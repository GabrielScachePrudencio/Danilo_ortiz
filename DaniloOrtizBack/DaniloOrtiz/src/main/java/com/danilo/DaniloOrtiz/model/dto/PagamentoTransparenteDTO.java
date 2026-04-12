package com.danilo.DaniloOrtiz.model.dto;

import lombok.Data;
import java.math.BigDecimal;

/**
 * DTO recebido pelo frontend para processar pagamento transparente
 * (sem redirecionar pro site do Mercado Pago)
 */
@Data
public class PagamentoTransparenteDTO {

    // Quem está pagando
    private Long alunoId;
    private Long parcelaId;       // ID da Mensalidades_parcelas que está sendo paga
    private Long mensalidadeId;   // ID da Mensalidade (para nova assinatura pode ser null)
    private Long planoId;         // ID do Plano (para nova assinatura)

    // Método de pagamento: "credit_card", "pix", "boleto"
    private String formaPagamento;
    private Integer numeroParcelas; // parcelamento no cartão (1 = à vista)

    // Campos exclusivos do CARTÃO DE CRÉDITO
    private String cardToken;        // token gerado pelo SDK do MP no frontend
    private String paymentMethodId;  // "visa", "master", "elo", etc.

    // Valor a cobrar (calculado no backend, mas enviado como confirmação)
    private BigDecimal valor;
}
