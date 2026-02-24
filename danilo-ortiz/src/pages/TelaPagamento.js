import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

/* ─── estilos locais ─────────────────────────────────────────────────── */
const S = {
  page: {
    minHeight: "100vh",
    background: "#0a0a0a",
    fontFamily: "'Barlow', sans-serif",
    color: "#f0ece4",
    position: "relative",
    overflow: "hidden",
  },
  bgGlow: {
    position: "fixed",
    inset: 0,
    background:
      "radial-gradient(ellipse 70% 50% at 50% -5%, rgba(196,160,100,0.1) 0%, transparent 65%)",
    pointerEvents: "none",
    zIndex: 0,
  },
  content: {
    position: "relative",
    zIndex: 1,
    maxWidth: 960,
    margin: "0 auto",
    padding: "80px 48px 120px",
  },

  /* cabeçalho */
  eyebrow: {
    fontSize: "0.6rem",
    fontWeight: 600,
    letterSpacing: "0.35em",
    textTransform: "uppercase",
    color: "rgba(196,160,100,0.5)",
    marginBottom: 12,
  },
  titulo: {
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: "clamp(3.5rem, 8vw, 6rem)",
    lineHeight: 0.9,
    letterSpacing: "0.04em",
    color: "#f0ece4",
    marginBottom: 8,
  },
  tituloAccent: { color: "#c4a064" },
  divider: {
    width: 60,
    height: 2,
    background: "#c4a064",
    margin: "32px 0 48px",
  },

  /* grid de resumo */
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 2,
    marginBottom: 48,
  },
  gridFull: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: 2,
    marginBottom: 48,
  },
  infoBox: {
    background: "rgba(255,255,255,0.02)",
    border: "1px solid rgba(196,160,100,0.12)",
    padding: "24px 28px",
    transition: "all 0.25s ease",
  },
  infoLabel: {
    fontSize: "0.58rem",
    fontWeight: 600,
    letterSpacing: "0.3em",
    textTransform: "uppercase",
    color: "rgba(196,160,100,0.45)",
    marginBottom: 8,
    display: "block",
  },
  infoValue: {
    fontSize: "1.1rem",
    color: "#f0ece4",
    fontWeight: 300,
    letterSpacing: "0.02em",
  },
  infoValueBig: {
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: "2.2rem",
    letterSpacing: "0.04em",
    color: "#c4a064",
    lineHeight: 1,
  },

  /* seção de pagamento */
  sectionLabel: {
    fontSize: "0.6rem",
    fontWeight: 600,
    letterSpacing: "0.35em",
    textTransform: "uppercase",
    color: "rgba(196,160,100,0.5)",
    marginBottom: 24,
    paddingBottom: 12,
    borderBottom: "1px solid rgba(196,160,100,0.1)",
  },
  metodosGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: 2,
    marginBottom: 40,
  },
  metodoCard: (selecionado) => ({
    padding: "20px 24px",
    background: selecionado ? "rgba(196,160,100,0.08)" : "rgba(255,255,255,0.02)",
    border: `1px solid ${selecionado ? "#c4a064" : "rgba(196,160,100,0.12)"}`,
    cursor: "pointer",
    transition: "all 0.25s ease",
    display: "flex",
    flexDirection: "column",
    gap: 6,
    position: "relative",
  }),
  metodoIcone: {
    fontSize: "1.4rem",
    marginBottom: 4,
  },
  metodoNome: {
    fontSize: "0.78rem",
    fontWeight: 600,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: "#f0ece4",
  },
  metodoDesc: {
    fontSize: "0.65rem",
    color: "rgba(240,236,228,0.35)",
    letterSpacing: "0.05em",
  },
  metodoDot: {
    position: "absolute",
    top: 14,
    right: 14,
    width: 8,
    height: 8,
    borderRadius: "50%",
    background: "#c4a064",
  },

  /* total */
  totalBox: {
    background: "rgba(196,160,100,0.05)",
    border: "1px solid rgba(196,160,100,0.2)",
    padding: "24px 28px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  totalLabel: {
    fontSize: "0.65rem",
    fontWeight: 600,
    letterSpacing: "0.25em",
    textTransform: "uppercase",
    color: "rgba(196,160,100,0.5)",
  },
  totalValor: {
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: "2.5rem",
    color: "#c4a064",
    letterSpacing: "0.04em",
    lineHeight: 1,
  },

  /* botões */
  btnPrimary: {
    fontFamily: "'Barlow', sans-serif",
    fontWeight: 600,
    fontSize: "0.8rem",
    letterSpacing: "0.2em",
    textTransform: "uppercase",
    padding: "16px 40px",
    background: "#c4a064",
    color: "#0a0a0a",
    border: "1px solid #c4a064",
    cursor: "pointer",
    transition: "all 0.25s ease",
    width: "100%",
    marginBottom: 10,
  },
  btnSecondary: {
    fontFamily: "'Barlow', sans-serif",
    fontWeight: 400,
    fontSize: "0.7rem",
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    padding: "13px",
    background: "transparent",
    color: "rgba(240,236,228,0.35)",
    border: "1px solid rgba(240,236,228,0.1)",
    cursor: "pointer",
    transition: "all 0.25s ease",
    width: "100%",
  },

  /* sem login */
  gateCard: {
    maxWidth: 440,
    margin: "0 auto",
    textAlign: "center",
    padding: "64px 48px",
    background: "rgba(255,255,255,0.02)",
    border: "1px solid rgba(196,160,100,0.15)",
  },
  gateTitulo: {
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: "2.5rem",
    letterSpacing: "0.04em",
    color: "#f0ece4",
    marginBottom: 12,
  },
  gateDesc: {
    fontSize: "0.85rem",
    fontWeight: 300,
    color: "rgba(240,236,228,0.4)",
    letterSpacing: "0.05em",
    marginBottom: 36,
  },


  /* parte da mensalidade */
  planoInfoContainer: {
    marginTop: 24,
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  planoTexto: {
    fontSize: "0.8rem",
    color: "rgba(240,236,228,0.5)",
    letterSpacing: "0.05em",
  },
  planoDestaque: {
    color: "#c4a064",
    fontWeight: 600,
  },
  btnPagar: {
    alignSelf: "flex-start",
    marginTop: 8,
    fontFamily: "'Barlow', sans-serif",
    fontWeight: 700,
    fontSize: "0.7rem",
    letterSpacing: "0.2em",
    textTransform: "uppercase",
    padding: "10px 20px",
    background: "#c4a064",
    color: "#0a0a0a",
    border: "none",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  parcelaCard: {
    padding: "32px", // Aumentado significativamente
    background: "linear-gradient(145deg, rgba(196,160,100,0.08) 0%, rgba(255,255,255,0.02) 100%)",
    borderLeft: "4px solid #c4a064", // Borda mais grossa
    display: "flex",
    flexDirection: "column",
    gap: 12,
    minWidth: "380px", // Card bem mais largo
    boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
  },
  parcelaLabel: {
    fontSize: "0.75rem", // Maior
    letterSpacing: "0.25em",
    textTransform: "uppercase",
    color: "#c4a064",
    fontWeight: 700,
  },
  parcelaValor: {
    fontSize: "3.5rem", // Valor bem grande (Elite style)
    fontFamily: "'Bebas Neue', sans-serif",
    color: "#f0ece4",
    lineHeight: 1,
    margin: "8px 0",
  },



  /* toast */
  toast: (ok) => ({
    position: "fixed",
    bottom: 32,
    right: 32,
    padding: "14px 24px",
    background: ok ? "rgba(90,180,100,0.1)" : "rgba(224,85,85,0.1)",
    border: `1px solid ${ok ? "rgba(90,180,100,0.4)" : "rgba(224,85,85,0.4)"}`,
    color: ok ? "#6fcf7a" : "#e05555",
    fontSize: "0.72rem",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    fontFamily: "'Barlow', sans-serif",
    zIndex: 999,
  }),
};

const METODOS = [
  { id: "pix",    nome: "Pix",           icone: "⚡", desc: "Aprovação imediata" },
  { id: "boleto", nome: "Boleto",         icone: "📄", desc: "Vence em 3 dias úteis" },
  { id: "cartao", nome: "Cartão",         icone: "💳", desc: "Crédito ou débito" },
];

function formatarValor(valor) {
  if (!valor && valor !== 0) return "—";
  return Number(valor).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function InfoBox({ label, value, big }) {
  return (
    <div
      style={S.infoBox}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "rgba(196,160,100,0.3)";
        e.currentTarget.style.background = "rgba(196,160,100,0.04)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "rgba(196,160,100,0.12)";
        e.currentTarget.style.background = "rgba(255,255,255,0.02)";
      }}
    >
      <span style={S.infoLabel}>{label}</span>
      <span style={big ? S.infoValueBig : S.infoValue}>{value ?? "—"}</span>
    </div>
  );
}

