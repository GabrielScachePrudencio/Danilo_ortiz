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
import java.util.Map;

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

    @GetMapping("/historico/{idAluno}")
    public ResponseEntity<HistoricoMensalidadesDTO> buscarHistoricoPorIdAluno(@PathVariable Long idAluno) {
        HistoricoMensalidadesDTO historico = mensalidadeService.historicoCompletoPorIdAluno(idAluno);

        if (historico == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(historico);
    }

    @PostMapping("/renovar/{idAluno}")
    public ResponseEntity<?> renovarMensalidade(@PathVariable Long idAluno) {
        try {
            MensalidadeComParcelasDTO dto = mensalidadeService.renovarMensalidade(idAluno);
            return ResponseEntity.ok(dto);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
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

          List<String> pendencias =
                  alunoService.validarDadosPagamento(aluno);

          if (!pendencias.isEmpty()) {

              return ResponseEntity.badRequest().body(
                      Map.of(
                              "status", "CADASTRO_INCOMPLETO",
                              "mensagem", "Complete seu cadastro.",
                              "campos", pendencias
                      )
              );
          }

            Mensalidades_parcelas parcela = mensalidadesParcelasService.findById(dto.getParcelaId());
            if (parcela == null) {
                return ResponseEntity.badRequest().body("Parcela não encontrada.");
            }

          // 3. Não deixa pagar parcela cancelada
          if ("CANCELADO".equalsIgnoreCase(parcela.getStatus())) {
              return ResponseEntity.badRequest()
                      .body("Esta parcela foi cancelada.");
          }

          // 4. Não deixa pagar parcela já finalizada
          if ("FINALIZADO".equalsIgnoreCase(parcela.getStatus())) {
              return ResponseEntity.badRequest()
                      .body("Esta parcela já foi paga.");
          }

          // valida pagamentos anteriores
          Pagamento pagamentoExistente =
                  mensalidadeService.validarOuRetornarPagamento(parcela.getId());

          if(pagamentoExistente != null && "FINALIZADO".equalsIgnoreCase(
                  pagamentoExistente.getStatusPagamento())) {
              return ResponseEntity.badRequest()
                      .body("Esta parcela já foi paga.");
          }

          if (pagamentoExistente != null
                  && "PENDENTE".equalsIgnoreCase(pagamentoExistente.getStatusPagamento())) {

              Payment mpPayment =
                      ApiMercadoPago.consultarPagamento(
                              Long.parseLong(pagamentoExistente.getMpPaymentId())
                      );

              return ResponseEntity.ok(
                      PagamentoTransparenteResponseDTO.builder()
                              .pagamentoId(pagamentoExistente.getId())
                              .status(mpPayment.getStatus())
                              .pixQrCode(mpPayment.getPointOfInteraction()
                                      .getTransactionData().getQrCode())
                              .pixQrCodeBase64(mpPayment.getPointOfInteraction()
                                      .getTransactionData().getQrCodeBase64())
                              .build()
              );
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
        if ("pix".equalsIgnoreCase(dto.getFormaPagamento())) {
                if (mpPayment.getPointOfInteraction() != null) {
                if (mpPayment.getPointOfInteraction().getTransactionData() != null) {
                }
            }

            if (mpPayment.getPointOfInteraction() != null
                    && mpPayment.getPointOfInteraction().getTransactionData() != null) {
                response.setPixQrCode(
                        mpPayment.getPointOfInteraction().getTransactionData().getQrCode()
                );
                response.setPixQrCodeBase64(
                        mpPayment.getPointOfInteraction().getTransactionData().getQrCodeBase64()
                );
            }
        }

        // Dados específicos do Boleto
        if ("boleto".equalsIgnoreCase(dto.getFormaPagamento())) {
            if (mpPayment.getTransactionDetails() != null) {
                // URL para abrir/imprimir o PDF do boleto
                response.setBoletoUrl(
                        mpPayment.getTransactionDetails().getExternalResourceUrl()
                );
                // Linha digitável (código de barras) — campo correto
                response.setBoletoBarCode(
                        mpPayment.getTransactionDetails().getBarcode() != null
                                ? mpPayment.getTransactionDetails().getBarcode().getContent()
                                : mpPayment.getTransactionDetails().getExternalResourceUrl()
                );
            }
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

    }  catch (Exception e) {
        e.printStackTrace(); // ou logger.error("Erro ao processar pagamento", e);
        return ResponseEntity.internalServerError()
                .body("Erro ao processar pagamento: " + e.getMessage());
    }



    }


    @GetMapping("/canceladas")
    public ResponseEntity<List<MensalidadeCancelada>> listarCanceladas() {
        return ResponseEntity.ok(mensalidadeCanceladaService.listarTodas());
    }

    @PostMapping("/cancelar-sem-log/{idAluno}")
    public ResponseEntity<Boolean> cancelarSemLog(@PathVariable Long idAluno) {
        boolean resultado = mensalidadeService.cancelarSemLog(idAluno);
        if (!resultado) return ResponseEntity.badRequest().build();
        return ResponseEntity.ok(true);
    }

    @PostMapping("/verificar-pagamento/{idParcela}")
    public ResponseEntity<Map<String, String>> verificarPagamentoManual(
            @PathVariable Long idParcela) {

        try {
            Pagamento pagamento = pagamentoService.findByParcelaId(idParcela);

            if (pagamento == null || pagamento.getMpPaymentId() == null) {
                return ResponseEntity.ok(Map.of(
                        "status", "SEM_PAGAMENTO",
                        "mensagem", "Nenhum pagamento iniciado para esta parcela."
                ));
            }

            if (Boolean.TRUE.equals(pagamento.getPago())) {
                return ResponseEntity.ok(Map.of(
                        "status", "FINALIZADO",
                        "mensagem", "Pagamento já confirmado!"
                ));
            }

            Payment mpPayment = ApiMercadoPago.consultarPagamento(
                    Long.parseLong(pagamento.getMpPaymentId())
            );

            if (mpPayment == null) {
                return ResponseEntity.status(502).body(Map.of(
                        "status", "ERRO",
                        "mensagem", "Não foi possível consultar o Mercado Pago. Tente novamente."
                ));
            }

            return switch (mpPayment.getStatus()) {
                case "approved" -> {
                    mensalidadeService.confirmarPagamentoPorParcelaId(
                            idParcela,
                            pagamento.getMpPaymentId(),
                            mpPayment.getStatus(),
                            mpPayment.getPaymentMethodId()
                    );
                    yield ResponseEntity.ok(Map.of(
                            "status", "FINALIZADO",
                            "mensagem", "Pagamento confirmado com sucesso!"
                    ));
                }
                case "pending", "in_process" -> ResponseEntity.ok(Map.of(
                        "status", "PENDENTE",
                        "mensagem", "Pagamento ainda não identificado. Aguarde e tente novamente."
                ));
                case "rejected", "cancelled" -> ResponseEntity.ok(Map.of(
                        "status", "REJEITADO",
                        "mensagem", "Pagamento recusado. Tente realizar um novo pagamento."
                ));
                default -> ResponseEntity.ok(Map.of(
                        "status", mpPayment.getStatus(),
                        "mensagem", "Status atual: " + mpPayment.getStatus()
                ));
            };

        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of(
                    "status", "ERRO",
                    "mensagem", "Erro interno: " + e.getMessage()
            ));
        }
    }

    @GetMapping("/completa/{alunoId}")
    public ResponseEntity<MensalidadeComParcelasDTO> mensalidadeCompleta(@PathVariable Long alunoId) {
        MensalidadeComParcelasDTO dto = mensalidadeService.mensalidadeCompletaPorIdAluno(alunoId);
        if (dto == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(dto);
    }
}
