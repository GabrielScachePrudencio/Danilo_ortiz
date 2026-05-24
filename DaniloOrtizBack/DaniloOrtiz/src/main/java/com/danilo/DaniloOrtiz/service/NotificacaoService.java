package com.danilo.DaniloOrtiz.service;

import com.danilo.DaniloOrtiz.model.Aluno;
import com.danilo.DaniloOrtiz.model.MensagemWhatsapp;
import com.danilo.DaniloOrtiz.model.Pagamento;
import com.danilo.DaniloOrtiz.repository.MensagemWhatsappRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;

@Slf4j
@Service
@RequiredArgsConstructor
public class NotificacaoService {

    private final MensagemWhatsappRepository mensagemRepository;

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

        String validade = "—";
        if (pagamento.getMensalidades_parcelas() != null
                && pagamento.getMensalidades_parcelas().getDataVencimento() != null) {
            validade = pagamento.getMensalidades_parcelas()
                    .getDataVencimento()
                    .format(DateTimeFormatter.ofPattern("dd/MM/yyyy"));
        }

        String planoNome = pagamento.getPlano() != null
                ? pagamento.getPlano().getNome()
                : "Academia";

        String texto = String.format(
                "✅ *Pagamento confirmado!*\n\n" +
                        "Olá, %s! Somos da *2DASSESSORIA* e recebemos o seu pagamento com sucesso. 🎉\n\n" +
                        "📋 *Plano:* %s\n" +
                        "💰 *Valor pago:* R$ %.2f\n" +
                        "📅 *Válido até:* %s\n\n" +
                        "Agora é só criar sua conta no *SisRun* pelo link abaixo:\n" +
                        "🔗 https://appsisrun.com.br/sisrun/forms/cadastro.xhtml?assessoria=2dassessoriaesportiva&utm_source=ig&utm_medium=social&utm_content=link_in_bio&fbclid=PAb21jcAR5LyxleHRuA2FlbQIxMQBzcnRjBmFwcF9pZA81NjcwNjczNDMzNTI0MjcAAacTy14m5_s11oO4TzNjZPHbREK-IR_xIrLeDe4qmC1yTdnrue5jtkVPdCjhKQ_aem_p6YqHccJxZ_ls7zK6By4Aw\n\n" +
                        "Qualquer dúvida estamos à disposição! 🏋️",
                aluno.getNome(),
                planoNome,
                pagamento.getValorPago(),
                validade
        );

        MensagemWhatsapp msg = new MensagemWhatsapp();
        msg.setNumero(numero);
        msg.setMensagem(texto);
        msg.setStatus("PENDENTE");
        msg.setPagamento(pagamento);
        mensagemRepository.save(msg);

        log.info("Mensagem agendada para aluno {} número {}", aluno.getNome(), numero);
    }
}