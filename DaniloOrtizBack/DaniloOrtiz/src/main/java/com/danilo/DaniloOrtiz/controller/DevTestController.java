package com.danilo.DaniloOrtiz.controller;

import com.danilo.DaniloOrtiz.model.Pagamento;
import com.danilo.DaniloOrtiz.scheduler.MensagemScheduler;
import com.danilo.DaniloOrtiz.service.NotificacaoService;
import com.danilo.DaniloOrtiz.service.PagamentoService;
import com.danilo.DaniloOrtiz.service.PlanoExpirationScheduler;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/dev")
@RequiredArgsConstructor
public class DevTestController {

    private final PlanoExpirationScheduler scheduler;
    private final NotificacaoService notificacaoService;
    private final PagamentoService pagamentoService;
    private final MensagemScheduler mensagemScheduler;

    @PostMapping("/forcar-verificacao-inadimplentes")
    public ResponseEntity<String> forcarVerificacao() {
        scheduler.verificarInadimplentes();
        return ResponseEntity.ok("Verificação executada — cheque o console.");
    }

    @GetMapping("/so-para-testar-envioZap")
    public ResponseEntity<String> testeEnvioMsg(){
        Pagamento pagamento = pagamentoService.findById(119L);
        notificacaoService.agendarConfirmacaoPagamento(pagamento);
        return ResponseEntity.ok("Mensagem agendada — cheque a tabela mensagens_whatsapp");
    }


    @GetMapping("/forcar-envio-zap")
    public ResponseEntity<String> forcarEnvioZap(){
        mensagemScheduler.processarMensagensPendentes();
        return ResponseEntity.ok("Scheduler executado — cheque o console e o banco");
    }
}