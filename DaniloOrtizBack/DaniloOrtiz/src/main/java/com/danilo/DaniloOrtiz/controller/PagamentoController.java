package com.danilo.DaniloOrtiz.controller;

import com.danilo.DaniloOrtiz.model.Mensalidade;
import com.danilo.DaniloOrtiz.model.Mensalidades_parcelas;
import com.danilo.DaniloOrtiz.model.Pagamento;
import com.danilo.DaniloOrtiz.model.Plano;
import com.danilo.DaniloOrtiz.model.dto.PagamentoCompletoDTO;
import com.danilo.DaniloOrtiz.service.MensalidadeService;
import com.danilo.DaniloOrtiz.service.Mensalidades_parcelasService;
import com.danilo.DaniloOrtiz.service.PagamentoService;
import com.danilo.DaniloOrtiz.service.PlanoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/pagamentos")
@RequiredArgsConstructor
//@CrossOrigin(origins = "http://localhost:3000")
@CrossOrigin(origins = "*")
public class PagamentoController {

    private final PagamentoService pagamentoService;
    private final PlanoService planoService;
    private final MensalidadeService mensalidadeService;
    private final Mensalidades_parcelasService mensalidadesParcelasService;

    @PostMapping
    public ResponseEntity<Pagamento> novoPagamento(@RequestBody Pagamento pagamento){

        if(pagamento == null){
            return ResponseEntity.badRequest().build();
        }

        Plano planoEscolhido = planoService.buscarPorId(pagamento.getPlano().getId());

        if(planoEscolhido == null){
            return ResponseEntity.badRequest().build();
        }

        // ── NOVO: verifica se já existe mensalidade DESATIVADO ou CANCELADO para reusa ──
        Mensalidade existente = mensalidadeService.findTopByAluno(pagamento.getAluno().getId());

        if (existente != null && "DESATIVADO".equals(existente.getStatusLiberacao())) {
            // Reusa a mensalidade existente, busca a parcela PENDENTE dela
            // e retorna sem criar nada novo
            return ResponseEntity.ok(pagamento);
        }


        // 🔹 pega parcelas do front
        int totalParcelas = pagamento.getParcelas() != null ? pagamento.getParcelas() : 1;

        // 🔹 valores
        BigDecimal valorMensal = planoEscolhido.getValor();
        BigDecimal valorTotal = valorMensal.multiply(
                BigDecimal.valueOf(planoEscolhido.getDuracaomeses())
        );

        BigDecimal valorParcela;

        if(totalParcelas == 1){
            // à vista
            valorParcela = valorTotal;
        } else {
            // mensal
            valorParcela = valorMensal;
        }

        // 🔹 cria mensalidade
        Mensalidade mensalidade = new Mensalidade();

        mensalidade.setAluno(pagamento.getAluno());
        mensalidade.setPlano(planoEscolhido);

        mensalidade.setDataInicio(pagamento.getDataCriacao().toLocalDate());

        mensalidade.setDataFim(
                pagamento.getDataCriacao()
                        .plusMonths(planoEscolhido.getDuracaomeses())
                        .toLocalDate()
        );

        mensalidade.setValorMensalidade(valorMensal);
        mensalidade.setValorParcela(valorParcela);

        mensalidade.setStatusLiberacao("DESATIVADO");

        // 🔥 agora usa o que veio do front
        mensalidade.setNumero_parcelas_restantes(totalParcelas);

        Mensalidade mensalidadeResultado = mensalidadeService.add(mensalidade);

        if(mensalidadeResultado == null){
            return ResponseEntity.badRequest().build();
        }

        // 🔹 cria parcelas
        for(int i = 1; i <= totalParcelas; i++){

            Mensalidades_parcelas m = new Mensalidades_parcelas();

            m.setMensalidade(mensalidadeResultado);
            m.setNumeroParcela(i);
            m.setValor(valorParcela);

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

        return ResponseEntity.ok(pagamento);
    }

    @GetMapping("/ultimas-vendas")
    public ResponseEntity<List<PagamentoCompletoDTO>> buscarUltimasVendas() {
        List<PagamentoCompletoDTO> vendas = pagamentoService.listarUltimasVendas();
        return ResponseEntity.ok(vendas);
    }
}