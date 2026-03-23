package com.danilo.DaniloOrtiz.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ParcelaDetalheDTO {

    // ── dados da parcela (tabela mensalidades_parcelas) ──
    private Long   id;
    private Integer numeroParcela;
    private BigDecimal valor;
    private LocalDate  dataVencimento;
    private String status;          // PENDENTE | FINALIZADO | AGUARDANDO | CANCELADO

    // ── dados do pagamento interno (tabela pagamentos) ──
    private Long   pagamentoInternoId;
    private String statusPagamento;  // PENDENTE | FINALIZADO
    private String formaPagamento;
    private String codigoVenda;
    private BigDecimal valorPago;
    private Boolean pago;

    // ── dados vindos do Mercado Pago (via API) ──
    private Long   mpPaymentId;           // id do payment no MP
    private String mpStatus;              // approved | pending | rejected …
    private String mpStatusDetail;        // accredited | pending_waiting_payment …
    private String mpMetodoPagamento;     // pix | credit_card …
    private BigDecimal mpValorTransacao;
    private OffsetDateTime mpDataAprovacao;
    private String mpErro;               // mensagem de erro caso a consulta ao MP falhe
}