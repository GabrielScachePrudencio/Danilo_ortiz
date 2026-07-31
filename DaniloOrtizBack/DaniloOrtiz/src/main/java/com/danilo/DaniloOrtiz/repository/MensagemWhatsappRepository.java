package com.danilo.DaniloOrtiz.repository;

import com.danilo.DaniloOrtiz.model.MensagemWhatsapp;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface MensagemWhatsappRepository extends JpaRepository<MensagemWhatsapp, Long> {
    List<MensagemWhatsapp> findByStatusAndTentativasLessThan(String status, int maxTentativas);
    Optional<MensagemWhatsapp> findTopByNumeroAndTipoOrderByDataCriacaoDesc(String numero, String tipo);
}