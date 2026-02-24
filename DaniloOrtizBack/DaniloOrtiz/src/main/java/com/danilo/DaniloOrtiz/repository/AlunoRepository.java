package com.danilo.DaniloOrtiz.repository;

import com.danilo.DaniloOrtiz.model.Aluno;
import com.danilo.DaniloOrtiz.model.dto.AlunoDTO;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.ArrayList;
import java.util.Optional;

public interface AlunoRepository extends JpaRepository<Aluno, Integer> {
    Optional<Aluno> findByEmailAndSenha(String email, String senha);

    Aluno findById(Long id);
}
