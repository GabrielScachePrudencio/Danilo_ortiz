package com.danilo.DaniloOrtiz.controller;

import com.danilo.DaniloOrtiz.config.WebhookValidator;
import com.danilo.DaniloOrtiz.pagamentoAPI.ApiMercadoPago;
import com.danilo.DaniloOrtiz.service.MensalidadeService;
import com.mercadopago.resources.payment.Payment;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/v1/pagamentos")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class PagamentoWebhookController {
    private final MensalidadeService mensalidadeService;



    @PostMapping("/notifications")
    public ResponseEntity<Void> receberNotificacao(
            @RequestParam(value = "topic",  required = false) String topic,
            @RequestParam(value = "id",     required = false) String id,
            @RequestBody(required = false)  Map<String, Object> body,
            @RequestHeader(value = "x-signature",   required = false) String xSignature,   // ← NOVO
            @RequestHeader(value = "x-request-id",  required = false) String xRequestId    // ← NOVO
    ) {
        System.out.println("=== WEBHOOK RECEBIDO ===");
        System.out.println("topic: " + topic);
        System.out.println("id: " + id);
        System.out.println("body: " + body);
        System.out.println("x-signature: " + xSignature);
        System.out.println("x-request-id: " + xRequestId);
        try {
            String resourceId = id;

            if (resourceId == null && body != null && body.containsKey("data")) {
                Map<String, Object> data = (Map<String, Object>) body.get("data");
                if (data != null && data.containsKey("id")) {
                    resourceId = data.get("id").toString();
                }
            }

//            // ── VALIDAÇÃO DA ASSINATURA ──────────────────────────────────────
//            if (resourceId != null && xSignature != null) {
//                boolean valido = WebhookValidator.validar(xSignature, xRequestId, resourceId);
//                System.out.println("assinatura válida? " + valido);
//
//                if (!valido) {
//                    // MP manda múltiplas notificações — retentativas com request-id diferente
//                    // são normais e esperadas, retorna 200 para o MP parar de retentar
//                    return ResponseEntity.ok().build();  // ← 200 em vez de 401
//                }
//
//            }
            // ────────────────────────────────────────────────────────────────

            if (resourceId != null && ("payment".equals(topic) || (body != null && "payment".equals(body.get("type"))))) {
                Payment payment = ApiMercadoPago.getPaymentDetails(Long.parseLong(resourceId));

                if ("approved".equals(payment.getStatus())) {
                    String status        = payment.getStatus();
                    String formaPagamento = payment.getPaymentMethodId();
                    String externalRef   = payment.getExternalReference();

                    if (externalRef != null && externalRef.startsWith("parcela:")) {
                        Long parcelaId = Long.parseLong(externalRef.replace("parcela:", ""));
                        mensalidadeService.confirmarPagamentoPorParcelaId(parcelaId, resourceId, status, formaPagamento);
                    } else if (externalRef != null) {
                        Long idInterno = Long.parseLong(externalRef);
                        mensalidadeService.confirmarPagamentoDoWebHook(idInterno, resourceId, status, formaPagamento);
                    } else {
                        System.err.println("externalReference nulo — não foi possível confirmar.");
                    }
                }
            }

        } catch (Exception e) {
            System.err.println("Erro ao processar webhook: " + e.getMessage());
        }

        return ResponseEntity.ok().build();
    }
}