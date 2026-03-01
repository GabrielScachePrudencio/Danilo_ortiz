package com.danilo.DaniloOrtiz.model.dto;

import jakarta.persistence.Entity;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;


@Data
public class PagamentoCompletoDTO {

    private Long alunoId;

    private String nomeAluno;

    private Long planoId;

    private String nomePlano;

    private LocalDateTime data;

    private BigDecimal valor;

    private Long parcelaId;

    private String mpPaymentId;

    private String codigoVenda;

    private String statusLiberacao;

    private String formaPagamento;


}
