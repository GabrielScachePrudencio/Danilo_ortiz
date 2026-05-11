package com.danilo.DaniloOrtiz.pagamentoAPI;

import com.danilo.DaniloOrtiz.model.dto.PagamentoCompletoDTO;
import com.danilo.DaniloOrtiz.model.dto.PagamentoTransparenteDTO;
import com.danilo.DaniloOrtiz.repository.ConfiguracaoRepository;
import com.danilo.DaniloOrtiz.service.ConfiguracaoService;
import com.mercadopago.MercadoPagoConfig;
import com.mercadopago.client.common.IdentificationRequest;
import com.mercadopago.client.payment.PaymentClient;
import com.mercadopago.client.payment.PaymentCreateRequest;
import com.mercadopago.client.payment.PaymentPayerRequest;
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
                .success("https://a597-191-205-231-62.ngrok-free.app/home/telapagamento/correto")
                .failure("https://a597-191-205-231-62.ngrok-free.app/home/telapagamento/erro")
                .pending("https://a597-191-205-231-62.ngrok-free.app/home/telapagamento/pendente")
                .build();

        PreferenceRequest request = PreferenceRequest.builder()
                .items(List.of(item))
                .backUrls(backUrlsRequest)
                .externalReference(idPagamentoInterno.toString())

                //aqui ver se o ip foi trocado pq ele vai pelo ip
                .notificationUrl("https://a1d4-191-205-231-62.ngrok-free.app/v1/pagamentos/notifications")
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


    //metodo novo
    public static Payment criarPagamentoTransparente(
            PagamentoTransparenteDTO dto,
            com.danilo.DaniloOrtiz.model.Aluno aluno
    ) {
        if (configuracaoServiceStatic == null) {
            throw new RuntimeException("ConfiguracaoService NÃO foi injetado");
        }

        MercadoPagoConfig.setAccessToken(
                configuracaoServiceStatic.getConfiguracao()
                        .orElseThrow(() -> new RuntimeException("Configuração não encontrada"))
                        .getMPACCESSTOKEN()
        );

        PaymentClient client = new PaymentClient();

        // ── Monta o pagador ──────────────────────────────────────────────
        PaymentPayerRequest.PaymentPayerRequestBuilder payerBuilder =
                PaymentPayerRequest.builder()
                        .email(aluno.getEmail())
                        .firstName(aluno.getNome());

        // CPF — obrigatório para PIX e Boleto, recomendado para cartão
        String cpf = aluno.getCPF();
        if (cpf != null && !cpf.isBlank()) {
            payerBuilder.identification(
                    IdentificationRequest.builder()
                            .type("CPF")
                            .number(cpf.replaceAll("[^0-9]", "")) // remove pontos/traços
                            .build()
            );
        }

        // ── Monta a requisição base ──────────────────────────────────────
        PaymentCreateRequest.PaymentCreateRequestBuilder reqBuilder =
                PaymentCreateRequest.builder()
                        .transactionAmount(dto.getValor())
                        .description("Plano academia — parcela")
                        .payer(payerBuilder.build())
                        // externalReference guarda o ID da parcela interna
                        // para o webhook conseguir confirmar depois
                        .externalReference("parcela:" + dto.getParcelaId())
                        .notificationUrl("https://a1d4-191-205-231-62.ngrok-free.app/v1/pagamentos/notifications");


        // ── Lógica por método de pagamento ──────────────────────────────
        switch (dto.getFormaPagamento().toLowerCase()) {

            case "credit_card":
                // Token gerado pelo SDK do MP no frontend (nunca o número real)
                reqBuilder
                        .token(dto.getCardToken())
                        .installments(dto.getNumeroParcelas() != null ? dto.getNumeroParcelas() : 1)
                        .paymentMethodId(dto.getPaymentMethodId()); // "visa", "master", "elo"...
                break;

            case "pix":
                reqBuilder.paymentMethodId("pix");
                // PIX tem vencimento de 30 minutos por padrão no MP
                // Não precisa de token
                break;

            case "boleto":
                reqBuilder.paymentMethodId("bolbradesco"); // boleto Bradesco (mais comum)
                // Você pode trocar por "bolsantander" se preferir
                break;

            default:
                throw new IllegalArgumentException(
                        "Método de pagamento inválido: " + dto.getFormaPagamento()
                );
        }

        try {
            Payment payment = client.create(reqBuilder.build());

            System.out.println("=== PAGAMENTO TRANSPARENTE CRIADO ===");
            System.out.println("ID MP: " + payment.getId());
            System.out.println("Status: " + payment.getStatus());
            System.out.println("Método: " + dto.getFormaPagamento());

            return payment;

        } catch (MPApiException e) {
            System.err.println("Erro API MP: " + e.getApiResponse().getContent());
            throw new RuntimeException("Erro Mercado Pago: " + e.getApiResponse().getContent());
        } catch (MPException e) {
            System.err.println("Erro MP: " + e.getMessage());
            throw new RuntimeException("Erro ao criar pagamento: " + e.getMessage());
        }
    }


}