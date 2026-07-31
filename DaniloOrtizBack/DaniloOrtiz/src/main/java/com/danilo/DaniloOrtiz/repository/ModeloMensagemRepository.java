package com.danilo.DaniloOrtiz.repository;

import com.danilo.DaniloOrtiz.model.ModeloMensagem;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ModeloMensagemRepository extends JpaRepository<ModeloMensagem, Long> {
    Optional<ModeloMensagem> findByTipoAndAtivoTrue(String tipo);
    List<ModeloMensagem> findByAtivoTrue();
}