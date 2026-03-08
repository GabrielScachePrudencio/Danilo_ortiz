package com.danilo.DaniloOrtiz.pagamentoAPI;

import com.danilo.DaniloOrtiz.model.dto.PagamentoCompletoDTO;
import com.mercadopago.MercadoPagoConfig;
import com.mercadopago.client.payment.PaymentClient;
import com.mercadopago.client.preference.*;
import com.mercadopago.exceptions.MPApiException;
import com.mercadopago.exceptions.MPException;
import com.mercadopago.resources.payment.Payment;
import com.mercadopago.resources.preference.Preference;
import lombok.Value;

import java.util.List;

public class ApiMercadoPago {

    private static final String ACCESS_TOKEN = System.getenv("MP_ACCESS_TOKEN") != null
            ? System.getenv("MP_ACCESS_TOKEN")
            : "MP_ACCESS_TOKEN";



    public static void main(String[] args) {
        consultarPagamento(148337041604L);
    }

    public static Preference gerarPagamento(PagamentoCompletoDTO pagamentoCompletoDTO, Long idPagamentoInterno) {
        MercadoPagoConfig.setAccessToken(ACCESS_TOKEN);

        PreferenceClient cliente = new PreferenceClient();

        PreferenceItemRequest item = PreferenceItemRequest.builder()
            .title(pagamentoCompletoDTO.getNomePlano())
                .quantity(1)
                .unitPrice(pagamentoCompletoDTO.getValor())
                .currencyId("BRL")
                .build();

        PreferenceBackUrlsRequest backUrlsRequest = PreferenceBackUrlsRequest.builder()
                .success("https://localhost:3000/home/telapagamento/correto")
                .failure("https://localhost:3000/home/telapagamento/erro")
                .pending("https://localhost:3000/home/telapagamento/erro")
                .build();

        PreferenceRequest request = PreferenceRequest.builder()
                .items(List.of(item))
                .backUrls(backUrlsRequest)
                .externalReference(idPagamentoInterno.toString())
                // grok .notificationUrl("https://7057-201-95-94-106.ngrok-free.app/v1/pagamentos/notifications")
                .notificationUrl("https://5811-201-95-94-106.ngrok-free.app/v1/pagamentos/notifications")
                .autoReturn("approved")
                .build();

        try {
            Preference preference = cliente.create(request);

            System.out.println("Link de pagamento gerado: " + preference.getInitPoint());

            return preference;

        } catch (MPApiException e) {
            System.err.println("Erro API Mercado Pago: " + e.getApiResponse().getContent());
            return null;
        } catch (MPException e) {
            e.printStackTrace();
            return null;
        }
    }

    public static String consultarPagamento(Long paymentId) {
        MercadoPagoConfig.setAccessToken(ACCESS_TOKEN);
        PaymentClient client = new PaymentClient();

        try {
            Payment payment = client.get(paymentId);

            System.out.println("--- STATUS DO PAGAMENTO ---");
            System.out.println("ID: " + payment.getId());
            System.out.println("Status: " + payment.getStatus());
            System.out.println("Detalhe: " + payment.getStatusDetail());
            System.out.println("Valor: " + payment.getTransactionAmount());
            System.out.println("---------------------------");

            return payment.getStatus();

        } catch (MPException | MPApiException e) {
            System.err.println("Erro ao consultar pagamento: " + e.getMessage());
            return "ERRO";
        }
    }

    public static Payment getPaymentDetails(Long paymentId) {
        MercadoPagoConfig.setAccessToken(ACCESS_TOKEN);
        PaymentClient client = new PaymentClient();

        try {
            Payment payment = client.get(paymentId);

            System.out.println("--- STATUS DO PAGAMENTO ---");
            System.out.println("ID: " + payment.getId());
            System.out.println("Status: " + payment.getStatus());
            System.out.println("Detalhe: " + payment.getStatusDetail());
            System.out.println("Valor: " + payment.getTransactionAmount());
            System.out.println("---------------------------");

            return payment;

        } catch (MPException | MPApiException e) {
            System.err.println("Erro ao consultar pagamento: " + e.getMessage());
            return null;
        }
    }


}