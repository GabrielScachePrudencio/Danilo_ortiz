package com.danilo.DaniloOrtiz.model.dto;

import lombok.Data;

@Data
public class ConfirmacaoManualDTO {
    private Long parcelaId;
    private String formaPagamento;
    private String observacao;
}