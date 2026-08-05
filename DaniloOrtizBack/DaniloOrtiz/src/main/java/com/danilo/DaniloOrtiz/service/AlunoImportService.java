package com.danilo.DaniloOrtiz.service;

import com.danilo.DaniloOrtiz.model.Aluno;
import com.danilo.DaniloOrtiz.model.Mensalidade;
import com.danilo.DaniloOrtiz.model.Mensalidades_parcelas;
import com.danilo.DaniloOrtiz.model.Plano;
import com.danilo.DaniloOrtiz.model.dto.ImportResultDTO;
import com.danilo.DaniloOrtiz.repository.AlunoRepository;
import org.apache.poi.ss.usermodel.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import java.text.Normalizer;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.*;

@Service
public class AlunoImportService {

    @Autowired private AlunoRepository ar;
    @Autowired private AlunoService alunoService;
    @Autowired private MensalidadeService mensalidadeService;
    @Autowired private Mensalidades_parcelasService mensalidadesParcelasService;
    @Autowired private PlanoService planoService;

    private static final String NOME_PLANO_IMPORTADO = "Importado Manual";
    private static final DateTimeFormatter FORMATO_DATA = DateTimeFormatter.ofPattern("dd/MM/yy");

    private static final SecureRandom RANDOM = new SecureRandom();

    private static final Map<String, List<String>> ALIASES = Map.of(
            "nome",         List.of("nome"),
            "email",        List.of("email", "e-mail"),
            "vencimento",   List.of("vencimento"),
            "valor",        List.of("valor"),
            "observacoes",  List.of("observacoes", "observações", "obs")
    );

    private static final List<String> OBRIGATORIOS = List.of("nome");
    private static final List<String> NAO_MAPEADOS = List.of("vencimento", "valor");

    // 🔥 NOVO parâmetro: criarMensalidade
    public ImportResultDTO importar(MultipartFile file, Aluno admin, boolean criarMensalidade) throws Exception {
        String nomeArquivo = file.getOriginalFilename();
        boolean isCsv = nomeArquivo != null && nomeArquivo.toLowerCase().endsWith(".csv");

        List<String[]> linhasBrutas = isCsv ? lerCsv(file) : lerExcel(file);

        ImportResultDTO resultado = new ImportResultDTO();
        List<ImportResultDTO.LinhaResultDTO> linhas = new ArrayList<>();
        int criados = 0, pendentes = 0, erros = 0;

        if (linhasBrutas.isEmpty()) {
            resultado.setTotalLinhas(0);
            resultado.setCriados(0);
            resultado.setCriadosComPendencia(0);
            resultado.setErros(0);
            resultado.setLinhas(linhas);
            return resultado;
        }

        Map<Integer, String> colunaParaCampo = mapearCabecalho(linhasBrutas.get(0));

        Set<String> nomesUsados = new HashSet<>();
        Set<String> emailsUsados = new HashSet<>();
        Set<String> cpfsUsados = new HashSet<>();

        // 🔥 NOVO: busca/cria o plano genérico UMA VEZ, fora do loop, só se for usar
        Plano planoImportado = criarMensalidade ? obterOuCriarPlanoImportado() : null;

        for (int i = 1; i < linhasBrutas.size(); i++) {
            String[] linhaBruta = linhasBrutas.get(i);
            if (linhaVazia(linhaBruta)) continue;

            Map<String, String> valores = extrairValores(linhaBruta, colunaParaCampo);
            ImportResultDTO.LinhaResultDTO linhaResult = new ImportResultDTO.LinhaResultDTO();
            linhaResult.setLinha(i + 1);
            String nome = valores.get("nome");
            linhaResult.setNome(nome);

            List<String> faltando = OBRIGATORIOS.stream()
                    .filter(campo -> vazio(valores.get(campo)))
                    .toList();

            if (!faltando.isEmpty()) {
                linhaResult.setStatus("ERRO");
                linhaResult.setMensagemErro("Campos obrigatórios ausentes: " + String.join(", ", faltando));
                erros++;
                linhas.add(linhaResult);
                continue;
            }

            String nomeNormalizado = normalizar(nome);
            if (nomesUsados.contains(nomeNormalizado) || ar.existsByNomeIgnoreCase(nome)) {
                linhaResult.setStatus("ERRO");
                linhaResult.setMensagemErro("Já existe um aluno com esse nome (duplicado)");
                erros++;
                linhas.add(linhaResult);
                continue;
            }

            String email = valores.get("email");
            boolean emailGerado = vazio(email);
            if (emailGerado) {
                email = gerarEmailUnico(nome, emailsUsados);
            } else if (ar.existsByEmail(email) || emailsUsados.contains(email.toLowerCase())) {
                linhaResult.setStatus("ERRO");
                linhaResult.setMensagemErro("Já existe um aluno com esse e-mail");
                erros++;
                linhas.add(linhaResult);
                continue;
            }
            linhaResult.setEmail(email);

            String cpfGerado = gerarCpfUnico(cpfsUsados);

            try {
                Aluno aluno = new Aluno();
                aluno.setNome(nome);
                aluno.setEmail(email);
                aluno.setCPF(cpfGerado);
                aluno.setObservacao(valores.get("observacoes"));

                alunoService.addAdmin(aluno, Optional.of(admin));

                nomesUsados.add(nomeNormalizado);
                emailsUsados.add(email.toLowerCase());
                cpfsUsados.add(cpfGerado);

                List<String> pendencias = new ArrayList<>();
                if (emailGerado) pendencias.add("email (gerado automaticamente, precisa completar)");
                pendencias.add("CPF (gerado automaticamente, precisa completar)");

                // 🔥 NOVO: tenta criar a mensalidade se o admin marcou a opção
                if (criarMensalidade) {
                    String valorStr = valores.get("valor");
                    String vencimentoStr = valores.get("vencimento");

                    if (vazio(valorStr) || vazio(vencimentoStr)) {
                        pendencias.add("mensalidade não criada: faltou valor ou vencimento na planilha");
                    } else {
                        try {
                            BigDecimal valor = new BigDecimal(valorStr.replace(",", "."));
                            LocalDate vencimento = LocalDate.parse(vencimentoStr, FORMATO_DATA);

                            criarMensalidadeImportada(aluno, valor, vencimento, admin,
                                    valores.get("observacoes"), planoImportado);

                            pendencias.add("mensalidade criada e marcada como paga: R$ " + valor
                                    + " até " + vencimento.format(FORMATO_DATA));
                        } catch (DateTimeParseException e) {
                            pendencias.add("mensalidade não criada: data de vencimento inválida (\"" + vencimentoStr + "\")");
                        } catch (NumberFormatException e) {
                            pendencias.add("mensalidade não criada: valor inválido (\"" + valorStr + "\")");
                        } catch (Exception e) {
                            pendencias.add("mensalidade não criada: " + e.getMessage());
                        }
                    }
                } else {
                    NAO_MAPEADOS.stream()
                            .filter(campo -> !vazio(valores.get(campo)))
                            .forEach(campo -> pendencias.add(campo + " (não importado, cadastre manualmente)"));
                }

                linhaResult.setStatus("PENDENTE");
                linhaResult.setCamposFaltando(pendencias);
                pendentes++;

            } catch (Exception e) {
                linhaResult.setStatus("ERRO");
                linhaResult.setMensagemErro("Falha ao salvar: " + e.getMessage());
                erros++;
            }

            linhas.add(linhaResult);
        }

        resultado.setTotalLinhas(linhas.size());
        resultado.setCriados(criados);
        resultado.setCriadosComPendencia(pendentes);
        resultado.setErros(erros);
        resultado.setLinhas(linhas);
        return resultado;
    }

