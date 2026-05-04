package com.danilo.DaniloOrtiz.repository;

import com.danilo.DaniloOrtiz.model.Aluno;
import com.danilo.DaniloOrtiz.model.dto.AlunoDTO;
import com.danilo.DaniloOrtiz.model.dto.AlunoPorPlanoDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

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
}
