package com.danilo.DaniloOrtiz.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "mensalidades_canceladas")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MensalidadeCancelada {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // snapshot do aluno
    private Long alunoId;
    private String nomeAluno;
    private String emailAluno;

    // snapshot do plano
    private Long planoId;
    private String nomePlano;

    // snapshot da mensalidade
    private Long mensalidadeId;
    private LocalDate dataInicio;
    private LocalDate dataFim;          // data fim ORIGINAL (até onde tinha direito)
    private LocalDate dataFimEfetiva;   // último mês pago — até onde vale de fato

    private BigDecimal valorMensalidade;
    private BigDecimal valorParcela;

    private Integer totalParcelasContratadas;
    private Integer parcelasPagas;
    private Integer parcelasRestantesNoCancelamento;

    // quais parcelas foram pagas (ids em JSON simples)
    @Column(columnDefinition = "TEXT")
    private String parcelasPagasIds;    // ex: "1,2,3"

    @Column(columnDefinition = "TEXT")
    private String parcelasCanceladasIds;

    // auditoria
    private LocalDateTime dataCancelamento;
    private Long canceladoPorAlunoId;   // id de quem estava logado
    private String canceladoPorNome;

    private String motivoCancelamento;  // "MANUAL", "INADIMPLENCIA"
}