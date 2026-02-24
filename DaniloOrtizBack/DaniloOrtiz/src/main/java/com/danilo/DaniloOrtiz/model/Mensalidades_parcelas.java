package com.danilo.DaniloOrtiz.model;


import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "mensalidades_parcelas")
public class Mensalidades_parcelas {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "mensalidade_id")
    private Mensalidade mensalidade;

    @Column(name = "numero_parcela")
    private Integer numeroParcela;

    private BigDecimal valor;

    @Column(name = "data_vencimento")
    private LocalDateTime dataVencimento;

    private String status;

    @ManyToOne
    @JoinColumn(name = "pagamento_id")
    private Pagamento pagamento;
}