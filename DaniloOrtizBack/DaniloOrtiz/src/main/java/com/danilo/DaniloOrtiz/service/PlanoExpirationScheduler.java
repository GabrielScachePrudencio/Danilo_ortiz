package com.danilo.DaniloOrtiz.service;

import com.danilo.DaniloOrtiz.model.Aluno;
import com.danilo.DaniloOrtiz.model.Mensalidade;
import com.danilo.DaniloOrtiz.model.MensalidadeCancelada;
import com.danilo.DaniloOrtiz.model.Mensalidades_parcelas;
import com.danilo.DaniloOrtiz.repository.Mensalidades_parcelasRepository;
import com.danilo.DaniloOrtiz.service.AlunoService;
import com.danilo.DaniloOrtiz.service.MensalidadeCanceladaService;
import com.danilo.DaniloOrtiz.service.MensalidadeService;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class PlanoExpirationScheduler {

    private final Mensalidades_parcelasRepository parcelasRepository;
    private final MensalidadeService              mensalidadeService;
    private final AlunoService                    alunoService;
    private final MensalidadeCanceladaService     mensalidadeCanceladaService;

    /**
     * Roda todo dia à meia-noite.
     * Verifica parcelas PENDENTES cujo vencimento já passou
     * e desativa o aluno por inadimplência.
     */
    @Scheduled(cron = "0 0 0 * * *")
    @Transactional
    public void verificarInadimplentes() {

        LocalDateTime agora = LocalDateTime.now();

        // 1. Busca todas as parcelas PENDENTES com vencimento no passado
        List<Mensalidades_parcelas> parcelasVencidas =
                parcelasRepository.findByStatusAndDataVencimentoBefore("PENDENTE", agora);

        for (Mensalidades_parcelas parcela : parcelasVencidas) {

            Mensalidade mensalidade = parcela.getMensalidade();
            if (mensalidade == null) continue;

            // Ignora se a mensalidade já foi cancelada anteriormente
            if ("CANCELADO".equals(mensalidade.getStatusLiberacao())) continue;

            Aluno aluno = mensalidade.getAluno();
            if (aluno == null) continue;

            // 2. Busca todas as parcelas da mensalidade para o snapshot
            List<Mensalidades_parcelas> todasParcelas =
                    parcelasRepository.findAllByMensalidade(mensalidade);

            List<Mensalidades_parcelas> pagas = todasParcelas.stream()
                    .filter(p -> "FINALIZADO".equals(p.getStatus()))
                    .collect(Collectors.toList());

            List<Mensalidades_parcelas> aCancelar = todasParcelas.stream()
                    .filter(p -> !"FINALIZADO".equals(p.getStatus()))
                    .collect(Collectors.toList());

            // 3. Data fim efetiva = último vencimento pago
            //    Se não pagou nada, usa a data de início da mensalidade
            LocalDate dataFimEfetiva = pagas.stream()
                    .map(p -> p.getDataVencimento().toLocalDate())
                    .max(LocalDate::compareTo)
                    .orElse(mensalidade.getDataInicio());

            String idsPagas = pagas.stream()
                    .map(p -> String.valueOf(p.getId()))
                    .collect(Collectors.joining(","));

            String idsCanceladas = aCancelar.stream()
                    .map(p -> String.valueOf(p.getId()))
                    .collect(Collectors.joining(","));

            // 4. Salva o histórico de cancelamento
            MensalidadeCancelada registro = MensalidadeCancelada.builder()
                    .alunoId(aluno.getId())
                    .nomeAluno(aluno.getNome())
                    .emailAluno(aluno.getEmail())
                    .planoId(mensalidade.getPlano() != null ? mensalidade.getPlano().getId()   : null)
                    .nomePlano(mensalidade.getPlano() != null ? mensalidade.getPlano().getNome() : "—")
                    .mensalidadeId(mensalidade.getId())
                    .dataInicio(mensalidade.getDataInicio())
                    .dataFim(mensalidade.getDataFim())
                    .dataFimEfetiva(dataFimEfetiva)
                    .valorMensalidade(mensalidade.getValorMensalidade())
                    .valorParcela(mensalidade.getValorParcela())
                    .totalParcelasContratadas(todasParcelas.size())
                    .parcelasPagas(pagas.size())
                    .parcelasRestantesNoCancelamento(aCancelar.size())
                    .parcelasPagasIds(idsPagas)
                    .parcelasCanceladasIds(idsCanceladas)
                    .dataCancelamento(LocalDateTime.now())
                    .canceladoPorAlunoId(0L)
                    .canceladoPorNome("sistema")
                    .motivoCancelamento("INADIMPLENCIA")
                    .build();

            mensalidadeCanceladaService.salvar(registro);

            // 5. Cancela todas as parcelas não finalizadas
            for (Mensalidades_parcelas p : aCancelar) {
                p.setStatus("CANCELADO");
                parcelasRepository.save(p);
            }

            // 6. Atualiza mensalidade
            mensalidade.setStatusLiberacao("CANCELADO");
            mensalidade.setDataFim(dataFimEfetiva); // ajusta para o último mês pago
            mensalidade.setPlano(null);             // remove vínculo com o plano
            mensalidadeService.save(mensalidade);

            // 7. Atualiza aluno
            if ("ATIVADO".equalsIgnoreCase(aluno.getStatusAssinatura())) {
                aluno.setStatusAssinatura("DESATIVADO");
            }
            aluno.setPlanoAtual(null); // remove vínculo com o plano
            alunoService.add(aluno);

            System.out.println("[Scheduler] Aluno " + aluno.getId()
                    + " (" + aluno.getNome() + ") desativado por inadimplência. "
                    + "Parcela vencida: " + parcela.getId()
                    + " | Vencimento: " + parcela.getDataVencimento());
        }

        System.out.println("[Scheduler] Verificação concluída. "
                + parcelasVencidas.size() + " parcela(s) vencida(s) processada(s).");
    }
}