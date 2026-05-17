import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
//import { loadMercadoPago } from "@mercadopago/sdk-js";

// ─── PUBLIC KEY do Mercado Pago ───────────────────────────────────────
// Troque por sua Public Key de TESTE (começa com TEST-...)
// Depois de validar, troque pela de produção (APP_USR-...)
//const MP_PUBLIC_KEY = "APP_USR-79991d9f-7628-4759-b8bb-b0fa5259240d";
//const MP_PUBLIC_KEY = "TEST-53f37eed-9061-4cf2-8484-c88e083f18c8";


// ─── Detecção de ambiente ─────────────────────────────────────────────
const isRailway = window.location.hostname.includes("railway.app");
const API = process.env.REACT_APP_API_URL || "http://localhost:3001";


// ─── Bandeiras por BIN (primeiros 6 dígitos) ─────────────────────────
function detectarBandeira(numero) {
  const n = numero.replace(/\s/g, "");
  if (/^4/.test(n)) return "visa";
  if (/^5[1-5]/.test(n)) return "master";
  if (/^3[47]/.test(n)) return "amex";
  if (/^(636368|438935|504175|451416|636297|5067|4576|4011)/.test(n)) return "elo";
  if (/^(301|305|3095|36|38)/.test(n)) return "diners";
  if (/^(6011|622|64[4-9]|65)/.test(n)) return "discover";
  if (/^(384100|384140|384160|606282|637095|637568)/.test(n)) return "hipercard";
  return "unknown";
}

