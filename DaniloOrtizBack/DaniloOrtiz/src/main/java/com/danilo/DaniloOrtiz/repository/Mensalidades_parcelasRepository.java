package com.danilo.DaniloOrtiz.repository;

import com.danilo.DaniloOrtiz.model.Aluno;
import com.danilo.DaniloOrtiz.model.Mensalidade;
import com.danilo.DaniloOrtiz.model.Mensalidades_parcelas;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;


public interface Mensalidades_parcelasRepository extends JpaRepository<Mensalidades_parcelas, Integer> {
    List<Mensalidades_parcelas> findAllByMensalidade(Mensalidade mensalidade);

    List<Mensalidades_parcelas>
    findByMensalidadeAndStatusInOrderByNumeroParcelaAsc(
            Mensalidade mensalidade,
            List<String> status
    );

    Mensalidades_parcelas findById(Long id);

    Mensalidades_parcelas findByMensalidadeAndNumeroParcela(Mensalidade mensalidade, Integer numeroParcela);

    List<Mensalidades_parcelas> findByStatusAndDataVencimentoBefore(
            String status, LocalDateTime dataVencimento
    );

    @Query("SELECT MAX(p.dataVencimento) FROM Mensalidades_parcelas p WHERE p.mensalidade.aluno = :aluno")
    LocalDateTime findUltimaDataVencimentoPorAluno(@Param("aluno") Aluno aluno);

}
