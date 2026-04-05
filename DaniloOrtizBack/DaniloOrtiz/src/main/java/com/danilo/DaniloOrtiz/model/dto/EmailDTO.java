package com.danilo.DaniloOrtiz.model.dto;

public class EmailDTO {
    private String para;
    private String assunto;
    private String mensagem;

    public EmailDTO(String para, String assunto, String mensagem) {
        this.para = para;
        this.assunto = assunto;
        this.mensagem = mensagem;
    }

    public String getPara() { return para; }
    public String getAssunto() { return assunto; }
    public String getMensagem() { return mensagem; }
}