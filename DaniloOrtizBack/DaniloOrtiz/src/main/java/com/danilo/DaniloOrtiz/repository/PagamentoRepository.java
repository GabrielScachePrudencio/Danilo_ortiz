package com.danilo.DaniloOrtiz.repository;

import com.danilo.DaniloOrtiz.model.Mensalidade;
import com.danilo.DaniloOrtiz.model.Pagamento;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PagamentoRepository extends JpaRepository<Pagamento, Integer>  {
    Pagamento findById(Long id);
    Optional<Pagamento> findByMpPaymentId(String mpPaymentId);
    List<Pagamento> findAllByOrderByDataCriacaoDesc();

}
