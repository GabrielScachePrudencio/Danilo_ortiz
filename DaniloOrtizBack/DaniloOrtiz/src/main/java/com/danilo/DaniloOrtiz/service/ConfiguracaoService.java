package com.danilo.DaniloOrtiz.service;

import com.danilo.DaniloOrtiz.model.Configuracao;
import com.danilo.DaniloOrtiz.repository.ConfiguracaoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ConfiguracaoService {
    private final ConfiguracaoRepository configuracaoRepository;

    public Optional<Configuracao> getConfiguracao(){
        return configuracaoRepository.findById(1);
    }

    public Configuracao salvar(Configuracao configuracao) {
        return configuracaoRepository.save(configuracao);
    }
}