function formatarCartao(v) {
  return v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
}
function formatarValidade(v) {
  return v.replace(/\D/g, "").slice(0, 4).replace(/^(\d{2})(\d)/, "$1/$2");
}
function formatarValor(v) {
  if (!v && v !== 0) return "—";
  return Number(v).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

// ─── Estilos ─────────────────────────────────────────────────────────
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
  divider: { width: 60, height: 2, background: "#c4a064", margin: "32px 0 48px" },
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

  // Abas de método de pagamento
  metodosGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 2,
    marginBottom: 40,
  },
  metodoCard: (sel) => ({
    padding: "20px 24px",
    background: sel ? "rgba(196,160,100,0.08)" : "rgba(255,255,255,0.02)",
    border: `1px solid ${sel ? "#c4a064" : "rgba(196,160,100,0.12)"}`,
    cursor: "pointer",
    transition: "all 0.25s ease",
    display: "flex",
    flexDirection: "column",
    gap: 6,
  }),
  metodoIcone: { fontSize: "1.6rem", marginBottom: 4 },
  metodoNome: {
    fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.1em",
    textTransform: "uppercase", color: "#f0ece4",
  },
  metodoDesc: { fontSize: "0.63rem", color: "rgba(240,236,228,0.35)", letterSpacing: "0.05em" },

  // Formulário cartão
  formGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 2,
    marginBottom: 32,
  },
  formGridFull: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: 2,
    marginBottom: 32,
  },
  fieldWrap: { display: "flex", flexDirection: "column", gap: 8 },
  label: {
    fontSize: "0.56rem", fontWeight: 600, letterSpacing: "0.3em",
    textTransform: "uppercase", color: "rgba(196,160,100,0.5)",
  },
  input: {
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(196,160,100,0.2)",
    padding: "14px 16px",
    color: "#f0ece4",
    fontFamily: "'Barlow', sans-serif",
    fontSize: "0.9rem",
    letterSpacing: "0.05em",
    outline: "none",
    transition: "border-color 0.2s",
    width: "100%",
    boxSizing: "border-box",
  },
  select: {
    background: "#111",
    border: "1px solid rgba(196,160,100,0.2)",
    padding: "14px 16px",
    color: "#f0ece4",
    fontFamily: "'Barlow', sans-serif",
    fontSize: "0.9rem",
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
    cursor: "pointer",
  },

  // Caixa de resumo/valor
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
    fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.25em",
    textTransform: "uppercase", color: "rgba(196,160,100,0.5)",
  },
  totalValor: {
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: "2.5rem", color: "#c4a064", letterSpacing: "0.04em", lineHeight: 1,
  },

  // Botões
  btnPrimary: (disabled) => ({
    fontFamily: "'Barlow', sans-serif",
    fontWeight: 700,
    fontSize: "0.8rem",
    letterSpacing: "0.2em",
    textTransform: "uppercase",
    padding: "18px 40px",
    background: disabled ? "rgba(196,160,100,0.3)" : "#c4a064",
    color: "#0a0a0a",
    border: "1px solid #c4a064",
    cursor: disabled ? "not-allowed" : "pointer",
    transition: "all 0.25s ease",
    width: "100%",
    marginBottom: 10,
    opacity: disabled ? 0.5 : 1,
  }),
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

  // Caixa de resultado PIX/Boleto
  resultBox: {
    background: "rgba(196,160,100,0.04)",
    border: "1px solid rgba(196,160,100,0.25)",
    padding: "32px",
    marginBottom: 24,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 20,
  },
  qrImg: { width: 220, height: 220, background: "#fff", padding: 8 },
  copiaCola: {
    width: "100%",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(196,160,100,0.15)",
    padding: "14px 16px",
    color: "rgba(240,236,228,0.7)",
    fontFamily: "monospace",
    fontSize: "0.75rem",
    wordBreak: "break-all",
    boxSizing: "border-box",
  },
  copyBtn: {
    fontFamily: "'Barlow', sans-serif",
    fontWeight: 600,
    fontSize: "0.7rem",
    letterSpacing: "0.2em",
    textTransform: "uppercase",
    padding: "12px 28px",
    background: "transparent",
    color: "#c4a064",
    border: "1px solid #c4a064",
    cursor: "pointer",
  },
  approvedBox: {
    background: "rgba(90,180,100,0.07)",
    border: "1px solid rgba(90,180,100,0.3)",
    padding: "32px",
    textAlign: "center",
    marginBottom: 24,
  },

  // Gate card (sem login / plano ativo)
  gateCard: {
    maxWidth: 440, margin: "0 auto", textAlign: "center",
    padding: "64px 48px",
    background: "rgba(255,255,255,0.02)",
    border: "1px solid rgba(196,160,100,0.15)",
  },
  gateTitulo: {
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: "2.5rem", letterSpacing: "0.04em", color: "#f0ece4", marginBottom: 12,
  },
  gateDesc: {
    fontSize: "0.85rem", fontWeight: 300,
    color: "rgba(240,236,228,0.4)", letterSpacing: "0.05em", marginBottom: 36,
  },

  // Bandeira do cartão
  bandeira: {
    fontSize: "0.65rem", color: "#c4a064", letterSpacing: "0.1em",
    textTransform: "uppercase", marginTop: 4,
  },

  // Info box simples
  infoBox: {
    background: "rgba(255,255,255,0.02)",
    border: "1px solid rgba(196,160,100,0.12)",
    padding: "24px 28px",
  },
  infoLabel: {
    fontSize: "0.58rem", fontWeight: 600, letterSpacing: "0.3em",
    textTransform: "uppercase", color: "rgba(196,160,100,0.45)", marginBottom: 8, display: "block",
  },
  infoValue: { fontSize: "1.1rem", color: "#f0ece4", fontWeight: 300 },
  infoValueBig: {
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: "2.2rem", letterSpacing: "0.04em", color: "#c4a064", lineHeight: 1,
  },
  grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, marginBottom: 40 },

  // Toast
  toast: (ok) => ({
    position: "fixed", bottom: 32, right: 32,
    padding: "14px 24px",
    background: ok ? "rgba(90,180,100,0.1)" : "rgba(224,85,85,0.1)",
    border: `1px solid ${ok ? "rgba(90,180,100,0.4)" : "rgba(224,85,85,0.4)"}`,
    color: ok ? "#6fcf7a" : "#e05555",
    fontSize: "0.72rem", letterSpacing: "0.1em", textTransform: "uppercase",
    fontFamily: "'Barlow', sans-serif", zIndex: 999,
  }),
};

