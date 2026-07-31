package com.danilo.DaniloOrtiz.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.HashMap;
import java.util.Map;

@Service
public class EvolutionApiService {

    @Value("${evolution.api.url:http://localhost:8080}")
    private String evolutionUrl;

    @Value("${evolution.api.key:minha-chave-123}")
    private String  apiKey;

    @Value("${evolution.api.instance:academia}")
    private String instanceName;

    private final RestTemplate restTemplate = new RestTemplate();

    public void enviarMensagem(String numero, String texto) {
        String url = evolutionUrl + "/message/sendText/" + instanceName;

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("apikey", apiKey);

        Map<String, Object> textMessage = new HashMap<>();
        textMessage.put("text", texto);

        Map<String, Object> body = new HashMap<>();
        body.put("number", numero);
        body.put("textMessage", textMessage);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);
        restTemplate.postForEntity(url, request, String.class);
    }
}