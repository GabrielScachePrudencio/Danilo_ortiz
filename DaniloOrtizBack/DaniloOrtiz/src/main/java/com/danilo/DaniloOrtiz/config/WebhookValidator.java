package com.danilo.DaniloOrtiz.config;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;

public class WebhookValidator {

    private static final String SECRET = System.getenv("MP_WEBHOOK_SECRET") != null
            ? System.getenv("MP_WEBHOOK_SECRET")
            : "sua-secret-aqui-para-dev";

    /**
     * Valida a assinatura do webhook do Mercado Pago.
     * Retorna true se legítimo, false se inválido/falso.
     */
    public static boolean validar(String xSignature, String xRequestId, String resourceId) {

        System.out.println("SECRET usada: " + SECRET); // ← adicionar
        System.out.println("xSignature: " + xSignature);
        System.out.println("xRequestId: " + xRequestId);
        System.out.println("resourceId: " + resourceId);

        if (xSignature == null || xRequestId == null) return false;

        try {
            String ts = null;
            String v1 = null;

            for (String part : xSignature.split(",")) {
                if (part.startsWith("ts=")) ts = part.substring(3);
                if (part.startsWith("v1=")) v1 = part.substring(3);
            }

            if (ts == null || v1 == null) return false;

            String manifest = "id:" + resourceId + ";request-id:" + xRequestId + ";ts:" + ts + ";";

            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(SECRET.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
            byte[] hash = mac.doFinal(manifest.getBytes(StandardCharsets.UTF_8));

            StringBuilder hex = new StringBuilder();
            for (byte b : hash) hex.append(String.format("%02x", b));

            return hex.toString().equals(v1);

        } catch (Exception e) {
            System.err.println("Erro ao validar webhook: " + e.getMessage());
            return false;
        }
    }
}