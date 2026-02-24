package com.danilo.DaniloOrtiz.service;

import com.danilo.DaniloOrtiz.model.Pagamento;
import com.danilo.DaniloOrtiz.repository.MensalidadeRepository;
import com.danilo.DaniloOrtiz.repository.Mensalidades_parcelasRepository;
import com.danilo.DaniloOrtiz.repository.PagamentoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PagamentoService {
    private final PagamentoRepository pagamentoRepository;

    //aqui ela so escolheu ela não pagou de fato
    public Pagamento novoPagamento(Pagamento pagamento){
        Pagamento p = pagamentoRepository.save(pagamento);
        return p;
    }


}
