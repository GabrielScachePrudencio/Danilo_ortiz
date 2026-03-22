package com.danilo.DaniloOrtiz.model.mapper;

import com.danilo.DaniloOrtiz.model.Aluno;
import com.danilo.DaniloOrtiz.model.dto.AlunoDTO;
import org.springframework.stereotype.Component;

@Component
public class AlunoMapper {
    public AlunoDTO toDTO (Aluno aluno){
        return new AlunoDTO(aluno.getId(), aluno.getNome(), aluno.getEmail(), aluno.getStatusAssinatura(), aluno.getCriouContaSisrun() ,aluno.getSenha()  );
    }
    public Aluno toEntity(AlunoDTO dto){
        Aluno aluno = new Aluno();
        aluno.setId(dto.getId());
        aluno.setNome(dto.getNome());
        aluno.setEmail(dto.getEmail());
        aluno.setStatusAssinatura(dto.getStatusAssinatura());
        aluno.setCriouContaSisrun(dto.getCriouContaSisrun());
        aluno.setSenha(dto.getSenha());

        return aluno;
    }
}
