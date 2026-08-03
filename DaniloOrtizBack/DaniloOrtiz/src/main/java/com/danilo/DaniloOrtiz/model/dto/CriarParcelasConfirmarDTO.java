package com.danilo.DaniloOrtiz.model.dto;

import lombok.Data;

@Data
public class CriarParcelasConfirmarDTO {
    private Long alunoId;
    private Integer totalParcelas;
    private String formaPagamento;
    private String observacao;
}