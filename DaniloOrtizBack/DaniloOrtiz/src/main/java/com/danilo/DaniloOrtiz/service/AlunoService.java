package com.danilo.DaniloOrtiz.service;

import com.danilo.DaniloOrtiz.config.JwtUtil;
import com.danilo.DaniloOrtiz.model.Aluno;
import com.danilo.DaniloOrtiz.model.Mensalidade;
import com.danilo.DaniloOrtiz.model.dto.AlunoDTO;
import com.danilo.DaniloOrtiz.model.dto.AlunoPorPlanoDTO;
import com.danilo.DaniloOrtiz.model.mapper.AlunoMapper;
import com.danilo.DaniloOrtiz.repository.AlunoRepository;
import com.danilo.DaniloOrtiz.repository.MensalidadeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class AlunoService {

    private final AlunoRepository ar;
    private final AlunoMapper mapper;
    private final MensalidadeRepository mensalidadeRepository;
    private final MensagemManualService mensagemManualService;



    public List<AlunoPorPlanoDTO> QtddAlunosPorPlano(){
        return ar.relatorioPorPlano();
    }

    public Optional<Aluno> findByEmail(String email){
        return ar.findByEmail(email);
    }
    public AlunoDTO update(Aluno aluno){
        if(aluno == null) return null;

        Aluno salvo = ar.save(aluno);
        return mapper.toDTO(salvo);
    }

    public AlunoDTO add(Aluno aluno){
        if(aluno == null) return null;

        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String senhaHash = encoder.encode(aluno.getSenha());
        aluno.setSenha(senhaHash);

        Aluno salvo = ar.save(aluno);
        return mapper.toDTO(salvo);
    }

    public Optional<Aluno> findByCpf(String cpf){
        return ar.findByCpf(cpf);
    }

    public AlunoDTO addAdmin(Aluno aluno, Optional<Aluno> administrador) {
        if (aluno == null) return null;

        aluno.setId_criado_por(administrador.get().getId());
        aluno.setSenha(null);

        Aluno salvo = ar.save(aluno);

        enviarMensagemSeguro(() -> {
            Map<String, Object> params = new HashMap<>();
            params.put("adminNome", administrador.get().getNome());
            params.put("linkLogin", "https://2dassessoria.com.br" + "/login");
            mensagemManualService.enviar(salvo.getId(), "CRIACAO_CONTA", params);
        }, salvo.getId());

        return mapper.toDTO(salvo);
    }

    private void enviarMensagemSeguro(Runnable envio, Long alunoId) {
        try {
            envio.run();
        } catch (Exception e) {
            System.out.println("Falha ao enviar mensagem WhatsApp automática para aluno alunoId");
        }
    }
    public List<AlunoDTO> findAll() {
        List<Aluno> alunos = ar.findAll();

        List<Long> alunoIds = alunos.stream().map(Aluno::getId).toList();

        List<Mensalidade> mensalidadesRelevantes =
                mensalidadeRepository.findByAluno_IdInAndStatusLiberacaoIn(
                        alunoIds, List.of("ATIVADO", "DESATIVADO", "EXPIRADO"));

        Map<Long, Mensalidade> mensalidadePorAluno = new HashMap<>();
        for (Mensalidade m : mensalidadesRelevantes) {
            Long alunoId = m.getAluno().getId();
            Mensalidade atual = mensalidadePorAluno.get(alunoId);

            if (atual == null || prevalece(m, atual)) {
                mensalidadePorAluno.put(alunoId, m);
            }
        }

        return alunos.stream()
                .map(aluno -> mapper.toDTO(aluno, mensalidadePorAluno.get(aluno.getId())))
                .toList();
    }

    private static final List<String> PRIORIDADE = List.of("ATIVADO", "DESATIVADO", "EXPIRADO");

    private boolean prevalece(Mensalidade candidata, Mensalidade atual) {
        int prioridadeCandidata = PRIORIDADE.indexOf(candidata.getStatusLiberacao());
        int prioridadeAtual = PRIORIDADE.indexOf(atual.getStatusLiberacao());

        if (prioridadeCandidata != prioridadeAtual) {
            return prioridadeCandidata < prioridadeAtual; // índice menor = prioridade maior
        }
        return candidata.getDataInicio().isAfter(atual.getDataInicio());
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

        if(aluno.getSenha() == null) throw new RuntimeException("SENHA_NAO_DEFINIDA");

        if(aluno == null) return null;

        if(encoder.matches(senha, aluno.getSenha())){
            return JwtUtil.gerarToken(aluno.getEmail(), aluno.getTipoUsuario());
        }

        return null;
    }

    public void definirSenhaInicial(String cpf, String novaSenha) {
        Aluno aluno = ar.findByCpf(cpf).orElse(null);
        if (aluno == null) throw new RuntimeException("Aluno não encontrado.");
        if (aluno.getSenha() != null) throw new RuntimeException("Senha já definida. Faça login normalmente.");

        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        aluno.setSenha(encoder.encode(novaSenha));
        ar.save(aluno);
    }

    public void ativarAssinatura(Long idAluno) {
        ar.atualizarStatusAssinatura(idAluno, "ATIVADO");
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
        if (alunoAtualizado.getBairro() != null) aluno.setBairro(alunoAtualizado.getBairro());
        if (alunoAtualizado.getEstado() != null) aluno.setEstado(alunoAtualizado.getEstado());
        if (alunoAtualizado.getObservacao() != null) aluno.setObservacao(alunoAtualizado.getObservacao());


        // senha: só atualiza se vier E não for vazia
        if (alunoAtualizado.getSenha() != null
                && !alunoAtualizado.getSenha().isBlank()
                && !alunoAtualizado.getSenha().startsWith("$2")) {
            //← não re-encoda hash
            BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
            aluno.setSenha(encoder.encode(alunoAtualizado.getSenha()));
        }
        return ar.save(aluno);
    }

    public void desativarAssinatura(Long id) {
        ar.desativarAssinatura(id);
    }


    public List<String> validarDadosPagamento(Aluno aluno) {

        List<String> pendencias = new ArrayList<>();

        if (aluno.getNome() == null || aluno.getNome().isBlank()) {
            pendencias.add("Nome completo");
        }

        if (aluno.getCPF() == null || aluno.getCPF().isBlank()) {
            pendencias.add("CPF");
        }

        if (aluno.getEmail() == null || aluno.getEmail().isBlank()) {
            pendencias.add("E-mail");
        }

        if (aluno.getWhatsapp() == null || aluno.getWhatsapp().isBlank()) {
            pendencias.add("Whatsapp");
        }

        if (aluno.getCEP() == null) {
            pendencias.add("CEP");
        }

        if (aluno.getRua() == null || aluno.getRua().isBlank()) {
            pendencias.add("Rua");
        }

        return pendencias;
    }
}
