package com.danilo.DaniloOrtiz.controller;

import com.danilo.DaniloOrtiz.model.dto.MensalidadeComParcelasDTO;
import com.danilo.DaniloOrtiz.model.dto.PagamentoCompletoDTO;
import com.danilo.DaniloOrtiz.model.dto.ParcelaDetalheDTO;
import com.danilo.DaniloOrtiz.service.MensalidadeService;
import com.mercadopago.resources.payment.Payment;
import com.mercadopago.resources.preference.Preference;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/mensalidades")
@RequiredArgsConstructor
//@CrossOrigin(origins = "http://localhost:3000")
@CrossOrigin(origins = "*")

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


    // Retorna detalhes da parcela + dados do pagamento interno + consulta MP
    @GetMapping("/parcela/{idParcela}")
    public ResponseEntity<ParcelaDetalheDTO> verificarParcela(
            @PathVariable Long idParcela) {

        ParcelaDetalheDTO dto = mensalidadeService.verificarParcela(idParcela);

        if (dto == null) return ResponseEntity.notFound().build();

        return ResponseEntity.ok(dto);
    }


    @PostMapping("/abrirPagamento")
    public ResponseEntity<String> abrirPagamento(@RequestBody PagamentoCompletoDTO dto){

        boolean resultado = mensalidadeService.addParcelaNaoPaga(dto);
        Preference preference = mensalidadeService.abrirPagamento(dto);

        if(preference == null || !resultado) return ResponseEntity.badRequest().build();

        return ResponseEntity.ok(preference.getInitPoint());
    }
}
