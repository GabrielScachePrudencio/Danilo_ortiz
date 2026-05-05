package com.danilo.DaniloOrtiz.controller;

import com.danilo.DaniloOrtiz.model.Aluno;
import com.danilo.DaniloOrtiz.model.MensalidadeCancelada;
import com.danilo.DaniloOrtiz.model.Mensalidades_parcelas;
import com.danilo.DaniloOrtiz.model.Pagamento;
import com.danilo.DaniloOrtiz.model.dto.*;
import com.danilo.DaniloOrtiz.pagamentoAPI.ApiMercadoPago;
import com.danilo.DaniloOrtiz.service.*;
import com.mercadopago.resources.payment.Payment;
import com.mercadopago.resources.preference.Preference;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.mercadopago.resources.payment.Payment;

import java.util.List;

@RestController
@RequestMapping("/mensalidades")
@RequiredArgsConstructor
//@CrossOrigin(origins = "http://localhost:3000")
@CrossOrigin(origins = "*")

public class MensalidadeController {
    private final MensalidadeService mensalidadeService;
    private final AlunoService alunoService;
    private final Mensalidades_parcelasService mensalidadesParcelasService;
    private final PagamentoService pagamentoService;
    private final MensalidadeCanceladaService mensalidadeCanceladaService;

    @GetMapping("/{idAluno}")
    public ResponseEntity<MensalidadeComParcelasDTO> buscarMensalidadePorIdAluno(@PathVariable Long idAluno){
        MensalidadeComParcelasDTO mensalidadeComParcelasDTO = mensalidadeService.mensalidadeCompletaPorIdAluno(idAluno);

        if(mensalidadeComParcelasDTO == null){
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(mensalidadeComParcelasDTO);
    }




    @PostMapping("/cancelar-mensalidade/{idAluno}")
    public ResponseEntity<Boolean> cancelarMensalidade(
            @PathVariable Long idAluno,
            @RequestParam Long idQuemCancelou) {

        boolean resultado = mensalidadeService.cancelarMensalidade(idAluno, idQuemCancelou);

        if (!resultado) return ResponseEntity.badRequest().build();

        return ResponseEntity.ok(true);
    }

    // Retorna detalhes da parcela + dados do pagamento interno + consulta MP
    @GetMapping("/parcela/{idParcela}")
    public ResponseEntity<ParcelaDetalheDTO> verificarParcela(
            @PathVariable Long idParcela) {

        ParcelaDetalheDTO dto = mensalidadeService.verificarParcela(idParcela);

        if (dto == null) return ResponseEntity.notFound().build();

        return ResponseEntity.ok(dto);
    }


    @PostMapping("/abrirPagamento")
    public ResponseEntity<String> abrirPagamento(@RequestBody PagamentoCompletoDTO dto){

        boolean resultado = mensalidadeService.addParcelaNaoPaga(dto);
        Preference preference = mensalidadeService.abrirPagamento(dto);

        if(preference == null || !resultado) return ResponseEntity.badRequest().build();

        return ResponseEntity.ok(preference.getInitPoint());
    }


    //novo jeito de pagar
    @PostMapping("/abrirPagamentoTransparente")
    public ResponseEntity<?> abrirPagamentoTransparente(
            @RequestBody PagamentoTransparenteDTO dto
    ) {
        try {
            // 1. Busca aluno e parcela no banco
            Aluno aluno = alunoService.findById(dto.getAlunoId());
            if (aluno == null) {
                return ResponseEntity.badRequest().body("Aluno não encontrado.");
            }

            Mensalidades_parcelas parcela = mensalidadesParcelasService.findById(dto.getParcelaId());
            if (parcela == null) {
                return ResponseEntity.badRequest().body("Parcela não encontrada.");
            }

            // 2. Usa o valor real da parcela (nunca confia só no front)
            dto.setValor(parcela.getValor());

            // 3. Cria pagamento interno (status PENDENTE) para rastrear
            Pagamento pagamento = new Pagamento();
            pagamento.setAluno(aluno);
            pagamento.setPlano(parcela.getMensalidade().getPlano());
            pagamento.setMensalidades_parcelas(parcela);
            pagamento.setValorPago(parcela.getValor());
            pagamento.setFormaPagamento(dto.getFormaPagamento());
            pagamento.setStatusPagamento("PENDENTE");
            pagamento.setPago(false);
            Pagamento pagamentoSalvo = pagamentoService.save(pagamento);

            // 4. Chama o MP — pagamento transparente
            Payment mpPayment = ApiMercadoPago.criarPagamentoTransparente(dto, aluno);

            if (mpPayment == null) {
                return ResponseEntity.internalServerError().body("Erro ao criar pagamento no Mercado Pago.");
            }

            // 5. Salva o ID do MP no pagamento interno
            pagamentoSalvo.setMpPaymentId(mpPayment.getId().toString());
            pagamentoService.save(pagamentoSalvo);

            // 6. Se cartão foi aprovado na hora (status = approved), confirma direto
            if ("approved".equals(mpPayment.getStatus())) {
                mensalidadeService.confirmarPagamentoDoWebHook(
                        pagamentoSalvo.getId(),
                        mpPayment.getId().toString(),
                        mpPayment.getStatus(),
                        mpPayment.getPaymentMethodId()
                );
            }

            // 7. Monta resposta para o frontend
            PagamentoTransparenteResponseDTO response = PagamentoTransparenteResponseDTO.builder()
                    .pagamentoId(pagamentoSalvo.getId())
                    .status(mpPayment.getStatus())
                    .statusDetail(mpPayment.getStatusDetail())
                    .build();

            // Dados específicos do PIX
            if ("pix".equalsIgnoreCase(dto.getFormaPagamento())
                    && mpPayment.getPointOfInteraction() != null
                    && mpPayment.getPointOfInteraction().getTransactionData() != null) {

                response.setPixQrCode(
                        mpPayment.getPointOfInteraction().getTransactionData().getQrCode()
                );
                response.setPixQrCodeBase64(
                        mpPayment.getPointOfInteraction().getTransactionData().getQrCodeBase64()
                );
            }

            // Dados específicos do Boleto
            if ("boleto".equalsIgnoreCase(dto.getFormaPagamento())) {
                response.setBoletoUrl(mpPayment.getTransactionDetails() != null
                        ? mpPayment.getTransactionDetails().getExternalResourceUrl()
                        : null);

                response.setBoletoBarCode(
                        mpPayment.getTransactionDetails() != null
                                ? mpPayment.getTransactionDetails().getExternalResourceUrl()
                                : null
                );
            }

            // Mensagem por status do cartão
            if ("credit_card".equalsIgnoreCase(dto.getFormaPagamento())) {
                switch (mpPayment.getStatus()) {
                    case "approved"  -> response.setMensagem("Pagamento aprovado! ✓");
                    case "rejected"  -> response.setMensagem("Pagamento recusado. Verifique os dados do cartão.");
                    case "in_process"-> response.setMensagem("Pagamento em análise. Aguarde.");
                    default          -> response.setMensagem("Status: " + mpPayment.getStatus());
                }
            }

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            System.err.println("Erro pagamento transparente: " + e.getMessage());
            return ResponseEntity.internalServerError()
                    .body("Erro ao processar pagamento: " + e.getMessage());
        }



    }


    @GetMapping("/canceladas")
    public ResponseEntity<List<MensalidadeCancelada>> listarCanceladas() {
        return ResponseEntity.ok(mensalidadeCanceladaService.listarTodas());
    }
}
