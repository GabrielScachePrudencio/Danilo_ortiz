package com.danilo.DaniloOrtiz.service;

import com.danilo.DaniloOrtiz.pagamentoAPI.ApiMercadoPago;
import com.mercadopago.resources.payment.Payment;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.concurrent.CompletableFuture;

@Service
@RequiredArgsConstructor
public class WebhookProcessorService {
    private final MensalidadeService mensalidadeService;
    @Async
    public CompletableFuture<Void> processar(String resourceId) {
        try {
            Payment payment = ApiMercadoPago.getPaymentDetails(Long.parseLong(resourceId));

            if (payment == null || !"approved".equals(payment.getStatus())) {
                return CompletableFuture.completedFuture(null);
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

        } catch (Exception e) {
            System.err.println("Erro ao processar webhook async: " + e.getMessage());
        }

        return CompletableFuture.completedFuture(null);
    }
}
