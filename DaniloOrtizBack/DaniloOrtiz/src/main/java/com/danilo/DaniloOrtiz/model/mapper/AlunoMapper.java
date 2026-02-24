package com.danilo.DaniloOrtiz.model.mapper;

import com.danilo.DaniloOrtiz.model.Aluno;
import com.danilo.DaniloOrtiz.model.dto.AlunoDTO;
import org.springframework.stereotype.Component;

@Component
public class AlunoMapper {
    public AlunoDTO toDTO (Aluno aluno){
        return new AlunoDTO(aluno.getId(), aluno.getEmail(),aluno.getSenha());
    }
    public Aluno toEntity(AlunoDTO dto){
        Aluno aluno = new Aluno();
        aluno.setId(dto.getId());
        aluno.setEmail(dto.getEmail());
        aluno.setSenha(dto.getSenha());

        return aluno;
    }
}
