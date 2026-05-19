import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const isRailway = window.location.hostname.includes("railway.app");
const API = process.env.REACT_APP_API_URL || "http://localhost:3001";
const BASE_URL = API;
// ─── Paleta de Cores Centralizada ───────────────────────────────────
const PALETTE = {
  bgRoot: "#0d0d0f",
  bgCard: "#111114",
  bgModal: "#141416",
  textPrimary: "#e8e6e1",
  accent: "#e8b44c", // Ouro / Mostarda principal

  // Tons de Cinza / Bordas
  borderLight: "#1e1e22",
  borderMedium: "#2a2a2e",
  borderUltraLight: "#141416",
  textMuted: "#888888",
  textDark: "#555555",
  textUltraDark: "#444444",
  borderDefault: "#333333",

  // Variações do Accent (Ouro) com Opacidade
  accentTabAlpha: "#e8b44c18",

  // Estados de Feedback e Badges (Fundo e Texto)
  success: "#4cde8c",
  successBg: "#1a3a2a",

  error: "#de4c4c",
  errorBg: "#2e1a1a",
  errorBorderAlpha: "#de4c4c44",

  warning: "#e8b44c", // Mesmo tom do accent para o estado pendente
  warningBg: "#2e2a1a",

  info: "#4ca8de",
  infoBg: "#1a2a3a",

  neutralMuted: "#666666",
  whitePure: "#ffffff",
};

// ─── estilos ─────────────────────────────────────────────────────────────────
const S = {
    root: {
        minHeight: "100vh", background: PALETTE.bgRoot, color: PALETTE.textPrimary,
        fontFamily: "'DM Mono', 'Fira Mono', monospace", display: "flex", flexDirection: "column",
    },
    topBar: {
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "18px 32px", borderBottom: `1px solid ${PALETTE.borderLight}`, background: PALETTE.bgRoot,
        position: "sticky", top: 0, zIndex: 100,
    },
    logo: { fontSize: 13, letterSpacing: "0.25em", color: PALETTE.accent, textTransform: "uppercase", fontWeight: 700 },
    tabs: { display: "flex", gap: 4, flexWrap: "wrap" },
    tab: (active) => ({
        padding: "7px 18px", borderRadius: 4,
        border: active ? `1px solid ${PALETTE.accent}` : `1px solid ${PALETTE.borderMedium}`,
        background: active ? PALETTE.accentTabAlpha : "transparent",
        color: active ? PALETTE.accent : PALETTE.textMuted,
        fontSize: 12, letterSpacing: "0.12em", cursor: "pointer",
        textTransform: "uppercase", transition: "all .18s",
    }),
    body: { flex: 1, padding: "32px", maxWidth: 1200, margin: "0 auto", width: "100%" },
    sectionTitle: {
        fontSize: 11, letterSpacing: "0.3em", color: PALETTE.textDark, textTransform: "uppercase",
        marginBottom: 20, borderBottom: `1px solid ${PALETTE.borderLight}`, paddingBottom: 10,
    },
    searchRow: { display: "flex", gap: 8, marginBottom: 24, alignItems: "center" },
    input: {
        flex: 1, background: PALETTE.bgCard, border: `1px solid ${PALETTE.borderMedium}`, borderRadius: 4,
        color: PALETTE.textPrimary, padding: "9px 14px", fontSize: 13, fontFamily: "inherit", outline: "none",
    },
    btnPrimary: {
        padding: "9px 20px", background: PALETTE.accent, color: PALETTE.bgRoot, border: "none",
        borderRadius: 4, fontFamily: "inherit", fontSize: 12, letterSpacing: "0.1em",
        textTransform: "uppercase", cursor: "pointer", fontWeight: 700,
    },
    btnGhost: {
        padding: "9px 20px", background: "transparent", color: PALETTE.textMuted,
        border: `1px solid ${PALETTE.borderMedium}`, borderRadius: 4, fontFamily: "inherit",
        fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer",
    },
    table: { width: "100%", borderCollapse: "collapse", fontSize: 13 },
    th: {
        textAlign: "left", padding: "10px 14px", fontSize: 10, letterSpacing: "0.2em",
        color: PALETTE.textDark, textTransform: "uppercase", borderBottom: `1px solid ${PALETTE.borderLight}`,
    },
    td: { padding: "12px 14px", borderBottom: `1px solid ${PALETTE.borderUltraLight}`, verticalAlign: "middle" },
    rowHover: { background: PALETTE.bgCard, cursor: "pointer", transition: "background .15s" },
    badge: (tipo) => {
        const map = {
            ATIVADO:    { bg: PALETTE.successBg, color: PALETTE.success },
            DESATIVADO: { bg: PALETTE.errorBg, color: PALETTE.error },
            FINALIZADO: { bg: PALETTE.successBg, color: PALETTE.success },
            PENDENTE:   { bg: PALETTE.warningBg, color: PALETTE.warning },
            AGUARDANDO: { bg: PALETTE.infoBg, color: PALETTE.info },
            CANCELADO:  { bg: PALETTE.errorBg, color: PALETTE.error },
            TRUE:       { bg: PALETTE.infoBg, color: PALETTE.info },
            FALSE:      { bg: PALETTE.borderMedium, color: PALETTE.neutralMuted },
        };
        const s = map[tipo] || map.FALSE;
        return {
            ...s, display: "inline-block", padding: "3px 10px", borderRadius: 3,
            fontSize: 11, letterSpacing: "0.12em", fontWeight: 700,
        };
    },
    badgeClickable: (tipo) => ({
        display: "inline-block", padding: "3px 10px", borderRadius: 3,
        fontSize: 11, letterSpacing: "0.12em", fontWeight: 700, cursor: "pointer",
        transition: "opacity .15s",
        ...(tipo === "ATIVADO"    ? { bg: PALETTE.successBg, color: PALETTE.success, background: PALETTE.successBg } :
            tipo === "DESATIVADO" ? { bg: PALETTE.errorBg, color: PALETTE.error, background: PALETTE.errorBg } :
            tipo === "TRUE"       ? { bg: PALETTE.infoBg, color: PALETTE.info, background: PALETTE.infoBg } :
                                    { bg: PALETTE.borderMedium, color: PALETTE.neutralMuted, background: PALETTE.borderMedium }),
    }),
    btnLink: {
        background: "transparent", border: `1px solid ${PALETTE.borderMedium}`, borderRadius: 3,
        color: PALETTE.accent, padding: "4px 12px", fontSize: 11, letterSpacing: "0.1em",
        cursor: "pointer", fontFamily: "inherit", textTransform: "uppercase",
    },
    cardGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))", gap: 16, marginBottom: 36 },
    card: { background: PALETTE.bgCard, border: `1px solid ${PALETTE.borderLight}`, borderRadius: 6, padding: "20px 22px" },
    cardLabel: { fontSize: 10, letterSpacing: "0.25em", color: PALETTE.textDark, textTransform: "uppercase", marginBottom: 8 },
    cardValue: { fontSize: 28, fontWeight: 700, color: PALETTE.accent, lineHeight: 1 },
    cardSub: { fontSize: 12, color: PALETTE.textUltraDark, marginTop: 4 },
    barRow: { marginBottom: 12 },
    barLabel: { display: "flex", justifyContent: "space-between", fontSize: 12, color: PALETTE.textMuted, marginBottom: 5 },
    barTrack: { height: 6, background: PALETTE.borderLight, borderRadius: 3, overflow: "hidden" },
    barFill: (pct) => ({ height: "100%", width: `${pct}%`, background: PALETTE.accent, borderRadius: 3, transition: "width .6s ease" }),
    tokenBox: { background: PALETTE.bgCard, border: `1px solid ${PALETTE.borderLight}`, borderRadius: 6, padding: "28px 32px", maxWidth: 560 },
    tokenLabel: { fontSize: 10, letterSpacing: "0.25em", color: PALETTE.textDark, textTransform: "uppercase", marginBottom: 8, display: "block" },
    tokenInput: {
        width: "100%", background: PALETTE.bgRoot, border: `1px solid ${PALETTE.borderMedium}`, borderRadius: 4,
        color: PALETTE.textPrimary, padding: "10px 14px", fontSize: 13,
        fontFamily: "'DM Mono', 'Fira Mono', monospace", outline: "none", boxSizing: "border-box", marginBottom: 16,
    },
    tokenStatus: (ok) => ({ fontSize: 12, color: ok ? PALETTE.success : PALETTE.error, marginTop: 10, letterSpacing: "0.05em" }),
    overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200 },
    modal: { background: PALETTE.bgModal, border: `1px solid ${PALETTE.borderMedium}`, borderRadius: 8, padding: "32px 36px", minWidth: 320, textAlign: "center" },
    modalTitle: { fontSize: 14, letterSpacing: "0.2em", textTransform: "uppercase", color: PALETTE.accent, marginBottom: 10 },
    modalText: { color: PALETTE.textMuted, fontSize: 13, marginBottom: 24 },
    modalRow: { display: "flex", gap: 10, justifyContent: "center" },
    erro: { background: PALETTE.errorBg, border: `1px solid ${PALETTE.errorBorderAlpha}`, color: PALETTE.error, borderRadius: 4, padding: "10px 16px", fontSize: 13, marginBottom: 20 },

    // ── parcelas por aluno ──
    alunoCard: {
        background: PALETTE.bgCard, border: `1px solid ${PALETTE.borderLight}`, borderRadius: 6,
        marginBottom: 4, overflow: "hidden",
    },
    alunoCardHeader: {
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "14px 20px", cursor: "pointer", transition: "background .15s",
    },
    parcelasContainer: { borderTop: "1px solid ${PALETTE.borderLight}" },
    parcelaRow: (status) => {
        const cores = {
            FINALIZADO: { border: PALETTE.success },
            PENDENTE:   { border: PALETTE.warning },
            AGUARDANDO: { border: PALETTE.info },
            CANCELADO:  { border: PALETTE.error },
        };
        return {
            display: "grid",
            gridTemplateColumns: "40px 1fr 1fr 140px",
            alignItems: "center",
            padding: "10px 20px 10px 32px",
            borderLeft: `3px solid ${(cores[status] || { border: PALETTE.borderDefault }).border}`,
            borderBottom: `1px solid ${PALETTE.borderUltraLight}`,
            fontSize: 12,
        };
    },

    // ── canceladas ──
    canceladaCard: {
        background: PALETTE.bgCard, border: `1px solid ${PALETTE.errorBg}`, borderRadius: 6,
        marginBottom: 8, padding: "20px 24px",
    },
    canceladaHeader: {
        display: "flex", justifyContent: "space-between", alignItems: "flex-start",
        marginBottom: 14, flexWrap: "wrap", gap: 8,
    },
    canceladaGrid: {
        display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
        gap: 12, marginTop: 12,
    },
    canceladaField: { background: PALETTE.bgRoot, border: `1px solid ${PALETTE.borderLight}`, borderRadius: 4, padding: "10px 14px" },
    canceladaFieldLabel: { fontSize: 9, letterSpacing: "0.25em", color: PALETTE.textDark, textTransform: "uppercase", marginBottom: 4 },
    canceladaFieldValue: { fontSize: 13, color: PALETTE.textPrimary },

    progressBar: (pct) => ({
        height: 4, background: PALETTE.borderLight, borderRadius: 2, overflow: "hidden", marginTop: 8,
        position: "relative",
    }),
    progressFill: (pct, color) => ({
        height: "100%", width: `${Math.min(pct, 100)}%`,
        background: color || PALETTE.success, borderRadius: 2, transition: "width .5s ease",
    }),
};

