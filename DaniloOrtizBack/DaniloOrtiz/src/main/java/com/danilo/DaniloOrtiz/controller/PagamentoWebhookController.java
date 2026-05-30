package com.danilo.DaniloOrtiz.controller;

import com.danilo.DaniloOrtiz.config.WebhookValidator;
import com.danilo.DaniloOrtiz.pagamentoAPI.ApiMercadoPago;
import com.danilo.DaniloOrtiz.service.MensalidadeService;
import com.danilo.DaniloOrtiz.service.WebhookProcessorService;
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

    private final WebhookProcessorService webhookProcessorService;
    // Persiste IDs já recebidos (use Redis ou banco em produção)
    private final Set<String> processando = ConcurrentHashMap.newKeySet();

    @PostMapping("/notifications")
    public ResponseEntity<Void> receberNotificacao(
            @RequestParam(value = "topic",  required = false) String topic,
            @RequestParam(value = "id",     required = false) String id,
            @RequestBody(required = false)  Map<String, Object> body,
            @RequestHeader(value = "x-signature",  required = false) String xSignature,
            @RequestHeader(value = "x-request-id", required = false) String xRequestId
    ) {
        System.out.println("=== WEBHOOK RECEBIDO === topic: " + topic + " | id: " + id);

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
            return ResponseEntity.ok().build(); // ← retorna 200 rápido
        }

        if (!processando.add(resourceId)) {
            System.out.println("Duplicata ignorada: " + resourceId);
            return ResponseEntity.ok().build(); // ← retorna 200 rápido
        }

        // Dispara em background e retorna 200 imediatamente
        String finalResourceId = resourceId;
        webhookProcessorService.processar(finalResourceId)
                .whenComplete((v, ex) -> processando.remove(finalResourceId));

        return ResponseEntity.ok().build(); // ← MP recebe 200 em <50ms
    }
}