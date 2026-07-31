package com.danilo.DaniloOrtiz.model.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AlunoDTO {
    private Long id;
    private String nome;
    private String email;
    private String statusAssinatura;
    private Boolean criouContaSisrun;

    //private String senha;
    private String tipoUsuario;


    private String statusMensalidade;
    private LocalDate dataFimMensalidade;

    private Long idCriadoPor;
    private Long atribuidoPorId;

}
