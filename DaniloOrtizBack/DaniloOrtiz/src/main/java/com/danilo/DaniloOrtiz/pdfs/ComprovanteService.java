package com.danilo.DaniloOrtiz.pdfs;

import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;

@Service
public class ComprovanteService {

    public byte[] gerarComprovante(String nome, String plano, String valor, String pagamentoId) {

        try {
            ByteArrayOutputStream out = new ByteArrayOutputStream();

            PdfWriter writer = new PdfWriter(out);
            com.itextpdf.layout.Document document = new Document(new com.itextpdf.kernel.pdf.PdfDocument(writer));

            document.add(new Paragraph("COMPROVANTE DE PAGAMENTO"));
            document.add(new Paragraph(" "));
            document.add(new Paragraph("Nome: " + nome));
            document.add(new Paragraph("Plano: " + plano));
            document.add(new Paragraph("Valor: R$ " + valor));
            document.add(new Paragraph("ID Pagamento: " + pagamentoId));
            document.add(new Paragraph("Data: " + java.time.LocalDateTime.now()));

            document.close();

            return out.toByteArray();

        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}