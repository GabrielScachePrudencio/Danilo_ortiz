package com.danilo.DaniloOrtiz.model;


import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.text.DecimalFormat;

@Entity
@Data
@Table(name = "planos")
public class Plano {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nome")
    private String nome;

    @Column(name = "valor")
    private BigDecimal valor;

    @Column(name = "duracao_meses")
    private Integer duracaomeses;

    @Column(name = "ativo")
    private boolean ativo;

    @Column(name = "frequencia_semanal")
    private Integer frequenciaSemanal;

    @Column(name =  "grupo", nullable = false)
    private String grupo; // FIT, INTENSE, POWER

    @Column(name = "periodo", nullable = false)
    private String periodo; // MENSAL, SEMESTRAL
}
