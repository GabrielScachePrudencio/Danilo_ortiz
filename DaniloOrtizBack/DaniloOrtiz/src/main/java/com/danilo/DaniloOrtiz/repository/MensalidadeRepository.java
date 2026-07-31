package com.danilo.DaniloOrtiz.repository;

import com.danilo.DaniloOrtiz.model.Aluno;
import com.danilo.DaniloOrtiz.model.Mensalidade;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface MensalidadeRepository extends JpaRepository<Mensalidade, Integer> {
    Mensalidade findByAluno(Aluno aluno);
    Mensalidade findTopByAlunoOrderByIdDesc(Aluno aluno);
    Mensalidade findById(Long id);
    List<Mensalidade> findByAlunoId(Long alunoId);
    List<Mensalidade> findByStatusLiberacaoAndDataFimBefore(String status, LocalDate data);

    List<Mensalidade> findByAlunoOrderByIdDesc(Aluno aluno);
    List<Mensalidade> findByAluno_IdInAndStatusLiberacaoIn(List<Long> alunoIds, List<String> status);
}
