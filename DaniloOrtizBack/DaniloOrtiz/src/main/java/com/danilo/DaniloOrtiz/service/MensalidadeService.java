package com.danilo.DaniloOrtiz.service;


import com.danilo.DaniloOrtiz.model.*;
import com.danilo.DaniloOrtiz.model.dto.MensalidadeComParcelasDTO;
import com.danilo.DaniloOrtiz.model.dto.PagamentoCompletoDTO;
import com.danilo.DaniloOrtiz.model.dto.ParcelaDTO;
import com.danilo.DaniloOrtiz.model.mapper.MensalidadeComParcelasMapper;
import com.danilo.DaniloOrtiz.repository.MensalidadeRepository;
import com.danilo.DaniloOrtiz.repository.Mensalidades_parcelasRepository;
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

    @Transactional
    public boolean pagarParcela(PagamentoCompletoDTO mensalidadeComParcelasDTO){
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
        pagamentoIncompleto.setPago(true);
        pagamentoIncompleto.setFormaPagamento(mensalidadeComParcelasDTO.getFormaPagamento());
        pagamentoIncompleto.setStatusPagamento("FINALIZADO");

        Pagamento pagamentoCompleto = pagamentoService.novoPagamento((pagamentoIncompleto));

        if(pagamentoCompleto == null) return  false;




        // atualizar parcela
        mensalidades_parcelas.setStatus("FINALIZADO");
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
        }
        mensalidadesParcelasService.save(proximaParcela);


        // atualizar mensalidade
        Mensalidade mensalidade = mensalidades_parcelas.getMensalidade();

        mensalidade.setNumero_parcelas_restantes(
                mensalidade.getNumero_parcelas_restantes() - 1
        );

        mensalidade.setStatusLiberacao("ATIVADO");

        save(mensalidade);

        if(mensalidade == null) return false;


        return true;

    }




}
