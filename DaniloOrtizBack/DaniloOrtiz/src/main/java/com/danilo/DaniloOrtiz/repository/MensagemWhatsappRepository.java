package com.danilo.DaniloOrtiz.repository;

import com.danilo.DaniloOrtiz.model.MensagemWhatsapp;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MensagemWhatsappRepository extends JpaRepository<MensagemWhatsapp, Long> {
    List<MensagemWhatsapp> findByStatusAndTentativasLessThan(String status, int maxTentativas);
}