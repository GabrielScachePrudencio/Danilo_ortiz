package com.danilo.DaniloOrtiz.service;

import com.danilo.DaniloOrtiz.model.Aluno;
import com.danilo.DaniloOrtiz.model.Mensalidade;
import com.danilo.DaniloOrtiz.model.MensalidadeCancelada;
import com.danilo.DaniloOrtiz.model.Mensalidades_parcelas;
import com.danilo.DaniloOrtiz.repository.Mensalidades_parcelasRepository;
import com.danilo.DaniloOrtiz.repository.MensalidadeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class PlanoExpirationScheduler {

    private final Mensalidades_parcelasRepository parcelasRepository;
    private final MensalidadeService              mensalidadeService;
    private final AlunoService                    alunoService;
    private final MensalidadeCanceladaService     mensalidadeCanceladaService;
    private final MensalidadeRepository           mensalidadeRepository; // <-- adiciona isso

    /**
     * Roda todo dia à meia-noite.
     * Verifica parcelas PENDENTES cujo vencimento já passou
     * e desativa o aluno por inadimplência.
     */
    @Scheduled(cron = "0 0 0 * * *")
    @Transactional
    public void verificarInadimplentes() {

        LocalDateTime limiteTolerancia = LocalDateTime.now().minusDays(1);

        List<Mensalidades_parcelas> parcelasVencidas =
                parcelasRepository.findByStatusAndDataVencimentoBefore("PENDENTE", limiteTolerancia);

        for (Mensalidades_parcelas parcela : parcelasVencidas) {

            Mensalidade mensalidade = parcela.getMensalidade();
            if (mensalidade == null) continue;

            if ("CANCELADO".equals(mensalidade.getStatusLiberacao())) continue;

            Aluno aluno = mensalidade.getAluno();
            if (aluno == null) continue;

            List<Mensalidades_parcelas> todasParcelas =
                    parcelasRepository.findAllByMensalidade(mensalidade);

            List<Mensalidades_parcelas> pagas = todasParcelas.stream()
                    .filter(p -> "FINALIZADO".equals(p.getStatus()))
                    .collect(Collectors.toList());

            List<Mensalidades_parcelas> aCancelar = todasParcelas.stream()
                    .filter(p -> !"FINALIZADO".equals(p.getStatus()))
                    .collect(Collectors.toList());

            LocalDate dataFimEfetiva = pagas.stream()
                    .map(p -> p.getDataVencimento().toLocalDate())
                    .max(LocalDate::compareTo)
                    .orElse(mensalidade.getDataInicio());

            String idsPagas = pagas.stream()
                    .map(p -> String.valueOf(p.getId()))
                    .collect(Collectors.joining(","));

            String idsCanceladas = aCancelar.stream()
                    .map(p -> String.valueOf(p.getId()))
                    .collect(Collectors.joining(","));

            MensalidadeCancelada registro = MensalidadeCancelada.builder()
                    .alunoId(aluno.getId())
                    .nomeAluno(aluno.getNome())
                    .emailAluno(aluno.getEmail())
                    .planoId(mensalidade.getPlano() != null ? mensalidade.getPlano().getId()   : null)
                    .nomePlano(mensalidade.getPlano() != null ? mensalidade.getPlano().getNome() : "—")
                    .mensalidadeId(mensalidade.getId())
                    .dataInicio(mensalidade.getDataInicio())
                    .dataFim(mensalidade.getDataFim())
                    .dataFimEfetiva(dataFimEfetiva)
                    .valorMensalidade(mensalidade.getValorMensalidade())
                    .valorParcela(mensalidade.getValorParcela())
                    .totalParcelasContratadas(todasParcelas.size())
                    .parcelasPagas(pagas.size())
                    .parcelasRestantesNoCancelamento(aCancelar.size())
                    .parcelasPagasIds(idsPagas)
                    .parcelasCanceladasIds(idsCanceladas)
                    .dataCancelamento(LocalDateTime.now())
                    .canceladoPorAlunoId(0L)
                    .canceladoPorNome("sistema")
                    .motivoCancelamento("INADIMPLENCIA")
                    .build();

            mensalidadeCanceladaService.salvar(registro);

            for (Mensalidades_parcelas p : aCancelar) {
                p.setStatus("CANCELADO");
                parcelasRepository.save(p);
            }

            mensalidade.setStatusLiberacao("CANCELADO");
            mensalidade.setDataFim(dataFimEfetiva);
            mensalidade.setPlano(null);
            mensalidadeService.save(mensalidade);

            if ("ATIVADO".equalsIgnoreCase(aluno.getStatusAssinatura())) {
                aluno.setStatusAssinatura("DESATIVADO");
            }
            aluno.setPlanoAtual(null);
            alunoService.update(aluno);
        }
    }

    /**
     * Roda todo dia à meia-noite.
     * Verifica mensalidades ATIVAS cuja data_fim já passou
     * e desativa o aluno por expiração do plano.
     */
    @Scheduled(cron = "0 0 0 * * *")
    @Transactional
    public void verificarPlanosExpirados() {

        LocalDate hoje = LocalDate.now();

        // Busca mensalidades ativas com data_fim no passado
        List<Mensalidade> expiradas = mensalidadeRepository
                .findByStatusLiberacaoAndDataFimBefore("ATIVADO", hoje);

        for (Mensalidade mensalidade : expiradas) {

            Aluno aluno = mensalidade.getAluno();
            if (aluno == null) continue;

            List<Mensalidades_parcelas> todasParcelas =
                    parcelasRepository.findAllByMensalidade(mensalidade);

            List<Mensalidades_parcelas> pagas = todasParcelas.stream()
                    .filter(p -> "FINALIZADO".equals(p.getStatus()))
                    .collect(Collectors.toList());

            LocalDate dataFimEfetiva = pagas.stream()
                    .map(p -> p.getDataVencimento().toLocalDate())
                    .max(LocalDate::compareTo)
                    .orElse(mensalidade.getDataInicio());

            String idsPagas = pagas.stream()
                    .map(p -> String.valueOf(p.getId()))
                    .collect(Collectors.joining(","));

            // Salva histórico de expiração
            MensalidadeCancelada registro = MensalidadeCancelada.builder()
                    .alunoId(aluno.getId())
                    .nomeAluno(aluno.getNome())
                    .emailAluno(aluno.getEmail())
                    .planoId(mensalidade.getPlano() != null ? mensalidade.getPlano().getId()   : null)
                    .nomePlano(mensalidade.getPlano() != null ? mensalidade.getPlano().getNome() : "—")
                    .mensalidadeId(mensalidade.getId())
                    .dataInicio(mensalidade.getDataInicio())
                    .dataFim(mensalidade.getDataFim())
                    .dataFimEfetiva(dataFimEfetiva)
                    .valorMensalidade(mensalidade.getValorMensalidade())
                    .valorParcela(mensalidade.getValorParcela())
                    .totalParcelasContratadas(todasParcelas.size())
                    .parcelasPagas(pagas.size())
                    .parcelasRestantesNoCancelamento(0)
                    .parcelasPagasIds(idsPagas)
                    .parcelasCanceladasIds("")
                    .dataCancelamento(LocalDateTime.now())
                    .canceladoPorAlunoId(0L)
                    .canceladoPorNome("sistema")
                    .motivoCancelamento("EXPIRACAO") // <-- diferencia do INADIMPLENCIA
                    .build();

            mensalidadeCanceladaService.salvar(registro);

            // Atualiza mensalidade
            mensalidade.setStatusLiberacao("EXPIRADO");
            mensalidade.setPlano(null);
            mensalidadeService.save(mensalidade);

            // Desativa aluno
            if ("ATIVADO".equalsIgnoreCase(aluno.getStatusAssinatura())) {
                aluno.setStatusAssinatura("DESATIVADO");
            }
            aluno.setPlanoAtual(null);
            alunoService.update(aluno);
        }
    }
}