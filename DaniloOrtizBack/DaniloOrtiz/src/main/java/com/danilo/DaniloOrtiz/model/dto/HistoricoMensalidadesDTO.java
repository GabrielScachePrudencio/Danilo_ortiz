package com.danilo.DaniloOrtiz.model.dto;

import lombok.Data;
import java.util.List;

@Data
public class HistoricoMensalidadesDTO {
    private Long alunoId;
    private String nomeAluno;
    private MensalidadeComParcelasDTO mensalidadeAtiva;          // ATIVADO
    private List<MensalidadeComParcelasDTO> historicoMensalidades; // CANCELADO + DESATIVADO
}