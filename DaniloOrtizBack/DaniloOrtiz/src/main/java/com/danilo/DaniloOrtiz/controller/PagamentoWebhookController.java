package com.danilo.DaniloOrtiz.controller;

import com.danilo.DaniloOrtiz.pagamentoAPI.ApiMercadoPago;
import com.danilo.DaniloOrtiz.service.MensalidadeService;
import com.mercadopago.resources.payment.Payment;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/v1/pagamentos")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class PagamentoWebhookController {

    private final MensalidadeService mensalidadeService;
    private final Set<String> processando = ConcurrentHashMap.newKeySet();

    @PostMapping("/notifications")
    public ResponseEntity<Void> receberNotificacao(
            @RequestParam(value = "topic",  required = false) String topic,
            @RequestParam(value = "id",     required = false) String id,
            @RequestBody(required = false)  Map<String, Object> body,
            @RequestHeader(value = "x-signature",  required = false) String xSignature,
            @RequestHeader(value = "x-request-id", required = false) String xRequestId
    ) {
        System.out.println("=== WEBHOOK RECEBIDO ===");
        System.out.println("topic: " + topic + " | id: " + id);

        try {
            String resourceId = id;
            if (resourceId == null && body != null && body.containsKey("data")) {
                Map<String, Object> data = (Map<String, Object>) body.get("data");
                if (data != null && data.containsKey("id")) {
                    resourceId = data.get("id").toString();
                }
            }

            boolean ehPagamento = "payment".equals(topic)
                    || (body != null && "payment".equals(body.get("type")));



            if (resourceId == null || !ehPagamento) {
                return ResponseEntity.ok().build();
            }

            // evita processar o mesmo pagamento simultâneo
            if (!processando.add(resourceId)) {
                System.out.println("Duplicata ignorada: " + resourceId);
                return ResponseEntity.ok().build();
            }

            try {
                Payment payment = ApiMercadoPago.getPaymentDetails(Long.parseLong(resourceId));

                if (payment == null || !"approved".equals(payment.getStatus())) {
                    return ResponseEntity.ok().build();
                }

                String status         = payment.getStatus();
                String formaPagamento = payment.getPaymentMethodId();
                String externalRef    = payment.getExternalReference();

                if (externalRef != null && externalRef.startsWith("parcela:")) {
                    Long parcelaId = Long.parseLong(externalRef.replace("parcela:", ""));
                    mensalidadeService.confirmarPagamentoPorParcelaId(
                            parcelaId, resourceId, status, formaPagamento);

                } else if (externalRef != null) {
                    Long idInterno = Long.parseLong(externalRef);
                    mensalidadeService.confirmarPagamentoDoWebHook(
                            idInterno, resourceId, status, formaPagamento);

                } else {
                    System.err.println("externalReference nulo — não foi possível confirmar.");
                }

            } finally {
                processando.remove(resourceId);
            }

        } catch (Exception e) {
            System.err.println("Erro ao processar webhook: " + e.getMessage());
        }

        return ResponseEntity.ok().build();
    }
}