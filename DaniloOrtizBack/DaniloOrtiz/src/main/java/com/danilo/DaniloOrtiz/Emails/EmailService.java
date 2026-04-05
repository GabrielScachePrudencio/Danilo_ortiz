package com.danilo.DaniloOrtiz.Emails;


import com.danilo.DaniloOrtiz.model.dto.EmailDTO;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import jakarta.mail.internet.MimeMessage;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.javamail.MimeMessageHelper;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void enviar(EmailDTO emailDTO) {

        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setTo(emailDTO.getPara());
        msg.setSubject(emailDTO.getAssunto());
        msg.setText(emailDTO.getMensagem());

        mailSender.send(msg);
    }



    public void enviarComAnexo(String para, String html, byte[] pdf) {

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setTo(para);
            helper.setSubject("Comprovante de pagamento ✔");
            helper.setText(html, true);

            helper.addAttachment("comprovante.pdf", new ByteArrayResource(pdf));

            mailSender.send(message);

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}