package com.danilo.DaniloOrtiz.controller;


import com.danilo.DaniloOrtiz.model.Aluno;
import com.danilo.DaniloOrtiz.model.dto.AlunoDTO;
import com.danilo.DaniloOrtiz.service.AlunoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/alunos")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class AlunoController {

    private final AlunoService alunoService;

    @GetMapping
    public ResponseEntity<List<AlunoDTO>> todosAlunos() {
        return ResponseEntity.ok(alunoService.findAll());
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

        AlunoDTO aluno = alunoService.login(
                alunoDTO.getEmail(),
                alunoDTO.getSenha()
        );

        if(aluno == null){
            return ResponseEntity.status(401).body("Credenciais inválidas");
        }
        System.out.println("Login realizado com sucesso para: " + aluno.getEmail());
        return ResponseEntity.ok(aluno);
    }

}

