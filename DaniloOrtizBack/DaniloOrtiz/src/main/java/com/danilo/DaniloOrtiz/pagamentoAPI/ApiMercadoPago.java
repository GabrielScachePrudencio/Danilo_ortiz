package com.danilo.DaniloOrtiz.pagamentoAPI;

import com.danilo.DaniloOrtiz.model.dto.PagamentoCompletoDTO;
import com.danilo.DaniloOrtiz.repository.ConfiguracaoRepository;
import com.danilo.DaniloOrtiz.service.ConfiguracaoService;
import com.mercadopago.MercadoPagoConfig;
import com.mercadopago.client.payment.PaymentClient;
import com.mercadopago.client.preference.*;
import com.mercadopago.exceptions.MPApiException;
import com.mercadopago.exceptions.MPException;
import com.mercadopago.resources.payment.Payment;
import com.mercadopago.resources.preference.Preference;
import lombok.RequiredArgsConstructor;
import lombok.Value;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ApiMercadoPago {
    private static ConfiguracaoService configuracaoServiceStatic;

    public ApiMercadoPago(ConfiguracaoService configuracaoService) {
        ApiMercadoPago.configuracaoServiceStatic = configuracaoService;
    }

    private static final String ACCESS_TOKEN = System.getenv("MP_ACCESS_TOKEN") != null
            ? System.getenv("MP_ACCESS_TOKEN")
            : "MP_ACCESS_TOKEN";


    public static void main(String[] args) {
        consultarPagamento(148337041604L);
    }

    public static Preference gerarPagamento(PagamentoCompletoDTO pagamentoCompletoDTO, Long idPagamentoInterno) {
        if (configuracaoServiceStatic == null) {
            throw new RuntimeException("ConfiguracaoService NÃO foi injetado (static null)");
        }

        MercadoPagoConfig.setAccessToken(
                configuracaoServiceStatic.getConfiguracao()
                        .orElseThrow(() -> new RuntimeException("Configuração não encontrada"))
                        .getMPACCESSTOKEN()
        );

        PreferenceClient cliente = new PreferenceClient();

        PreferenceItemRequest item = PreferenceItemRequest.builder()
                .title(pagamentoCompletoDTO.getNomePlano())
                .quantity(1)
                .unitPrice(pagamentoCompletoDTO.getValor())
                .currencyId("BRL")
                .build();

        PreferenceBackUrlsRequest backUrlsRequest = PreferenceBackUrlsRequest.builder()
                //rodar ngrok http 3000
                // colocar o novo caminho
                .success("https://a7ef-201-95-93-179.ngrok-free.app/home/telapagamento/correto")
                .failure("https://a7ef-201-95-93-179.ngrok-free.app/home/telapagamento/erro")
                .pending("https://a7ef-201-95-93-179.ngrok-free.app/home/telapagamento/pendente")
                .build();

        PreferenceRequest request = PreferenceRequest.builder()
                .items(List.of(item))
                .backUrls(backUrlsRequest)
                .externalReference(idPagamentoInterno.toString())

                //aqui ver se o ip foi trocado pq ele vai pelo ip
                .notificationUrl("http://201.95.93.179:3001/v1/pagamentos/notifications")
                .autoReturn("approved")
                .build();

        try {
            Preference preference = cliente.create(request);
            return preference;
        } catch (MPApiException e) {
            System.err.println("Erro API Mercado Pago: " + e.getApiResponse().getContent());
            return null;
        } catch (MPException e) {
            e.printStackTrace();
            return null;
        }
    }


    public static Payment consultarPagamento(Long paymentId) {
        if (configuracaoServiceStatic == null) {
            throw new RuntimeException("ConfiguracaoService NÃO foi injetado (static null)");
        }

//        MercadoPagoConfig.setAccessToken(ACCESS_TOKEN);
        MercadoPagoConfig.setAccessToken(
                configuracaoServiceStatic.getConfiguracao()
                        .orElseThrow(() -> new RuntimeException("Configuração não encontrada"))
                        .getMPACCESSTOKEN()
        );

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

    public static Payment getPaymentDetails(Long paymentId) {
        if (configuracaoServiceStatic == null) {
            throw new RuntimeException("ConfiguracaoService NÃO foi injetado (static null)");
        }

        //MercadoPagoConfig.setAccessToken(ACCESS_TOKEN);
        MercadoPagoConfig.setAccessToken(
                configuracaoServiceStatic.getConfiguracao()
                        .orElseThrow(() -> new RuntimeException("Configuração não encontrada"))
                        .getMPACCESSTOKEN()
        );

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