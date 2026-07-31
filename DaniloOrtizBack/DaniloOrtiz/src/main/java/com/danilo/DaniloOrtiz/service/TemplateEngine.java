package com.danilo.DaniloOrtiz.service;

import org.springframework.stereotype.Component;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Component
public class TemplateEngine {

    private static final Pattern PLACEHOLDER = Pattern.compile("\\{\\{(\\w+)\\}\\}");

    /** Substitui {{chave}} pelos valores do mapa. Chave ausente vira "". */
    public String resolver(String conteudo, Map<String, Object> variaveis) {
        Matcher matcher = PLACEHOLDER.matcher(conteudo);
        StringBuilder resultado = new StringBuilder();
        while (matcher.find()) {
            String chave = matcher.group(1);
            Object valor = variaveis.getOrDefault(chave, "");
            matcher.appendReplacement(resultado, Matcher.quoteReplacement(String.valueOf(valor)));
        }
        matcher.appendTail(resultado);
        return resultado.toString();
    }
}