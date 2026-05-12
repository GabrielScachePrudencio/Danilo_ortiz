package com.danilo.DaniloOrtiz.controller;


import com.danilo.DaniloOrtiz.model.Aluno;
import com.danilo.DaniloOrtiz.model.dto.AlunoDTO;
import com.danilo.DaniloOrtiz.model.dto.AlunoPorPlanoDTO;
import com.danilo.DaniloOrtiz.model.mapper.AlunoMapper;
import com.danilo.DaniloOrtiz.service.AlunoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/alunos")
@RequiredArgsConstructor
//@CrossOrigin(origins = "http://localhost:3000")
@CrossOrigin(origins = "*")
public class AlunoController {

    private final AlunoService alunoService;
    private final AlunoMapper mapper;

    @GetMapping
    public ResponseEntity<List<AlunoDTO>> todosAlunos() {
        List<AlunoDTO> alunoDTOS = alunoService.findAll();

        if(alunoDTOS == null) return ResponseEntity.notFound().build();

        return ResponseEntity.ok(alunoDTOS);
    }

    @PostMapping("/{id}/trocar-senha")
    public ResponseEntity<?> trocarSenha(
            @PathVariable Long id,
            @RequestBody Map<String, String> body
    ) {
        try {
            String senhaAtual = body.get("senhaAtual");
            String senhaNova  = body.get("senhaNova");

            alunoService.trocarSenha(id, senhaAtual, senhaNova);

            return ResponseEntity.ok(Map.of("message", "Senha alterada com sucesso."));

        } catch (RuntimeException e) {
            return ResponseEntity
                    .status(400)
                    .body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/me")
    public ResponseEntity<AlunoDTO> getMe(Authentication authentication) {

        String email = authentication.getName(); // vem do token

        Aluno aluno = alunoService.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        AlunoDTO alunoDTO = mapper.toDTO(aluno);
        alunoDTO.setSenha(null);

        return ResponseEntity.ok(alunoDTO);
    }

    @GetMapping("/qtdd-aluno-por-plano")
    public ResponseEntity<List<AlunoPorPlanoDTO>> qtddplanoaluno(){
        List<AlunoPorPlanoDTO> lista = alunoService.QtddAlunosPorPlano();

        if(lista==null) return ResponseEntity.notFound().build();

        return ResponseEntity.ok(lista);
    }


    @PostMapping("/atualizar-status-aluno/{id}")
    public ResponseEntity<Boolean> atualizarStatusAluno(@PathVariable Long id){
        boolean res = alunoService.atualizarStatus(id);

        if(!res){
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(res);
    }

    @PostMapping("/atualizar-status-contasisrun-aluno/{id}")
    public ResponseEntity<Boolean> atualizarStatusContaSisrunAluno(@PathVariable Long id){
        boolean res = alunoService.atualizarStatusSisrun(id);

        if(!res){
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(res);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> atualizarAluno(
            @PathVariable Long id,
            @RequestBody Aluno alunoAtualizado
    ) {
        try {
            Aluno aluno = alunoService.atualizar(id, alunoAtualizado);

            if (aluno == null) return ResponseEntity.notFound().build();

            return ResponseEntity.ok(aluno);

        } catch (RuntimeException e) {
            return ResponseEntity
                    .status(400)
                    .body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<AlunoDTO> addAluno(@RequestBody Aluno aluno) {
        return ResponseEntity.ok(alunoService.add(aluno));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Aluno> buscarPorId(@PathVariable Long id){
        Aluno aluno = alunoService.findById(id);

        if(aluno == null) return ResponseEntity.notFound().build();

        return ResponseEntity.ok(aluno);
    }


    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AlunoDTO alunoDTO){

        if(alunoDTO.getEmail() == null || alunoDTO.getSenha() == null){
            return ResponseEntity.badRequest().body("Email e senha são obrigatórios");
        }


        String tokenCompleto = alunoService.loginComToken(
                alunoDTO.getEmail(),
                alunoDTO.getSenha()
        );

        if(tokenCompleto == null){
            return ResponseEntity.status(401).body("Credenciais inválidas");
        }

        return ResponseEntity.ok(tokenCompleto);
    }

}

