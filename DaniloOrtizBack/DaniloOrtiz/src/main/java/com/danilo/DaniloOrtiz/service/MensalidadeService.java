package com.danilo.DaniloOrtiz.service;


import com.danilo.DaniloOrtiz.Emails.EmailService;
import com.danilo.DaniloOrtiz.model.*;
import com.danilo.DaniloOrtiz.model.dto.*;
import com.danilo.DaniloOrtiz.model.mapper.MensalidadeComParcelasMapper;
import com.danilo.DaniloOrtiz.pagamentoAPI.ApiMercadoPago;
import com.danilo.DaniloOrtiz.pdfs.ComprovanteService;
import com.danilo.DaniloOrtiz.repository.MensalidadeRepository;
import com.danilo.DaniloOrtiz.repository.Mensalidades_parcelasRepository;
import com.danilo.DaniloOrtiz.repository.PagamentoRepository;
import com.mercadopago.resources.payment.Payment;
import com.mercadopago.resources.preference.Preference;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.CannotAcquireLockException;
import org.springframework.dao.DeadlockLoserDataAccessException;
import org.springframework.retry.annotation.Backoff;
import org.springframework.retry.annotation.Retryable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MensalidadeService {
    private final MensalidadeRepository mensalidadeRepository;
    private final Mensalidades_parcelasService mensalidadesParcelasService;
    private final PagamentoService pagamentoService;
    private final PagamentoRepository pagamentoRepository;
    private final AlunoService alunoService;
    private final PlanoService planoService;
    private final EmailService emailService;
    private final ComprovanteService comprovanteService;
    private final MensalidadeCanceladaService mensalidadeCanceladaService;
    private final NotificacaoService notificacaoService;

    public Mensalidade add(Mensalidade mensalidade){
        Aluno aluno = alunoService.findById(mensalidade.getAluno().getId());
        aluno.setPlanoAtual(mensalidade.getPlano());

        return mensalidadeRepository.save(mensalidade);
    }

    public Mensalidade findById(Long id){
        return mensalidadeRepository.findById(id);
    }

    public Mensalidade findByAluno(Aluno a){
        return mensalidadeRepository.findByAluno(a);
    }

    public Mensalidade save(Mensalidade m){
        return mensalidadeRepository.save(m);
    }


    @Transactional
    public boolean cancelarMensalidade(Long idAluno, Long idQuemCancelou) {
        Aluno aluno = alunoService.findById(idAluno);
        if (aluno == null) return false;

        Mensalidade mensalidade = mensalidadeRepository
                .findTopByAlunoOrderByIdDesc(aluno);
        if (mensalidade == null) return false;

        List<Mensalidades_parcelas> todasParcelas =
                mensalidadesParcelasService.findAllByMensalidade(mensalidade);

        // ── parcelas pagas e canceladas ──────────────────────────────────────
        List<Mensalidades_parcelas> pagas = todasParcelas.stream()
                .filter(p -> "FINALIZADO".equals(p.getStatus()))
                .toList();

        List<Mensalidades_parcelas> aCancelar = todasParcelas.stream()
                .filter(p -> !"FINALIZADO".equals(p.getStatus()))
                .toList();

        // ── data fim efetiva = último vencimento pago ────────────────────────
        LocalDate dataFimEfetiva = pagas.stream()
                .map(p -> p.getDataVencimento().toLocalDate())
                .max(Comparator.naturalOrder())
                .orElse(mensalidade.getDataInicio()); // se não pagou nada, usa início

        // ── snapshot para auditoria ──────────────────────────────────────────
        String idsPagas = pagas.stream()
                .map(p -> String.valueOf(p.getId()))
                .collect(Collectors.joining(","));

        String idsCanceladas = aCancelar.stream()
                .map(p -> String.valueOf(p.getId()))
                .collect(Collectors.joining(","));

        Aluno quemCancelou = alunoService.findById(idQuemCancelou);

        MensalidadeCancelada registro = MensalidadeCancelada.builder()
                .alunoId(aluno.getId())
                .nomeAluno(aluno.getNome())
                .emailAluno(aluno.getEmail())
                .planoId(mensalidade.getPlano() != null ? mensalidade.getPlano().getId() : null)
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
                .canceladoPorAlunoId(idQuemCancelou)
                .canceladoPorNome(quemCancelou != null ? quemCancelou.getNome() : "sistema")
                .motivoCancelamento("MANUAL")
                .build();

        mensalidadeCanceladaService.salvar(registro);

        // ── cancela as parcelas pendentes ────────────────────────────────────
        for (Mensalidades_parcelas p : aCancelar) {
            p.setStatus("CANCELADO");
            mensalidadesParcelasService.save(p);
        }

        // ── atualiza mensalidade ─────────────────────────────────────────────
        mensalidade.setStatusLiberacao("CANCELADO");
        mensalidade.setDataFim(dataFimEfetiva);   // ajusta para o último mês pago
        mensalidade.setPlano(null);               // plano null na mensalidade
        save(mensalidade);

        // ── atualiza aluno ───────────────────────────────────────────────────
        alunoService.desativarAssinatura(aluno.getId());


        return true;
    }

    public MensalidadeComParcelasDTO mensalidadeCompletaPorIdAluno(Long id){
        Aluno aluno = alunoService.findById(id);
        if(aluno == null) return null;

        Mensalidade mensalidade = mensalidadeRepository.findTopByAlunoOrderByIdDesc(aluno);
        if(mensalidade == null) return null;

        // ← ADICIONA ISSO
        if("CANCELADO".equals(mensalidade.getStatusLiberacao())) return null;

        List<Mensalidades_parcelas> listaDeParcelas =
                mensalidadesParcelasService.findAllByMensalidadePendenteFinalizado(mensalidade);

        return MensalidadeComParcelasMapper.toDTO(mensalidade, listaDeParcelas);
    }


    public Preference abrirPagamento(PagamentoCompletoDTO pagamentoCompletoDTO){
        Preference preference = ApiMercadoPago.gerarPagamento(pagamentoCompletoDTO, pagamentoCompletoDTO.getIdPagamento());

        return preference;
    }


    @Transactional
    public boolean addParcelaNaoPaga(PagamentoCompletoDTO mensalidadeComParcelasDTO){
//        Mexer na tabela pagamentos:
//        - add com vlaor da parcela e id parcela
//        - não criar na hora que vc escolhe o plano na tabela de pagamentos
//
//        mexer na tabela mensalidade:
//        - diminuir o numero de parcelas restantes
//        - stautus como ATIVADO

//        tabela parcelas:
//        - add id pagamentos
//        - alterar para finalizado a parcela
//        - add a proxima parcela

        Aluno aluno = alunoService.findById(mensalidadeComParcelasDTO.getAlunoId());

        if(aluno == null){
            return false;
        }

        Plano plano = planoService.buscarPorId(mensalidadeComParcelasDTO.getPlanoId());

        if(plano == null) return false;

        Mensalidades_parcelas mensalidades_parcelas = mensalidadesParcelasService.findById(mensalidadeComParcelasDTO.getParcelaId());

        if(mensalidades_parcelas == null) return false;


        //inserindo em pagamentos
        Pagamento pagamentoIncompleto = new Pagamento();
        pagamentoIncompleto.setAluno(aluno);
        pagamentoIncompleto.setPlano(plano);
        pagamentoIncompleto.setMpPaymentId(mensalidadeComParcelasDTO.getMpPaymentId());
        pagamentoIncompleto.setFormaPagamento(mensalidadeComParcelasDTO.getFormaPagamento());
        pagamentoIncompleto.setCodigoVenda(mensalidadeComParcelasDTO.getCodigoVenda());
        pagamentoIncompleto.setValorPago(mensalidadeComParcelasDTO.getValor());
        pagamentoIncompleto.setMensalidades_parcelas(mensalidades_parcelas);
        pagamentoIncompleto.setPago(false);
        pagamentoIncompleto.setFormaPagamento(mensalidadeComParcelasDTO.getFormaPagamento());
        pagamentoIncompleto.setStatusPagamento("PENDENTE");


        //api mercado pago
        pagamentoIncompleto.setId_mercadopago("");
        pagamentoIncompleto.setStatusPagamento("");
        pagamentoIncompleto.setMetodo_pagamento_mercadopago("");


        Pagamento pagamentoCompleto = pagamentoService.novoPagamento((pagamentoIncompleto));

        if(pagamentoCompleto == null) return  false;


        //ver se o objeto vai receber o id do pagamento
        //eesse metodo tem que chaamr primeiro para alterar esse valor do dto
        //antes de ir para o metodo de abrir
        mensalidadeComParcelasDTO.setIdPagamento(pagamentoCompleto.getId());



        // atualizar parcela
        mensalidades_parcelas.setStatus("PENDENTE");
        mensalidades_parcelas.setPagamento(pagamentoCompleto);
        mensalidadesParcelasService.save(mensalidades_parcelas);

        //atualizar a proxima parcela
        Integer proximoNumero = mensalidades_parcelas.getNumeroParcela() + 1;

        Mensalidades_parcelas proximaParcela =
                mensalidadesParcelasService
                        .findByMensalidadeAndNumeroParcela(
                                mensalidades_parcelas.getMensalidade(),
                                proximoNumero
                        );

        if (proximaParcela != null) {
            proximaParcela.setStatus("PENDENTE");
            mensalidadesParcelasService.save(proximaParcela);
        }


        // atualizar mensalidade
        Mensalidade mensalidade = mensalidades_parcelas.getMensalidade();

        mensalidade.setNumero_parcelas_restantes(
                mensalidade.getNumero_parcelas_restantes() - 1
        );

        mensalidade.setStatusLiberacao("DESATIVADO");

        save(mensalidade);

        if(mensalidade == null) return false;


        return true;

    }

    @Retryable(
            retryFor = { CannotAcquireLockException.class, DeadlockLoserDataAccessException.class },
            maxAttempts = 3,
            backoff = @Backoff(delay = 500)
    )
    @Transactional
    public void confirmarPagamentoDoWebHook(Long idpagamentoInterno, String mpId, String statusMp, String pagamentoMp){
        Pagamento pagamento = pagamentoService.findById(idpagamentoInterno);

        if (pagamento.getEnvioEmailConfirmando() == 1) {
            return; // já enviou email, ignora
        }

        if(pagamento != null && !"FINALIZADO".equals(pagamento.getStatusPagamento())){
            // 2. Atualiza os dados do Mercado Pago na sua tabela
            pagamento.setId_mercadopago(mpId);
            pagamento.setStatus_mercadopago(statusMp);
            pagamento.setMetodo_pagamento_mercadopago(pagamentoMp);
            pagamento.setStatusPagamento("FINALIZADO"); // ou o status que veio do MP
            pagamento.setPago(true);

            //api do zap
            notificacaoService.agendarConfirmacaoPagamento(pagamento);

            pagamento.setEnvioEmailConfirmando(1);

            pagamentoService.save(pagamento); // Salva a alteração

            Mensalidades_parcelas parcela = pagamento.getMensalidades_parcelas();
            parcela.setStatus("FINALIZADO");
            mensalidadesParcelasService.save(parcela);

            // 4. Ativa a Mensalidade
            Mensalidade mensalidade = parcela.getMensalidade();
            mensalidade.setStatusLiberacao("ATIVADO");
            save(mensalidade);

            //ativa o aluno se ja não estiver
            alunoService.ativarAssinatura(pagamento.getAluno().getId());

            Aluno aluno = alunoService.findById(pagamento.getAluno().getId());
//            if(aluno.getStatusAssinatura().equalsIgnoreCase("DESATIVADO")){
//                aluno.setStatusAssinatura("ATIVADO");
//            }
//            alunoService.add(aluno);


            //envia o email de confirmação

            byte[] pdf = comprovanteService.gerarComprovante(
                    aluno.getNome(),
                    pagamento.getPlano().getNome(),
                    pagamento.getValorPago().toString(),
                    pagamento.getId().toString()
            );

            String html = "<h2>Pagamento confirmado ✔</h2>" +
                    "<p>Seu pagamento foi aprovado com sucesso.</p>";

            emailService.enviarComAnexo(
                    aluno.getEmail(),
                    html,
                    pdf
            );

            // ✅ SÓ marca depois que enviou
            pagamento.setEnvioEmailConfirmando(1);
            pagamentoService.save(pagamento);

        }

    }

    public ParcelaDetalheDTO verificarParcela(Long idParcela) {

        Mensalidades_parcelas parcela = mensalidadesParcelasService.findById(idParcela);
        if (parcela == null) return null;

        ParcelaDetalheDTO.ParcelaDetalheDTOBuilder builder = ParcelaDetalheDTO.builder()
                .id(parcela.getId())
                .numeroParcela(parcela.getNumeroParcela())
                .valor(parcela.getValor())
                .dataVencimento(parcela.getDataVencimento().toLocalDate())
                .status(parcela.getStatus());

        // ← MUDA AQUI: busca direto pelo id da parcela em vez de parcela.getPagamento()
        Pagamento pagamento = pagamentoService.findByParcelaId(idParcela);

        if (pagamento != null) {
            builder
                    .pagamentoInternoId(pagamento.getId())
                    .statusPagamento(pagamento.getStatusPagamento())
                    .formaPagamento(pagamento.getFormaPagamento())
                    .codigoVenda(pagamento.getCodigoVenda())
                    .valorPago(pagamento.getValorPago())
                    .pago(pagamento.getPago());

            // ← MUDA AQUI: usa mpPaymentId em vez de id_mercadopago
            String mpIdStr = pagamento.getMpPaymentId();

            if (mpIdStr != null && !mpIdStr.isBlank()) {
                try {
                    Long mpId = Long.parseLong(mpIdStr);
                    Payment mpPayment = ApiMercadoPago.consultarPagamento(mpId);

                    if (mpPayment != null) {
                        builder
                                .mpPaymentId(mpPayment.getId())
                                .mpStatus(mpPayment.getStatus())
                                .mpStatusDetail(mpPayment.getStatusDetail())
                                .mpValorTransacao(mpPayment.getTransactionAmount())
                                .mpDataAprovacao(mpPayment.getDateApproved())
                                .mpMetodoPagamento(
                                        mpPayment.getPaymentMethodId() != null
                                                ? mpPayment.getPaymentMethodId()
                                                : pagamento.getMetodo_pagamento_mercadopago()
                                );
                    } else {
                        builder.mpErro("Pagamento não encontrado no Mercado Pago");
                    }

                } catch (NumberFormatException e) {
                    builder.mpErro("ID do Mercado Pago inválido: " + mpIdStr);
                } catch (Exception e) {
                    builder.mpErro("Erro ao consultar Mercado Pago: " + e.getMessage());
                }
            } else {
                builder.mpErro("Aguardando confirmação do Mercado Pago");
            }
        }

        return builder.build();
    }

    @Retryable(
            retryFor = { CannotAcquireLockException.class, DeadlockLoserDataAccessException.class },
            maxAttempts = 3,
            backoff = @Backoff(delay = 500)
    )
    @Transactional
    public void confirmarPagamentoPorParcelaId(Long parcelaId, String mpId, String statusMp, String pagamentoMp) {
        Mensalidades_parcelas parcela = mensalidadesParcelasService.findById(parcelaId);

        if (parcela == null) {
            System.err.println("Parcela não encontrada");
            return;
        }

        // Busca o pagamento — primeiro tenta pelo vínculo da parcela,
        // se não achar busca pelo mpPaymentId (caso o vínculo ainda não foi salvo)
        Pagamento pagamento = parcela.getPagamento();

        if (pagamento == null) {
            pagamento = pagamentoService.findByMpPaymentId(mpId);
        }

        if (pagamento == null) {
            System.err.println("Pagamento não encontrado nem por parcela nem");
            return;
        }

        if (Integer.valueOf(1).equals(pagamento.getEnvioEmailConfirmando())) {
            return;
        }

        if (!"FINALIZADO".equals(pagamento.getStatusPagamento())) {
            pagamento.setId_mercadopago(mpId);
            pagamento.setStatus_mercadopago(statusMp);
            pagamento.setMetodo_pagamento_mercadopago(pagamentoMp);
            pagamento.setMpPaymentId(mpId);
            pagamento.setStatusPagamento("FINALIZADO");
            pagamento.setPago(true);
            pagamento.setEnvioEmailConfirmando(1);

            //teste para enviar msgs
            notificacaoService.agendarConfirmacaoPagamento(pagamento);


            // Garante o vínculo com a parcela
            pagamento.setMensalidades_parcelas(parcela);
            pagamentoService.save(pagamento);

            parcela.setStatus("FINALIZADO");
            parcela.setPagamento(pagamento); // garante vínculo
            mensalidadesParcelasService.save(parcela);

            Mensalidade mensalidade = parcela.getMensalidade();
            mensalidade.setStatusLiberacao("ATIVADO");
            save(mensalidade);

//            if (aluno.getStatusAssinatura().equalsIgnoreCase("DESATIVADO")) {
//                aluno.setStatusAssinatura("ATIVADO");
//            }
//            alunoService.add(aluno);
             alunoService.ativarAssinatura(pagamento.getAluno().getId());
             Aluno aluno = alunoService.findById(pagamento.getAluno().getId());


            try {
                byte[] pdf = comprovanteService.gerarComprovante(
                        aluno.getNome(),
                        pagamento.getPlano().getNome(),
                        pagamento.getValorPago().toString(),
                        pagamento.getId().toString()
                );
                emailService.enviarComAnexo(
                        aluno.getEmail(),
                        "<h2>Pagamento confirmado ✔</h2><p>Seu pagamento foi aprovado com sucesso.</p>",
                        pdf
                );
            } catch (Exception e) {
                System.err.println("Erro ao enviar email (não crítico): " + e.getMessage());
            }
        }
    }

    @Transactional
    public boolean cancelarSemLog(Long idAluno) {
        Aluno aluno = alunoService.findById(idAluno);
        if (aluno == null) return false;

        // Busca mensalidade ativa se existir
        Mensalidade mensalidade = mensalidadeRepository.findTopByAlunoOrderByIdDesc(aluno);

        if (mensalidade != null) {
            // Cancela parcelas não finalizadas
            List<Mensalidades_parcelas> parcelas = mensalidadesParcelasService.findAllByMensalidade(mensalidade);
            for (Mensalidades_parcelas p : parcelas) {
                if (!"FINALIZADO".equals(p.getStatus())) {
                    p.setStatus("CANCELADO");
                    mensalidadesParcelasService.save(p);
                }
            }

            // Cancela a mensalidade
            mensalidade.setStatusLiberacao("CANCELADO");
            mensalidade.setPlano(null);
            save(mensalidade);
        }

        // Limpa o aluno — isso é o mais importante
        alunoService.desativarAssinatura(aluno.getId());

        return true;
    }


    public Mensalidade findTopByAluno(Long idAluno) {
        Aluno aluno = alunoService.findById(idAluno);
        if (aluno == null) return null;
        return mensalidadeRepository.findTopByAlunoOrderByIdDesc(aluno);
    }


    public Pagamento validarOuRetornarPagamento(Long idParcela) {

        List<Pagamento> pagamentos =
                pagamentoService.findAllByParcelaId(idParcela);

        Pagamento pendente = null;

        for (Pagamento pagamento : pagamentos) {

            // já finalizado
            if (Boolean.TRUE.equals(pagamento.getPago())
                    || "FINALIZADO".equalsIgnoreCase(pagamento.getStatusPagamento())) {
                return pagamento;
            }

            // pendente sem MP ainda
            if ("PENDENTE".equalsIgnoreCase(pagamento.getStatusPagamento())) {

                pendente = pagamento;

                if (pagamento.getMpPaymentId() == null
                        || pagamento.getMpPaymentId().isBlank()) {
                    return pagamento;
                }

                try {
                    Payment mpPayment =
                            ApiMercadoPago.consultarPagamento(
                                    Long.parseLong(pagamento.getMpPaymentId())
                            );

                    if (mpPayment != null) {

                        switch (mpPayment.getStatus()) {

                            case "approved":
                                confirmarPagamentoDoWebHook(
                                        pagamento.getId(),
                                        mpPayment.getId().toString(),
                                        mpPayment.getStatus(),
                                        mpPayment.getPaymentMethodId()
                                );
                                pagamento = pagamentoService.findById((pagamento.getId()));
                                return pagamento;

                            case "pending":
                            case "in_process":
                                return pagamento;

                            case "rejected":
                            case "cancelled":
                                // ❗ IMPORTANTE: esse aqui NÃO pode reutilizar
                                // PIX expirado entra aqui → deixa criar novo
                                break;
                        }
                    }

                } catch (Exception ignored) {}
            }
        }

        // se tiver pendente, retorna ele
        return pendente;
    }
}
