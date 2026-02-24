package com.danilo.DaniloOrtiz.service;

import com.danilo.DaniloOrtiz.model.Aluno;
import com.danilo.DaniloOrtiz.model.dto.AlunoDTO;
import com.danilo.DaniloOrtiz.model.mapper.AlunoMapper;
import com.danilo.DaniloOrtiz.repository.AlunoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AlunoService {

    private final AlunoRepository ar;
    private final AlunoMapper mapper;

    public AlunoDTO add(Aluno aluno){
        Aluno salvo = ar.save(aluno);
        return mapper.toDTO(salvo);
    }

    public List<AlunoDTO> findAll(){
        return ar.findAll()
                .stream()
                .map(mapper::toDTO)
                .toList();
    }

    public AlunoDTO login(String email, String senha){
        return ar.findByEmailAndSenha(email, senha)
                .map(mapper::toDTO)
                .orElse(null);
    }

    public Aluno findById(Long id){
        return ar.findById(id);
    }
}
