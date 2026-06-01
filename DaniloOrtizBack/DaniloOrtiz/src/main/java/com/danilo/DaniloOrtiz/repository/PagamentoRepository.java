package com.danilo.DaniloOrtiz.repository;

import com.danilo.DaniloOrtiz.model.Aluno;
import com.danilo.DaniloOrtiz.model.Mensalidade;
import com.danilo.DaniloOrtiz.model.Pagamento;
import com.danilo.DaniloOrtiz.model.Plano;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.awt.print.Pageable;
import java.util.List;
import java.util.Optional;

public interface PagamentoRepository extends JpaRepository<Pagamento, Integer>  {
    Pagamento findById(Long id);
    Optional<Pagamento> findByMpPaymentId(String mpPaymentId);
    List<Pagamento> findAllByOrderByDataCriacaoDesc();
    // PagamentoRepository
    @Query("SELECT p FROM Pagamento p WHERE p.mensalidades_parcelas.id = :parcelaId ORDER BY p.id DESC LIMIT 1")
    Optional<Pagamento> findTopByParcelaId(@Param("parcelaId") Long parcelaId);

    @Query("""
    SELECT p
    FROM Pagamento p
    WHERE p.mensalidades_parcelas.id = :id
""")
    List<Pagamento> findByParcelaId(@Param("id") Long id);


    // Busca o plano do pagamento mais recente aprovado do aluno
    @Query(value = "SELECT plano_id FROM pagamentos WHERE aluno_id = :alunoId AND plano_id IS NOT NULL ORDER BY id DESC LIMIT 1", nativeQuery = true)
    Optional<Long> findPlanoIdByAlunoId(@Param("alunoId") Long alunoId);
}
