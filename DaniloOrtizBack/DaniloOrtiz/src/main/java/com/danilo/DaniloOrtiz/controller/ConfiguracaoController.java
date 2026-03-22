package com.danilo.DaniloOrtiz.controller;

import com.danilo.DaniloOrtiz.model.Configuracao;
import com.danilo.DaniloOrtiz.service.ConfiguracaoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@RestController
@RequestMapping("/configuracao")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ConfiguracaoController {
    private final ConfiguracaoService configuracaoService;

    @GetMapping
    public Configuracao pegarConf(){
        return configuracaoService.getConfiguracao()
                .orElseThrow(() -> new RuntimeException("Configuração não encontrada"));
    }
}
