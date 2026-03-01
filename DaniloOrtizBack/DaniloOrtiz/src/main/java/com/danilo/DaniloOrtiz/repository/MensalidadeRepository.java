package com.danilo.DaniloOrtiz.repository;

import com.danilo.DaniloOrtiz.model.Aluno;
import com.danilo.DaniloOrtiz.model.Mensalidade;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MensalidadeRepository extends JpaRepository<Mensalidade, Integer> {
    Mensalidade findByAluno(Aluno aluno);
    Mensalidade findTopByAlunoOrderByDataInicioDesc(Aluno aluno);
    Mensalidade findById(Long id);
}
