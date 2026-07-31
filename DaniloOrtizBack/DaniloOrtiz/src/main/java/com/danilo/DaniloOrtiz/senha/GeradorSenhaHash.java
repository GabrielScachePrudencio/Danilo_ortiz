package com.danilo.DaniloOrtiz.senha;

import java.util.Scanner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class GeradorSenhaHash {

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

        System.out.print("Digite a senha: ");
        String senha = scanner.nextLine();

        String hash = encoder.encode(senha);

        System.out.println("Senha original: " + senha);
        System.out.println("Hash BCrypt: " + hash);

        // Opcional: testar se o hash bate com a senha digitada
        boolean confere = encoder.matches(senha, hash);
        System.out.println("Confere? " + confere);

        scanner.close();
    }
}