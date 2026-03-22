import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const BASE_URL =
    window.location.hostname === "localhost" ||
    window.location.hostname === "192.168.15.19"
        ? "http://192.168.15.19:3001"
        : "http://201.95.94.106:3001";

// ─── mock data para desenvolver antes do back estar pronto ──────────────────
const MOCK_ALUNOS = [
    { id: 1, nome: "Ana Souza",     email: "ana@email.com",   statusAssinatura: "ATIVADO",    criouContaSisrun: true,  plano: "MENSAL" },
    { id: 2, nome: "Bruno Lima",    email: "bruno@email.com", statusAssinatura: "DESATIVADO", criouContaSisrun: false, plano: "TRIMESTRAL" },
    { id: 3, nome: "Carla Dias",    email: "carla@email.com", statusAssinatura: "ATIVADO",    criouContaSisrun: true,  plano: "ANUAL" },
    { id: 4, nome: "Diego Melo",    email: "diego@email.com", statusAssinatura: "ATIVADO",    criouContaSisrun: false, plano: "MENSAL" },
    { id: 5, nome: "Eva Torres",    email: "eva@email.com",   statusAssinatura: "DESATIVADO", criouContaSisrun: true,  plano: "SEMESTRAL" },
];

const MOCK_RELATORIO = [
    { plano: "MENSAL",      quantidade: 42, receita: 2520 },
    { plano: "TRIMESTRAL",  quantidade: 18, receita: 3060 },
    { plano: "SEMESTRAL",   quantidade: 9,  receita: 2700 },
    { plano: "ANUAL",       quantidade: 14, receita: 8400 },
];

