package com.danilo.DaniloOrtiz.controller;


import com.danilo.DaniloOrtiz.model.MensagemWhatsapp;
import com.danilo.DaniloOrtiz.repository.ModeloMensagemRepository;
import com.danilo.DaniloOrtiz.service.MensagemManualService;
import com.danilo.DaniloOrtiz.service.MensagemTemplateService;
import lombok.RequiredArgsConstructor;
import org.antlr.v4.runtime.misc.NotNull;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/v1/mensagens")
@RequiredArgsConstructor
public class MensagemController {

    private final MensagemManualService mensagemManualService;
    private final ModeloMensagemRepository modeloRepository;

    public record EnviarMensagemDTO(
            @NotNull Long alunoId,
             String tipo,
            Map<String, Object> params
    ) {}

    @PostMapping("/enviar")
    public ResponseEntity<?> enviar(@RequestBody EnviarMensagemDTO dto) {
        MensagemWhatsapp msg = mensagemManualService.enviar(dto.alunoId(), dto.tipo(), dto.params());
        return ResponseEntity.ok(Map.of("id", msg.getId(), "status", msg.getStatus(), "tipo", msg.getTipo()));
    }

    @GetMapping("/tipos")
    public ResponseEntity<?> listarTipos() {
        return ResponseEntity.ok(
                modeloRepository.findByAtivoTrue().stream()
                        .map(m -> Map.of("tipo", m.getTipo(), "descricao", m.getDescricao()))
                        .toList()
        );
    }
}