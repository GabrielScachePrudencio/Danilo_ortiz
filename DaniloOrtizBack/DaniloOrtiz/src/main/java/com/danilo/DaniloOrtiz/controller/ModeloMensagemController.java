package com.danilo.DaniloOrtiz.controller;


import com.danilo.DaniloOrtiz.model.ModeloMensagem;
import com.danilo.DaniloOrtiz.repository.ModeloMensagemRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/v1/mensagens/modelos")
@RequiredArgsConstructor
public class ModeloMensagemController {

    private final ModeloMensagemRepository repository;

    @GetMapping
    public List<ModeloMensagem> listar() { return repository.findAll(); }

    @PutMapping("/{id}")
    public ResponseEntity<ModeloMensagem> atualizar(@PathVariable Long id, @RequestBody ModeloMensagem dto) {
        ModeloMensagem modelo = repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Modelo não encontrado"));
        modelo.setConteudo(dto.getConteudo());
        modelo.setDescricao(dto.getDescricao());
        modelo.setAtivo(dto.isAtivo());
        modelo.setAtualizadoEm(LocalDateTime.now());
        return ResponseEntity.ok(repository.save(modelo));
    }

    @PostMapping
    public ResponseEntity<ModeloMensagem> criar(@RequestBody ModeloMensagem dto) {
        dto.setAtualizadoEm(LocalDateTime.now());
        return ResponseEntity.ok(repository.save(dto));
    }
}