package com.danilo.DaniloOrtiz.service;

import com.danilo.DaniloOrtiz.model.Aluno;
import com.danilo.DaniloOrtiz.model.MensagemWhatsapp;
import com.danilo.DaniloOrtiz.repository.AlunoRepository;
import com.danilo.DaniloOrtiz.repository.MensagemWhatsappRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Map;
@Slf4j
@Service
@RequiredArgsConstructor
public class MensagemManualService {

    private final AlunoRepository alunoRepository;
    private final MensagemWhatsappRepository mensagemRepository;
    private final MensagemTemplateService templateService;

    public MensagemWhatsapp enviar(Long alunoId, String tipo, Map<String, Object> params) {
        Aluno aluno = alunoRepository.findById(alunoId);

        if (aluno.getWhatsapp() == null || aluno.getWhatsapp().isBlank()) {
            throw new IllegalStateException("Aluno " + aluno.getId() + " sem WhatsApp cadastrado.");
        }

        String numero = aluno.getWhatsapp().replaceAll("[^0-9]", "");
        String texto = templateService.montar(tipo, aluno, params);

        MensagemWhatsapp msg = new MensagemWhatsapp();
        msg.setNumero(numero);
        msg.setMensagem(texto);
        msg.setStatus("PENDENTE");
        msg.setTipo(tipo);

        MensagemWhatsapp salva = mensagemRepository.save(msg);
        log.info("Mensagem manual [{}] agendada para aluno {} ({})", tipo, aluno.getNome(), numero);
        System.out.printf("Mensagem manual [{}] agendada para aluno {} ({})",  tipo, aluno.getNome(), numero);
        return salva;
    }
}