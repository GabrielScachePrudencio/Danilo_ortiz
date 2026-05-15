package com.danilo.DaniloOrtiz.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "configuracoes")
public class Configuracao {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nome_site")
    private String nomeSite = "SisRun Elite";

    @Column(columnDefinition = "TEXT")
    private String sobreVoce;

    @Column(columnDefinition = "TEXT")
    private String textoInformativo;

    @Column(name = "whatsapp_suporte")
    private String whatsappSuporte;

    @Column(name = "data_atualizacao")
    private LocalDateTime dataAtualizacao = LocalDateTime.now();


    //da api de pagementos
    @Column(name = "MP_ACCESS_TOKEN")
    private String MPACCESSTOKEN;

    @Column(name = "MP_PUBLIC_KEY")
    private String MPPUBLICKEY;

    @Column(name = "MP_CLIENT_SECRET")
    private String MPCLIENTSECRET;

    @Column(name = "MP_CLIENT_ID")
    private String MPCLIENTID;

    // Credenciais de teste
    @Column(name = "MP_ACCESS_TOKEN_TEST")
    private String MPACCESSTOKENTEST;

    @Column(name = "MP_PUBLIC_KEY_TEST")
    private String MPPUBLICKEYTEST;

    // Qual ambiente está ativo: "PRODUCAO" ou "TESTE"
    @Column(name = "MP_AMBIENTE")
    private String MPAMBIENTE = "PRODUCAO";
}
