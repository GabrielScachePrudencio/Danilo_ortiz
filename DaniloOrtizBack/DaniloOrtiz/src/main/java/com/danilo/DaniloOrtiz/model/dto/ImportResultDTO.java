package com.danilo.DaniloOrtiz.model.dto;


import lombok.Data;

import java.util.List;

@Data
public class ImportResultDTO {
    private int totalLinhas;
    private int criados;
    private int criadosComPendencia;
    private int erros;
    private List<LinhaResultDTO> linhas;

    // getters/setters

    @Data
    public static class LinhaResultDTO {
        private int linha;
        private String status; // "CRIADO" | "PENDENTE" | "ERRO"
        private String nome;
        private String email;
        private List<String> camposFaltando;
        private String mensagemErro;

        // getters/setters
    }
}