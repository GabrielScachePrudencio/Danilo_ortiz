package com.danilo.DaniloOrtiz.scheduler;

import com.danilo.DaniloOrtiz.model.MensagemWhatsapp;
import com.danilo.DaniloOrtiz.repository.MensagemWhatsappRepository;
import com.danilo.DaniloOrtiz.service.EvolutionApiService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class MensagemScheduler {

    private static final int MAX_TENTATIVAS = 3;

    private final MensagemWhatsappRepository mensagemRepository;
    private final EvolutionApiService evolutionApiService;

    @Scheduled(fixedDelay = 30000) // roda a cada 30 segundos
    public void processarMensagensPendentes() {
        log.warn("🔄 Scheduler rodando...");

        List<MensagemWhatsapp> pendentes = mensagemRepository
                .findByStatusAndTentativasLessThan("PENDENTE", MAX_TENTATIVAS);

        if (pendentes.isEmpty()) return;

        log.warn("Processando {} mensagem(ns) pendente(s)...", pendentes.size());

        for (MensagemWhatsapp msg : pendentes) {
            try {
                evolutionApiService.enviarMensagem(msg.getNumero(), msg.getMensagem());
                msg.setStatus("ENVIADO");
                msg.setDataEnvio(LocalDateTime.now());
                log.warn("✅ Mensagem {} enviada para {}", msg.getId(), msg.getNumero());
            } catch (Exception e) {
                msg.setTentativas(msg.getTentativas() + 1);
                msg.setErroDetalhe(e.getMessage());
                log.error("❌ Erro ao enviar mensagem {}: {}", msg.getId(), e.getMessage());

                if (msg.getTentativas() >= MAX_TENTATIVAS) {
                    msg.setStatus("ERRO");
                    log.warn("Mensagem {} marcada como ERRO após {} tentativas.", msg.getId(), MAX_TENTATIVAS);
                }
            }
            mensagemRepository.save(msg);
        }
    }
}