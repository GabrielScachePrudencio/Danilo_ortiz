package com.danilo.DaniloOrtiz.controller;


import com.danilo.DaniloOrtiz.model.Aluno;
import com.danilo.DaniloOrtiz.model.Plano;
import com.danilo.DaniloOrtiz.service.AlunoService;
import com.danilo.DaniloOrtiz.service.PlanoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/planos")
@RequiredArgsConstructor
//@CrossOrigin(origins = "http://localhost:3000")
@CrossOrigin(origins = "*")

public class PlanoController {
    private final PlanoService planoservice;
    private final AlunoService alunoService;

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

    @PutMapping("/{id}")
    public ResponseEntity<?> atualizarPlano(@PathVariable Long id, @RequestBody Plano planoAtualizado, Authentication authentication) {
        String email = authentication.getName();
        Aluno usuarioLogado = alunoService.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        boolean isAdmin = "ADMIN".equals(usuarioLogado.getTipoUsuario());

        if(!isAdmin){
            return ResponseEntity.status(403).body(Map.of("message", "Acesso negado"));
        }

        Plano plano = planoservice.buscarPorId(id);
        if (plano == null) return ResponseEntity.notFound().build();

        plano.setNome(planoAtualizado.getNome());
        plano.setValor(planoAtualizado.getValor());
        plano.setDuracaomeses(planoAtualizado.getDuracaomeses()); // ← nome correto

        return ResponseEntity.ok(planoservice.salvar(plano));
    }
}