// ─── badge helper ──────────────────────────────────────────────────────────────
function Badge({ status }) {
    const map = {
        ATIVADO:    { bg: "#1a3a2a", color: "#4cde8c" },
        DESATIVADO: { bg: "#2e1a1a", color: "#de4c4c" },
        FINALIZADO: { bg: "#1a3a2a", color: "#4cde8c" },
        PENDENTE:   { bg: "#2e2a1a", color: "#e8b44c" },
        AGUARDANDO: { bg: "#1a2a3a", color: "#4ca8de" },
        CANCELADO:  { bg: "#2e1a1a", color: "#de4c4c" },
    };
    const s = map[String(status).toUpperCase()] || { bg: "#2a2a2e", color: "#666" };
    return (
        <span style={{
            display: "inline-block", padding: "3px 10px", borderRadius: 3,
            fontSize: 11, letterSpacing: "0.12em", fontWeight: 700,
            background: s.bg, color: s.color,
        }}>
            {status}
        </span>
    );
}

// ─── linha de info para canceladas ────────────────────────────────────────────
function Campo({ label, value, color }) {
    return (
        <div style={S.canceladaField}>
            <div style={S.canceladaFieldLabel}>{label}</div>
            <div style={{ ...S.canceladaFieldValue, color: color || "#e8e6e1" }}>{value ?? "—"}</div>
        </div>
    );
}

function fmtData(iso) {
    if (!iso) return "—";
    try { return new Date(iso).toLocaleDateString("pt-BR"); } catch { return iso; }
}

