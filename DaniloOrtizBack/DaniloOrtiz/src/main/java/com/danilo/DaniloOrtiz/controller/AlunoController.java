package com.danilo.DaniloOrtiz.controller;


import com.danilo.DaniloOrtiz.model.Aluno;
import com.danilo.DaniloOrtiz.model.dto.AlunoDTO;
import com.danilo.DaniloOrtiz.model.dto.AlunoPorPlanoDTO;
import com.danilo.DaniloOrtiz.model.dto.LoginDTO;
import com.danilo.DaniloOrtiz.model.mapper.AlunoMapper;
import com.danilo.DaniloOrtiz.service.AlunoService;
import com.danilo.DaniloOrtiz.service.NotificacaoService;
import com.danilo.DaniloOrtiz.service.PlanoExpirationScheduler;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/alunos")
@RequiredArgsConstructor
//@CrossOrigin(origins = "http://localhost:3000")
public class AlunoController {
    private final PlanoExpirationScheduler planoExpirationScheduler; // <-- adiciona
    private final AlunoService alunoService;
    private final AlunoMapper mapper;
    private final NotificacaoService notificacaoService;

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

    @PostMapping("/admin/criar")
    public ResponseEntity<AlunoDTO> addAlunoAdmin(@RequestBody Aluno aluno,
              Authentication authentication) {

        String email = authentication.getName();
        Optional<Aluno> administradorOpt = alunoService.findByEmail(email);

        if(!"ADMIN".equals(administradorOpt.get().getTipoUsuario())){
            return ResponseEntity.badRequest().build();
        }

        return ResponseEntity.ok(alunoService.addAdmin(aluno, administradorOpt));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Aluno> buscarPorId(@PathVariable Long id){
        Aluno aluno = alunoService.findById(id);

        if(aluno == null) return ResponseEntity.notFound().build();

        return ResponseEntity.ok(aluno);
    }


    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDTO loginDTO){
        String frontendUrl = System.getenv("FRONTEND_URL");
        if(loginDTO.getEmail() == null || loginDTO.getSenha() == null){
            return ResponseEntity.badRequest().body("Email e senha são obrigatórios");
        }
        System.out.println("FRONTEND_URL = " + System.getenv("FRONTEND_URL"));
        String tokenCompleto = alunoService.loginComToken(
                loginDTO.getEmail(),
                loginDTO.getSenha()
        );

        if(tokenCompleto == null){
            return ResponseEntity.status(401).body("Credenciais inválidas");
        }

        planoExpirationScheduler.verificarInadimplentes();
        planoExpirationScheduler.verificarPlanosExpirados();

        notificacaoService.verificarMensalidadesProximasDoFim();
        notificacaoService.verificarCobrancasDoDia();
        notificacaoService.verificarAlunosInativos();



        return ResponseEntity.ok(tokenCompleto);
    }

    @GetMapping("/verifica-criado-admin")
    public ResponseEntity<?> loginParaContasCriadasPeloAdmin(@RequestParam String cpf){

        if(cpf == null || cpf.isBlank()){
            return ResponseEntity.badRequest().body("CPF é obrigatório");
        }

        // Remova formatações caso o usuário digite pontos/traços
        String cpfLimpo = cpf.replaceAll("\\D", "");

        Optional<Aluno> alunoOpt = alunoService.findByCpf(cpfLimpo);

        if(alunoOpt.isEmpty()){
            return ResponseEntity.status(401).body("Erro aluno nao encontrado");
        }

        Aluno aluno = alunoOpt.get();

        if(aluno.getId_criado_por() == null || aluno.getId_criado_por() <= 0 || aluno.getSenha() != null){
            return ResponseEntity.status(401).body("Erro aluno");
        }

        Aluno administrador = alunoService.findById(aluno.getId_criado_por());

        if(administrador == null){
            return ResponseEntity.status(401).body("Erro administrador");
        }

        if(!"ADMIN".equals(administrador.getTipoUsuario())){
            return ResponseEntity.status(401).body("Erro somente administradores");
        }

        return ResponseEntity.ok(true);
    }

    @PostMapping("/definir-senha")
    public ResponseEntity<?> definirSenha(@RequestBody Map<String, String> body) {
        try {
            alunoService.definirSenhaInicial(body.get("cpf"), body.get("novaSenha"));
            return ResponseEntity.ok(Map.of("message", "Senha definida com sucesso."));
        } catch (RuntimeException e) {
            return ResponseEntity.status(400).body(Map.of("message", e.getMessage()));
        }
    }
}

