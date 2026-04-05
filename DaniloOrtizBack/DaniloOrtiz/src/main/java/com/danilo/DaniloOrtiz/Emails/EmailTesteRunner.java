package com.danilo.DaniloOrtiz.Emails;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class EmailTesteRunner implements CommandLineRunner {

    @Autowired
    private EmailService emailService;

    @Override
    public void run(String... args) throws Exception {
//        System.out.println("Enviando email...");
//
//        emailService.enviar("bielscache@gmail.com");
//
//        System.out.println("Email enviado!");
    }
}