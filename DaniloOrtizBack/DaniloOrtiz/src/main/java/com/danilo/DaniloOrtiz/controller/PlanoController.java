package com.danilo.DaniloOrtiz.controller;


import com.danilo.DaniloOrtiz.model.Aluno;
import com.danilo.DaniloOrtiz.model.Plano;
import com.danilo.DaniloOrtiz.repository.PlanoRepository;
import com.danilo.DaniloOrtiz.service.AlunoService;
import com.danilo.DaniloOrtiz.service.PlanoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/planos")
@RequiredArgsConstructor
//@CrossOrigin(origins = "http://localhost:3000")
@CrossOrigin(origins = "*")

public class PlanoController {
    private final PlanoService planoservice;
    private final AlunoService alunoService;
    private final PlanoRepository planoRepository;

    @GetMapping
    public ResponseEntity<List<Plano>> getPlanos(){
        return ResponseEntity.ok(planoservice.listarTodosPlanos());
    }

    @GetMapping("/todos")
    public ResponseEntity<?> getAllPlanos(Authentication authentication){
        String email = authentication.getName();
        Aluno usuarioLogado = alunoService.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        boolean isAdmin = "ADMIN".equals(usuarioLogado.getTipoUsuario());

        if(!isAdmin){
            return ResponseEntity.status(403).body(Map.of("message", "Acesso negado"));
        }
        return ResponseEntity.ok(planoservice.getAll());
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
        plano.setFrequenciaSemanal(planoAtualizado.getFrequenciaSemanal());
        plano.setAtivo(planoAtualizado.isAtivo());
        plano.setGrupo(planoAtualizado.getGrupo());
        plano.setPeriodo(planoAtualizado.getPeriodo());
        return ResponseEntity.ok(planoservice.salvar(plano));
    }

    @PostMapping
    public ResponseEntity<?> criar(@RequestBody Plano plano, Authentication authentication) {
        String email = authentication.getName();
        Aluno usuarioLogado = alunoService.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        boolean isAdmin = "ADMIN".equals(usuarioLogado.getTipoUsuario());

        if(!isAdmin){
            return ResponseEntity.status(403).body(Map.of("message", "Acesso negado"));
        }

        try {

            if (plano.getNome() == null ||
                    plano.getNome().trim().isEmpty()) {

                return ResponseEntity
                        .badRequest()
                        .body("O nome do plano é obrigatório.");
            }

            if (plano.getValor() == null ||
                    plano.getValor().signum() < 0) {

                return ResponseEntity
                        .badRequest()
                        .body("O valor do plano é inválido.");
            }

            if (plano.getDuracaomeses() == null ||
                    plano.getDuracaomeses() < 1) {

                return ResponseEntity
                        .badRequest()
                        .body("A duração do plano deve ser de pelo menos 1 mês.");
            }

            if (plano.getFrequenciaSemanal() != null &&
                    plano.getFrequenciaSemanal() < 1) {

                return ResponseEntity
                        .badRequest()
                        .body("A frequência semanal deve ser maior que zero.");
            }

            // Todo plano novo começa ativo,
            // caso o front não envie essa informação.
            if (!plano.isAtivo()) {
                // Mantemos o valor enviado pelo front.
                // Portanto, se quiser criar inativo, poderá.
            }

            plano.setId(null);

            Plano salvo = planoRepository.save(plano);

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(salvo);

        } catch (Exception e) {

            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erro ao criar plano: " + e.getMessage());
        }
    }


    @PutMapping("/{id}/alternar-status")
    public ResponseEntity<?> alternarStatus(
            @PathVariable Long id, Authentication authentication
    ) {
        String email = authentication.getName();
        Aluno usuarioLogado = alunoService.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        boolean isAdmin = "ADMIN".equals(usuarioLogado.getTipoUsuario());

        if(!isAdmin){
            return ResponseEntity.status(403).body(Map.of("message", "Acesso negado"));
        }

        try {

            Plano optionalPlano =
                    planoRepository.findById(id);

            if (optionalPlano == null) {

                return ResponseEntity
                        .status(HttpStatus.NOT_FOUND)
                        .body("Plano não encontrado.");
            }

            Plano plano = optionalPlano;

            plano.setAtivo(!plano.isAtivo());

            Plano atualizado =
                    planoRepository.save(plano);

            return ResponseEntity.ok(atualizado);

        } catch (Exception e) {

            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erro ao alterar status do plano: " + e.getMessage());
        }
    }

}
