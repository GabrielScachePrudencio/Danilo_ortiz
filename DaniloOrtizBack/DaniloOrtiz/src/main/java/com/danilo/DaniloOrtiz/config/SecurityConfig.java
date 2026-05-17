package com.danilo.DaniloOrtiz.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {
    private final JwtFilter jwtFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception{
        http
                .cors(cors -> {}) // 🔥 ativa CORS
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        // 🔥 LIBERA PREFLIGHT (ESSENCIAL)
                        .requestMatchers(org.springframework.http.HttpMethod.OPTIONS, "/**").permitAll()

                        // 🔓 rotas públicas
                        .requestMatchers("/alunos/login").permitAll()
                        .requestMatchers(org.springframework.http.HttpMethod.POST,"/alunos").permitAll()
                        .requestMatchers("/planos/**").permitAll()
                        .requestMatchers("/v1/pagamentos/notifications").permitAll()

                        // 🔒 rotas exclusivas de ADMIN
                        .requestMatchers("/alunos").hasRole("ADMIN")

                        .requestMatchers(HttpMethod.GET, "/mensalidades/**").authenticated()
                        .requestMatchers(HttpMethod.POST, "/mensalidades/**").authenticated()

                        .requestMatchers("/alunos/qtdd-aluno-por-plano").hasRole("ADMIN")
                        .requestMatchers("/alunos/atualizar-status-aluno/**").hasRole("ADMIN")
                        .requestMatchers("/alunos/atualizar-status-contasisrun-aluno/**").hasRole("ADMIN")
                        .requestMatchers("/pagamentos/ultimas-vendas").hasRole("ADMIN")
                        .requestMatchers("/mensalidades/canceladas").hasRole("ADMIN")
                        .requestMatchers("/configuracao").hasRole("ADMIN")


                        // 🔒 resto protegido
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();

        config.setAllowedOrigins(List.of("http://localhost:3000"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        return source;
    }
}
