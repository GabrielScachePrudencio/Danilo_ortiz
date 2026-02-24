package com.danilo.DaniloOrtiz.model.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
@Data
public class ParcelaDTO {

    private Long id;
    private BigDecimal valor;
    private LocalDate dataVencimento;
    private String status;
}