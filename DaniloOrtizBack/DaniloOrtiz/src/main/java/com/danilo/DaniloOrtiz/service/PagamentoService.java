package com.danilo.DaniloOrtiz.service;

import com.danilo.DaniloOrtiz.model.Pagamento;
import com.danilo.DaniloOrtiz.model.dto.PagamentoCompletoDTO;
import com.danilo.DaniloOrtiz.repository.MensalidadeRepository;
import com.danilo.DaniloOrtiz.repository.Mensalidades_parcelasRepository;
import com.danilo.DaniloOrtiz.repository.PagamentoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

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

        return pagamentos.stream()
                // 🔥 FILTRO: Só deixa passar se o ID do Mercado Pago não for nulo nem vazio
                .filter(p -> p.getId_mercadopago() != null && !p.getId_mercadopago().isEmpty())
                .map(p -> {
                    PagamentoCompletoDTO dto = new PagamentoCompletoDTO();
                    dto.setIdPagamento(p.getId());

                    if (p.getAluno() != null) {
                        dto.setAlunoId(p.getAluno().getId());
                        dto.setNomeAluno(p.getAluno().getNome());
                    }

                    if (p.getPlano() != null) {
                        dto.setNomePlano(p.getPlano().getNome());
                    }

                    dto.setData(p.getDataCriacao());
                    dto.setValor(p.getValorPago());

                    // Usando os campos específicos que você mencionou
                    dto.setStatusLiberacao(p.getStatus_mercadopago());
                    dto.setMpPaymentId(p.getId_mercadopago());
                    dto.setFormaPagamento(p.getMetodo_pagamento_mercadopago());

                    return dto;
                }).collect(Collectors.toList());
    }
}
