package com.danilo.DaniloOrtiz.model.mapper;

import com.danilo.DaniloOrtiz.model.Mensalidade;
import com.danilo.DaniloOrtiz.model.Mensalidades_parcelas;
import com.danilo.DaniloOrtiz.model.dto.MensalidadeComParcelasDTO;
import com.danilo.DaniloOrtiz.model.dto.ParcelaDTO;

import java.util.List;

public class MensalidadeComParcelasMapper {
    public static MensalidadeComParcelasDTO toDTO(Mensalidade mensalidade, List<Mensalidades_parcelas> parcelas) {

        MensalidadeComParcelasDTO dto = new MensalidadeComParcelasDTO();

        dto.setId(mensalidade.getId());
        dto.setAlunoId(mensalidade.getAluno().getId());
        dto.setNomeAluno(mensalidade.getAluno().getNome());

        dto.setPlanoId(mensalidade.getPlano().getId());
        dto.setNomePlano(mensalidade.getPlano().getNome());

        dto.setDataInicio(mensalidade.getDataInicio());
        dto.setDataFim(mensalidade.getDataFim());

        dto.setValorMensalidade(mensalidade.getValorMensalidade());
        dto.setStatusLiberacao(mensalidade.getStatusLiberacao());
        dto.setNumeroParcelasRestantes(mensalidade.getNumero_parcelas_restantes());

        List<ParcelaDTO> parcelasDTO = parcelas.stream()
                .map(MensalidadeComParcelasMapper::toParcelaDTO)
                .toList();

        dto.setParcelas(parcelasDTO);

        dto.setParcelas(parcelasDTO);

        return dto;
    }

    public static ParcelaDTO toParcelaDTO(Mensalidades_parcelas parcela) {

        ParcelaDTO dto = new ParcelaDTO();

        dto.setId(parcela.getId());
        dto.setValor(parcela.getValor());
        dto.setDataVencimento(parcela.getDataVencimento().toLocalDate());
        dto.setStatus(parcela.getStatus());

        return dto;
    }


}
