package com.danilo.DaniloOrtiz.service;

import com.danilo.DaniloOrtiz.model.*;
import com.danilo.DaniloOrtiz.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Map;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class NotificacaoService {

    private static final int DIAS_ANTECEDENCIA_MENSALIDADE_FINAL = 3;
    private static final int DIAS_INATIVIDADE_PARA_INCENTIVO = 7;
    private static final int DIAS_MINIMOS_ENTRE_REENVIOS = 5;

    private final MensagemWhatsappRepository mensagemRepository;
    private final MensagemTemplateService templateService;
    private final Mensalidades_parcelasRepository parcelasRepository;
    private final AlunoRepository alunoRepository;
    private final MensalidadeCanceladaRepository canceladaRepository;

    // ===================== FLUXO EXISTENTE (não mudou) =====================

    public void agendarConfirmacaoPagamento(Pagamento pagamento) {
        Aluno aluno = pagamento.getAluno();
        if (aluno == null) {
            log.warn("Pagamento {} sem aluno vinculado, ignorando notificação.", pagamento.getId());
            return;
        }
        if (aluno.getWhatsapp() == null || aluno.getWhatsapp().isBlank()) {
            log.warn("Aluno {} sem WhatsApp cadastrado, ignorando notificação.", aluno.getId());
            return;
        }

        String numero = aluno.getWhatsapp().replaceAll("[^0-9]", "");
        String texto = templateService.montar("CONFIRMACAO_PAGAMENTO", aluno, Map.of("pagamento", pagamento));

        MensagemWhatsapp msg = new MensagemWhatsapp();
        msg.setNumero(numero);
        msg.setMensagem(texto);
        msg.setStatus("PENDENTE");
        msg.setTipo("CONFIRMACAO_PAGAMENTO");
        msg.setPagamento(pagamento);
        mensagemRepository.save(msg);

        log.info("Mensagem agendada para aluno {} número {}", aluno.getNome(), numero);
    }

    // ===================== NOVO: chamado a partir do /login =====================

    //parcelas proximas do final do vencimento
    public void verificarMensalidadesProximasDoFim() {
        LocalDateTime hoje = LocalDate.now().atStartOfDay();
        LocalDateTime limite = hoje.plusDays(DIAS_ANTECEDENCIA_MENSALIDADE_FINAL).plusDays(1);

        var parcelas = parcelasRepository.findByStatusAndDataVencimentoBetweenNative("PENDENTE", hoje, limite);
        for (var parcela : parcelas) {
            Aluno aluno = resolverAluno(parcela);
            if (aluno == null) continue;

            String dataFormatada = parcela.getDataVencimento().format(DateTimeFormatter.ofPattern("dd/MM/yyyy"));
            enviarSeNaoDuplicado(aluno, "MENSALIDADE_FINAL", Map.of("dataVencimento", dataFormatada));
        }
    }

    // o aluno tem 1 dia apos o vencimento para pagar se não cancela tudo
    public void verificarCobrancasDoDia() {
        LocalDateTime inicioHoje = LocalDate.now().atStartOfDay();
        LocalDateTime fimHoje = inicioHoje.plusDays(1);

        System.out.println("inicioHoje=" + inicioHoje + " fimHoje=" + fimHoje);

        var parcelas = parcelasRepository.findByStatusAndDataVencimentoBetweenNative("PENDENTE", inicioHoje, fimHoje);

        System.out.println("Encontradas " + parcelas.size() + " parcelas");

        for (var parcela : parcelas) {
            System.out.println("Parcela id=" + parcela.getId() + " vencimento=" + parcela.getDataVencimento() + " status=" + parcela.getStatus());

            Aluno aluno = resolverAluno(parcela);
            if (aluno == null) {
                System.out.println("Aluno nulo ou sem whatsapp para parcela id=" + parcela.getId());
                continue;
            }

            enviarSeNaoDuplicado(aluno, "COBRANCA", Map.of());
        }
    }



    //pega pela data do cancelamento seja por nao pagar, por expirado ou cancelado
    public void verificarAlunosInativos() {
        var desativados = alunoRepository.findByStatusAssinatura("DESATIVADO");

        for (Aluno aluno : desativados) {
            Optional<MensalidadeCancelada> ultimoCancelamento =
                    canceladaRepository.findTopByAlunoIdOrderByDataCancelamentoDesc(aluno.getId());

            if (ultimoCancelamento.isEmpty()) continue;

            long dias = Duration.between(ultimoCancelamento.get().getDataCancelamento(), LocalDateTime.now()).toDays();
            if (dias >= DIAS_INATIVIDADE_PARA_INCENTIVO) {
                enviarSeNaoDuplicado(aluno, "INCENTIVO_VOLTAR_TREINAR", Map.of());
            }
        }
    }

    // ===================== helpers privados =====================

    private Aluno resolverAluno(Mensalidades_parcelas parcela) {
        Mensalidade mensalidade = parcela.getMensalidade();
        if (mensalidade == null) return null;
        Aluno aluno = mensalidade.getAluno();
        if (aluno == null || aluno.getWhatsapp() == null || aluno.getWhatsapp().isBlank()) return null;
        return aluno;
    }

    private void enviarSeNaoDuplicado(Aluno aluno, String tipo, Map<String, Object> ctx) {

        if (aluno == null || aluno.getWhatsapp() == null || aluno.getWhatsapp().isBlank()) {
            log.warn("Aluno {} sem WhatsApp cadastrado. Notificação [{}] ignorada.",
                    aluno != null ? aluno.getId() : null, tipo);
            return;
        }

        String numero = aluno.getWhatsapp().replaceAll("[^0-9]", "");

        var ultima = mensagemRepository.findTopByNumeroAndTipoOrderByDataCriacaoDesc(numero, tipo);
        if (ultima.isPresent()) {
            long dias = Duration.between(ultima.get().getDataCriacao(), LocalDateTime.now()).toDays();
            if (dias < DIAS_MINIMOS_ENTRE_REENVIOS) {
                return;
            }
        }

        try {
            String texto = templateService.montar(tipo, aluno, ctx);
            MensagemWhatsapp msg = new MensagemWhatsapp();
            msg.setNumero(numero);
            msg.setMensagem(texto);
            msg.setStatus("PENDENTE");
            msg.setTipo(tipo);
            mensagemRepository.save(msg);

            log.info("Mensagem automática [{}] agendada para aluno {} ({})", tipo, aluno.getNome(), numero);

        } catch (Exception e) {
            log.error("Falha ao agendar mensagem [{}] para aluno {}: {}", tipo, aluno.getId(), e.getMessage());
        }
    }
}