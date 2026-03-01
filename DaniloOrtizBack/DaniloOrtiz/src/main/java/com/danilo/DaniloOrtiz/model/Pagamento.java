package com.danilo.DaniloOrtiz.model;

import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "pagamentos")
public class Pagamento {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "aluno_id")
    private Aluno aluno;

    @ManyToOne
    @JoinColumn(name = "plano_id")
    private Plano plano;

    @ManyToOne
    @JoinColumn(name = "parcela_id")
    private Mensalidades_parcelas mensalidades_parcelas;

    @Column(name = "mp_payment_id", unique = true)
    private String mpPaymentId;

    @Column(name = "forma_pagamento")
    private String formaPagamento;

    @Column(name = "codigo_venda")
    private String codigoVenda;

    @Column(name = "valor_pago")
    private BigDecimal valorPago;

    private Boolean pago = false;

    @Column(name = "data_criacao")
    private LocalDateTime dataCriacao = LocalDateTime.now();

    @Column(name = "status_pagamento")
    private String statusPagamento;
}
