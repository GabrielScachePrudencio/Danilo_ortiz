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

        // Busca todos os pagamentos ordenados
        List<Pagamento> pagamentos = pagamentoRepository.findAllByOrderByDataCriacaoDesc();

        // Lista final
        List<PagamentoCompletoDTO> listaDTO = new ArrayList<>();

        // Percorre cada pagamento
        for (Pagamento pagamento : pagamentos) {

            // DEBUG
            String idMercadoPago = pagamento.getId_mercadopago();

            // Verifica se possui id do Mercado Pago
            boolean possuiIdMercadoPago =
                    idMercadoPago != null &&
                            !idMercadoPago.isEmpty();

            // DEBUG

            // Ignora se não tiver ID Mercado Pago
            if (!possuiIdMercadoPago) {
                continue;
            }

            PagamentoCompletoDTO dto = new PagamentoCompletoDTO();

            // ID pagamento
            Long idPagamento = pagamento.getId();
            dto.setIdPagamento(idPagamento);

            // ALUNO
            Aluno aluno = pagamento.getAluno();

            if (aluno != null) {

                Long alunoId = aluno.getId();
                String nomeAluno = aluno.getNome();

                dto.setAlunoId(alunoId);
                dto.setNomeAluno(nomeAluno);

            }

            // PLANO
            Plano plano = pagamento.getPlano();

            if (plano != null) {

                String nomePlano = plano.getNome();

                dto.setNomePlano(nomePlano);

            }

            // DATA
            LocalDateTime dataCriacao = pagamento.getDataCriacao();
            dto.setData(dataCriacao);

            // VALOR
            BigDecimal valorPago = pagamento.getValorPago();
            dto.setValor(valorPago);

            // STATUS
            String statusMercadoPago = pagamento.getStatus_mercadopago();
            dto.setStatusLiberacao(statusMercadoPago);

            // PAYMENT ID
            dto.setMpPaymentId(idMercadoPago);

            // FORMA PAGAMENTO
            String metodoPagamento = pagamento.getMetodo_pagamento_mercadopago();
            dto.setFormaPagamento(metodoPagamento);

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
