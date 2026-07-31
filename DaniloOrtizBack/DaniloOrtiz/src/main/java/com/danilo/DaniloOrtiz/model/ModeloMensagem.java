package com.danilo.DaniloOrtiz.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Table(name = "modelo_mensagem")
@Getter
@Setter
public class ModeloMensagem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 60)
    private String tipo;

    private String descricao;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String conteudo;

    @Column(nullable = false)
    private boolean ativo = true;

    private LocalDateTime atualizadoEm;
}