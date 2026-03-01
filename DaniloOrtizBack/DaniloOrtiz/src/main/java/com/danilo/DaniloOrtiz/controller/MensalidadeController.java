package com.danilo.DaniloOrtiz.controller;

import com.danilo.DaniloOrtiz.model.dto.MensalidadeComParcelasDTO;
import com.danilo.DaniloOrtiz.model.dto.PagamentoCompletoDTO;
import com.danilo.DaniloOrtiz.service.MensalidadeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/mensalidades")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class MensalidadeController {
    private final MensalidadeService mensalidadeService;

    @GetMapping("/{idAluno}")
    public ResponseEntity<MensalidadeComParcelasDTO> buscarMensalidadePorIdAluno(@PathVariable Long idAluno){
        MensalidadeComParcelasDTO mensalidadeComParcelasDTO = mensalidadeService.mensalidadeCompletaPorIdAluno(idAluno);

        if(mensalidadeComParcelasDTO == null){
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(mensalidadeComParcelasDTO);
    }

    @PostMapping("/pagarParcela")
    public ResponseEntity<Boolean> pagarParcela(@RequestBody PagamentoCompletoDTO PagamentoCompletoDTO){
        boolean resultado = mensalidadeService.pagarParcela(PagamentoCompletoDTO);

        if(!resultado){
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok().build();

    }


}
