package com.danilo.DaniloOrtiz.config;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.annotations.Cache;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;

public class JwtUtil {

    private static final String SECRET = "minha-chave-super-secreta-com-32-caracteres";
    private static final Key KEY = Keys.hmacShaKeyFor(SECRET.getBytes());

    public static String gerarToken(String email, String tipoUsuario){
        return Jwts.builder()
                .subject(email)
                .claim("role", tipoUsuario)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + 86400000)) // 1 dia
                .signWith(KEY)
                .compact();
    }

    public static String validarToken(String token){
        return Jwts.parser()
                .verifyWith((SecretKey) KEY)
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
    }


    public static String extrairRole(String token) {
        return (String) Jwts.parser()
                .verifyWith((SecretKey) KEY)
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .get("role");
    }

}
