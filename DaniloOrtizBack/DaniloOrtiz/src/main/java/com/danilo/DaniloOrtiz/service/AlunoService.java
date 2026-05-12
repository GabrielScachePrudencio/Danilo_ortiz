package com.danilo.DaniloOrtiz.service;

import com.danilo.DaniloOrtiz.config.JwtUtil;
import com.danilo.DaniloOrtiz.model.Aluno;
import com.danilo.DaniloOrtiz.model.dto.AlunoDTO;
import com.danilo.DaniloOrtiz.model.dto.AlunoPorPlanoDTO;
import com.danilo.DaniloOrtiz.model.mapper.AlunoMapper;
import com.danilo.DaniloOrtiz.repository.AlunoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
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

    public void trocarSenha(Long idAluno, String senhaAtual, String senhaNova) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

        Aluno aluno = ar.findById(idAluno);

        if (!encoder.matches(senhaAtual, aluno.getSenha())) {
            throw new RuntimeException("Senha atual incorreta.");
        }

        if (senhaNova == null || senhaNova.length() < 6) {
            throw new RuntimeException("A nova senha deve ter pelo menos 6 caracteres.");
        }

        aluno.setSenha(encoder.encode(senhaNova));
        ar.save(aluno);
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

    public Aluno atualizar(Long id, Aluno alunoAtualizado) {
        Aluno aluno = ar.findById(id);

        
        if (aluno == null) return null;

        // atualiza só os campos que vieram preenchidos
        if (alunoAtualizado.getNome()     != null) aluno.setNome(alunoAtualizado.getNome());
        if (alunoAtualizado.getEmail()    != null) aluno.setEmail(alunoAtualizado.getEmail());
        if (alunoAtualizado.getWhatsapp() != null) aluno.setWhatsapp(alunoAtualizado.getWhatsapp());
        if (alunoAtualizado.getCPF()      != null) aluno.setCPF(alunoAtualizado.getCPF());
        if (alunoAtualizado.getCNPJ()     != null) aluno.setCNPJ(alunoAtualizado.getCNPJ());
        if (alunoAtualizado.getRua()      != null) aluno.setRua(alunoAtualizado.getRua());
        if (alunoAtualizado.getNumero()   != null) aluno.setNumero(alunoAtualizado.getNumero());
        if (alunoAtualizado.getCidade()   != null) aluno.setCidade(alunoAtualizado.getCidade());
        if (alunoAtualizado.getCEP()      != null) aluno.setCEP(alunoAtualizado.getCEP());

        // senha: só atualiza se vier E não for vazia
        if (alunoAtualizado.getSenha() != null && !alunoAtualizado.getSenha().isBlank()) {
            BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
            aluno.setSenha(encoder.encode(alunoAtualizado.getSenha()));
        }

        return ar.save(aluno);
    }

}
