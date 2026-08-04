package com.danilo.DaniloOrtiz.controller;

import com.danilo.DaniloOrtiz.model.*;
import com.danilo.DaniloOrtiz.model.dto.AlunoDTO;
import com.danilo.DaniloOrtiz.model.dto.ConfirmacaoManualDTO;
import com.danilo.DaniloOrtiz.model.dto.CriarParcelasConfirmarDTO;
import com.danilo.DaniloOrtiz.model.dto.PagamentoCompletoDTO;
import com.danilo.DaniloOrtiz.service.*;
import jakarta.persistence.criteria.CriteriaBuilder;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/pagamentos")
@RequiredArgsConstructor
//@CrossOrigin(origins = "http://localhost:3000")
@CrossOrigin(origins = "*")
public class PagamentoController {

    private final PagamentoService pagamentoService;
    private final PlanoService planoService;
    private final AlunoService alunoService;
    private final MensalidadeService mensalidadeService;
    private final Mensalidades_parcelasService mensalidadesParcelasService;
    private final MensagemManualService mensagemManualService;




    @PostMapping("/admin/atribuir-plano")
    public ResponseEntity<Mensalidade> atribuirPlano(
            @RequestParam Long idplano,
            @RequestParam Long idaluno,
            @RequestParam(required = false, defaultValue = "1") Integer parcelas,
            Authentication authentication) {

        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Aluno aluno = alunoService.findById(idaluno);
        if (aluno == null) {
            return ResponseEntity.badRequest().build();
        }

        String email = authentication.getName();
        Optional<Aluno> administradorOpt = alunoService.findByEmail(email);
        if (administradorOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        boolean isAdmin = "ADMIN".equals(administradorOpt.get().getTipoUsuario());

        if(!isAdmin){
            return ResponseEntity.badRequest().build();
        }


        Aluno administrador = administradorOpt.get();

        Plano planoEscolhido = planoService.buscarPorId(idplano);
        if (planoEscolhido == null) {
            return ResponseEntity.badRequest().build();
        }

        // ── valida quantidade de parcelas contra a duração do plano ──
        int totalParcelas = (parcelas != null && parcelas > 0) ? parcelas : 1;
        if (totalParcelas > planoEscolhido.getDuracaomeses()) {
            return ResponseEntity.badRequest().build();
        }

        List<Mensalidade> mensalidades = mensalidadeService.findByAlunoId(idaluno);

        boolean temAtiva = mensalidades.stream()
                .anyMatch(m -> "ATIVADO".equals(m.getStatusLiberacao()));

        if (temAtiva) {
            return ResponseEntity.badRequest().build();
        }

        mensalidades.stream()
                .filter(m -> "DESATIVADO".equals(m.getStatusLiberacao()) || "EXPIRADO".equals(m.getStatusLiberacao()))
                .forEach(m -> {
                    m.setStatusLiberacao("CANCELADO");
                    mensalidadeService.add(m);
                });

        LocalDate hoje = LocalDate.now();

        Mensalidade mensalidade = new Mensalidade();
        mensalidade.setAluno(aluno);
        mensalidade.setPlano(planoEscolhido);
        mensalidade.setDataInicio(hoje);
        mensalidade.setDataFim(hoje.plusMonths(planoEscolhido.getDuracaomeses()));
        mensalidade.setValorMensalidade(planoEscolhido.getValor());
        mensalidade.setStatusLiberacao("DESATIVADO");
        mensalidade.setNumero_parcelas_restantes(parcelas);
        mensalidade.setAtribuidoPorId(administrador.getId());
        mensalidade.setAtribuidoPorNome(administrador.getNome());
        mensalidade.setDataAtribuicao(LocalDateTime.now());

        Mensalidade resultado = mensalidadeService.add(mensalidade);

        // ── NOVO: cria as parcelas de acordo com o que o admin escolheu ──
        BigDecimal valorMensal = planoEscolhido.getValor();
        BigDecimal valorTotal = valorMensal.multiply(BigDecimal.valueOf(planoEscolhido.getDuracaomeses()));

        mensalidadeService.criarParcelasParaMensalidade(resultado, totalParcelas, valorMensal, valorTotal);

        aluno.setStatusAssinatura("DESATIVADO");
        aluno.setPlanoAtual(planoEscolhido);
        alunoService.update(aluno);

        try {
            Map<String, Object> params = new HashMap<>();
            params.put("adminNome", administrador.getNome());
            params.put("linkPagamento", "https://2dassessoria.com.br");
            mensagemManualService.enviar(aluno.getId(), "PLANO_ANEXADO", params);
        } catch (Exception e) {
            System.out.println("Falha ao enviar mensagem WhatsApp automática para aluno " + aluno.getId());
        }

        return ResponseEntity.ok(resultado);
    }

    @PostMapping
    public ResponseEntity<Pagamento> novoPagamento(@RequestBody Pagamento pagamento){

        if(pagamento == null){
            return ResponseEntity.badRequest().build();
        }

        Plano planoEscolhido = planoService.buscarPorId(pagamento.getPlano().getId());

        if(planoEscolhido == null){
            return ResponseEntity.badRequest().build();
        }

        // 🔹 pega parcelas do front
        int totalParcelas = pagamento.getParcelas() != null ? pagamento.getParcelas() : 1;

        // 🔹 valores
        BigDecimal valorMensal = planoEscolhido.getValor();
        BigDecimal valorTotal = valorMensal.multiply(
                BigDecimal.valueOf(planoEscolhido.getDuracaomeses())
        );

        BigDecimal valorParcela;

        if(totalParcelas == 1){
            // à vista
            valorParcela = valorTotal;
        } else {
            // mensal
            valorParcela = valorMensal;
        }

        // ── verifica se já existe mensalidade DESATIVADO para reusar/completar ──
        Mensalidade mensalidade;
        Mensalidade existente = mensalidadeService.findTopByAluno(pagamento.getAluno().getId());

        if (existente != null && "DESATIVADO".equals(existente.getStatusLiberacao())) {

            List<Mensalidades_parcelas> parcelasExistentes =
                    mensalidadesParcelasService.findAllByMensalidadePendenteFinalizado(existente);

            boolean temPendente = parcelasExistentes.stream()
                    .anyMatch(p -> "PENDENTE".equals(p.getStatus()));

            if (temPendente) {
                // já existe parcela pendente para essa mensalidade, não cria nada novo
                return ResponseEntity.ok(pagamento);
            }

            // mensalidade existe (ex: veio do admin/atribuir-plano) mas está sem parcelas
            // -> reaproveita ela em vez de deixar órfã
            mensalidade = existente;
            mensalidade.setPlano(planoEscolhido);
            mensalidade.setDataInicio(pagamento.getDataCriacao().toLocalDate());
            mensalidade.setDataFim(
                    pagamento.getDataCriacao()
                            .plusMonths(planoEscolhido.getDuracaomeses())
                            .toLocalDate()
            );
            mensalidade.setValorMensalidade(valorMensal);
            mensalidade.setValorParcela(valorParcela);
            mensalidade.setNumero_parcelas_restantes(totalParcelas);

        } else {
            // 🔹 cria mensalidade nova do zero
            mensalidade = new Mensalidade();

            mensalidade.setAluno(pagamento.getAluno());
            mensalidade.setPlano(planoEscolhido);

            mensalidade.setDataInicio(pagamento.getDataCriacao().toLocalDate());

            mensalidade.setDataFim(
                    pagamento.getDataCriacao()
                            .plusMonths(planoEscolhido.getDuracaomeses())
                            .toLocalDate()
            );

            mensalidade.setValorMensalidade(valorMensal);
            mensalidade.setValorParcela(valorParcela);

            mensalidade.setStatusLiberacao("DESATIVADO");

            mensalidade.setNumero_parcelas_restantes(totalParcelas);
        }

        Mensalidade mensalidadeResultado = mensalidadeService.add(mensalidade);

        if(mensalidadeResultado == null){
            return ResponseEntity.badRequest().build();
        }

        // 🔹 cria parcelas
        for(int i = 1; i <= totalParcelas; i++){

            Mensalidades_parcelas m = new Mensalidades_parcelas();

            m.setMensalidade(mensalidadeResultado);
            m.setNumeroParcela(i);
            m.setValor(valorParcela);

            m.setDataVencimento(
                    mensalidadeResultado.getDataInicio()
                            .plusMonths(i)
                            .atStartOfDay()
            );

            if(i == 1){
                m.setStatus("PENDENTE");
            } else {
                m.setStatus("AGUARDANDO");
            }

            mensalidadesParcelasService.add(m);
        }

        return ResponseEntity.ok(pagamento);
    }

    @GetMapping("/ultimas-vendas")
    public ResponseEntity<?> buscarUltimasVendas(Authentication authentication) {
        String email = authentication.getName();
        Aluno usuarioLogado = alunoService.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        boolean isAdmin = "ADMIN".equals(usuarioLogado.getTipoUsuario());

        if(!isAdmin) {
            return ResponseEntity.status(403).body(Map.of("message", "Acesso negado"));
        }

        List<PagamentoCompletoDTO> vendas = pagamentoService.listarUltimasVendas();
        return ResponseEntity.ok(vendas);
    }

    @PostMapping("/confirmar-manual")
    public ResponseEntity<?> confirmarPagamentoManual(
            @RequestBody ConfirmacaoManualDTO dto,
            Authentication authentication) {

        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String email = authentication.getName();

        Optional<Aluno> administradorOpt = alunoService.findByEmail(email);

        if (administradorOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }



        Aluno administrador = administradorOpt.get();
        boolean isAdmin = "ADMIN".equals(administrador.getTipoUsuario());

        if(!isAdmin){
            return ResponseEntity.status(403).body(Map.of("message", "Acesso negado"));
        }

        try {
            boolean sucesso = mensalidadeService.confirmarPagamentoManualAdmin(
                    dto.getParcelaId(),
                    administrador.getId(),
                    administrador.getNome(),
                    dto.getFormaPagamento(),
                    dto.getObservacao()
            );

            return sucesso
                    ? ResponseEntity.ok().build()
                    : ResponseEntity.badRequest().build();

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/admin/criar-parcelas-confirmar")
    public ResponseEntity<?> criarParcelasEConfirmar(
            @RequestBody CriarParcelasConfirmarDTO dto,
            Authentication authentication) {

        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Optional<Aluno> administradorOpt = alunoService.findByEmail(authentication.getName());
        if (administradorOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        Aluno administrador = administradorOpt.get();

        boolean isAdmin = "ADMIN".equals(administrador.getTipoUsuario());

        if(!isAdmin){
            return ResponseEntity.status(403).body(Map.of("message", "Acesso negado"));
        }


        try {
            Mensalidades_parcelas resultado = mensalidadeService.criarParcelasEConfirmarPrimeira(
                    dto.getAlunoId(),
                    dto.getTotalParcelas(),
                    administrador.getId(),
                    administrador.getNome(),
                    dto.getFormaPagamento(),
                    dto.getObservacao()
            );

            return ResponseEntity.ok(resultado);

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}