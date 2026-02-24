package com.danilo.DaniloOrtiz.repository;

import com.danilo.DaniloOrtiz.model.Mensalidade;
import com.danilo.DaniloOrtiz.model.Pagamento;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PagamentoRepository extends JpaRepository<Pagamento, Integer>  {
}
