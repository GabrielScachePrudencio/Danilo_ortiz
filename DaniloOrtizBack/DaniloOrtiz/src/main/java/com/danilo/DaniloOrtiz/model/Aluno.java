package com.danilo.DaniloOrtiz.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "alunos")
public class Aluno {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    @Column(nullable = false)
    private String senha;

    @Column(nullable = false, unique = true)
    private String email;

    private String whatsapp;

    @Column(name = "tipo_usuario")
    private String tipoUsuario = "ALUNO";

    @Column(name = "criou_conta_sisrun")
    private Boolean criouContaSisrun = false;

    @ManyToOne
    @JoinColumn(name = "plano_atual_id")
    private Plano planoAtual; // você já tem essa classe

    @Column(name = "status_assinatura")
    private String statusAssinatura = "INATIVO";

    @Column(name = "data_cadastro")
    private LocalDateTime dataCadastro = LocalDateTime.now();


    private String CPF;

    private String CNPJ;

    private String rua;

    @Column(name = "número")
    private Integer numero;

    private String cidade;

    private Integer CEP;
}
