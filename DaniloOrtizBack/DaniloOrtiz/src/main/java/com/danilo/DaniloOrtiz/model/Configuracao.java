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

}