// ─── estilos em objeto para não depender de CSS externo ─────────────────────
const S = {
    root: {
        minHeight: "100vh",
        background: "#0d0d0f",
        color: "#e8e6e1",
        fontFamily: "'DM Mono', 'Fira Mono', monospace",
        display: "flex",
        flexDirection: "column",
    },
    topBar: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "18px 32px",
        borderBottom: "1px solid #1e1e22",
        background: "#0d0d0f",
        position: "sticky",
        top: 0,
        zIndex: 100,
    },
    logo: {
        fontSize: 13,
        letterSpacing: "0.25em",
        color: "#e8b44c",
        textTransform: "uppercase",
        fontWeight: 700,
    },
    tabs: {
        display: "flex",
        gap: 4,
    },
    tab: (active) => ({
        padding: "7px 18px",
        borderRadius: 4,
        border: active ? "1px solid #e8b44c" : "1px solid #2a2a2e",
        background: active ? "#e8b44c18" : "transparent",
        color: active ? "#e8b44c" : "#888",
        fontSize: 12,
        letterSpacing: "0.12em",
        cursor: "pointer",
        textTransform: "uppercase",
        transition: "all .18s",
    }),
    body: {
        flex: 1,
        padding: "32px",
        maxWidth: 1100,
        margin: "0 auto",
        width: "100%",
    },
    sectionTitle: {
        fontSize: 11,
        letterSpacing: "0.3em",
        color: "#555",
        textTransform: "uppercase",
        marginBottom: 20,
        borderBottom: "1px solid #1e1e22",
        paddingBottom: 10,
    },

    // ── busca ──────────────────────────────────────────────────────────────
    searchRow: {
        display: "flex",
        gap: 8,
        marginBottom: 24,
    },
    input: {
        flex: 1,
        background: "#111114",
        border: "1px solid #2a2a2e",
        borderRadius: 4,
        color: "#e8e6e1",
        padding: "9px 14px",
        fontSize: 13,
        fontFamily: "inherit",
        outline: "none",
    },
    btnPrimary: {
        padding: "9px 20px",
        background: "#e8b44c",
        color: "#0d0d0f",
        border: "none",
        borderRadius: 4,
        fontFamily: "inherit",
        fontSize: 12,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        cursor: "pointer",
        fontWeight: 700,
    },
    btnGhost: {
        padding: "9px 20px",
        background: "transparent",
        color: "#888",
        border: "1px solid #2a2a2e",
        borderRadius: 4,
        fontFamily: "inherit",
        fontSize: 12,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        cursor: "pointer",
    },

    // ── tabela ─────────────────────────────────────────────────────────────
    table: {
        width: "100%",
        borderCollapse: "collapse",
        fontSize: 13,
    },
    th: {
        textAlign: "left",
        padding: "10px 14px",
        fontSize: 10,
        letterSpacing: "0.2em",
        color: "#555",
        textTransform: "uppercase",
        borderBottom: "1px solid #1e1e22",
    },
    td: {
        padding: "12px 14px",
        borderBottom: "1px solid #141416",
        verticalAlign: "middle",
    },
    rowHover: {
        background: "#111114",
        cursor: "pointer",
        transition: "background .15s",
    },

    // ── badges ─────────────────────────────────────────────────────────────
    badge: (tipo) => {
        const map = {
            ATIVADO:    { bg: "#1a3a2a", color: "#4cde8c" },
            DESATIVADO: { bg: "#2e1a1a", color: "#de4c4c" },
            TRUE:       { bg: "#1a2a3a", color: "#4ca8de" },
            FALSE:      { bg: "#2a2a2e", color: "#666" },
        };
        const s = map[tipo] || map.FALSE;
        return {
            ...s,
            display: "inline-block",
            padding: "3px 10px",
            borderRadius: 3,
            fontSize: 11,
            letterSpacing: "0.12em",
            fontWeight: 700,
            cursor: "pointer",
            transition: "opacity .15s",
        };
    },

    btnLink: {
        background: "transparent",
        border: "1px solid #2a2a2e",
        borderRadius: 3,
        color: "#e8b44c",
        padding: "4px 12px",
        fontSize: 11,
        letterSpacing: "0.1em",
        cursor: "pointer",
        fontFamily: "inherit",
        textTransform: "uppercase",
    },

    // ── relatório ──────────────────────────────────────────────────────────
    cardGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))",
        gap: 16,
        marginBottom: 36,
    },
    card: {
        background: "#111114",
        border: "1px solid #1e1e22",
        borderRadius: 6,
        padding: "20px 22px",
    },
    cardLabel: {
        fontSize: 10,
        letterSpacing: "0.25em",
        color: "#555",
        textTransform: "uppercase",
        marginBottom: 8,
    },
    cardValue: {
        fontSize: 28,
        fontWeight: 700,
        color: "#e8b44c",
        lineHeight: 1,
    },
    cardSub: {
        fontSize: 12,
        color: "#444",
        marginTop: 4,
    },

    barRow: {
        marginBottom: 12,
    },
    barLabel: {
        display: "flex",
        justifyContent: "space-between",
        fontSize: 12,
        color: "#888",
        marginBottom: 5,
    },
    barTrack: {
        height: 6,
        background: "#1e1e22",
        borderRadius: 3,
        overflow: "hidden",
    },
    barFill: (pct) => ({
        height: "100%",
        width: `${pct}%`,
        background: "#e8b44c",
        borderRadius: 3,
        transition: "width .6s ease",
    }),

    // ── token MP ──────────────────────────────────────────────────────────
    tokenBox: {
        background: "#111114",
        border: "1px solid #1e1e22",
        borderRadius: 6,
        padding: "28px 32px",
        maxWidth: 560,
    },
    tokenLabel: {
        fontSize: 10,
        letterSpacing: "0.25em",
        color: "#555",
        textTransform: "uppercase",
        marginBottom: 8,
        display: "block",
    },
    tokenInput: {
        width: "100%",
        background: "#0d0d0f",
        border: "1px solid #2a2a2e",
        borderRadius: 4,
        color: "#e8e6e1",
        padding: "10px 14px",
        fontSize: 13,
        fontFamily: "'DM Mono', 'Fira Mono', monospace",
        outline: "none",
        boxSizing: "border-box",
        marginBottom: 16,
    },
    tokenStatus: (ok) => ({
        fontSize: 12,
        color: ok ? "#4cde8c" : "#de4c4c",
        marginTop: 10,
        letterSpacing: "0.05em",
    }),

    // ── modal ─────────────────────────────────────────────────────────────
    overlay: {
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,.7)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 200,
    },
    modal: {
        background: "#141416",
        border: "1px solid #2a2a2e",
        borderRadius: 8,
        padding: "32px 36px",
        minWidth: 320,
        textAlign: "center",
    },
    modalTitle: {
        fontSize: 14,
        letterSpacing: "0.2em",
        textTransform: "uppercase",
        color: "#e8b44c",
        marginBottom: 10,
    },
    modalText: {
        color: "#888",
        fontSize: 13,
        marginBottom: 24,
    },
    modalRow: {
        display: "flex",
        gap: 10,
        justifyContent: "center",
    },

    erro: {
        background: "#2e1a1a",
        border: "1px solid #de4c4c44",
        color: "#de4c4c",
        borderRadius: 4,
        padding: "10px 16px",
        fontSize: 13,
        marginBottom: 20,
    },
};

