package com.danilo.DaniloOrtiz.service;

import com.danilo.DaniloOrtiz.model.Mensalidade;
import com.danilo.DaniloOrtiz.model.Mensalidades_parcelas;
import com.danilo.DaniloOrtiz.repository.Mensalidades_parcelasRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class Mensalidades_parcelasService {
    private final Mensalidades_parcelasRepository mensalidadesParcelasRepository;

    public Mensalidades_parcelas add(Mensalidades_parcelas mensalidades_parcelas){
        return mensalidadesParcelasRepository.save(mensalidades_parcelas);
    }

    public Mensalidades_parcelas save(Mensalidades_parcelas mensalidades_parcelas){
        return mensalidadesParcelasRepository.save(mensalidades_parcelas);
    }

    public Mensalidades_parcelas findById(Long id){
        return mensalidadesParcelasRepository.findById(id);
    }

    public List<Mensalidades_parcelas> findAllByMensalidade(Mensalidade mensalidade){
        return mensalidadesParcelasRepository.findAllByMensalidade(mensalidade);
    }

    public Mensalidades_parcelas findByMensalidadeAndNumeroParcela(Mensalidade mensalidade, Integer numeroParcela){
        return mensalidadesParcelasRepository.findByMensalidadeAndNumeroParcela(mensalidade, numeroParcela);
    }

    public List<Mensalidades_parcelas> findAllByMensalidadePendenteFinalizado(Mensalidade mensalidade){
        List<String> statusPermitidos = List.of("PENDENTE", "FINALIZADO");

        List<Mensalidades_parcelas> listaDeParcelas =
                mensalidadesParcelasRepository
                        .findByMensalidadeAndStatusInOrderByNumeroParcelaAsc(
                                mensalidade,
                                statusPermitidos
                        );
        return listaDeParcelas;
    }
}
