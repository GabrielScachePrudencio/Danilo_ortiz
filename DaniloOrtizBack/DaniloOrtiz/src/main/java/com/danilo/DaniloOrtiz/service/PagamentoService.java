package com.danilo.DaniloOrtiz.service;

import com.danilo.DaniloOrtiz.model.Aluno;
import com.danilo.DaniloOrtiz.model.Pagamento;
import com.danilo.DaniloOrtiz.model.Plano;
import com.danilo.DaniloOrtiz.model.dto.PagamentoCompletoDTO;
import com.danilo.DaniloOrtiz.repository.MensalidadeRepository;
import com.danilo.DaniloOrtiz.repository.Mensalidades_parcelasRepository;
import com.danilo.DaniloOrtiz.repository.PagamentoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PagamentoService {
    private final PagamentoRepository pagamentoRepository;

    //aqui ela so escolheu ela não pagou de fato
    public Pagamento novoPagamento(Pagamento pagamento){
        Pagamento p = pagamentoRepository.save(pagamento);
        return p;
    }
    public void delete(Pagamento pagamento){
        pagamentoRepository.delete(pagamento);
    }

    public List<Pagamento> findAllByParcelaId(Long parcelaId) {
        return pagamentoRepository
                .findByParcelaId(parcelaId);
    }
    public Pagamento findByMpPaymentId(String mpPaymentId) {
        return pagamentoRepository.findByMpPaymentId(mpPaymentId).orElse(null);
    }
    public Pagamento findById(Long id){
        return pagamentoRepository.findById(id);
    }

    public Pagamento save(Pagamento p){
        return pagamentoRepository.save(p);
    }


    public List<PagamentoCompletoDTO> listarUltimasVendas() {
        List<Pagamento> pagamentos = pagamentoRepository.findAllByOrderByDataCriacaoDesc();
        List<PagamentoCompletoDTO> listaDTO = new ArrayList<>();

        for (Pagamento pagamento : pagamentos) {

            String idMercadoPago = pagamento.getId_mercadopago();
            boolean possuiIdMercadoPago = idMercadoPago != null && !idMercadoPago.isEmpty();

            // Verifica se foi confirmado manualmente
            boolean confirmadoManualmente = pagamento.getConfirmadoManualmente() != null && pagamento.getConfirmadoManualmente() == true;

            // Ignora se não tiver ID do Mercado Pago E NÃO foi confirmado manualmente
            if (!possuiIdMercadoPago && !confirmadoManualmente) {
                continue;
            }

            PagamentoCompletoDTO dto = new PagamentoCompletoDTO();

            dto.setIdPagamento(pagamento.getId());

            // ALUNO
            Aluno aluno = pagamento.getAluno();
            if (aluno != null) {
                dto.setAlunoId(aluno.getId());
                dto.setNomeAluno(aluno.getNome());
            }

            // PLANO
            Plano plano = pagamento.getPlano();
            if (plano != null) {
                dto.setNomePlano(plano.getNome());
            }

            // DATA
            dto.setData(pagamento.getDataCriacao());

            // VALOR
            dto.setValor(pagamento.getValorPago());

            // STATUS
            String statusMercadoPago = pagamento.getStatus_mercadopago();
            if (confirmadoManualmente) {
                dto.setStatusLiberacao("FINALIZADO");
            } else {
                dto.setStatusLiberacao(statusMercadoPago);
            }

            dto.setMpPaymentId(idMercadoPago);

            // FORMA PAGAMENTO (Verifica primeiro a forma de pagamento geral/manual, se não tiver, pega do MP)
            String metodoPagamento = pagamento.getFormaPagamento();
            if (metodoPagamento == null || metodoPagamento.isEmpty()) {
                metodoPagamento = pagamento.getMetodo_pagamento_mercadopago();
            }
            dto.setFormaPagamento(metodoPagamento);

            // ── CAMPOS DE CONFIRMAÇÃO MANUAL ──
            dto.setConfirmadoManualmente(confirmadoManualmente);
            dto.setIdAdminConfirmou(pagamento.getIdAdminConfirmou());
            dto.setObservacaoConfirmacao(pagamento.getObservacaoConfirmacao());
            dto.setDataConfirmacaoManual(pagamento.getDataConfirmacaoManual());
            dto.setNomeAdminConfirmou(pagamento.getNomeAdminConfirmou());

            listaDTO.add(dto);
        }

        return listaDTO;
    }

    // PagamentoService
    public Pagamento findByParcelaId(Long parcelaId) {
        return pagamentoRepository
                .findTopByParcelaId(parcelaId).orElse(null);
    }

}
