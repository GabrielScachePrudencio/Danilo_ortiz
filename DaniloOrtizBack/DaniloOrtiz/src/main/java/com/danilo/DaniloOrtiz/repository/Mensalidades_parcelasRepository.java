package com.danilo.DaniloOrtiz.repository;

import com.danilo.DaniloOrtiz.model.Mensalidade;
import com.danilo.DaniloOrtiz.model.Mensalidades_parcelas;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;


public interface Mensalidades_parcelasRepository extends JpaRepository<Mensalidades_parcelas, Integer> {
    List<Mensalidades_parcelas> findAllByMensalidade(Mensalidade mensalidade);
    List<Mensalidades_parcelas>
    findByMensalidadeAndStatusInOrderByNumeroParcelaAsc(
            Mensalidade mensalidade,
            List<String> status
    );
}

