package com.danilo.DaniloOrtiz.controller;

import com.danilo.DaniloOrtiz.service.PlanoExpirationScheduler;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/dev")
@RequiredArgsConstructor
public class DevTestController {

    private final PlanoExpirationScheduler scheduler;

    @PostMapping("/forcar-verificacao-inadimplentes")
    public ResponseEntity<String> forcarVerificacao() {
        scheduler.verificarInadimplentes();
        return ResponseEntity.ok("Verificação executada — cheque o console.");
    }
}