// ─── Componentes auxiliares ───────────────────────────────────────────
function InfoBox({ label, value, big }) {
  return (
    <div style={S.infoBox}>
      <span style={S.infoLabel}>{label}</span>
      <span style={big ? S.infoValueBig : S.infoValue}>{value ?? "—"}</span>
    </div>
  );
}

function Campo({ label, children }) {
  return (
    <div style={S.fieldWrap}>
      <label style={S.label}>{label}</label>
      {children}
    </div>
  );
}

// ─── Tela principal ───────────────────────────────────────────────────
export default function TelaPagamento() {
  const navigate = useNavigate();
  const { idplano } = useParams();
  const [searchParams] = useSearchParams();
  const parcelasParam = Number(searchParams.get("parcelas") || 1);

  // ── Estado geral
  const token = localStorage.getItem("token");
  const [emailLogado, setEmailLogado] = useState(null);
  const [idAluno, setIdAluno] = useState(null);
  const [aluno, setAluno] = useState(null);
  const [plano, setPlano] = useState(null);
  const [mensalidadeDTO, setMensalidadeDTO] = useState(null);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(null);
  const [toast, setToast] = useState(null);
// adiciona junto aos outros estados
  const [carregandoAuth, setCarregandoAuth] = useState(true);
  
  //public key
  const [mpPublicKey, setMpPublicKey] = useState(null);


  // ── Método de pagamento
  const [metodo, setMetodo] = useState("pix"); // "pix" | "credit_card" | "boleto"

  // ── Formulário cartão
  const [cartaoNum, setCartaoNum] = useState("");
  const [cartaoNome, setCartaoNome] = useState("");
  const [cartaoValidade, setCartaoValidade] = useState("");
  const [cartaoCVV, setCartaoCVV] = useState("");
  const [parcelasCartao, setParcelasCartao] = useState(1);
  const bandeira = detectarBandeira(cartaoNum);

  // ── Resultado do pagamento
  const [resultado, setResultado] = useState(null); // response do backend
  const [copiado, setCopiado] = useState(false);

  // ── MP SDK
  const mpRef = useRef(null);

  // ── Valores calculados
  const agora = new Date();
const parcelaPendente = mensalidadeDTO?.parcelas
  ?.filter((p) => p.status === "PENDENTE")
  ?.sort((a, b) => new Date(a.dataVencimento) - new Date(b.dataVencimento))[0];

// CORRETO: nova assinatura = não tem parcela pendente
const ehNovaAssinatura = !parcelaPendente;

  const valorTotal = ehNovaAssinatura
    ? parcelasParam === 1
      ? plano?.valor * plano?.duracaomeses
      : plano?.valor
    : parcelaPendente?.valor;

  const jaTemPlanoAtivo =
    aluno?.statusAssinatura === "ATIVADO" &&
    mensalidadeDTO &&
    new Date(mensalidadeDTO.dataFim) > agora &&
    !!parcelaPendente;

  /* / ── Efeitos
  useEffect(() => {
  // Carrega o SDK v1 do MP via script — não exige montar campos no DOM
  const script = document.createElement("script");
  script.src = "https://sdk.mercadopago.com/js/v2";
  script.async = true;
  script.onload = () => {
    mpRef.current = new window.MercadoPago(MP_PUBLIC_KEY, {
      locale: "pt-BR",
    });
    console.log("MP SDK carregado");
  };
  document.body.appendChild(script);
 
  if (idAluno) {
    buscarAluno(idAluno);
    buscarMensalidade(idAluno);
  }
  if (idplano) buscarPlano();
 
  return () => {
    // limpa o script ao desmontar
    document.body.removeChild(script);
  };
}, []);
*/

// useEffect 1 — só busca a public key
useEffect(() => {
    fetch(`${API}/configuracao/public-key`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
    .then(res => res.json())
    .then(data => setMpPublicKey(data.publicKey))
        
}, []);

// useEffect 2 — só carrega o SDK quando a key já chegou
useEffect(() => {
    if (!mpPublicKey) return; // ← aguarda

    const script = document.createElement("script");
    script.src = "https://sdk.mercadopago.com/js/v2";
    script.async = true;
    script.onload = () => {
        mpRef.current = new window.MercadoPago(mpPublicKey, { locale: "pt-BR" }); // ✅ usa o estado
        
    };
    document.body.appendChild(script);

    return () => {
        if (document.body.contains(script)) document.body.removeChild(script);
    };
}, [mpPublicKey]); // ← só roda quando a key chegar

// useEffect 3 — autenticação e dados (sem o SDK aqui)
useEffect(() => {
    if (!token) {
        navigate(`/login/${idplano}`);
        return;
    }

    fetch(`${API}/alunos/me`, {
        headers: { Authorization: `Bearer ${token}` }
    })
        .then(res => {
            if (!res.ok) {
                localStorage.removeItem("token");
                navigate(`/login/${idplano}`);
                throw new Error("Não autenticado");
            }
            return res.json();
        })
        .then(data => {
            setEmailLogado(data.email);
            setIdAluno(data.id);
        })
        .catch(() => {})
        .finally(() => setCarregandoAuth(false));

    if (idplano) buscarPlano();
}, []);

useEffect(() => {
  if (!idAluno) return;
  buscarAluno(idAluno);
  buscarMensalidade(idAluno);
}, [idAluno]);



  async function buscarAluno(id) {
    try {
       const res = await fetch(`${API}/alunos/${id}`, {
        headers: { Authorization: `Bearer ${token}` }  // <-- adicionar
      });
      if (res.ok) setAluno(await res.json());
    } catch { setErro("Erro ao buscar dados do aluno."); }
  }

  async function buscarMensalidade(id) {
    try {
    const res = await fetch(`${API}/mensalidades/${id}`, {
      headers: { Authorization: `Bearer ${token}` }  // <-- adicionar
    });
      if (res.ok) setMensalidadeDTO(await res.json());
    } catch { /* sem mensalidade = nova assinatura */ }
  }

  async function buscarPlano() {
    try {
      const res = await fetch(`${API}/planos/${idplano}`, {
        headers: { Authorization: `Bearer ${token}` }  // <-- adicionar
      });
      if (res.ok) setPlano(await res.json());
      else setErro("Plano não encontrado.");
    } catch { setErro("Erro de conexão."); }
  }

  function mostrarToast(msg, ok) {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 4000);
  }

  // ── Copiar PIX
  function copiarPix() {
    navigator.clipboard.writeText(resultado.pixQrCode);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2500);
  }

  // ── Enviar pagamento
  async function confirmar() {
    if (!valorTotal) { mostrarToast("Valor não encontrado.", false); return; }
    setLoading(true);
    setErro(null);

    try {
      // ── NOVA ASSINATURA: primeiro cria mensalidade + parcelas
      let parcelaIdFinal = parcelaPendente?.id;

      if (ehNovaAssinatura) {
          const resMens = await fetch(`${API}/pagamentos`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`  // <-- adicionar
          },
          body: JSON.stringify({
            aluno: { id: Number(idAluno) },
            plano: { id: Number(idplano) },
            formaPagamento: metodo,
            codigoVenda: "",
            valorPago: valorTotal,
            parcelas: parcelasParam,
            pago: false,
            statusPagamento: "PENDENTE",
          }),
        });

        if (!resMens.ok) {
          mostrarToast("Erro ao criar mensalidade.", false);
          return;
        }

        // Recarrega mensalidade para pegar o id da parcela gerada
        const resMensAtual = await fetch(`${API}/mensalidades/${idAluno}`, {
          headers: { Authorization: `Bearer ${token}` }  // <-- adicionar
        });
        if (resMensAtual.ok) {
          const dadosMens = await resMensAtual.json();
          const primeiraPendente = dadosMens?.parcelas
            ?.filter((p) => p.status === "PENDENTE")
            ?.sort((a, b) => new Date(a.dataVencimento) - new Date(b.dataVencimento))[0];
          parcelaIdFinal = primeiraPendente?.id;
        }
      }

      if (!parcelaIdFinal) {
        mostrarToast("Parcela não encontrada.", false);
        return;
      }

      // ── Monta payload base
      const payload = {
        alunoId: Number(idAluno),
        parcelaId: parcelaIdFinal,
        planoId: Number(idplano),
        formaPagamento: metodo,
        valor: valorTotal,
      };

      // ── CARTÃO: gera token antes
      // ── CARTÃO: gera token antes
        if (metodo === "credit_card") {
          if (!mpRef.current) { mostrarToast("SDK do Mercado Pago não carregou.", false); return; }

          const [expMes, expAno] = cartaoValidade.split("/");
            
            if (!expMes || !expAno || cartaoNum.replace(/\s/g, "").length < 16) {
              mostrarToast("Preencha todos os dados do cartão corretamente.", false);
              setLoading(false);
              return;
            }
            
            let tokenData;
            try {
              // API correta para o SDK carregado via script
              tokenData = await mpRef.current.createCardToken({
                cardNumber:          cartaoNum.replace(/\s/g, ""),
                cardholderName:      cartaoNome.toUpperCase(),
                cardExpirationMonth: expMes,
                cardExpirationYear:  "20" + expAno,
                securityCode:        cartaoCVV,
                identificationType:   "CPF",
                identificationNumber: aluno?.cpf?.replace(/[^0-9]/g, "") || "",
              });
            } catch (mpErr) {
              console.error("MP token error:", mpErr);
              mostrarToast("Erro ao tokenizar cartão: " + (mpErr.message || "verifique os dados"), false);
              setLoading(false);
              return;
            }
            
            if (!tokenData?.id) {
              mostrarToast("Não foi possível gerar o token do cartão. Verifique os dados.", false);
              setLoading(false);
              return;
            }
            
            payload.cardToken       = tokenData.id;
            payload.paymentMethodId = bandeira;
            payload.numeroParcelas  = parcelasCartao;

        }

      // ── Chama o backend
      const res = await fetch(`${API}/mensalidades/abrirPagamentoTransparente`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`  // <-- adicionar
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const msg = await res.text();
        mostrarToast(msg || "Erro ao processar pagamento.", false);
        return;
      }

      const data = await res.json();
      setResultado(data);

      if (data.status === "approved") {
        mostrarToast("Pagamento aprovado! ✓", true);
      } else if (metodo === "pix") {
        mostrarToast("PIX gerado! Escaneie o QR code.", true);
      } else if (metodo === "boleto") {
        mostrarToast("Boleto gerado!", true);
      }

    } catch (e) {
      mostrarToast("Erro de conexão: " + e.message, false);
    } finally {
      setLoading(false);
    }
  }

  if (carregandoAuth) {
      return (
          <div style={{ ...S.page, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={S.bgGlow} />
              <p style={{ color: "rgba(196,160,100,0.5)", letterSpacing: "0.3em", fontSize: "0.7rem" }}>
                  CARREGANDO...
              </p>
          </div>
      );
  }

  // ─── Guards de navegação ─────────────────────────────────────────
  if (!emailLogado) {
    return (
      <div style={S.page}>
        <div style={S.bgGlow} />
        <div style={{ ...S.content, display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", paddingTop: 0 }}>
          <div style={S.gateCard}>
            <p style={S.eyebrow}>Acesso restrito</p>
            <h2 style={S.gateTitulo}>Login necessário</h2>
            <p style={S.gateDesc}>Para continuar, você precisa estar logado.</p>
            <button style={S.btnPrimary(false)} onClick={() => navigate(`/login/${idplano}`)}>Fazer Login</button>
            <button style={S.btnSecondary} onClick={() => navigate("/")}>← Voltar</button>
          </div>
        </div>
      </div>
    );
  }

  if (aluno && jaTemPlanoAtivo && aluno?.planoAtual !== null) {
    return (
      <div style={S.page}>
        <div style={S.bgGlow} />
        <div style={{ ...S.content, display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
          <div style={S.gateCard}>
            <p style={S.eyebrow}>Plano ativo</p>
            <h2 style={S.gateTitulo}>Você já possui um plano</h2>
            <p style={S.gateDesc}>Seu plano atual ainda está ativo.</p>
            <button style={S.btnPrimary(false)} onClick={() => navigate("/")}>Ir para minha área</button>
          </div>
        </div>
      </div>
    );
  }

  // ─── Resultado aprovado (cartão) ──────────────────────────────────
  if (resultado?.status === "approved") {
    return (
      <div style={S.page}>
        <div style={S.bgGlow} />
        <main style={S.content}>
          <p style={S.eyebrow}>Pagamento</p>
          <h1 style={S.titulo}>Paga<span style={S.tituloAccent}>mento</span></h1>
          <div style={S.divider} />
          <div style={S.approvedBox}>
            <div style={{ fontSize: "3rem", marginBottom: 16 }}>✓</div>
            <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "2rem", color: "#6fcf7a", letterSpacing: "0.1em" }}>
              Pagamento Aprovado!
            </p>
            <p style={{ fontSize: "0.8rem", color: "rgba(240,236,228,0.5)", marginTop: 8 }}>
              Seu acesso será ativado em instantes.
            </p>
          </div>
          <button style={S.btnPrimary(false)} onClick={() => navigate(`/home/conta/${idAluno}`)}>
            Ir para minha conta →
          </button>
        </main>
      </div>
    );
  }

  // ─── Tela principal ───────────────────────────────────────────────
  return (
    <div style={S.page}>
      <div style={S.bgGlow} />

      {/* NAV */}
      <nav className="nav-bar">
        <span style={{ marginRight: "auto", fontSize: "0.6rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(196,160,100,0.4)" }}>
          {emailLogado}
        </span>
        <button className="btn-sair" onClick={() => navigate("/")}>← Voltar</button>
      </nav>

      <main style={S.content}>
        <p style={S.eyebrow}>Finalizar assinatura</p>
        <h1 style={S.titulo}>
          Tela de<br />
          <span style={S.tituloAccent}>Pagamento</span>
        </h1>
        <div style={S.divider} />

        {erro && <p style={{ color: "#e05555", fontSize: "0.8rem", marginBottom: 24 }}>{erro}</p>}

        {/* RESUMO */}
        <p style={S.sectionLabel}>Resumo</p>
        <div style={S.grid2}>
          <InfoBox label="Plano" value={plano?.nome ?? "Mensalidade"} />
          <InfoBox label="Total" value={formatarValor(valorTotal)} big />
          {ehNovaAssinatura && (
            <>
              <InfoBox label="Duração" value={plano?.duracaomeses ? `${plano.duracaomeses} meses` : "—"} />
              <InfoBox label="Usuário" value={emailLogado} />
            </>
          )}
          {!ehNovaAssinatura && parcelaPendente && (
            <>
              <InfoBox label="Parcela nº" value={parcelaPendente.numeroParcela} />
              <InfoBox
                label="Vencimento"
                value={new Date(parcelaPendente.dataVencimento).toLocaleDateString("pt-BR")}
              />
            </>
          )}
        </div>

        {/* MÉTODO DE PAGAMENTO */}
        <p style={S.sectionLabel}>Método de pagamento</p>
        <div style={S.metodosGrid}>
          {[
            { id: "pix", icone: "⚡", nome: "PIX", desc: "Aprovação instantânea" },
            { id: "credit_card", icone: "💳", nome: "Cartão", desc: "Crédito em até 12x" },
            { id: "boleto", icone: "🧾", nome: "Boleto", desc: "Vence em 3 dias úteis" },
          ].map((m) => (
            <div
              key={m.id}
              style={S.metodoCard(metodo === m.id)}
              onClick={() => { setMetodo(m.id); setResultado(null); }}
            >
              <span style={S.metodoIcone}>{m.icone}</span>
              <span style={S.metodoNome}>{m.nome}</span>
              <span style={S.metodoDesc}>{m.desc}</span>
            </div>
          ))}
        </div>

        {/* FORMULÁRIO CARTÃO */}
        {metodo === "credit_card" && !resultado && (
          <>
            <p style={S.sectionLabel}>Dados do cartão</p>
            <div style={{ ...S.formGridFull, gridTemplateColumns: "1fr" }}>
              <Campo label="Número do cartão">
                <input
                  style={S.input}
                  placeholder="0000 0000 0000 0000"
                  value={cartaoNum}
                  maxLength={19}
                  onChange={(e) => setCartaoNum(formatarCartao(e.target.value))}
                />
                {bandeira !== "unknown" && cartaoNum.length > 4 && (
                  <span style={S.bandeira}>🏦 {bandeira.toUpperCase()}</span>
                )}
              </Campo>
            </div>
            <div style={S.formGrid}>
              <Campo label="Nome no cartão">
                <input
                  style={S.input}
                  placeholder="COMO ESTÁ NO CARTÃO"
                  value={cartaoNome}
                  onChange={(e) => setCartaoNome(e.target.value.toUpperCase())}
                />
              </Campo>
              <Campo label="Validade">
                <input
                  style={S.input}
                  placeholder="MM/AA"
                  value={cartaoValidade}
                  maxLength={5}
                  onChange={(e) => setCartaoValidade(formatarValidade(e.target.value))}
                />
              </Campo>
              <Campo label="CVV">
                <input
                  style={S.input}
                  placeholder="123"
                  value={cartaoCVV}
                  maxLength={4}
                  onChange={(e) => setCartaoCVV(e.target.value.replace(/\D/g, ""))}
                />
              </Campo>
              <Campo label="Parcelas">
                <select
                  style={S.select}
                  value={parcelasCartao}
                  onChange={(e) => setParcelasCartao(Number(e.target.value))}
                >
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => (
                    <option key={n} value={n}>
                      {n}x de {formatarValor(valorTotal / n)}
                      {n === 1 ? " (à vista)" : ""}
                    </option>
                  ))}
                </select>
              </Campo>
            </div>
          </>
        )}

        {/* AVISO PIX */}
        {metodo === "pix" && !resultado && (
          <div style={{ ...S.infoBox, marginBottom: 32, textAlign: "center" }}>
            <span style={{ fontSize: "2rem" }}>⚡</span>
            <p style={{ ...S.infoValue, marginTop: 12 }}>
              Clique em confirmar para gerar o QR Code PIX.<br />
              <span style={{ color: "rgba(240,236,228,0.4)", fontSize: "0.78rem" }}>
                Válido por 30 minutos. Aprovação instantânea.
              </span>
            </p>
          </div>
        )}

        {/* AVISO BOLETO */}
        {metodo === "boleto" && !resultado && (
          <div style={{ ...S.infoBox, marginBottom: 32, textAlign: "center" }}>
            <span style={{ fontSize: "2rem" }}>🧾</span>
            <p style={{ ...S.infoValue, marginTop: 12 }}>
              Clique em confirmar para gerar o boleto.<br />
              <span style={{ color: "rgba(240,236,228,0.4)", fontSize: "0.78rem" }}>
                Vence em 3 dias úteis. Compensação em até 2 dias após pagamento.
              </span>
            </p>
          </div>
        )}

        {/* RESULTADO PIX */}
{resultado && metodo === "pix" && resultado.pixQrCode && (
  <div style={S.resultBox}>
    <p style={S.sectionLabel}>Escaneie o QR Code</p>
    {resultado.pixQrCodeBase64 && (
      <img
        src={`data:image/png;base64,${resultado.pixQrCodeBase64}`}
        alt="QR Code PIX"
        style={S.qrImg}
      />
    )}
    <p style={{ ...S.label, marginBottom: 8 }}>Ou copie o código:</p>
    <div style={S.copiaCola}>{resultado.pixQrCode}</div>
    <button style={S.copyBtn} onClick={copiarPix}>
      {copiado ? "✓ Copiado!" : "Copiar código PIX"}
    </button>

    {/* ← ADICIONAR ISSO */}
    <button
      style={{
        ...S.btnPrimary(false),
        marginTop: 24,
        width: "100%",
        background: "transparent",
        border: "1px solid rgba(196,160,100,0.4)",
        color: "#c4a064",
      }}
      onClick={() => navigate(`/home/conta/${idAluno}`)}
    >
      Já paguei — ver minha conta →
    </button>
    <p style={{ fontSize: "0.7rem", color: "rgba(240,236,228,0.35)", textAlign: "center", marginTop: 8 }}>
      Seu acesso é liberado automaticamente após o pagamento ser confirmado.
    </p>
    {/* ← FIM */}

  </div>
)}

        {/* RESULTADO BOLETO */}
        {resultado && metodo === "boleto" && (
          <div style={S.resultBox}>
            <p style={S.sectionLabel}>Boleto gerado</p>
            {resultado.boletoBarCode && (
              <>
                <p style={S.label}>Código de barras:</p>
                <div style={S.copiaCola}>{resultado.boletoBarCode}</div>
                <button
                  style={S.copyBtn}
                  onClick={() => navigator.clipboard.writeText(resultado.boletoBarCode)}
                >
                  Copiar código
                </button>
              </>
            )}
            {resultado.boletoUrl && (
              <a
                href={resultado.boletoUrl}
                target="_blank"
                rel="noreferrer"
                style={{ ...S.copyBtn, textDecoration: "none", display: "inline-block" }}
              >
                📄 Abrir PDF do Boleto
              </a>
            )}
            <p style={{ fontSize: "0.7rem", color: "rgba(240,236,228,0.35)", textAlign: "center" }}>
              Vence em 3 dias úteis. Sua conta será ativada após compensação.
            </p>
          </div>
        )}

        {/* TOTAL */}
        {!resultado && (
          <div style={S.totalBox}>
            <div>
              <p style={S.totalLabel}>Total a pagar</p>
              {metodo === "credit_card" && parcelasCartao > 1 && (
                <p style={{ fontSize: "0.7rem", color: "rgba(196,160,100,0.5)", marginTop: 4 }}>
                  {parcelasCartao}x de {formatarValor(valorTotal / parcelasCartao)}
                </p>
              )}
            </div>
            <p style={S.totalValor}>{formatarValor(valorTotal)}</p>
          </div>
        )}

        {/* BOTÃO CONFIRMAR */}
        {!resultado && (
          <button
            style={S.btnPrimary(loading)}
            disabled={loading}
            onClick={confirmar}
          >
            {loading
              ? "Processando..."
              : metodo === "pix"
              ? `Gerar PIX — ${formatarValor(valorTotal)}`
              : metodo === "boleto"
              ? `Gerar Boleto — ${formatarValor(valorTotal)}`
              : `Pagar com Cartão — ${formatarValor(valorTotal)}`}
          </button>
        )}



        <button
          style={S.btnSecondary}
          onClick={() => navigate("/")}
          onMouseEnter={(e) => { e.target.style.color = "#f0ece4"; e.target.style.borderColor = "rgba(240,236,228,0.4)"; }}
          onMouseLeave={(e) => { e.target.style.color = "rgba(240,236,228,0.35)"; e.target.style.borderColor = "rgba(240,236,228,0.1)"; }}
        >
          Cancelar
        </button>
      </main>

      {toast && (
        <div style={S.toast(toast.ok)}>
          {toast.ok ? "✓" : "✕"} &nbsp; {toast.msg}
        </div>
      )}
    </div>
  );
}
