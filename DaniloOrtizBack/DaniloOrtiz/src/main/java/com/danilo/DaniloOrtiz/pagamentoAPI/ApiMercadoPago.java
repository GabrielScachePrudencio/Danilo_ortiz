package com.danilo.DaniloOrtiz.pagamentoAPI;

import com.danilo.DaniloOrtiz.config.AppConfig;
import com.danilo.DaniloOrtiz.model.dto.PagamentoCompletoDTO;
import com.danilo.DaniloOrtiz.model.dto.PagamentoTransparenteDTO;
import com.danilo.DaniloOrtiz.repository.ConfiguracaoRepository;
import com.danilo.DaniloOrtiz.service.ConfiguracaoService;
import com.mercadopago.MercadoPagoConfig;
import com.mercadopago.client.common.AddressRequest;
import com.mercadopago.client.common.IdentificationRequest;
import com.mercadopago.client.payment.PaymentClient;
import com.mercadopago.client.payment.PaymentCreateRequest;
import com.mercadopago.client.payment.PaymentPayerAddressRequest;
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
    private static AppConfig appConfig;

    public ApiMercadoPago(ConfiguracaoService configuracaoService,
                          AppConfig appConfig) {

        ApiMercadoPago.configuracaoServiceStatic = configuracaoService;
        ApiMercadoPago.appConfig = appConfig;
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
                // DEPOIS
                configuracaoServiceStatic.getAccessTokenAtivo()
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

        String url = appConfig.getBaseUrl() + "/v1/pagamentos/notifications";

        PreferenceRequest request = PreferenceRequest.builder()
                .items(List.of(item))
                .backUrls(backUrlsRequest)
                .externalReference(idPagamentoInterno.toString())

                //aqui ver se o ip foi trocado pq ele vai pelo ip
                .notificationUrl(
                        url
                )
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
                // DEPOIS
                configuracaoServiceStatic.getAccessTokenAtivo()
        );

        PaymentClient client = new PaymentClient();

        try {
            Payment payment = client.get(paymentId);

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
                // DEPOIS
                configuracaoServiceStatic.getAccessTokenAtivo()
        );

        PaymentClient client = new PaymentClient();

        try {
            Payment payment = client.get(paymentId);

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
        System.out.println(">>> DTO recebido: valor=" + dto.getValor()
                + " | parcelaId=" + dto.getParcelaId()
                + " | forma=" + dto.getFormaPagamento()
                + " | token=" + dto.getCardToken());

        if (configuracaoServiceStatic == null) {
            throw new RuntimeException("ConfiguracaoService NÃO foi injetado");
        }

        MercadoPagoConfig.setAccessToken(
                // DEPOIS
                configuracaoServiceStatic.getAccessTokenAtivo()
        );

        PaymentClient client = new PaymentClient();
        String nomeCompleto = aluno.getNome() != null ? aluno.getNome().trim() : "";
        String[] partes = nomeCompleto.split("\\s+", 2);
        String firstName = partes[0];
        String lastName  = partes.length > 1 ? partes[1] : partes[0];



        // ── Monta o pagador ──────────────────────────────────────────────
//        PaymentPayerRequest.PaymentPayerRequestBuilder payerBuilder =
//                PaymentPayerRequest.builder()
//                        .email(aluno.getEmail())
//                        .firstName(aluno.getNome());
        PaymentPayerRequest.PaymentPayerRequestBuilder payerBuilder =
                PaymentPayerRequest.builder()
                        .email(aluno.getEmail())
                        .firstName(firstName)
                        .lastName(lastName);

// CPF
        String cpf = aluno.getCPF();
        if (cpf != null && !cpf.isBlank()) {
            payerBuilder.identification(
                    IdentificationRequest.builder()
                            .type("CPF")
                            .number(cpf.replaceAll("[^0-9]", ""))
                            .build()
            );
        }
        String url = appConfig.getBaseUrl() + "/v1/pagamentos/notifications";

        // ── Monta a requisição base ──────────────────────────────────────
        PaymentCreateRequest.PaymentCreateRequestBuilder reqBuilder =
                PaymentCreateRequest.builder()
                        .transactionAmount(dto.getValor())
                        .description("Plano academia — parcela")
                        //.payer(payerBuilder.build())
                        // externalReference guarda o ID da parcela interna
                        // para o webhook conseguir confirmar depois
                        .externalReference("parcela:" + dto.getParcelaId())
                        .notificationUrl(
                                url
                        );

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
                reqBuilder
                        .paymentMethodId("bolbradesco")
                        .dateOfExpiration(
                                java.time.OffsetDateTime.now().plusDays(3)  // vence em 3 dias
                        );


                // Endereço completo — obrigatório para boleto registrado
                String cep = aluno.getCEP() != null
                        ? aluno.getCEP().toString().replaceAll("[^0-9]", "")
                        : null;

                if (cep == null || aluno.getRua() == null || aluno.getCidade() == null) {
                    throw new IllegalArgumentException(
                            "Endereço incompleto. Boleto exige: CEP, rua, número, bairro, cidade e estado."
                    );
                }

                payerBuilder.address(
                        PaymentPayerAddressRequest.builder()
                                .zipCode(cep)
                                .streetName(aluno.getRua())
                                .streetNumber(aluno.getNumero() != null
                                        ? aluno.getNumero().toString() : "0")
                                .neighborhood(aluno.getBairro() != null
                                        ? aluno.getBairro() : "")
                                .city(aluno.getCidade())
                                .federalUnit(aluno.getEstado() != null
                                        ? aluno.getEstado().toUpperCase() : "SP")
                                .build()
                );
                break;

            default:
                throw new IllegalArgumentException(
                        "Método de pagamento inválido: " + dto.getFormaPagamento()
                );
        }

        try {
            PaymentCreateRequest request = reqBuilder
                    .payer(payerBuilder.build())   // ← aqui, não antes do switch
                    .build();

            Payment payment = client.create(request);
//            Payment payment = client.create(reqBuilder.build());


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