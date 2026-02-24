package com.danilo.DaniloOrtiz.controller;


import com.danilo.DaniloOrtiz.model.Plano;
import com.danilo.DaniloOrtiz.service.PlanoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/planos")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class PlanoController {
    private final PlanoService planoservice;

    @GetMapping
    public ResponseEntity<List<Plano>> getPlanos(){
        return ResponseEntity.ok(planoservice.listarTodosPlanos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Plano> buscarPorId(@PathVariable Long id){
        Plano plano = planoservice.buscarPorId(id);

        if(plano == null) return ResponseEntity.notFound().build();

        return ResponseEntity.ok(plano);
    }
}
