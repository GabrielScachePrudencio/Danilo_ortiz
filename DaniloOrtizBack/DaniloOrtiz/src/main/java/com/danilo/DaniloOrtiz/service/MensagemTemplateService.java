package com.danilo.DaniloOrtiz.service;

import com.danilo.DaniloOrtiz.model.Aluno;
import com.danilo.DaniloOrtiz.model.ModeloMensagem;
import com.danilo.DaniloOrtiz.model.Pagamento;
import com.danilo.DaniloOrtiz.repository.ModeloMensagemRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class MensagemTemplateService {

    private static final String LINK_CADASTRO_SISRUN =
            "https://appsisrun.com.br/sisrun/forms/cadastro.xhtml?assessoria=2dassessoriaesportiva&utm_source=ig&utm_medium=social&utm_content=link_in_bio";
    private static final String LINK_PAGAMENTO =
            "https://2dassessoria.com.br";

    private final ModeloMensagemRepository modeloRepository;
    private final TemplateEngine templateEngine;

    /**
     * tipo: chave livre (bate com a coluna `tipo` da tabela modelo_mensagem)
     * ctxExtra: variáveis específicas do chamador (ex: dataVencimento, pagamento)
     */
    public String montar(String tipo, Aluno aluno, Map<String, Object> ctxExtra) {
        ModeloMensagem modelo = modeloRepository.findByTipoAndAtivoTrue(tipo)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Modelo de mensagem '" + tipo + "' não encontrado ou inativo."));

        Map<String, Object> variaveis = construirVariaveis(aluno, ctxExtra);
        return templateEngine.resolver(modelo.getConteudo(), variaveis);
    }

    private Map<String, Object> construirVariaveis(Aluno aluno, Map<String, Object> ctxExtra) {
        Map<String, Object> vars = new HashMap<>();
        vars.put("nome", aluno.getNome());
        vars.put("linkCadastro", LINK_CADASTRO_SISRUN);
        vars.put("linkPagamento", LINK_PAGAMENTO);

        Object pagamentoObj = ctxExtra != null ? ctxExtra.get("pagamento") : null;
        if (pagamentoObj instanceof Pagamento pagamento) {
            vars.put("plano", pagamento.getPlano() != null ? pagamento.getPlano().getNome() : "Academia");
            vars.put("valor", String.format("%.2f", pagamento.getValorPago()));
            String validade = "—";
            if (pagamento.getMensalidades_parcelas() != null
                    && pagamento.getMensalidades_parcelas().getDataVencimento() != null) {
                validade = pagamento.getMensalidades_parcelas().getDataVencimento()
                        .format(DateTimeFormatter.ofPattern("dd/MM/yyyy"));
            }
            vars.put("validade", validade);
        }

        if (ctxExtra != null) {
            // qualquer coisa extra passada (ex: dataVencimento) sobrescreve/soma
            ctxExtra.forEach((k, v) -> { if (!"pagamento".equals(k)) vars.put(k, v); });
        }

        return vars;
    }
}