package com.danilo.DaniloOrtiz.controller;

import com.danilo.DaniloOrtiz.model.Configuracao;
import com.danilo.DaniloOrtiz.model.dto.AtualizarCredenciaisDTO;
import com.danilo.DaniloOrtiz.pagamentoAPI.ApiMercadoPago;
import com.danilo.DaniloOrtiz.service.ConfiguracaoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
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

    @PutMapping
    public ResponseEntity<Configuracao> atualizarCredenciais(
            @RequestBody AtualizarCredenciaisDTO dto
    ) {
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

    @GetMapping("/configuracao/public-key")
    public ResponseEntity<Map<String, String>> publicKey() {
        return ResponseEntity.ok(Map.of(
                "publicKey", ApiMercadoPago.resolverPublicKey(),
                "ambiente",  configuracaoService.getConfiguracao()
                        .map(c -> c.getMPAMBIENTE())
                        .orElse("PRODUCAO")
        ));
    }
}
