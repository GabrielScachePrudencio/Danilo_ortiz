package com.danilo.DaniloOrtiz.model.dto;

import lombok.Data;

import java.math.BigDecimal;

public class AlunoPorPlanoDTO {

    private String plano;
    private Long quantidade;
    private BigDecimal  receita;

    public AlunoPorPlanoDTO(String plano, Long quantidade, BigDecimal  receita) {
        this.plano = plano;
        this.quantidade = quantidade;
        this.receita = receita;
    }

    public String getPlano() { return plano; }
    public Long getQuantidade() { return quantidade; }
    public BigDecimal getReceita() { return receita; }

}