export default function TelaPagamento() {
  const navigate = useNavigate();
  const { idplano } = useParams();

  const [idAluno, setIdAluno] = useState();
  const [aluno, setAluno] = useState(null);
  const [MensalidadeParcelasDTOS, setMensalidadeParcelasDTOS] = useState({});
  const [plano, setPlano] = useState(null);
  const [emailLogado, setEmailLogado] = useState(null);
  const [metodoPag, setMetodoPag]     = useState("pix");
  const [loading, setLoading]         = useState(false);
  const [erro, setErro]               = useState(null);
  const [toast, setToast]             = useState(null);

  const url = "http://localhost:8080/planos";
  const urlalunos = "http://localhost:8080/alunos";
  const urlmensalidade = "http://localhost:8080/mensalidades";

  useEffect(() => {
    setEmailLogado(localStorage.getItem("email"));
    
    setIdAluno(localStorage.getItem("id"));
    const ida = localStorage.getItem("id");
    
    if(ida){
      obterAluno(ida);
      pegarDadosMensalidadeAlunoPorId(ida);
    }
    pegarPlano();
  }, []);
  
  async function pegarDadosMensalidadeAlunoPorId(ida){
    try {
        const res = await fetch(`${urlmensalidade}/${ida}`);
        if(res.ok){
            const data = await res.json();
            console.log("dados da conta: ", data);
            setMensalidadeParcelasDTOS(data);   
        }else{
            setErro("mensalidade não encontrada");
        }
    } catch (error) {
        setErro(error);
    }
  }

  
  async function pegarPlano() {
    try {
      const res = await fetch(`${url}/${idplano}`);
      if (res.ok) {
        setPlano(await res.json());
      } else {
        setErro("Plano não encontrado.");
      }
    } catch {
      setErro("Erro de conexão com o servidor.");
    }
  }

  async function obterAluno(ida){
     try {
      console.log(`pesquisa: ${urlalunos}/${ida}`);
      const res = await fetch(`${urlalunos}/${ida}`);
      if (res.ok) {
        const data = await res.json();
        console.log("aluno", data);
        setAluno(data);
      } else {
        setErro("Aluno não encontrado no banco.");
      }
    } catch {
      setErro("Erro de conexão com o servidor.");
    }
  }

  function mostrarToast(msg, ok) {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3500);
  }

  async function confirmarPagamento() {
    setLoading(true);
    try {
      // Adapte o endpoint conforme sua API
      const res = await fetch(`http://localhost:8080/pagamentos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          aluno: { id: Number(idAluno) },
          plano: { id: Number(idplano) },
          //mpPaymentId: "",
          formaPagamento: metodoPag,
          codigoVenda: "",
          valorPago: plano.valor,
          pago: false,
          statusPagamento: "PENDENTE"
          }),
      });

      if (res.ok) {
        mostrarToast("Pagamento confirmado! Redirecionando...", true);
        setTimeout(() => navigate("/"), 2000);
      } else {
        mostrarToast("Erro ao processar pagamento.", false);
      }
    } catch {
      mostrarToast("Erro de conexão ao confirmar pagamento.", false);
    } finally {
      setLoading(false);
    }
  }

  quando pagar uma parcela ela tem que salvar na tabela de pagamentos com o id da parcela criar essa coluna
  fazer com que na conta aparece as parcelas ja pagas
  async function confirmarPagamentoParcela() {
  setLoading(true);

  try {
    // 1. Pegamos a parcela que está em aberto no DTO que veio do Back
    const parcelaAtual = MensalidadeParcelasDTOS?.parcelas?.[0];

    if (!parcelaAtual) {
      mostrarToast("Erro: Parcela não localizada.", false);
      setLoading(false);
      return;
    }

    // 2. Montamos o DTO de Pagamento que agrupa tudo
    // Este objeto casa com o que o Back precisa para salvar nas tabelas 'pagamentos' e 'mensalidades_parcelas'
    const pagamentoCompletoDTO = {
      alunoId: Number(idAluno),
      planoId: Number(idplano),
      formaPagamento: metodoPag, // pix, boleto, cartao
      valorPago: parcelaAtual.valor,
      
      // O DTO da Parcela com o status que você quer
      parcela: {
        id: parcelaAtual.id,
        valor: parcelaAtual.valor,
        dataVencimento: parcelaAtual.dataVencimento,
        status: "FINALIZADO"
      }
    };

    const res = await fetch(`http://localhost:8080/pagamentos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(pagamentoCompletoDTO),
    });

    if (res.ok) {
      mostrarToast("Pagamento Finalizado com Sucesso!", true);
      // Redireciona para o perfil do aluno após 2 segundos
      setTimeout(() => navigate(`/home/${idAluno}`), 2000);
    } else {
      mostrarToast("Erro ao processar o pagamento no servidor.", false);
    }
  } catch (error) {
    console.error("Erro na requisição:", error);
    mostrarToast("Erro de conexão com o servidor.", false);
  } finally {
    setLoading(false);
  }
}

  /* ── sem login ── */
  if (!emailLogado) {
    return (
      <div style={S.page}>
        <div style={S.bgGlow} />
        <div style={{ ...S.content, display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", paddingTop: 0 }}>
          <div style={S.gateCard}>
            <p style={{ ...S.eyebrow, marginBottom: 20 }}>Acesso restrito</p>
            <h2 style={S.gateTitulo}>Login necessário</h2>
            <p style={S.gateDesc}>Para continuar com a assinatura, você precisa estar logado na plataforma.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <button
                style={S.btnPrimary}
                onClick={() => navigate(`/login/${idplano}`)}
                onMouseEnter={(e) => { e.target.style.background = "transparent"; e.target.style.color = "#c4a064"; }}
                onMouseLeave={(e) => { e.target.style.background = "#c4a064"; e.target.style.color = "#0a0a0a"; }}
              >
                Fazer Login
              </button>
              <button
                style={S.btnSecondary}
                onClick={() => navigate("/")}
                onMouseEnter={(e) => { e.target.style.color = "#f0ece4"; e.target.style.borderColor = "rgba(240,236,228,0.4)"; }}
                onMouseLeave={(e) => { e.target.style.color = "rgba(240,236,228,0.35)"; e.target.style.borderColor = "rgba(240,236,228,0.1)"; }}
              >
                ← Voltar
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

 

  /* ── carregando ── */
  if (!plano && !erro) {
    return (
      <div style={{ ...S.page, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ fontSize: "0.7rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(240,236,228,0.25)" }}>
          Carregando plano...
        </p>
      </div>
    );
  }

  return (
    <div style={S.page}>
      <div style={S.bgGlow} />

      {/* ── NAV ── */}
      <nav className="nav-bar">
        <span style={{ marginRight: "auto", fontSize: "0.6rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(196,160,100,0.4)" }}>
          {emailLogado}
        </span>
        <button className="btn-sair" onClick={() => navigate("/")}>← Voltar</button>
      </nav>

      <main style={S.content}>
        {/* ── CABEÇALHO ── */}
        <p style={S.eyebrow}>Finalizar assinatura</p>
        <h1 style={S.titulo}>
          Tela de<br />
          <span style={S.tituloAccent}>Pagamento</span>
        </h1>
        <div style={S.divider} />

        {erro && <p className="erro-msg">{erro}</p>}

        {plano && (
          <>
             {/* ── RESUMO DO PLANO OU PARCELA ── */}
              {aluno?.planoAtual?.id === 0 || !MensalidadeParcelasDTOS?.parcelas ? (
                <>
                  <p style={S.sectionLabel}>Resumo do Plano</p>
                  <div style={S.grid}>
                    <InfoBox label="Plano" value={plano?.nome} />
                    <InfoBox label="Valor" value={formatarValor(plano?.valor)} big />
                    <InfoBox label="Duração" value={plano?.duracaomeses ? `${plano.duracaomeses} meses` : "—"} />
                    <InfoBox label="Usuário" value={emailLogado} />
                  </div>
                </>
              ) : (
                <>
                  <p style={S.sectionLabel}>Resumo da Parcela</p>
                  <div style={S.grid}>
                    <InfoBox label="ID Parcela" value={MensalidadeParcelasDTOS.parcelas[0]?.id} />
                    <InfoBox label="Vencimento" value={new Date(MensalidadeParcelasDTOS.parcelas[0]?.dataVencimento).toLocaleDateString('pt-BR')} />
                    <InfoBox label="Status" value={MensalidadeParcelasDTOS.parcelas[0]?.status} />
                    <InfoBox label="Valor" value={formatarValor(MensalidadeParcelasDTOS.parcelas[0]?.valor)} big />
                  </div>
                </>
              )}

            {/* ── MÉTODO DE PAGAMENTO ── */}
            <p style={S.sectionLabel}>Método de Pagamento</p>
            <div style={S.metodosGrid}>
              {METODOS.map((m) => (
                <div
                  key={m.id}
                  style={S.metodoCard(metodoPag === m.id)}
                  onClick={() => setMetodoPag(m.id)}
                  onMouseEnter={(e) => { if (metodoPag !== m.id) e.currentTarget.style.borderColor = "rgba(196,160,100,0.3)"; }}
                  onMouseLeave={(e) => { if (metodoPag !== m.id) e.currentTarget.style.borderColor = "rgba(196,160,100,0.12)"; }}
                >
                  {metodoPag === m.id && <div style={S.metodoDot} />}
                  <span style={S.metodoIcone}>{m.icone}</span>
                  <span style={S.metodoNome}>{m.nome}</span>
                  <span style={S.metodoDesc}>{m.desc}</span>
                </div>
              ))}
            </div>

            {/* ── TOTAL ── */}
             
            <div style={S.totalBox}>
              <div>
                <p style={S.totalLabel}>Total a pagar</p>
                <p style={{ fontSize: "0.65rem", color: "rgba(196,160,100,0.35)", letterSpacing: "0.1em", marginTop: 4, textTransform: "uppercase" }}>
                  via {METODOS.find((m) => m.id === metodoPag)?.nome}
                </p>
              </div>
              {
                aluno?.planoAtual?.id === 0 || !MensalidadeParcelasDTOS?.parcelas ? (
                  <p style={S.totalValor}>{formatarValor(plano.valor)}</p>
                ): (
                  <p style={S.totalValor}>{formatarValor(MensalidadeParcelasDTOS.parcelas[0].valor)}</p>
                )
              }
            </div>

            {/* ── AÇÕES ── */}
            <button
              style={{ ...S.btnPrimary, opacity: loading ? 0.65 : 1 }}
              onClick={confirmarPagamento}
              disabled={loading}
              onMouseEnter={(e) => { if (!loading) { e.target.style.background = "transparent"; e.target.style.color = "#c4a064"; } }}
              onMouseLeave={(e) => { e.target.style.background = "#c4a064"; e.target.style.color = "#0a0a0a"; }}
            >
              {loading ? "Processando..." : `Confirmar Pagamento — ${formatarValor(plano.valor)}`}
            </button>
            <button
              style={S.btnSecondary}
              onClick={() => navigate("/")}
              onMouseEnter={(e) => { e.target.style.color = "#f0ece4"; e.target.style.borderColor = "rgba(240,236,228,0.4)"; }}
              onMouseLeave={(e) => { e.target.style.color = "rgba(240,236,228,0.35)"; e.target.style.borderColor = "rgba(240,236,228,0.1)"; }}
            >
              Cancelar
            </button>
          </>
        )}
      </main>

      {/* ── TOAST ── */}
      {toast && (
        <div style={S.toast(toast.ok)}>
          {toast.ok ? "✓" : "✕"} &nbsp; {toast.msg}
        </div>
      )}
    </div>
  );
}
