package com.danilo.DaniloOrtiz.model.dto;

import com.danilo.DaniloOrtiz.model.Aluno;
import com.danilo.DaniloOrtiz.model.Mensalidades_parcelas;
import com.danilo.DaniloOrtiz.model.Plano;
import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
public class MensalidadeComParcelasDTO {

    private Long id;

    private Long alunoId;
    private String nomeAluno;

    private Long planoId;
    private String nomePlano;

    private LocalDate dataInicio;
    private LocalDate dataFim;

    private BigDecimal valorMensalidade;

    private String statusLiberacao;

    private Integer numeroParcelasRestantes;

    private List<ParcelaDTO> parcelas;
}
