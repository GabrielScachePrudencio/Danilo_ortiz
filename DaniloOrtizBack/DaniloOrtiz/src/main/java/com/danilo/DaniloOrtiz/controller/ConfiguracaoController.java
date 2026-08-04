package com.danilo.DaniloOrtiz.controller;

import com.danilo.DaniloOrtiz.model.Aluno;
import com.danilo.DaniloOrtiz.model.Configuracao;
import com.danilo.DaniloOrtiz.model.dto.AtualizarCredenciaisDTO;
import com.danilo.DaniloOrtiz.pagamentoAPI.ApiMercadoPago;
import com.danilo.DaniloOrtiz.service.AlunoService;
import com.danilo.DaniloOrtiz.service.ConfiguracaoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/configuracao")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ConfiguracaoController {
    private final ConfiguracaoService configuracaoService;
    private final AlunoService alunoService;

    @GetMapping
    public ResponseEntity<?> pegarConf(Authentication authentication){
        String email = authentication.getName();
        Aluno usuarioLogado = alunoService.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        boolean isAdmin = "ADMIN".equals(usuarioLogado.getTipoUsuario());

        if(!isAdmin){
            return ResponseEntity.status(403).body(Map.of("message", "Acesso negado"));
        }

        Configuracao configuracao = configuracaoService.getConfiguracao()
                .orElseThrow(() -> new RuntimeException("Configuração não encontrada"));

        return ResponseEntity.ok(configuracao);
    }

    @PutMapping
    public ResponseEntity<?> atualizarCredenciais(
            @RequestBody AtualizarCredenciaisDTO dto,
            Authentication authentication
    ) {
        String email = authentication.getName();
        Aluno usuarioLogado = alunoService.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        boolean isAdmin = "ADMIN".equals(usuarioLogado.getTipoUsuario());

        if(!isAdmin){
            return ResponseEntity.status(403).body(Map.of("message", "Acesso negado"));
        }


        Configuracao cfg = configuracaoService.getConfiguracao()
                .orElseThrow(() -> new RuntimeException("Configuração não encontrada"));

        if (dto.getMpaccesstoken()     != null) cfg.setMPACCESSTOKEN(dto.getMpaccesstoken());
        if (dto.getMppublickey()       != null) cfg.setMPPUBLICKEY(dto.getMppublickey());
        if (dto.getMpclientid()        != null) cfg.setMPCLIENTID(dto.getMpclientid());
        if (dto.getMpclientsecret()    != null) cfg.setMPCLIENTSECRET(dto.getMpclientsecret());
        if (dto.getMpaccesstokentest() != null) cfg.setMPACCESSTOKENTEST(dto.getMpaccesstokentest());
        if (dto.getMppublickeytest()   != null) cfg.setMPPUBLICKEYTEST(dto.getMppublickeytest());
        if (dto.getMpambiente()        != null) cfg.setMPAMBIENTE(dto.getMpambiente());

        cfg.setDataAtualizacao(java.time.LocalDateTime.now());

        Configuracao salvo = configuracaoService.salvar(cfg);
        return ResponseEntity.ok(salvo);
    }

    @GetMapping("/public-key")
    public ResponseEntity<Map<String, String>> publicKey() {
        Configuracao config = configuracaoService.getConfiguracao()
                .orElseThrow(() -> new RuntimeException("Configuração não encontrada"));

        String publicKey;

        if ("TEST".equalsIgnoreCase(config.getMPAMBIENTE())) {
            publicKey = config.getMPPUBLICKEYTEST();
        } else {
            publicKey = config.getMPPUBLICKEY();
        }

        return ResponseEntity.ok(Map.of(
                "publicKey", publicKey,
                "ambiente", config.getMPAMBIENTE()
        ));

    }
}
