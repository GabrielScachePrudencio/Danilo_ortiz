package com.danilo.DaniloOrtiz.service;


import com.danilo.DaniloOrtiz.model.Aluno;
import com.danilo.DaniloOrtiz.model.Mensalidade;
import com.danilo.DaniloOrtiz.model.Mensalidades_parcelas;
import com.danilo.DaniloOrtiz.model.dto.MensalidadeComParcelasDTO;
import com.danilo.DaniloOrtiz.model.dto.ParcelaDTO;
import com.danilo.DaniloOrtiz.model.mapper.MensalidadeComParcelasMapper;
import com.danilo.DaniloOrtiz.repository.MensalidadeRepository;
import com.danilo.DaniloOrtiz.repository.Mensalidades_parcelasRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MensalidadeService {
    private final MensalidadeRepository mensalidadeRepository;
    private final Mensalidades_parcelasService mensalidadesParcelasService;
    private final AlunoService alunoService;

    public Mensalidade add(Mensalidade mensalidade){
        Aluno aluno = alunoService.findById(mensalidade.getAluno().getId());
        aluno.setPlanoAtual(mensalidade.getPlano());

        return mensalidadeRepository.save(mensalidade);
    }

    public MensalidadeComParcelasDTO mensalidadeCompletaPorIdAluno(Long id){
        Aluno aluno = alunoService.findById(id);

        if(aluno == null) return null;

        Mensalidade mensalidade = mensalidadeRepository.findTopByAlunoOrderByDataInicioDesc(aluno);

        if(mensalidade == null) return null;

        List<Mensalidades_parcelas> listaDeParcelas = mensalidadesParcelasService.findAllByMensalidadePendenteFinalizado(mensalidade);

        MensalidadeComParcelasDTO mensalidadeCompletaComParcelas = MensalidadeComParcelasMapper.toDTO(mensalidade, listaDeParcelas);

        return mensalidadeCompletaComParcelas;
    }



}
