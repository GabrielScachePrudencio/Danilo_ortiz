package com.danilo.DaniloOrtiz.repository;

import com.danilo.DaniloOrtiz.model.MensalidadeCancelada;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MensalidadeCanceladaRepository
        extends JpaRepository<MensalidadeCancelada, Long> {

    List<MensalidadeCancelada> findByAlunoIdOrderByDataCancelamentoDesc(Long alunoId);
}