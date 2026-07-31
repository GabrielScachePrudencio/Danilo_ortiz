package com.danilo.DaniloOrtiz.model.mapper;

import com.danilo.DaniloOrtiz.model.Aluno;
import com.danilo.DaniloOrtiz.model.Mensalidade;
import com.danilo.DaniloOrtiz.model.dto.AlunoDTO;
import org.springframework.stereotype.Component;

@Component
public class AlunoMapper {

    public AlunoDTO toDTO(Aluno aluno, Mensalidade mensalidadeAtual) {
        return new AlunoDTO(
                aluno.getId(),
                aluno.getNome(),
                aluno.getEmail(),
                aluno.getStatusAssinatura(),
                aluno.getCriouContaSisrun(),
                aluno.getTipoUsuario(),
                mensalidadeAtual != null ? mensalidadeAtual.getStatusLiberacao() : null,
                mensalidadeAtual != null ? mensalidadeAtual.getDataFim() : null,
                aluno.getId_criado_por(), // <-- preenchendo quem criou o aluno
                mensalidadeAtual != null ? mensalidadeAtual.getAtribuidoPorId() : null // <-- preenchendo quem atribuiu a mensalidade
        );
    }

    // sobrecarga pra quem já chama toDTO(aluno) sem mensalidade em algum outro lugar do código
    public AlunoDTO toDTO(Aluno aluno) {
        return toDTO(aluno, null);
    }

    public Aluno toEntity(AlunoDTO dto) {
        Aluno aluno = new Aluno();
        aluno.setId(dto.getId());
        aluno.setNome(dto.getNome());
        aluno.setEmail(dto.getEmail());
        aluno.setStatusAssinatura(dto.getStatusAssinatura());
        aluno.setCriouContaSisrun(dto.getCriouContaSisrun());
        aluno.setTipoUsuario(dto.getTipoUsuario());
        aluno.setId_criado_por(dto.getIdCriadoPor());
        return aluno;
    }
}