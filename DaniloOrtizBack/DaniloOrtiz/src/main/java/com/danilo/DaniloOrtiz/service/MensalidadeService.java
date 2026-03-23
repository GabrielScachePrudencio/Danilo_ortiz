package com.danilo.DaniloOrtiz.service;


import com.danilo.DaniloOrtiz.model.*;
import com.danilo.DaniloOrtiz.model.dto.MensalidadeComParcelasDTO;
import com.danilo.DaniloOrtiz.model.dto.PagamentoCompletoDTO;
import com.danilo.DaniloOrtiz.model.dto.ParcelaDTO;
import com.danilo.DaniloOrtiz.model.dto.ParcelaDetalheDTO;
import com.danilo.DaniloOrtiz.model.mapper.MensalidadeComParcelasMapper;
import com.danilo.DaniloOrtiz.pagamentoAPI.ApiMercadoPago;
import com.danilo.DaniloOrtiz.repository.MensalidadeRepository;
import com.danilo.DaniloOrtiz.repository.Mensalidades_parcelasRepository;
import com.mercadopago.resources.payment.Payment;
import com.mercadopago.resources.preference.Preference;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MensalidadeService {
    private final MensalidadeRepository mensalidadeRepository;
    private final Mensalidades_parcelasService mensalidadesParcelasService;
    private final PagamentoService pagamentoService;
    private final AlunoService alunoService;
    private final PlanoService planoService;


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




    public MensalidadeComParcelasDTO mensalidadeCompletaPorIdAluno(Long id){
        Aluno aluno = alunoService.findById(id);

        if(aluno == null) return null;

        Mensalidade mensalidade = mensalidadeRepository.findTopByAlunoOrderByDataInicioDesc(aluno);

        if(mensalidade == null) return null;

        List<Mensalidades_parcelas> listaDeParcelas = mensalidadesParcelasService.findAllByMensalidadePendenteFinalizado(mensalidade);

        MensalidadeComParcelasDTO mensalidadeCompletaComParcelas = MensalidadeComParcelasMapper.toDTO(mensalidade, listaDeParcelas);

        return mensalidadeCompletaComParcelas;
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


    @Transactional
    public void confirmarPagamentoDoWebHook(Long idpagamentoInterno, String mpId, String statusMp, String pagamentoMp){
        Pagamento pagamento = pagamentoService.findById(idpagamentoInterno);

        if(pagamento != null && !"FINALIZADO".equals(pagamento.getStatusPagamento())){
            // 2. Atualiza os dados do Mercado Pago na sua tabela
            pagamento.setId_mercadopago(mpId);
            pagamento.setStatus_mercadopago(statusMp);
            pagamento.setMetodo_pagamento_mercadopago(pagamentoMp);
            pagamento.setStatusPagamento("FINALIZADO"); // ou o status que veio do MP
            pagamento.setPago(true);
            pagamentoService.save(pagamento); // Salva a alteração

            Mensalidades_parcelas parcela = pagamento.getMensalidades_parcelas();
            parcela.setStatus("FINALIZADO");
            mensalidadesParcelasService.save(parcela);

            // 4. Ativa a Mensalidade
            Mensalidade mensalidade = parcela.getMensalidade();
            mensalidade.setStatusLiberacao("ATIVADO");
            save(mensalidade);


            //ativa o aluno se ja não estiver
            Aluno aluno = alunoService.findById(pagamento.getAluno().getId());
            if(aluno.getStatusAssinatura().equalsIgnoreCase("DESATIVADO")){
                aluno.setStatusAssinatura("ATIVADO");
            }
            alunoService.add(aluno);

            System.out.println("Pagamento " + idpagamentoInterno + " confirmado com sucesso!");
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

        Pagamento pagamento = parcela.getPagamento();

        if (pagamento != null) {
            builder
                    .pagamentoInternoId(pagamento.getId())
                    .statusPagamento(pagamento.getStatusPagamento())
                    .formaPagamento(pagamento.getFormaPagamento())
                    .codigoVenda(pagamento.getCodigoVenda())
                    .valorPago(pagamento.getValorPago())
                    .pago(pagamento.getPago());

            String mpIdStr = pagamento.getId_mercadopago();

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
                // Pagamento registrado mas webhook ainda não trouxe o id do MP
                builder.mpErro("Aguardando confirmação do Mercado Pago");
            }
        }
        // pagamento == null → parcela sem pagamento iniciado; retorna só dados básicos

        return builder.build();
    }









}
