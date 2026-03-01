package com.danilo.DaniloOrtiz.controller;

import com.danilo.DaniloOrtiz.model.Mensalidade;
import com.danilo.DaniloOrtiz.model.Mensalidades_parcelas;
import com.danilo.DaniloOrtiz.model.Pagamento;
import com.danilo.DaniloOrtiz.model.Plano;
import com.danilo.DaniloOrtiz.service.MensalidadeService;
import com.danilo.DaniloOrtiz.service.Mensalidades_parcelasService;
import com.danilo.DaniloOrtiz.service.PagamentoService;
import com.danilo.DaniloOrtiz.service.PlanoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequestMapping("/pagamentos")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class PagamentoController {

    private final PagamentoService pagamentoService;
    private final PlanoService planoService;
    private final MensalidadeService mensalidadeService;
    private final Mensalidades_parcelasService mensalidadesParcelasService;

    @PostMapping
    public ResponseEntity<Pagamento> novoPagamento(@RequestBody Pagamento pagamento){

        Pagamento p = pagamento;

        if(p == null){
            return ResponseEntity.badRequest().build();
        }

        Plano planoEscolhido = planoService.buscarPorId(p.getPlano().getId());

        if(planoEscolhido == null){
            return ResponseEntity.badRequest().build();
        }

        Mensalidade mensalidade = new Mensalidade();

        mensalidade.setAluno(p.getAluno());
        mensalidade.setPlano(planoEscolhido);
        mensalidade.setDataInicio(p.getDataCriacao().toLocalDate());
        mensalidade.setDataFim(
                p.getDataCriacao().plusMonths(planoEscolhido.getDuracaomeses()).toLocalDate()
        );

        mensalidade.setValorMensalidade(planoEscolhido.getValor());
        mensalidade.setStatusLiberacao("DESATIVADO");
        mensalidade.setNumero_parcelas_restantes(
                planoEscolhido.getDuracaomeses().intValue()
        );


        Mensalidade mensalidadeResultado = mensalidadeService.add(mensalidade);

        if(mensalidadeResultado == null){
            return ResponseEntity.badRequest().build();
        }

        // 4️⃣ Criar todas parcelas como PENDENTE
        int totalParcelas = mensalidadeResultado.getNumero_parcelas_restantes();
        double valorParcela = mensalidadeResultado.getValorMensalidade().intValue() / totalParcelas;

        //add o valor da parcela na mensalidade
        mensalidade.setValorParcela(new BigDecimal(valorParcela));
        mensalidadeService.save(mensalidadeResultado);

        for(int i = 1; i <= totalParcelas; i++){

            Mensalidades_parcelas m = new Mensalidades_parcelas();
            m.setMensalidade(mensalidadeResultado);
            m.setNumeroParcela(i);
            m.setValor(new BigDecimal(valorParcela));

            m.setDataVencimento(
                    mensalidadeResultado.getDataInicio()
                            .plusMonths(i)
                            .atStartOfDay()
            );

            if(i == 1){
                m.setStatus("PENDENTE");
            } else {
                m.setStatus("AGUARDANDO");
            }

            mensalidadesParcelasService.add(m);
        }

        return ResponseEntity.ok(p);
    }
}