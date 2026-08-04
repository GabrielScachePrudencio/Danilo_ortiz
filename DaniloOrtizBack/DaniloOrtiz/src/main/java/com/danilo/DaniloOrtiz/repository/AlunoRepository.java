package com.danilo.DaniloOrtiz.repository;

import com.danilo.DaniloOrtiz.model.Aluno;
import com.danilo.DaniloOrtiz.model.dto.AlunoDTO;
import com.danilo.DaniloOrtiz.model.dto.AlunoPorPlanoDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

public interface AlunoRepository extends JpaRepository<Aluno, Integer> {
    Optional<Aluno> findByEmailAndSenha(String email, String senha);

    Optional<Aluno> findByEmail(String email);

    Aluno findById(Long id);

    @Query("""
    SELECT new com.danilo.DaniloOrtiz.model.dto.AlunoPorPlanoDTO(
        p.nome,
        COUNT(a),
        SUM(p.valor)
    )
    FROM Aluno a
    JOIN a.planoAtual p
    WHERE a.statusAssinatura = 'ATIVADO'
    GROUP BY p.nome
""")
    List<AlunoPorPlanoDTO> relatorioPorPlano();

    @Modifying
    @Query("UPDATE Aluno a SET a.statusAssinatura = :status WHERE a.id = :id")
    void atualizarStatusAssinatura(@Param("id") Long id, @Param("status") String status);

    @Modifying
    @Transactional
    @Query("UPDATE Aluno a SET a.statusAssinatura = 'DESATIVADO', a.planoAtual = null WHERE a.id = :id")
    void desativarAssinatura(@Param("id") Long id);

    // AlunoRepository
    List<Aluno> findByStatusAssinatura(String statusAssinatura);

    @Query("SELECT a FROM Aluno a WHERE a.CPF = :cpf")
    Optional<Aluno> findByCpf(@Param("cpf") String cpf);


    boolean existsByEmail(String email);
    boolean existsByCPF(String cpf);

    // usado pra checar duplicidade por nome (ignorando maiúsculas)
    boolean existsByNomeIgnoreCase(String nome);
}
