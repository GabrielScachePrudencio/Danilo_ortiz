package com.danilo.DaniloOrtiz.repository;

import com.danilo.DaniloOrtiz.model.Mensalidade;
import com.danilo.DaniloOrtiz.model.Pagamento;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PagamentoRepository extends JpaRepository<Pagamento, Integer>  {
    Pagamento findById(Long id);

    List<Pagamento> findAllByOrderByDataCriacaoDesc();

}