function fmtMoeda(v) {
    if (v === null || v === undefined) return "—";
    return `R$ ${Number(v).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;
}

// ═══════════════════════════════════════════════════════════════════════════════
// ABA: PARCELAS POR ALUNO
// ═══════════════════════════════════════════════════════════════════════════════
function AbaParcelas({ token, allAlunos, navigate }) {
    const [busca, setBusca]             = useState("");
    const [expandido, setExpandido]     = useState(null);
    const [parcelas, setParcelas]       = useState({});   // { idAluno: dadosMensalidade }
    const [carregando, setCarregando]   = useState({});
    const [erroLocal, setErroLocal]     = useState("");

    const alunosFiltrados = busca.trim()
        ? allAlunos.filter(a =>
            a.nome.toLowerCase().includes(busca.toLowerCase()) ||
            a.email.toLowerCase().includes(busca.toLowerCase())
          )
        : allAlunos;

    async function toggleAluno(id) {
        if (expandido === id) { setExpandido(null); return; }
        setExpandido(id);
        if (parcelas[id]) return; // já carregou

        setCarregando(c => ({ ...c, [id]: true }));
        try {
            const res = await fetch(`${BASE_URL}/mensalidades/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                const data = await res.json();
                setParcelas(p => ({ ...p, [id]: data }));
            } else {
                setParcelas(p => ({ ...p, [id]: null }));
            }
        } catch {
            setErroLocal("Erro ao buscar parcelas.");
        } finally {
            setCarregando(c => ({ ...c, [id]: false }));
        }
    }

    return (
        <>
            <p style={S.sectionTitle}>Parcelas por Aluno</p>
            {erroLocal && <div style={S.erro}>{erroLocal}</div>}

            <div style={S.searchRow}>
                <input
                    style={S.input}
                    placeholder="Pesquise por nome ou e-mail..."
                    value={busca}
                    onChange={e => setBusca(e.target.value)}
                />
                {busca && <button style={S.btnGhost} onClick={() => setBusca("")}>Limpar</button>}
            </div>

            {alunosFiltrados.length === 0 && (
                <p style={{ color: "#555", fontSize: 13, textAlign: "center", marginTop: 32 }}>nenhum resultado</p>
            )}

            {alunosFiltrados.map(aluno => {
                const aberto = expandido === aluno.id;
                const dados  = parcelas[aluno.id];
                const load   = carregando[aluno.id];

                // contagens rápidas
                const listaP = dados?.parcelas ?? [];
                const pagas   = listaP.filter(p => p.status === "FINALIZADO").length;
                const total   = listaP.length;
                const pct     = total > 0 ? Math.round((pagas / total) * 100) : 0;

                return (
                    <div key={aluno.id} style={S.alunoCard}>
                        {/* cabeçalho clicável */}
                        <div
                            style={S.alunoCardHeader}
                            onClick={() => toggleAluno(aluno.id)}
                            onMouseEnter={e => e.currentTarget.style.background = "#18181b"}
                            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                        >
                            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                                <span style={{ fontSize: 13, color: "#e8e6e1" }}>{aluno.nome}</span>
                                <span style={{ fontSize: 11, color: "#555" }}>{aluno.email}</span>
                                {dados && (
                                    <div style={{ marginTop: 6 }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#888", marginBottom: 3 }}>
                                            <span>{dados.nomePlano || "—"}</span>
                                            <span style={{ color: "#4cde8c" }}>{pagas}/{total} pagas</span>
                                        </div>
                                        <div style={S.progressBar(pct)}>
                                            <div style={S.progressFill(pct, "#4cde8c")} />
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                <Badge status={aluno.statusAssinatura} />
                                <span style={{ color: "#555", fontSize: 16 }}>{aberto ? "▲" : "▼"}</span>
                            </div>
                        </div>

                        {/* conteúdo expandido */}
                        {aberto && (
                            <div style={S.parcelasContainer}>
                                {load && (
                                    <p style={{ color: "#555", fontSize: 12, padding: "16px 20px", textAlign: "center" }}>
                                        carregando parcelas…
                                    </p>
                                )}

                                {!load && dados === null && (
                                    <p style={{ color: "#555", fontSize: 12, padding: "16px 20px", textAlign: "center" }}>
                                        nenhuma mensalidade encontrada para este aluno
                                    </p>
                                )}

                                {!load && dados && (
                                    <>
                                        {/* resumo da mensalidade */}
                                        <div style={{
                                            display: "flex", gap: 24, padding: "12px 20px 12px 32px",
                                            background: "#0d0d0f", borderBottom: "1px solid #1e1e22",
                                            flexWrap: "wrap",
                                        }}>
                                            <InfoMini label="Plano"       value={dados.nomePlano} />
                                            <InfoMini label="Valor mensal" value={fmtMoeda(dados.valorMensalidade)} color="#e8b44c" />
                                            <InfoMini label="Início"       value={fmtData(dados.dataInicio)} />
                                            <InfoMini label="Fim"          value={fmtData(dados.dataFim)} />
                                            <InfoMini label="Status"       value={dados.statusLiberacao} color={dados.statusLiberacao === "ATIVADO" ? "#4cde8c" : "#de4c4c"} />
                                            <InfoMini label="Pagas"        value={`${pagas} / ${total}`} color="#4cde8c" />
                                        </div>

                                        {/* cabeçalho da tabela de parcelas */}
                                        <div style={{
                                            display: "grid", gridTemplateColumns: "40px 1fr 1fr 140px",
                                            padding: "8px 20px 8px 32px", borderBottom: "1px solid #1e1e22",
                                        }}>
                                            {["#", "Vencimento", "Valor", "Status"].map(h => (
                                                <span key={h} style={{ fontSize: 9, letterSpacing: "0.2em", color: "#555", textTransform: "uppercase" }}>{h}</span>
                                            ))}
                                        </div>

                                        {listaP.length === 0 && (
                                            <p style={{ color: "#555", fontSize: 12, padding: "16px 32px" }}>sem parcelas registradas</p>
                                        )}

                                        {listaP.map((p, i) => (
                                            <div key={p.id} style={S.parcelaRow(p.status)}>
                                                <span style={{ color: "#444", fontSize: 11 }}>#{i + 1}</span>
                                                <span style={{ color: "#aaa" }}>{fmtData(p.dataVencimento)}</span>
                                                <span style={{ color: "#e8b44c" }}>{fmtMoeda(p.valor)}</span>
                                                <Badge status={p.status} />
                                            </div>
                                        ))}

                                        <div style={{ padding: "10px 20px", display: "flex", justifyContent: "flex-end" }}>
                                            <button
                                                style={S.btnLink}
                                                onClick={() => navigate(`/home/conta/${aluno.id}?admin=true`)}
                                            >
                                                Ver perfil completo →
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                );
            })}
        </>
    );
}

function InfoMini({ label, value, color }) {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <span style={{ fontSize: 9, letterSpacing: "0.2em", color: "#555", textTransform: "uppercase" }}>{label}</span>
            <span style={{ fontSize: 12, color: color || "#e8e6e1" }}>{value ?? "—"}</span>
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ABA: CANCELADAS
// ═══════════════════════════════════════════════════════════════════════════════
function AbaCanceladas({ token }) {
    const [canceladas, setCanceladas] = useState([]);
    const [busca, setBusca]           = useState("");
    const [carregando, setCarregando] = useState(false);
    const [erro, setErro]             = useState("");
    const [expandido, setExpandido]   = useState(null);

    useEffect(() => {
        buscarCanceladas();
    }, []);

    async function buscarCanceladas() {
        setCarregando(true);
        try {
            const res = await fetch(`${BASE_URL}/mensalidades/canceladas`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                const data = await res.json();
                setCanceladas(data);
            } else {
                setErro("Erro ao buscar cancelamentos. Verifique se o endpoint /mensalidades/canceladas existe no backend.");
            }
        } catch {
            setErro("Falha na conexão ao buscar cancelamentos.");
        } finally {
            setCarregando(false);
        }
    }

    const filtradas = busca.trim()
        ? canceladas.filter(c =>
            c.nomeAluno?.toLowerCase().includes(busca.toLowerCase()) ||
            c.emailAluno?.toLowerCase().includes(busca.toLowerCase()) ||
            c.nomePlano?.toLowerCase().includes(busca.toLowerCase())
          )
        : canceladas;

    // totalizadores
    const totalCancelados    = canceladas.length;
    const totalParcelasPagas = canceladas.reduce((s, c) => s + (c.parcelasPagas || 0), 0);
    const receitaRealizada   = canceladas.reduce((s, c) => {
        return s + (Number(c.valorParcela || 0) * (c.parcelasPagas || 0));
    }, 0);

    return (
        <>
            <p style={S.sectionTitle}>Assinaturas Canceladas</p>
            {erro && <div style={S.erro}>{erro}</div>}

            {/* cards resumo */}
            <div style={S.cardGrid}>
                <div style={S.card}>
                    <div style={S.cardLabel}>Total Cancelados</div>
                    <div style={S.cardValue}>{totalCancelados}</div>
                    <div style={S.cardSub}>assinaturas encerradas</div>
                </div>
                <div style={S.card}>
                    <div style={S.cardLabel}>Parcelas Pagas (total)</div>
                    <div style={S.cardValue}>{totalParcelasPagas}</div>
                    <div style={S.cardSub}>antes do cancelamento</div>
                </div>
                <div style={S.card}>
                    <div style={S.cardLabel}>Receita Realizada</div>
                    <div style={S.cardValue} style={{ fontSize: 20, fontWeight: 700, color: "#e8b44c", lineHeight: 1 }}>
                        {fmtMoeda(receitaRealizada)}
                    </div>
                    <div style={S.cardSub}>de assinaturas canceladas</div>
                </div>
            </div>

            {/* busca */}
            <div style={S.searchRow}>
                <input
                    style={S.input}
                    placeholder="Pesquise por nome, e-mail ou plano..."
                    value={busca}
                    onChange={e => setBusca(e.target.value)}
                />
                {busca && <button style={S.btnGhost} onClick={() => setBusca("")}>Limpar</button>}
                <button style={S.btnPrimary} onClick={buscarCanceladas}>↻ Atualizar</button>
            </div>

            {carregando && (
                <p style={{ color: "#555", fontSize: 12, textAlign: "center", padding: "32px 0" }}>carregando…</p>
            )}

            {!carregando && filtradas.length === 0 && !erro && (
                <p style={{ color: "#555", fontSize: 13, textAlign: "center", padding: "32px 0" }}>
                    {busca ? "nenhum resultado para a busca" : "nenhum cancelamento registrado"}
                </p>
            )}

            {!carregando && filtradas.map(c => {
                const aberto = expandido === c.id;
                const pct    = c.totalParcelasContratadas > 0
                    ? Math.round((c.parcelasPagas / c.totalParcelasContratadas) * 100)
                    : 0;

                return (
                    <div key={c.id} style={S.canceladaCard}>
                        {/* cabeçalho */}
                        <div
                            style={{ ...S.canceladaHeader, cursor: "pointer" }}
                            onClick={() => setExpandido(aberto ? null : c.id)}
                        >
                            <div>
                                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                                    <span style={{ fontSize: 14, color: "#e8e6e1", fontWeight: 600 }}>{c.nomeAluno}</span>
                                    <span style={{
                                        display: "inline-block", padding: "2px 8px", borderRadius: 3,
                                        fontSize: 10, letterSpacing: "0.12em", fontWeight: 700,
                                        background: "#2e1a1a", color: "#de4c4c",
                                    }}>
                                        {c.motivoCancelamento || "CANCELADO"}
                                    </span>
                                </div>
                                <span style={{ fontSize: 11, color: "#555" }}>{c.emailAluno}</span>
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
                                <span style={{ fontSize: 11, color: "#666" }}>
                                    Cancelado em: <span style={{ color: "#e8b44c" }}>{fmtData(c.dataCancelamento)}</span>
                                </span>
                                <span style={{ fontSize: 16, color: "#555" }}>{aberto ? "▲" : "▼"}</span>
                            </div>
                        </div>

                        {/* barra de progresso de parcelas */}
                        <div style={{ marginBottom: 12 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#888", marginBottom: 4 }}>
                                <span>{c.nomePlano || "—"}</span>
                                <span>
                                    <span style={{ color: "#4cde8c" }}>{c.parcelasPagas}</span>
                                    <span style={{ color: "#555" }}> pagas / </span>
                                    <span style={{ color: "#e8e6e1" }}>{c.totalParcelasContratadas} contratadas</span>
                                </span>
                            </div>
                            <div style={S.progressBar(pct)}>
                                <div style={S.progressFill(pct, "#4cde8c")} />
                            </div>
                        </div>

                        {/* detalhes expandidos */}
                        {aberto && (
                            <div style={{ marginTop: 16, borderTop: "1px solid #1e1e22", paddingTop: 16 }}>
                                <div style={S.canceladaGrid}>
                                    <Campo label="Plano"                    value={c.nomePlano} />
                                    <Campo label="Valor mensal"             value={fmtMoeda(c.valorMensalidade)} color="#e8b44c" />
                                    <Campo label="Valor por parcela"        value={fmtMoeda(c.valorParcela)} color="#e8b44c" />
                                    <Campo label="Início da assinatura"     value={fmtData(c.dataInicio)} />
                                    <Campo label="Fim original previsto"    value={fmtData(c.dataFim)} />
                                    <Campo label="Último mês pago até"      value={fmtData(c.dataFimEfetiva)} color="#4ca8de" />
                                    <Campo label="Parcelas pagas"           value={`${c.parcelasPagas} de ${c.totalParcelasContratadas}`} color="#4cde8c" />
                                    <Campo label="Parcelas canceladas"      value={c.parcelasRestantesNoCancelamento} color="#de4c4c" />
                                    <Campo label="Cancelado por"            value={c.canceladoPorNome} />
                                    <Campo label="Motivo"                   value={c.motivoCancelamento} />
                                </div>

                                {/* IDs das parcelas pagas */}
                                {c.parcelasPagasIds && (
                                    <div style={{ marginTop: 12 }}>
                                        <div style={{ fontSize: 9, letterSpacing: "0.2em", color: "#555", textTransform: "uppercase", marginBottom: 6 }}>
                                            IDs das parcelas pagas
                                        </div>
                                        <div style={{
                                            background: "#0d0d0f", border: "1px solid #1e1e22", borderRadius: 4,
                                            padding: "8px 12px", fontSize: 11, color: "#4cde8c",
                                            letterSpacing: "0.05em", fontFamily: "monospace",
                                        }}>
                                            {c.parcelasPagasIds}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                );
            })}
        </>
    );
}


// ═══════════════════════════════════════════════════════════════════════════════
// ABA: PLANOS
// ═══════════════════════════════════════════════════════════════════════════════
function AbaPlanos({ token }) {
    const [planos, setPlanos]       = useState([]);
    const [editando, setEditando]   = useState(null); // { id, nome, valor, duracao }
    const [salvando, setSalvando]   = useState(false);
    const [status, setStatus]       = useState(null); // { id, ok }
    const [erro, setErro]           = useState("");

    useEffect(() => { carregarPlanos(); }, []);

    async function carregarPlanos() {
        const res = await fetch(`${BASE_URL}/planos`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        console.log("plano[0]:", data[0]); // ← veja no console quais chaves chegam
        setPlanos(data);
    }

    async function salvarPlano() {
        if (!editando) return;
        setSalvando(true); setStatus(null);
        try {
            const res = await fetch(`${BASE_URL}/planos/${editando.id}`, {
                method: "PUT",
                headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
                body: JSON.stringify({
                    nome:    editando.nome,
                    valor:   parseFloat(editando.valor),
                    duracaomeses: parseInt(editando.duracaomeses), 
                }),
            });
            if (res.ok) {
                const atualizado = await res.json();
                setPlanos(prev => prev.map(p => p.id === atualizado.id ? atualizado : p));
                setStatus({ id: editando.id, ok: true });
                setEditando(null);
            } else {
                setStatus({ id: editando.id, ok: false });
            }
        } catch { setStatus({ id: editando?.id, ok: false }); }
        finally {
            setSalvando(false);
            setTimeout(() => setStatus(null), 3000);
        }
    }

    return (
        <>
            <p style={S.sectionTitle}>Gerenciar Planos</p>
            {erro && <div style={S.erro}>{erro}</div>}

            <div style={{
                background: "#0d0d0f", border: "1px solid #1e2a1e",
                borderRadius: 4, padding: "10px 16px", marginBottom: 24,
                fontSize: 11, color: "#4cde8c", letterSpacing: "0.05em",
            }}>
                ⚠ Alterações afetam apenas <strong>novas assinaturas</strong>. Assinaturas existentes mantêm o valor e parcelas originais.
            </div>

            {planos.map(plano => {
                const emEdicao = editando?.id === plano.id;
                const ok = status?.id === plano.id && status?.ok;
                const err = status?.id === plano.id && !status?.ok;

                return (
                    <div key={plano.id} style={{
                        ...S.tokenBox,
                        marginBottom: 16,
                        borderColor: emEdicao ? "#4cde8c44" : "#1e1e22",
                    }}>
                        {/* cabeçalho */}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                <span style={{
                                    fontSize: 10, letterSpacing: "0.2em", color: "#444",
                                    textTransform: "uppercase",
                                }}>
                                    #{plano.id}
                                </span>
                                <span style={{ fontSize: 14, color: "#e8e6e1", fontWeight: 600 }}>
                                    {plano.nome}
                                </span>
                            </div>
                            {!emEdicao && (
                                <button
                                    style={S.btnGhost}
                                    onClick={() => setEditando({
                                        id: plano.id,
                                        nome: plano.nome,
                                        valor: plano.valor,
                                        duracaomeses: plano.duracaomeses,
                                    })}
                                >
                                    ✏ Editar
                                </button>
                            )}
                        </div>

                        {/* valores atuais */}
                        {!emEdicao && (
                            <div style={{ display: "flex", gap: 32 }}>
                                <InfoMini label="Valor mensal"   value={fmtMoeda(plano.valor)}             color="#e8b44c" />
                                <InfoMini label="Duração"        value={`${plano.duracaomeses} mês(es)`} />
                                <InfoMini label="Nº de parcelas" value={plano.duracaomeses} color="#4cde8c" />

                            </div>
                        )}

                        {/* formulário de edição */}
                        {emEdicao && (
                            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                                    {/* nome */}
                                    <div>
                                        <div style={{ fontSize: 9, letterSpacing: "0.2em", color: "#555", textTransform: "uppercase", marginBottom: 6 }}>
                                            Nome do plano
                                        </div>
                                        <input
                                            style={{ ...S.input, margin: 0 }}
                                            value={editando.nome}
                                            onChange={e => setEditando(ed => ({ ...ed, nome: e.target.value }))}
                                        />
                                    </div>

                                    {/* valor */}
                                    <div>
                                        <div style={{ fontSize: 9, letterSpacing: "0.2em", color: "#555", textTransform: "uppercase", marginBottom: 6 }}>
                                            Valor mensal (R$)
                                        </div>
                                        <input
                                            style={{ ...S.input, margin: 0, color: "#e8b44c" }}
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={editando.valor}
                                            onChange={e => setEditando(ed => ({ ...ed, valor: e.target.value }))}
                                        />
                                    </div>

                                    {/* duração */}
                                    <div>
                                        <div style={{ fontSize: 9, letterSpacing: "0.2em", color: "#555", textTransform: "uppercase", marginBottom: 6 }}>
                                            Duração / parcelas (meses)
                                        </div>
                                        <input
                                            style={{ ...S.input, margin: 0, color: "#4cde8c" }}
                                            type="number"
                                            min="1"
                                            step="1"
                                            value={editando.duracaomeses}
                                            onChange={e => setEditando(ed => ({ ...ed, duracaomeses: e.target.value }))}
                                        />
                                    </div>
                                </div>

                                {/* preview */}
                                <div style={{
                                    background: "#0d0d0f", border: "1px solid #1e1e22",
                                    borderRadius: 4, padding: "10px 14px",
                                    fontSize: 11, color: "#666", letterSpacing: "0.05em",
                                }}>
                                    Preview → <span style={{ color: "#e8e6e1" }}>{editando.nome}</span>
                                    {" · "}
                                    <span style={{ color: "#e8b44c" }}>{fmtMoeda(editando.valor)}/mês</span>
                                    {" · "}
                                    <span style={{ color: "#4cde8c" }}>{editando.duracaomeses} parcela(s)</span>
                                    {" = "}
                                    <span style={{ color: "#e8e6e1" }}>
                                        {fmtMoeda(editando.valor * editando.duracaomeses)} total
                                    </span>
                                </div>

                                {/* botões */}
                                <div style={{ display: "flex", gap: 10 }}>
                                    <button style={S.btnPrimary} onClick={salvarPlano} disabled={salvando}>
                                        {salvando ? "Salvando…" : "✓ Salvar"}
                                    </button>
                                    <button style={S.btnGhost} onClick={() => setEditando(null)}>
                                        Cancelar
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* feedback */}
                        {ok  && <div style={S.tokenStatus(true)}>✓ Plano atualizado com sucesso.</div>}
                        {err && <div style={S.tokenStatus(false)}>✗ Erro ao salvar. Tente novamente.</div>}
                    </div>
                );
            })}
        </>
    );
}


// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENTE PRINCIPAL
// ═══════════════════════════════════════════════════════════════════════════════
export default function Conta() {
    const token = localStorage.getItem("token");
    const [autenticado, setAutenticado] = useState(false);
    const [verificando, setVerificando] = useState(true);

    const navigate = useNavigate();

    const [aba, setAba]     = useState("alunos");
    const [erro, setErro]   = useState("");

    const [allAlunos, setAllAlunos]         = useState([]);
    const [inputBusca, setInputBusca]       = useState("");
    const [carregando, setCarregando]       = useState(false);
    const [rowHover, setRowHover]           = useState(null);
    const [modal, setModal]                 = useState(null);
    const [relatorio, setRelatorio]         = useState([]);
    const [tokenAtual, setTokenAtual]       = useState("");
    const [tokenInput, setTokenInput]       = useState("");
    const [tokenStatus, setTokenStatus]     = useState(null);
    const [salvandoToken, setSalvandoToken] = useState(false);
    const [vendas, setVendas]               = useState([]);
    const [acessoNegado, setAcessoNegado] = useState(false);

const [credentials, setCredentials] = useState({
    mpaccesstoken: "", mppublickey: "", mpclientsecret: "", mpclientid: "",
    mpaccesstokentest: "", mppublickeytest: "", mpambiente: "PRODUCAO"
});
const [credAtual, setCredAtual] = useState({});
const [salvando, setSalvando]   = useState(false);
const [statusSalvo, setStatusSalvo] = useState(null);


    useEffect(() => {
    if (!token) { navigate("/login"); return; }

    fetch(`${BASE_URL}/alunos/me`, {
        headers: { Authorization: `Bearer ${token}` }
    })
        .then(res => {
            if (!res.ok) {
                localStorage.removeItem("token");
                navigate("/login");
                throw new Error();
            }
            return res.json();
        })
        .then(data => {
            if (data.tipoUsuario !== "ADMIN") {
                setAcessoNegado(true);   // ← em vez de redirecionar, mostra tela
                return;
            }
            setAutenticado(true);
            pegarAlunos();
            pegarRelatorio();
            pegarTokenAtual();
            pegarUltimasVendas();
        })
        .catch(() => {})
        .finally(() => setVerificando(false));
}, []);


    async function pegarAlunos() {
        try {
            const res = await fetch(`${BASE_URL}/alunos`, { headers: { Authorization: `Bearer ${token}` } });
            if (res.ok) setAllAlunos(await res.json());
            else setErro("Erro ao pegar usuários.");
        } catch { setErro("Falha na conexão ao buscar alunos."); }
    }

    async function pegarRelatorio() {
        try {
            const res = await fetch(`${BASE_URL}/alunos/qtdd-aluno-por-plano`, { headers: { Authorization: `Bearer ${token}` } });
            if (res.ok) setRelatorio(await res.json());
            else setErro("Erro ao carregar relatório.");
        } catch { setErro("Erro ao carregar relatório."); }
    }

    // ✅ correto — carrega tudo no credAtual
    async function pegarTokenAtual() {
        try {
            const res = await fetch(`${BASE_URL}/configuracao`, { headers: { Authorization: `Bearer ${token}` } });
            if (res.ok) {
                const d = await res.json();
                setTokenAtual(d.mpaccesstoken); // mantém compatibilidade se usar em outro lugar
                setCredAtual({
                    mpaccesstoken:     d.mpaccesstoken     || "",
                    mppublickey:       d.mppublickey       || "",
                    mpclientid:        d.mpclientid        || "",
                    mpclientsecret:    d.mpclientsecret    || "",
                    mpaccesstokentest: d.mpaccesstokentest || "",
                    mppublickeytest:   d.mppublickeytest   || "",
                    mpambiente:        d.mpambiente        || "PRODUCAO",
                });
            } else setErro("Erro ao buscar configurações.");
        } catch { setErro("Erro ao buscar configurações."); }
    }
    
    async function pegarUltimasVendas() {
        try {
            setCarregando(true);
            const res = await fetch(`${BASE_URL}/pagamentos/ultimas-vendas`, { headers: { Authorization: `Bearer ${token}` } });
            if (res.ok) setVendas(await res.json());
            else setErro("Erro ao buscar últimas vendas.");
        } catch { setErro("Falha na conexão ao buscar vendas."); }
        finally { setCarregando(false); }
    }

    const alunosFiltrados = inputBusca.trim()
        ? allAlunos.filter(a =>
            a.nome.toLowerCase().includes(inputBusca.toLowerCase()) ||
            a.email.toLowerCase().includes(inputBusca.toLowerCase())
          )
        : allAlunos;

    async function confirmarTrocaStatus() {
        const id = modal.id;
        try {
            await fetch(`${BASE_URL}/alunos/atualizar-status-aluno/${id}`, {
                method: "POST", headers: { Authorization: `Bearer ${token}` },
            });
            setAllAlunos(prev => prev.map(u =>
                u.id === id ? { ...u, statusAssinatura: u.statusAssinatura === "ATIVADO" ? "DESATIVADO" : "ATIVADO" } : u
            ));
        } catch { setErro("Não foi possível atualizar o status."); }
        finally { setModal(null); }
    }

    async function trocarSisrun(id) {
        try {
            await fetch(`${BASE_URL}/alunos/atualizar-status-contasisrun-aluno/${id}`, {
                method: "POST", headers: { Authorization: `Bearer ${token}` },
            });
            setAllAlunos(prev => prev.map(u => u.id === id ? { ...u, criouContaSisrun: !u.criouContaSisrun } : u));
        } catch { setErro("Não foi possível atualizar conta Sisrun."); }
    }

    async function salvarToken() {
        if (!tokenInput.trim()) return;
        setSalvandoToken(true); setTokenStatus(null);
        try {
            const payload = { mpaccesstoken: tokenInput };
            const res = await fetch(`${BASE_URL}/configuracao`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });
            if (res.ok) {
                setTokenAtual(tokenInput);
                setTokenInput("");
                setTokenStatus("ok");
            } else {
                setTokenStatus("erro");
            }
        } catch {
            setTokenStatus("erro");
        } finally {
            setSalvandoToken(false);
        }
    }

    const totalAlunos  = relatorio.reduce((s, r) => s + r.quantidade, 0);
    const totalReceita = relatorio.reduce((s, r) => s + r.receita, 0);
    const maxQtd       = Math.max(...relatorio.map(r => r.quantidade), 1);

    if (verificando) return (
        <div style={{ ...S.root, alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "#555", letterSpacing: "0.2em", fontSize: 12 }}>VERIFICANDO…</span>
        </div>
    );

    
    


// ← ADICIONAR AQUI
if (acessoNegado) return (
    <div style={{ ...S.root, alignItems: "center", justifyContent: "center" }}>
        <div style={{
            background: "#141416", border: "1px solid #2e1a1a",
            borderRadius: 8, padding: "48px 40px", maxWidth: 420,
            textAlign: "center",
        }}>
            <div style={{
                width: 56, height: 56, borderRadius: "50%",
                background: "#2e1a1a", display: "flex",
                alignItems: "center", justifyContent: "center",
                margin: "0 auto 24px", fontSize: 24,
            }}>
                🔒
            </div>
            <p style={{
                fontSize: 13, letterSpacing: "0.25em", textTransform: "uppercase",
                color: "#de4c4c", marginBottom: 12, fontWeight: 700,
            }}>
                Acesso Restrito
            </p>
            <p style={{ color: "#666", fontSize: 13, lineHeight: 1.7, marginBottom: 28 }}>
                Você não tem permissão para acessar o painel administrativo.
                Esta área é exclusiva para administradores.
            </p>
            <button style={S.btnPrimary} onClick={() => navigate("/")}>
                ← Voltar ao início
            </button>
            <p style={{ color: "#333", fontSize: 11, marginTop: 16, letterSpacing: "0.05em" }}>
                Se acredita que isso é um engano, fale com o administrador.
            </p>
        </div>
    </div>
);

if (!autenticado) return null;

    const ABAS = [
        { key: "alunos",    label: "Alunos"             },
        { key: "parcelas",  label: "Parcelas por Aluno" },  // ← NOVA
        { key: "canceladas",label: "Canceladas"         },  // ← NOVA
        { key: "relatorio", label: "Relatório"          },
        { key: "vendas",    label: "Últimas Vendas"     },
        { key: "token",     label: "Token MP"           },
         { key: "planos", label: "Planos" }
    ];



    return (
        <div style={S.root}>
            <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300&display=swap');`}</style>

            {/* top bar */}
            <div style={S.topBar}>
                <span style={S.logo}>⬡ Painel Admin</span>
                <div style={S.tabs}>
                    {ABAS.map(({ key, label }) => (
                        <button key={key} style={S.tab(aba === key)} onClick={() => setAba(key)}>{label}</button>
                    ))}
                    <button className="btn-sair" onClick={() => navigate("/")}>Voltar</button>
                </div>
            </div>

            {/* body */}
            <div style={S.body}>
                {erro && <div style={S.erro}>{erro}</div>}

                {/* ══ ABA ALUNOS ══ */}
                {aba === "alunos" && (
                    <>
                        <p style={S.sectionTitle}>Gerenciar Alunos</p>
                        <div style={S.searchRow}>
                            <input style={S.input} placeholder="Pesquise por nome ou e-mail..."
                                value={inputBusca} onChange={e => setInputBusca(e.target.value)}
                                onKeyDown={e => e.key === "Escape" && setInputBusca("")}
                            />
                            {inputBusca && <button style={S.btnGhost} onClick={() => setInputBusca("")}>Limpar</button>}
                        </div>
                        <table style={S.table}>
                            <thead>
                                <tr>{["ID", "Nome", "E-mail", "Status", "Sisrun", ""].map(h => <th key={h} style={S.th}>{h}</th>)}</tr>
                            </thead>
                            <tbody>
                                {carregando ? (
                                    <tr><td colSpan={6} style={{ ...S.td, color: "#555", textAlign: "center" }}>carregando…</td></tr>
                                ) : alunosFiltrados.length === 0 ? (
                                    <tr><td colSpan={6} style={{ ...S.td, color: "#555", textAlign: "center" }}>nenhum resultado</td></tr>
                                ) : alunosFiltrados.map(a => (
                                    <tr key={a.id}
                                        style={rowHover === a.id ? S.rowHover : {}}
                                        onMouseEnter={() => setRowHover(a.id)}
                                        onMouseLeave={() => setRowHover(null)}
                                    >
                                        <td style={{ ...S.td, color: "#444", fontSize: 11 }}>{a.id}</td>
                                        <td style={S.td}>{a.nome}</td>
                                        <td style={{ ...S.td, color: "#888" }}>{a.email}</td>
                                        <td style={S.td}>
                                            <span style={S.badge(a.statusAssinatura)}
                                                onClick={() => setModal({ tipo: "status", id: a.id })}
                                                title="Clique para alternar" role="button"
                                                onMouseEnter={e => e.target.style.opacity = .7}
                                                onMouseLeave={e => e.target.style.opacity = 1}
                                            >
                                                {a.statusAssinatura}
                                            </span>
                                        </td>
                                        <td style={S.td}>
                                            <span style={S.badge(a.criouContaSisrun ? "TRUE" : "FALSE")}
                                                onClick={() => trocarSisrun(a.id)} title="Clique para alternar" role="button"
                                                onMouseEnter={e => e.target.style.opacity = .7}
                                                onMouseLeave={e => e.target.style.opacity = 1}
                                            >
                                                {a.criouContaSisrun ? "TRUE" : "FALSE"}
                                            </span>
                                        </td>
                                        <td style={S.td}>
                                            <button style={S.btnLink} onClick={() => navigate(`/home/conta/${a.id}?admin=true`)}>Ver</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </>
                )}

                {/* ══ ABA PARCELAS POR ALUNO ══ (NOVA) */}
                {aba === "parcelas" && (
                    <AbaParcelas token={token} allAlunos={allAlunos} navigate={navigate} />
                )}

                {/* ══ ABA CANCELADAS ══ (NOVA) */}
                {aba === "canceladas" && (
                    <AbaCanceladas token={token} />
                )}

                {/* ══ ABA RELATÓRIO ══ */}
                {aba === "relatorio" && (
                    <>
                        <p style={S.sectionTitle}>Alunos por Plano</p>
                        <div style={S.cardGrid}>
                            <div style={S.card}>
                                <div style={S.cardLabel}>Total de Alunos</div>
                                <div style={S.cardValue}>{totalAlunos}</div>
                                <div style={S.cardSub}>ativos + inativos</div>
                            </div>
                            <div style={S.card}>
                                <div style={S.cardLabel}>Receita Estimada</div>
                                <div style={S.cardValue}>R$ {totalReceita.toLocaleString("pt-BR")}</div>
                                <div style={S.cardSub}>soma de todos os planos</div>
                            </div>
                            <div style={S.card}>
                                <div style={S.cardLabel}>Planos Ativos</div>
                                <div style={S.cardValue}>{relatorio.length}</div>
                                <div style={S.cardSub}>tipos de plano</div>
                            </div>
                        </div>
                        <p style={{ ...S.sectionTitle, marginTop: 8 }}>Distribuição</p>
                        {relatorio.map(r => (
                            <div key={r.plano} style={S.barRow}>
                                <div style={S.barLabel}>
                                    <span>{r.plano}</span>
                                    <span>{r.quantidade} alunos — R$ {r.receita.toLocaleString("pt-BR")}</span>
                                </div>
                                <div style={S.barTrack}>
                                    <div style={S.barFill(Math.round((r.quantidade / maxQtd) * 100))} />
                                </div>
                            </div>
                        ))}
                    </>
                )}

                {/* ══ ABA TOKEN ══ */}
                {aba === "token" && (
    <>
        <p style={S.sectionTitle}>Credenciais Mercado Pago</p>

        {/* toggle ambiente */}
        <div style={{ ...S.tokenBox, marginBottom: 24, display: "flex", alignItems: "center", gap: 20 }}>
            <span style={{ fontSize: 13, color: "#888" }}>Ambiente ativo:</span>
            {["PRODUCAO", "TESTE"].map(amb => (
                <button
                    key={amb}
                    style={{
                        ...S.btnGhost,
                        ...(credAtual.mpambiente === amb
                            ? { borderColor: "#e8b44c", color: "#e8b44c", background: "#e8b44c18" }
                            : {})
                    }}
                    onClick={async () => {
                        await fetch(`${BASE_URL}/configuracao`, {
                            method: "PUT",
                            headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
                            body: JSON.stringify({ ...credAtual, mpambiente: amb })
                        });
                        setCredAtual(c => ({ ...c, mpambiente: amb }));
                    }}
                >
                    {amb}
                </button>
            ))}
            <span style={{ fontSize: 11, color: "#555" }}>
                {credAtual.mpambiente === "TESTE"
                    ? "⚠ usando credenciais de teste — pagamentos não são reais"
                    : "✓ usando credenciais de produção"}
            </span>
        </div>

        {/* grid de campos */}
        {[
            { key: "mpaccesstoken",     label: "Access Token (produção)",  prod: true  },
            { key: "mppublickey",       label: "Public Key (produção)",    prod: true  },
            { key: "mpclientid",        label: "Client ID",                prod: true  },
            { key: "mpclientsecret",    label: "Client Secret",            prod: true  },
            { key: "mpaccesstokentest", label: "Access Token (teste)",     prod: false },
            { key: "mppublickeytest",   label: "Public Key (teste)",       prod: false },
        ].map(({ key, label, prod }) => (
            <div key={key} style={{ ...S.tokenBox, marginBottom: 16 }}>
                <span style={S.tokenLabel}>{label}</span>
                <div style={{ ...S.tokenInput, color: "#555", marginBottom: 12, letterSpacing: "0.03em", padding: "10px 14px", fontSize: 11 }}>
                    {credAtual[key]
                        ? credAtual[key].slice(0, 12) + "••••••••••••" + credAtual[key].slice(-4)
                        : "—"}
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                    <input
                        style={{ ...S.tokenInput, marginBottom: 0, flex: 1 }}
                        type="password"
                        placeholder={`Novo valor para ${label.toLowerCase()}...`}
                        value={credentials[key]}
                        onChange={e => setCredentials(c => ({ ...c, [key]: e.target.value }))}
                        autoComplete="off"
                    />
                    <button
                        style={S.btnPrimary}
                        onClick={async () => {
                            if (!credentials[key].trim()) return;
                            setSalvando(key);
                            try {
                                const payload = { ...credAtual, [key]: credentials[key] };
                                const res = await fetch(`${BASE_URL}/configuracao`, {
                                    method: "PUT",
                                    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
                                    body: JSON.stringify(payload)
                                });
                                if (res.ok) {
                                    setCredAtual(payload);
                                    setCredentials(c => ({ ...c, [key]: "" }));
                                    setStatusSalvo({ key, ok: true });
                                } else {
                                    setStatusSalvo({ key, ok: false });
                                }
                            } catch {
                                setStatusSalvo({ key, ok: false });
                            } finally {
                                setSalvando(null);
                                setTimeout(() => setStatusSalvo(null), 3000);
                            }
                        }}
                        disabled={salvando === key}
                    >
                        {salvando === key ? "Salvando…" : "Salvar"}
                    </button>
                </div>
                {statusSalvo?.key === key && (
                    <div style={S.tokenStatus(statusSalvo.ok)}>
                        {statusSalvo.ok ? "✓ Salvo com sucesso." : "✗ Erro ao salvar."}
                    </div>
                )}
            </div>
        ))}
    </>
)}

                {/* ══ ABA ÚLTIMAS VENDAS ══ */}
                {aba === "vendas" && (
                    <>
                        <p style={S.sectionTitle}>Histórico de Pagamentos</p>
                        <table style={S.table}>
                            <thead>
                                <tr>
                                    {["Data", "Aluno", "Plano", "Valor", "Status", "ID Mercado Pago", "Método"].map(h => (
                                        <th key={h} style={S.th}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {carregando ? (
                                    <tr><td colSpan={7} style={{ ...S.td, color: "#555", textAlign: "center" }}>carregando…</td></tr>
                                ) : vendas.length === 0 ? (
                                    <tr><td colSpan={7} style={{ ...S.td, color: "#555", textAlign: "center" }}>nenhuma venda encontrada</td></tr>
                                ) : vendas.map((v, idx) => (
                                    <tr key={v.idPagamento || idx}>
                                        <td style={S.td}>{v.data ? new Date(v.data).toLocaleDateString("pt-BR") : "—"}</td>
                                        <td style={S.td}>{v.nomeAluno}</td>
                                        <td style={{ ...S.td, color: "#e8b44c" }}>{v.nomePlano || "—"}</td>
                                        <td style={S.td}>R$ {v.valor ? v.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 }) : "0,00"}</td>
                                        <td style={S.td}>
                                            <Badge status={v.statusLiberacao === "approved" ? "ATIVADO" : "DESATIVADO"} />
                                        </td>
                                        <td style={{ ...S.td, fontSize: 10, color: "#666" }}>{v.mpPaymentId || "—"}</td>
                                        <td style={S.td}>
                                            {v.formaPagamento === "account_money" ? "Saldo MP" :
                                             v.formaPagamento === "pix" ? "PIX" :
                                             v.formaPagamento || "—"}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </>
                )}
            </div>

            {aba === "planos" && (
                <AbaPlanos token={token} />
            )}


            {/* modal confirmação status */}
            {modal?.tipo === "status" && (
                <div style={S.overlay}>
                    <div style={S.modal}>
                        <div style={S.modalTitle}>Confirmar alteração</div>
                        <p style={S.modalText}>Deseja realmente mudar o status da assinatura?</p>
                        <div style={S.modalRow}>
                            <button style={S.btnPrimary} onClick={confirmarTrocaStatus}>Sim</button>
                            <button style={S.btnGhost} onClick={() => setModal(null)}>Cancelar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}