    // ---------- geração de email baseado no nome ----------

    private String gerarEmailUnico(String nome, Set<String> emailsUsados) {
        String base = normalizar(nome).replaceAll("[^a-z ]", "").trim().replaceAll("\\s+", ".");
        if (base.isBlank()) base = "aluno";

        String candidato = base + "@pendente.2dassessoria.com.br";
        int sufixo = 2;
        while (ar.existsByEmail(candidato) || emailsUsados.contains(candidato.toLowerCase())) {
            candidato = base + sufixo + "@pendente.2dassessoria.com.br";
            sufixo++;
        }
        return candidato;
    }

    // ---------- geração de CPF placeholder ----------

    private String gerarCpfUnico(Set<String> cpfsUsados) {
        String candidato;
        do {
            candidato = gerarCpfAleatorio();
        } while (ar.existsByCPF(candidato) || cpfsUsados.contains(candidato));
        return candidato;
    }

    private String gerarCpfAleatorio() {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < 11; i++) {
            sb.append(RANDOM.nextInt(10));
        }
        return sb.toString();
    }

    // ---------- leitura de arquivo ----------

    private List<String[]> lerCsv(MultipartFile file) throws Exception {
        List<String[]> linhas = new ArrayList<>();
        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8))) {
            String linha;
            boolean primeira = true;
            String separador = ",";
            while ((linha = reader.readLine()) != null) {
                if (linha.isBlank()) continue;
                if (primeira) {
                    separador = linha.contains(";") ? ";" : (linha.contains("\t") ? "\t" : ",");
                    primeira = false;
                }
                linhas.add(splitCsvLine(linha, separador));
            }
        }
        return linhas;
    }

    private String[] splitCsvLine(String linha, String separador) {
        List<String> campos = new ArrayList<>();
        StringBuilder atual = new StringBuilder();
        boolean dentroAspas = false;
        char sep = separador.charAt(0);

        for (int i = 0; i < linha.length(); i++) {
            char c = linha.charAt(i);
            if (c == '"') {
                dentroAspas = !dentroAspas;
            } else if (c == sep && !dentroAspas) {
                campos.add(atual.toString().trim());
                atual.setLength(0);
            } else {
                atual.append(c);
            }
        }
        campos.add(atual.toString().trim());
        return campos.toArray(new String[0]);
    }

    private List<String[]> lerExcel(MultipartFile file) throws Exception {
        List<String[]> linhas = new ArrayList<>();
        try (Workbook wb = WorkbookFactory.create(file.getInputStream())) {
            Sheet sheet = wb.getSheetAt(0);
            for (Row row : sheet) {
                if (row == null) continue;
                short lastCell = row.getLastCellNum();
                if (lastCell <= 0) continue;

                String[] valores = new String[lastCell];
                for (int c = 0; c < lastCell; c++) {
                    Cell cell = row.getCell(c);
                    valores[c] = cell == null ? "" : cellToString(cell).trim();
                }
                linhas.add(valores);
            }
        }
        return linhas;
    }

    private String cellToString(Cell cell) {
        return switch (cell.getCellType()) {
            case STRING -> cell.getStringCellValue();
            case NUMERIC -> String.valueOf((long) cell.getNumericCellValue());
            case BOOLEAN -> String.valueOf(cell.getBooleanCellValue());
            default -> "";
        };
    }

    // ---------- mapeamento de colunas ----------

    private Map<Integer, String> mapearCabecalho(String[] headerRow) {
        Map<Integer, String> mapa = new HashMap<>();
        for (int col = 0; col < headerRow.length; col++) {
            String normalizado = normalizar(headerRow[col]);
            for (var entry : ALIASES.entrySet()) {
                if (entry.getValue().stream().anyMatch(a -> normalizar(a).equals(normalizado))) {
                    mapa.put(col, entry.getKey());
                    break;
                }
            }
        }
        return mapa;
    }

    private Map<String, String> extrairValores(String[] linha, Map<Integer, String> colunaParaCampo) {
        Map<String, String> valores = new HashMap<>();
        for (var entry : colunaParaCampo.entrySet()) {
            int col = entry.getKey();
            valores.put(entry.getValue(), col < linha.length ? linha[col].trim() : "");
        }
        return valores;
    }

    private String normalizar(String s) {
        if (s == null) return "";
        String semAcento = Normalizer.normalize(s, Normalizer.Form.NFD)
                .replaceAll("[\\p{InCombiningDiacriticalMarks}]", "");
        return semAcento.toLowerCase().trim().replaceAll("\\s+", " ");
    }

    private boolean vazio(String s) { return s == null || s.isBlank(); }

    private boolean linhaVazia(String[] linha) {
        for (String v : linha) {
            if (v != null && !v.isBlank()) return false;
        }
        return true;
    }

    // ---------- plano genérico pra mensalidades importadas ----------

    private Plano obterOuCriarPlanoImportado() {
        Plano existente = planoService.findByNome(NOME_PLANO_IMPORTADO);
        if (existente != null) return existente;

        Plano novo = new Plano();
        novo.setNome(NOME_PLANO_IMPORTADO);
        novo.setValor(BigDecimal.ZERO);
        novo.setDuracaomeses(1);
        novo.setAtivo(false);
        return planoService.salvar(novo);
    }

    // ---------- criação da mensalidade + parcela + confirmação ----------

    private void criarMensalidadeImportada(Aluno aluno, BigDecimal valor, LocalDate vencimento,
                                           Aluno admin, String observacao, Plano planoImportado) {
        LocalDate hoje = LocalDate.now();

        Mensalidade mensalidade = new Mensalidade();
        mensalidade.setAluno(aluno);
        mensalidade.setPlano(planoImportado);
        mensalidade.setDataInicio(hoje);
        mensalidade.setDataFim(vencimento);
        mensalidade.setValorMensalidade(valor);
        mensalidade.setValorParcela(valor);
        mensalidade.setStatusLiberacao("DESATIVADO"); // vira ATIVADO dentro do confirmarPagamentoManualAdmin
        mensalidade.setNumero_parcelas_restantes(1);
        mensalidade.setAtribuidoPorId(admin.getId());
        mensalidade.setAtribuidoPorNome(admin.getNome());
        mensalidade.setDataAtribuicao(LocalDateTime.now());

        Mensalidade mensalidadeSalva = mensalidadeService.add(mensalidade);

        Mensalidades_parcelas parcela = new Mensalidades_parcelas();
        parcela.setMensalidade(mensalidadeSalva);
        parcela.setNumeroParcela(1);
        parcela.setValor(valor);
        parcela.setDataVencimento(vencimento.atStartOfDay());
        parcela.setStatus("PENDENTE");

        Mensalidades_parcelas parcelaSalva = mensalidadesParcelasService.add(parcela);

        mensalidadeService.confirmarPagamentoManualAdmin(
                parcelaSalva.getId(),
                admin.getId(),
                admin.getNome(),
                "IMPORTACAO_MANUAL",
                observacao
        );
    }
}