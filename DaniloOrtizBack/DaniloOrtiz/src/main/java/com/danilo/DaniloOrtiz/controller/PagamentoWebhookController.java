package com.danilo.DaniloOrtiz.controller;


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
            @RequestParam(value = "topic", required = false) String topic,
            @RequestParam(value = "id", required = false) String id,
            @RequestBody(required = false) Map<String, Object> body // Use Map para ler o JSON
    ) {
        try {
            String resourceId = id;

            if (resourceId == null && body != null && body.containsKey("data")) {
                Map<String, Object> data = (Map<String, Object>) body.get("data");
                if (data != null && data.containsKey("id")) {
                    resourceId = data.get("id").toString();
                }
            }

            if (resourceId != null && ("payment".equals(topic) || (body != null && "payment".equals(body.get("type"))))) {
                System.out.println("Notificação de pagamento recebida ID: " + resourceId);

                Payment payment = ApiMercadoPago.getPaymentDetails(Long.parseLong(resourceId));


                if ("approved".equals(payment.getStatus())) {
                    System.out.println("Pagamento Aprovado! Baixando mensalidade...");
                    String status = payment.getStatus();
                    String idInternoStr = payment.getExternalReference();
                    String formaPagamento = payment.getPaymentMethodId().toString();
                    Long idInternolong = Long.parseLong(idInternoStr);
                    mensalidadeService.confirmarPagamentoDoWebHook(idInternolong, resourceId, status, formaPagamento);                }
                }

        } catch (Exception e) {
            System.err.println("Erro ao processar webhook: " + e.getMessage());
        }

        return ResponseEntity.ok().build();
    }


}