// ─── helpers ─────────────────────────────────────────────────────────────────
function MockOrFetch(url, mockData) {
    // Troca por fetch real quando o back estiver pronto
    return new Promise((res) => setTimeout(() => res(mockData), 400));
}

// ═══════════════════════════════════════════════════════════════════════════
export default function Conta() {
    const navigate = useNavigate();

    const [aba, setAba] = useState("alunos"); // "alunos" | "relatorio" | "token"
    const [erro, setErro] = useState("");

    // ── alunos ──────────────────────────────────────────────────────────────
    const [allAlunos, setAllAlunos]       = useState([]);
    const [inputBusca, setInputBusca]     = useState("");
    const [carregando, setCarregando]     = useState(false);
    const [rowHover, setRowHover]         = useState(null);
    const [modal, setModal]               = useState(null); // { tipo, id }

    // ── relatório ───────────────────────────────────────────────────────────
    const [relatorio, setRelatorio]       = useState([]);

    // ── token ───────────────────────────────────────────────────────────────

    const [tokenAtual, setTokenAtual]     = useState("");
    const [tokenInput, setTokenInput]     = useState("");
    const [tokenStatus, setTokenStatus]   = useState(null); // null | "ok" | "erro"
    const [salvandoToken, setSalvandoToken] = useState(false);

    // ── fetch alunos ────────────────────────────────────────────────────────
    async function pegarAlunos() {
        try {
            const res = await fetch(BASE_URL+"/alunos", {
                method: "GET"
            });
            
            if(res.ok) {
                const data = await res.json();
                console.log("all usuarios ", data );
                setAllAlunos(data);
            }else{
                setErro("erro ao pegar usuarios");
            }
           
        } catch (error) {
            setErro(error)
        }
    }

    async function pegarRelatorio() {
        try {
            const res = await fetch(BASE_URL+"/alunos/qtdd-aluno-por-plano", {
                method: "GET"
            });
            
            if(res.ok) {
                const data = await res.json();
                console.log("all quantidade de alunos por planos ", data );
                setRelatorio(data);
            }else{
                setErro("erro ao pegar usuarios");
            }            
        } catch {
            setErro("Erro ao carregar relatório.");
        }
    }

    async function pegarTokenAtual() {
         try {
            const res = await fetch(BASE_URL+"/configuracao", {
                method: "GET"
            });
            console.log("RES:", res);

            if(res.ok) {
                const data = await res.json();
                console.log("DATA:", data);
                console.log("configuracoes  ", data.mpaccesstoken );
                setTokenAtual(data.mpaccesstoken);
            }else{
                setErro("erro ao pegar usuarios");
            }            
        } catch {
            setErro("Erro ao configuracoes.");
        }
    }
    

    useEffect(() => {
        pegarAlunos();
        pegarRelatorio();
        pegarTokenAtual();
    }, []);

    // ── busca ────────────────────────────────────────────────────────────────
    const alunosFiltrados = inputBusca.trim()
        ? allAlunos.filter((a) =>
            a.nome.toLowerCase().includes(inputBusca.toLowerCase()) ||
            a.email.toLowerCase().includes(inputBusca.toLowerCase())
          )
        : allAlunos;

    // ── ações de status ──────────────────────────────────────────────────────
    async function confirmarTrocaStatus() {
        const id = modal.id;
        try {
             await fetch(`${BASE_URL}/alunos/atualizar-status-aluno/${id}`, { method: "POST" });
            setAllAlunos((prev) =>
                prev.map((u) =>
                    u.id === id
                        ? { ...u, statusAssinatura: u.statusAssinatura === "ATIVADO" ? "DESATIVADO" : "ATIVADO" }
                        : u
                )
            );
        } catch {
            setErro("Não foi possível atualizar o status.");
        } finally {
            setModal(null);
        }
    }

    async function trocarSisrun(id) {
        try {
            await fetch(`${BASE_URL}/alunos/atualizar-status-contasisrun-aluno/${id}`, { method: "POST" });
            setAllAlunos((prev) =>
                prev.map((u) => u.id === id ? { ...u, criouContaSisrun: !u.criouContaSisrun } : u)
            );
        } catch {
            setErro("Não foi possível atualizar conta Sisrun.");
        }
    }

    // ── salvar token ─────────────────────────────────────────────────────────
    async function salvarToken() {
        if (!tokenInput.trim()) return;
        setSalvandoToken(true);
        setTokenStatus(null);
        try {
            // const res = await fetch(`${BASE_URL}/config/token-mercadopago`, {
            //     method: "POST",
            //     headers: { "Content-Type": "application/json" },
            //     body: JSON.stringify({ token: tokenInput }),
            // });
            // if (!res.ok) throw new Error();
            await new Promise((r) => setTimeout(r, 600)); // simula latência
            setTokenAtual(tokenInput);
            setTokenInput("");
            setTokenStatus("ok");
        } catch {
            setTokenStatus("erro");
        } finally {
            setSalvandoToken(false);
        }
    }

    // ── relatório: totais ─────────────────────────────────────────────────────
    const totalAlunos  = relatorio.reduce((s, r) => s + r.quantidade, 0);
    const totalReceita = relatorio.reduce((s, r) => s + r.receita, 0);
    const maxQtd       = Math.max(...relatorio.map((r) => r.quantidade), 1);

    // ═══════════════════════════════════════════════════════════════════════
    return (
        <div style={S.root}>
            {/* Google Font */}
            <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300&display=swap');`}</style>

            {/* top bar */}
            <div style={S.topBar}>
                <div>
                    <span style={S.logo}>⬡ Painel Admin</span>
                </div>
                <div style={S.tabs}>
                    {[
                        { key: "alunos",    label: "Alunos"    },
                        { key: "relatorio", label: "Relatório" },
                        { key: "token",     label: "Token MP"  },
                    ].map(({ key, label }) => (
                        <button key={key} style={S.tab(aba === key)} onClick={() => setAba(key)}>
                            {label}
                        </button>
                    ))}
                    <button className="btn-sair" onClick={() => navigate("/")}>Voltar</button>

                </div>
            </div>

            {/* body */}
            <div style={S.body}>
                {erro && <div style={S.erro}>{erro}</div>}

                {/* ══ ABA ALUNOS ══════════════════════════════════════════════ */}
                {aba === "alunos" && (
                    <>
                        <p style={S.sectionTitle}>Gerenciar Alunos</p>

                        <div style={S.searchRow}>
                            <input
                                style={S.input}
                                placeholder="Pesquise por nome ou e-mail..."
                                value={inputBusca}
                                onChange={(e) => setInputBusca(e.target.value)}
                                onKeyDown={(e) => e.key === "Escape" && setInputBusca("")}
                            />
                            {inputBusca && (
                                <button style={S.btnGhost} onClick={() => setInputBusca("")}>
                                    Limpar
                                </button>
                            )}
                        </div>

                        <table style={S.table}>
                            <thead>
                                <tr>
                                    {["ID", "Nome", "E-mail", "Status", "Sisrun",""].map((h) => (
                                        <th key={h} style={S.th}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {carregando ? (
                                    <tr><td colSpan={6} style={{ ...S.td, color: "#555", textAlign: "center" }}>carregando…</td></tr>
                                ) : alunosFiltrados.length === 0 ? (
                                    <tr><td colSpan={6} style={{ ...S.td, color: "#555", textAlign: "center" }}>nenhum resultado</td></tr>
                                ) : alunosFiltrados.map((a) => (
                                    <tr
                                        key={a.id}
                                        style={rowHover === a.id ? { ...S.rowHover } : {}}
                                        onMouseEnter={() => setRowHover(a.id)}
                                        onMouseLeave={() => setRowHover(null)}
                                    >
                                        <td style={{ ...S.td, color: "#444", fontSize: 11 }}>{a.id}</td>
                                        <td style={S.td}>{a.nome}</td>
                                        <td style={{ ...S.td, color: "#888" }}>{a.email}</td>
                                        <td style={S.td}>
                                            <span
                                                style={S.badge(a.statusAssinatura)}
                                                onClick={() => setModal({ tipo: "status", id: a.id })}
                                                title="Clique para alternar"
                                            >
                                                {a.statusAssinatura}
                                            </span>
                                        </td>
                                        <td style={S.td}>
                                            <span
                                                style={S.badge(a.criouContaSisrun ? "TRUE" : "FALSE")}
                                                onClick={() => trocarSisrun(a.id)}
                                                title="Clique para alternar"
                                            >
                                                {a.criouContaSisrun ? "TRUE" : "FALSE"}
                                            </span>
                                        </td>
                                        <td style={S.td}>
                                            <button
                                                style={S.btnLink}
                                                onClick={() => navigate(`/home/conta/${a.id}`)}

                                            >
                                                Ver
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </>
                )}

                {/* ══ ABA RELATÓRIO ═══════════════════════════════════════════ */}
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
                                <div style={S.cardValue}>
                                    R$ {totalReceita.toLocaleString("pt-BR")}
                                </div>
                                <div style={S.cardSub}>soma de todos os planos</div>
                            </div>
                            <div style={S.card}>
                                <div style={S.cardLabel}>Planos Ativos</div>
                                <div style={S.cardValue}>{relatorio.length}</div>
                                <div style={S.cardSub}>tipos de plano</div>
                            </div>
                        </div>

                        <p style={{ ...S.sectionTitle, marginTop: 8 }}>Distribuição</p>

                        {relatorio.map((r) => (
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

                {/* ══ ABA TOKEN ════════════════════════════════════════════════ */}
                {aba === "token" && (
                    <>
                        <p style={S.sectionTitle}>Token Mercado Pago</p>

                        <div style={S.tokenBox}>
                            <p style={{ fontSize: 13, color: "#888", marginBottom: 22, lineHeight: 1.6 }}>
                                O token de acesso é usado para processar pagamentos via Mercado Pago.
                                Troque-o aqui sempre que gerar um novo token no painel do MP.
                            </p>

                            <span style={S.tokenLabel}>Token atual</span>
                            <div style={{
                                ...S.tokenInput,
                                color: "#555",
                                marginBottom: 24,
                                userSelect: "none",
                                letterSpacing: "0.05em",
                                padding: "10px 14px",
                            }}>
                                {tokenAtual || "—"}
                            </div>

                            <span style={S.tokenLabel}>Novo token</span>
                            <input
                                style={S.tokenInput}
                                type="password"
                                placeholder="Cole o novo token aqui"
                                value={tokenInput}
                                onChange={(e) => setTokenInput(e.target.value)}
                                autoComplete="off"
                            />

                            <button
                                style={salvandoToken ? { ...S.btnPrimary, opacity: 0.5 } : S.btnPrimary}
                                onClick={salvarToken}
                                disabled={salvandoToken}
                            >
                                {salvandoToken ? "Salvando…" : "Salvar Token"}
                            </button>

                            {tokenStatus && (
                                <div style={S.tokenStatus(tokenStatus === "ok")}>
                                    {tokenStatus === "ok"
                                        ? "✓ Token atualizado com sucesso."
                                        : "✗ Erro ao salvar o token. Tente novamente."}
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>

            {/* ── modal confirmação status ─────────────────────────────────── */}
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
