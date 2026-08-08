package com.danilo.DaniloOrtiz.service;

import com.danilo.DaniloOrtiz.model.Plano;
import com.danilo.DaniloOrtiz.repository.PlanoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PlanoService {
    private final PlanoRepository pr;

    public List<Plano> listarTodosPlanos(){
        List<Plano> planos = pr.findAllByAtivoTrueOrderByDuracaomesesAsc();

        if(planos == null){
            return List.of();
        }

        return planos;
    }

    public List<Plano> getAll(){
        return pr.findAll();
    }

    public Plano buscarPorId(Long id){
        return pr.findById(id);
    }

    public Plano salvar(Plano plano) {
        return pr.save(plano);
    }

    public Plano findByNome(String nome){
        return pr.findByNome(nome);
    }


}
