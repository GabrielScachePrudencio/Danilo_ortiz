package com.danilo.DaniloOrtiz.model.dto;

import lombok.Builder;
import lombok.Data;

/**
 * Resposta enviada ao frontend após criar pagamento transparente.
 * Os campos são preenchidos conforme o método de pagamento usado.
 */
@Data
@Builder
public class PagamentoTransparenteResponseDTO {

    private Long pagamentoId;       // ID interno do Pagamento salvo no banco

    // Status do MP: "approved", "pending", "rejected", "in_process"
    private String status;
    private String statusDetail;    // ex: "accredited", "cc_rejected_other_reason"

    // PIX — preenchido quando formaPagamento = "pix"
    private String pixQrCode;       // string copia-e-cola
    private String pixQrCodeBase64; // imagem PNG em base64 para exibir no <img>

    // Boleto — preenchido quando formaPagamento = "boleto"
    private String boletoUrl;       // link PDF do boleto
    private String boletoBarCode;   // código de barras (linha digitável)

    // Cartão — mensagem humanizada do resultado
    private String mensagem;
}
