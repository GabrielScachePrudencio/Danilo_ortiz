package com.danilo.DaniloOrtiz.service;

import com.danilo.DaniloOrtiz.config.JwtUtil;
import com.danilo.DaniloOrtiz.model.Aluno;
import com.danilo.DaniloOrtiz.model.dto.AlunoDTO;
import com.danilo.DaniloOrtiz.model.dto.AlunoPorPlanoDTO;
import com.danilo.DaniloOrtiz.model.mapper.AlunoMapper;
import com.danilo.DaniloOrtiz.repository.AlunoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AlunoService {

    private final AlunoRepository ar;
    private final AlunoMapper mapper;

    public List<AlunoPorPlanoDTO> QtddAlunosPorPlano(){
        return ar.relatorioPorPlano();
    }

    public Optional<Aluno> findByEmail(String email){
        return ar.findByEmail(email);
    }

    public AlunoDTO add(Aluno aluno){
        if(aluno == null) return null;

        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String senhaHash = encoder.encode(aluno.getSenha());
        aluno.setSenha(senhaHash);

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

    public String loginComToken(String email, String senha){
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

        Aluno aluno = ar.findByEmail(email).orElse(null);

        if(aluno == null) return null;

        if(encoder.matches(senha, aluno.getSenha())){
            return JwtUtil.gerarToken(aluno.getEmail(), aluno.getTipoUsuario());
        }

        return null;
    }

    public Aluno findById(Long id){
        return ar.findById(id);
    }

    public boolean atualizarStatus(Long id){
        Aluno aluno = ar.findById(id);

        if(aluno == null) return false;

        if(aluno.getStatusAssinatura().equalsIgnoreCase("DESATIVADO") || aluno.getStatusAssinatura().equalsIgnoreCase("INATIVO")){
            aluno.setStatusAssinatura("ATIVADO");
        } else {
            aluno.setStatusAssinatura("DESATIVADO");
        }

        ar.save(aluno);
        return true;
    }

    public boolean atualizarStatusSisrun(Long id){
        Aluno aluno = ar.findById(id);

        if(aluno == null) return false;

        if(aluno.getCriouContaSisrun() == false){
            aluno.setCriouContaSisrun(true);
        } else {
            aluno.setCriouContaSisrun(false);
        }

        ar.save(aluno);
        return true;
    }

}
