package com.danilo.DaniloOrtiz.repository;


import com.danilo.DaniloOrtiz.model.Plano;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.ArrayList;
import java.util.List;

public interface PlanoRepository extends JpaRepository<Plano, Integer> {
    Plano findById(Long id);
}
