package com.danilo.DaniloOrtiz.service;

import com.danilo.DaniloOrtiz.model.MensalidadeCancelada;
import com.danilo.DaniloOrtiz.repository.MensalidadeCanceladaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MensalidadeCanceladaService {

    private final MensalidadeCanceladaRepository repository;

    public MensalidadeCancelada salvar(MensalidadeCancelada cancelada) {
        return repository.save(cancelada);
    }

    public List<MensalidadeCancelada> buscarPorAluno(Long alunoId) {
        return repository.findByAlunoIdOrderByDataCancelamentoDesc(alunoId);
    }
}