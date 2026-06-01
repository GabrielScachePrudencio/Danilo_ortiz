package com.danilo.DaniloOrtiz.model.mapper;

import com.danilo.DaniloOrtiz.model.Aluno;
import com.danilo.DaniloOrtiz.model.Mensalidade;
import com.danilo.DaniloOrtiz.model.Mensalidades_parcelas;
import com.danilo.DaniloOrtiz.model.dto.HistoricoMensalidadesDTO;
import com.danilo.DaniloOrtiz.model.dto.MensalidadeComParcelasDTO;
import com.danilo.DaniloOrtiz.model.dto.ParcelaDTO;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class MensalidadeComParcelasMapper {
    public static MensalidadeComParcelasDTO toDTO(Mensalidade mensalidade, List<Mensalidades_parcelas> parcelas) {

        MensalidadeComParcelasDTO dto = new MensalidadeComParcelasDTO();

        dto.setId(mensalidade.getId());
        dto.setAlunoId(mensalidade.getAluno().getId());
        dto.setNomeAluno(mensalidade.getAluno().getNome());

        dto.setPlanoId(mensalidade.getPlano() != null ? mensalidade.getPlano().getId() : null);
        dto.setNomePlano(mensalidade.getPlano() != null ? mensalidade.getPlano().getNome() : null);
// qualquer outro campo que acesse mensalidade.getPlano()

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

    public static HistoricoMensalidadesDTO toHistoricoDTO(
            Aluno aluno,
            List<Mensalidade> todasMensalidades,
            Map<Long, List<Mensalidades_parcelas>> parcelasPorMensalidade) {

        HistoricoMensalidadesDTO historico = new HistoricoMensalidadesDTO();
        historico.setAlunoId(aluno.getId());
        historico.setNomeAluno(aluno.getNome());

        List<MensalidadeComParcelasDTO> canceladas = new ArrayList<>();

        for (Mensalidade m : todasMensalidades) {
            List<Mensalidades_parcelas> parcelas =
                    parcelasPorMensalidade.getOrDefault(m.getId(), List.of());
            MensalidadeComParcelasDTO dto = toDTO(m, parcelas);

            String status = m.getStatusLiberacao();
            if ("ATIVADO".equals(status)) {
                historico.setMensalidadeAtiva(dto);
            } else {
                canceladas.add(dto);
            }
        }

        historico.setHistoricoMensalidades(canceladas);
        return historico;
    }

}
