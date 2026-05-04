package com.danilo.DaniloOrtiz.model.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AlunoDTO {
    private Long id;
    private String nome;
    private String email;
    private String statusAssinatura;
    private Boolean criouContaSisrun;

    private String senha;

}
