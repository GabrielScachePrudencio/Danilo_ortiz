import { useState, useEffect } from "react";
import { useNavigate, useParams  } from "react-router-dom";

/* ─── paleta de cores centralizada ─────────────────────────────────── */
const PALETTE = {
  bgPage: "#0a0a0a",
  textPrimary: "#f0ece4",
  accent: "#c4a064", // Dourado principal
  
  // Variações do Accent (Dourado) com Opacidade
  accentGlow: "rgba(196,160,100,0.1)",
  accentBorder: "rgba(196,160,100,0.2)",
  accentBorderLight: "rgba(196,160,100,0.15)",
  accentBorderSoft: "rgba(196,160,100,0.12)",
  accentBorderUltraLight: "rgba(196,160,100,0.1)",
  accentBgBadge: "rgba(196,160,100,0.06)",
  accentTextMuted: "rgba(196,160,100,0.5)",
  accentTextUltraMuted: "rgba(196,160,100,0.3)",
  accentBorderOutlined: "rgba(196,160,100,0.4)",

  // Variações do Texto Primário / Brancos com Opacidade
  whiteCardBg: "rgba(255,255,255,0.02)",
  whiteInputBg: "rgba(255,255,255,0.03)",
  textSecondaryBtn: "rgba(240,236,228,0.35)",
  borderSecondaryBtn: "rgba(240,236,228,0.1)",

  // Estados de Feedback (Erro e Sucesso)
  error: "#e05555",
  errorBorder: "rgba(224,85,85,0.3)",
  errorBg: "rgba(224,85,85,0.05)",
  
  success: "#6fcf7a",
  successBorder: "rgba(111,207,122,0.3)",
  successBg: "rgba(111,207,122,0.05)",
};

/* ─── estilos locais ─────────────────────────────────────────────────── */
const S = {
  page: {
    minHeight: "100vh",
    background: PALETTE.bgPage,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Barlow', sans-serif",
    position: "relative",
    overflow: "hidden",
  },
  bgGlow: {
    position: "fixed",
    inset: 0,
    background: `radial-gradient(ellipse 70% 50% at 50% 0%, ${PALETTE.accentGlow} 0%, transparent 70%)`,
    pointerEvents: "none",
    zIndex: 0,
  },
  card: {
    position: "relative",
    zIndex: 1,
    width: "100%",
    maxWidth: 440,
    padding: "56px 48px",
    background: PALETTE.whiteCardBg,
    border: `1px solid ${PALETTE.accentBorder}`,
    display: "flex",
    flexDirection: "column",
    gap: 0,
  },
  logo: {
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: "3.5rem",
    letterSpacing: "0.06em",
    color: PALETTE.textPrimary,
    lineHeight: 1,
    marginBottom: 4,
    textAlign: "center",
  },
  logoAccent: {
    color: PALETTE.accent,
  },
  eyebrow: {
    fontSize: "0.6rem",
    fontWeight: 600,
    letterSpacing: "0.35em",
    textTransform: "uppercase",
    color: PALETTE.accentTextMuted,
    textAlign: "center",
    marginBottom: 40,
  },
  planoBadge: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "10px 16px",
    background: PALETTE.accentBgBadge,
    border: `1px solid ${PALETTE.accentBorder}`,
    marginBottom: 32,
  },
  planoBadgeLabel: {
    fontSize: "0.6rem",
    fontWeight: 600,
    letterSpacing: "0.25em",
    textTransform: "uppercase",
    color: PALETTE.accentTextMuted,
  },
  planoBadgeValue: {
    fontSize: "0.75rem",
    fontWeight: 600,
    letterSpacing: "0.1em",
    color: PALETTE.accent,
    marginLeft: "auto",
  },
  divider: {
    width: "100%",
    height: 1,
    background: PALETTE.accentBorderSoft,
    margin: "8px 0 32px",
  },
  formTitle: {
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: "1.8rem",
    letterSpacing: "0.05em",
    color: PALETTE.textPrimary,
    marginBottom: 28,
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: "0.58rem",
    fontWeight: 600,
    letterSpacing: "0.25em",
    textTransform: "uppercase",
    color: PALETTE.accentTextMuted,
  },
  input: {
    background: PALETTE.whiteInputBg,
    border: `1px solid ${PALETTE.accentBorderLight}`,
    borderRadius: 0,
    color: PALETTE.textPrimary,
    fontFamily: "'Barlow', sans-serif",
    fontSize: "0.9rem",
    padding: "12px 16px",
    outline: "none",
    transition: "border-color 0.2s ease",
    width: "100%",
  },
  actions: {
    marginTop: 28,
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  btnPrimary: {
    fontFamily: "'Barlow', sans-serif",
    fontWeight: 600,
    fontSize: "0.75rem",
    letterSpacing: "0.2em",
    textTransform: "uppercase",
    padding: "14px",
    background: PALETTE.accent,
    color: PALETTE.bgPage,
    border: `1px solid ${PALETTE.accent}`,
    cursor: "pointer",
    transition: "all 0.25s ease",
    width: "100%",
  },
  btnSecondary: {
    fontFamily: "'Barlow', sans-serif",
    fontWeight: 400,
    fontSize: "0.7rem",
    letterSpacing: "0.15em",
    textTransform: "uppercase",
    padding: "12px",
    background: "transparent",
    color: PALETTE.textSecondaryBtn,
    border: `1px solid ${PALETTE.borderSecondaryBtn}`,
    cursor: "pointer",
    transition: "all 0.25s ease",
    width: "100%",
  },
  btnOutlined: {
    fontFamily: "'Barlow', sans-serif",
    fontWeight: 600,
    fontSize: "0.75rem",
    letterSpacing: "0.2em",
    textTransform: "uppercase",
    padding: "14px",
    background: "transparent",
    color: PALETTE.accent,
    border: `1px solid ${PALETTE.accentBorderOutlined}`,
    cursor: "pointer",
    transition: "all 0.25s ease",
    width: "100%",
  },
  erroMsg: {
    fontSize: "0.75rem",
    letterSpacing: "0.05em",
    color: PALETTE.error,
    padding: "10px 14px",
    border: `1px solid ${PALETTE.errorBorder}`,
    background: PALETTE.errorBg,
    marginBottom: 20,
    textAlign: "center",
  },
  successMsg: {
    fontSize: "0.75rem",
    letterSpacing: "0.05em",
    color: PALETTE.success,
    padding: "10px 14px",
    border: `1px solid ${PALETTE.successBorder}`,
    background: PALETTE.successBg,
    marginBottom: 20,
    textAlign: "center",
  },
  separador: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    margin: "4px 0",
  },
  separadorLine: {
    flex: 1,
    height: 1,
    background: PALETTE.accentBorderUltraLight,
  },
  separadorText: {
    fontSize: "0.6rem",
    letterSpacing: "0.2em",
    textTransform: "uppercase",
    color: PALETTE.accentTextUltraMuted,
  },
  loadingOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(10, 10, 10, 0.85)",
    backdropFilter: "blur(6px)",
    zIndex: 9999,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  spinner: {
    width: 40,
    height: 40,
    border: "3px solid rgba(196, 160, 100, 0.15)",
    borderTop: "3px solid #c4a064",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
  loadingText: {
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: "1.5rem",
    letterSpacing: "0.1em",
    color: "#f0ece4",
  }
};

/* ─── componente de input ────────────────────────────────────────────── */
function Campo({ label, name, type = "text", value, onChange, placeholder }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={S.inputGroup}>
      <label style={S.inputLabel}>{label}</label>
      <input
        type={type}
        name={name}
        placeholder={placeholder ?? label}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          ...S.input,
          borderColor: focused
            ? "rgba(196,160,100,0.6)"
            : "rgba(196,160,100,0.15)",
        }}
      />
    </div>
  );
}

/* ─── campo estilo Conta.js ──────────────────────────────────────────── */
function CampoForm({ label, name, type = "text", value, onChange, placeholder }) {
  const [focused, setFocused] = useState(false);
  return (
    <div
      style={{
        background: focused ? "rgba(196,160,100,0.04)" : "rgba(255,255,255,0.02)",
        border: `1px solid ${focused ? "rgba(196,160,100,0.35)" : "rgba(196,160,100,0.1)"}`,
        padding: "20px 24px",
        transition: "all 0.25s ease",
      }}
      onMouseEnter={(e) => { if (!focused) { e.currentTarget.style.borderColor = "rgba(196,160,100,0.35)"; e.currentTarget.style.background = "rgba(196,160,100,0.04)"; } }}
      onMouseLeave={(e) => { if (!focused) { e.currentTarget.style.borderColor = "rgba(196,160,100,0.1)"; e.currentTarget.style.background = "rgba(255,255,255,0.02)"; } }}
    >
      <label style={{
        display: "block", fontSize: "0.6rem", fontWeight: 600,
        letterSpacing: "0.25em", textTransform: "uppercase",
        color: "rgba(196,160,100,0.5)", marginBottom: 10,
      }}>
        {label}
      </label>
      <input
        type={type}
        name={name}
        placeholder={placeholder ?? ""}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: "100%", boxSizing: "border-box",
          background: "transparent", border: "none",
          borderBottom: `1px solid ${focused ? "#c4a064" : "rgba(196,160,100,0.3)"}`,
          color: "#f0ece4", fontFamily: "'Barlow', sans-serif",
          fontSize: "0.95rem", padding: "4px 0", outline: "none",
          transition: "border-color 0.2s",
        }}
      />
    </div>
  );
}



/* ─── página principal ───────────────────────────────────────────────── */
export default function Login() {
  const navigate = useNavigate();
  const { idplano } = useParams();

  const API = process.env.REACT_APP_API_URL || "http://localhost:3001";
  const url = API + "/alunos";

  useEffect(() => {
    fetch(`${API}/health`).catch(() => {
      // ignora erro silenciosamente, é só um "wake up call"
    });
  }, [API]);

  const [modo, setModo] = useState(null); // null | "login" | "cadastro"
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("Carregando...");
  const [erro, setErro] = useState(null);
  const [sucesso, setSucesso] = useState(null);

  const [subEtapaAdmin, setSubEtapaAdmin] = useState("cpf"); // "email" | "senha"
  const [cpfAdminCriado, setCpfAdminCriado] = useState("");

  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  const [formLogin, setFormLogin] = useState({ email: "", senha: "" });
  const [formCadastro, setFormCadastro] = useState({ 
    nome: "", 
    email: "", 
    senha: "", 
    whatsapp: "",
    cpf: "",
    cnpj: "",
    rua: "",
    numero: "",
    bairro: "",
    cidade: "",
    estado: "",
    cep: ""
  });

  
  function handleLogin(e) {
    setFormLogin({ ...formLogin, [e.target.name]: e.target.value });
  }

  function handleCadastro(e) {
    let { name, value } = e.target;

    if (name === "cep")    value = value.replace(/\D/g, "").slice(0, 8);
    if (name === "cpf")    value = value.replace(/\D/g, "").slice(0, 11);
    if (name === "cnpj")   value = value.replace(/\D/g, "").slice(0, 14);
    if (name === "numero") value = value.replace(/\D/g, "");
    if (name === "whatsapp") {
      value = value.replace(/\D/g, "");
      if (value.startsWith("55")) {
        value = value.slice(2);
      }
      value = value.slice(0, 11);
      value = "55" + value;
    }

    setFormCadastro({ ...formCadastro, [name]: value });
  }

  function limpar() {
    setErro(null);
    setSucesso(null);
  }

  function voltar() {
    limpar();
    setModo(null);
  }

  async function buscarUsuarioERedirecionar(token) {
  try {
    const resMe = await fetch(`${API}/alunos/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!resMe.ok) {
      setErro("Erro ao carregar os dados do perfil.");
      setLoading(false); // <-- desliga o loading no erro
      return;
    }

    const aluno = await resMe.json();

    if (aluno.tipoUsuario) {
      localStorage.setItem("tipo_usuario", aluno.tipoUsuario);
    }

    const tipo = aluno.tipoUsuario?.toUpperCase();

    setLoadingText("Redirecionando...");

    if (tipo === "ADMIN") {
      navigate("/home/administrativonovo");
    } else if (idplano) {
      navigate(`/home/telapagamento/${idplano}`);
    } else {
      navigate("/");
    }
    // loading continua true aqui de propósito: a navegação vai
    // desmontar essa tela em seguida, então não precisa desligar.
  } catch (err) {
    setErro("Erro de conexão ao validar o perfil.");
    setLoading(false); // <-- desliga o loading no erro
  }
}

async function logar() {
  limpar();
  setLoadingText("Autenticando...");
  setLoading(true);
  try {
    const res = await fetch(url + "/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formLogin),
    });

    if (res.status === 401) {
      setErro("E-mail ou senha incorretos.");
      setLoading(false); // <-- desliga o loading no erro
      return;
    }

    if (!res.ok) {
      setErro("Erro no servidor. Tente novamente.");
      setLoading(false); // <-- desliga o loading no erro
      return;
    }

    const token = await res.text();
    localStorage.setItem("token", token);

    setLoadingText("Carregando perfil...");
    await buscarUsuarioERedirecionar(token);

  } catch (e) {
    setErro("Erro de conexão com o servidor.");
    setLoading(false); // <-- desliga o loading no erro
  }
}
  async function verificarContaCriadaPeloAdmin() {
    limpar();

    if (!cpfAdminCriado || cpfAdminCriado.trim() === "") {
      setErro("Informe o CPF.");
      return;
    }

    const cpfLimpo = cpfAdminCriado.replace(/\D/g, "");

    setLoadingText("Verificando CPF...");
    setLoading(true);
    try {
      const res = await fetch(
        `${API}/alunos/verifica-criado-admin?cpf=${encodeURIComponent(cpfLimpo)}`
      );

      if (!res.ok) {
        setErro("Não encontramos uma conta pendente com esse CPF.");
        return;
      }

      setSubEtapaAdmin("senha");
    } catch {
      setErro("Erro de conexão com o servidor.");
    } finally {
      setLoading(false);
    }
  }

  async function definirSenhaContaAdmin() {
    limpar();

    if (!novaSenha || novaSenha.length < 6) {
      setErro("A senha deve ter pelo menos 6 caracteres.");
      return;
    }
    if (novaSenha !== confirmarSenha) {
      setErro("As senhas não coincidem.");
      return;
    }

    const cpfLimpo = cpfAdminCriado.replace(/\D/g, "");

    setLoadingText("Salvando senha...");
    setLoading(true);
    try {
      const res = await fetch(`${API}/alunos/definir-senha`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cpf: cpfLimpo, novaSenha }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setErro(data?.message || "Erro ao definir senha.");
        return;
      }

      setSucesso("Senha definida com sucesso! Faça login para continuar.");
      setTimeout(() => {
        setModo("login");
        setSubEtapaAdmin("cpf");
        setCpfAdminCriado("");
        setNovaSenha("");
        setConfirmarSenha("");
        limpar();
      }, 1500);
    } catch {
      setErro("Erro de conexão com o servidor.");
    } finally {
      setLoading(false);
    }
  }

  async function cadastrar() {
    limpar();
    const obrigatorios = [
      { campo: "nome",    label: "Nome Completo" },
      { campo: "email",   label: "E-mail"        },
      { campo: "senha",   label: "Senha"         },
      { campo: "whatsapp",label: "WhatsApp"      },
      { campo: "cpf",     label: "CPF"           },
    ];

    for (const { campo, label } of obrigatorios) {
      if (!formCadastro[campo] || formCadastro[campo].trim() === "") {
        setErro(`O campo "${label}" é obrigatório.`);
        return;
      }
    }
    if (formCadastro.whatsapp.length !== 13) {
      setErro("O WhatsApp deve conter DDD + número.");
      return;
    }
    if (formCadastro.senha.length < 6) {
      setErro("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    setLoadingText("Criando conta...");
    setLoading(true);
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formCadastro),
      });

      if (res.ok) {
        setSucesso("Conta criada com sucesso!");
        setTimeout(() => voltar(), 1200);
      } else {
        setErro("Erro ao cadastrar. Verifique os dados.");
      }
    } catch {
      setErro("Erro de conexão com o servidor.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={S.page}>
      <div style={S.bgGlow} />

      {/* Tela de Loading Global / Overlay */}
      {loading && (
        <div style={S.loadingOverlay}>
          <div style={S.spinner} />
          <p style={S.loadingText}>{loadingText}</p>
        </div>
      )}

      <div style={S.card}>
        <h1 style={S.logo}>
          Sis<span style={S.logoAccent}>Run</span>
        </h1>
        <p style={S.eyebrow}>Elite Training Platform</p>

        {idplano && (
          <div style={S.planoBadge}>
            <span style={S.planoBadgeLabel}>Plano selecionado</span>
            <span style={S.planoBadgeValue}>#{idplano}</span>
          </div>
        )}


        {modo === null && (
          <>
            <div style={S.divider} />
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <button
                style={S.btnPrimary}
                onClick={() => { limpar(); setModo("login"); }}
              >
                Entrar
              </button>

              <div style={S.separador}>
                <div style={S.separadorLine} />
                <span style={S.separadorText}>ou</span>
                <div style={S.separadorLine} />
              </div>

              <button
                style={S.btnOutlined}
                onClick={() => { limpar(); setModo("cadastro"); }}
              >
                Criar conta
              </button>

              <button
                style={{ ...S.btnSecondary, marginTop: 4 }}
                onClick={() => { limpar(); setModo("admin-criado"); }}
              >
                Administrador criou minha conta
              </button>
            </div>
          </>
        )}

        {modo === "login" && (
          <>
            <p style={S.formTitle}>Entrar</p>

            <Campo label="E-mail" name="email" type="email" value={formLogin.email} onChange={handleLogin} />
            <Campo label="Senha" name="senha" type="password" value={formLogin.senha} onChange={handleLogin} />

            <div style={S.actions}>
              <button
                style={{ ...S.btnPrimary, opacity: loading ? 0.6 : 1 }}
                onClick={logar}
                disabled={loading}
              >
                Entrar
              </button>

              <button style={S.btnSecondary} onClick={voltar}>
                ← Voltar
              </button>
            </div>
          </>
        )}

        {modo === "admin-criado" && (
          <>
            {subEtapaAdmin === "cpf" && (
              <>
                <p style={S.formTitle}>Definir senha de acesso</p>
                <p style={{ fontSize: "0.75rem", color: "rgba(240,236,228,0.5)", marginBottom: 20 }}>
                  Informe o CPF que o administrador cadastrou pra você.
                </p>

                <Campo
                  label="CPF"
                  name="cpfAdminCriado"
                  type="text"
                  placeholder="000.000.000-00"
                  value={cpfAdminCriado}
                  onChange={(e) => {
                    let val = e.target.value.replace(/\D/g, "").slice(0, 11);
                    setCpfAdminCriado(val);
                  }}
                />

                <div style={S.actions}>
                  <button
                    style={{ ...S.btnPrimary, opacity: loading ? 0.6 : 1 }}
                    onClick={verificarContaCriadaPeloAdmin}
                    disabled={loading}
                  >
                    Continuar
                  </button>

                  <button style={S.btnSecondary} onClick={voltar}>
                    ← Voltar
                  </button>
                </div>
              </>
            )}

            {subEtapaAdmin === "senha" && (
              <>
                <p style={S.formTitle}>Crie sua senha</p>
                <p style={{ fontSize: "0.75rem", color: "rgba(240,236,228,0.5)", marginBottom: 20 }}>
                  Conta encontrada. Agora defina uma senha pra acessar.
                </p>

                <Campo
                  label="Nova senha"
                  name="novaSenha"
                  type="password"
                  value={novaSenha}
                  onChange={(e) => setNovaSenha(e.target.value)}
                />
                <Campo
                  label="Confirmar senha"
                  name="confirmarSenha"
                  type="password"
                  value={confirmarSenha}
                  onChange={(e) => setConfirmarSenha(e.target.value)}
                />

                <div style={S.actions}>
                  <button
                    style={{ ...S.btnPrimary, opacity: loading ? 0.6 : 1 }}
                    onClick={definirSenhaContaAdmin}
                    disabled={loading}
                  >
                    Salvar senha
                  </button>

                  <button style={S.btnSecondary} onClick={() => setSubEtapaAdmin("cpf")}>
                    ← Voltar
                  </button>
                </div>
              </>
            )}
          </>
        )}
        <br></br>
{erro && (
  <div style={{
    ...S.erroMsg,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 8,
    marginBottom: 20,
  }}>
    <span>{erro}</span>
    <button
      onClick={() => {
        setErro(null);
        if (modo === "login") logar();
        else if (modo === "cadastro") cadastrar();
        else if (modo === "admin-criado") {
          subEtapaAdmin === "cpf" ? verificarContaCriadaPeloAdmin() : definirSenhaContaAdmin();
        }
      }}
      style={{
        fontFamily: "'Barlow', sans-serif",
        fontSize: "0.65rem",
        fontWeight: 600,
        letterSpacing: "0.15em",
        textTransform: "uppercase",
        background: "transparent",
        color: PALETTE.error,
        border: `1px solid ${PALETTE.errorBorder}`,
        padding: "6px 16px",
        cursor: "pointer",
        transition: "all 0.2s ease",
      }}
    >
      Tentar novamente
    </button>
  </div>
)}
{sucesso && <p style={S.successMsg}>✓ &nbsp;{sucesso}</p>}
        {modo === "cadastro" && (
          <div style={{
            position: "fixed", inset: 0, zIndex: 100,
            background: "#0a0a0a",
            overflowY: "auto",
            fontFamily: "'Barlow', sans-serif",
          }}>
            <div style={{
              position: "fixed", inset: 0, pointerEvents: "none",
              background: "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(196,160,100,0.08) 0%, transparent 70%)",
            }} />

            <div style={{
              position: "sticky", top: 0, zIndex: 10,
              borderBottom: "1px solid rgba(196,160,100,0.1)",
              background: "rgba(10,10,10,0.95)",
              backdropFilter: "blur(8px)",
              padding: "20px 48px",
              display: "flex", alignItems: "center", justifyContent: "space-between",
            }}>
              <div>
                <p style={{
                  fontSize: "0.55rem", letterSpacing: "0.35em", textTransform: "uppercase",
                  color: "rgba(196,160,100,0.5)", marginBottom: 4,
                }}>
                  SisRun — Elite Training Platform
                </p>
                <h1 style={{
                  fontFamily: "'Bebas Neue', sans-serif", fontSize: "2rem",
                  letterSpacing: "0.06em", color: "#f0ece4", lineHeight: 1,
                }}>
                  Criar <span style={{ color: "#c4a064" }}>Conta</span>
                </h1>
              </div>

              <button
                onClick={voltar}
                style={{
                  background: "transparent", border: "1px solid rgba(240,236,228,0.12)",
                  color: "rgba(240,236,228,0.4)", cursor: "pointer",
                  fontFamily: "'Barlow', sans-serif", fontSize: "0.65rem",
                  letterSpacing: "0.15em", textTransform: "uppercase",
                  padding: "8px 18px", transition: "all 0.2s",
                }}
              >
                ← Voltar
              </button>
            </div>

            <div style={{ maxWidth: 860, margin: "0 auto", padding: "48px 48px 100px", position: "relative", zIndex: 1 }}>

              {erro    && <p style={{ ...S.erroMsg,    marginBottom: 32 }}>{erro}</p>}
              {sucesso && <p style={{ ...S.successMsg, marginBottom: 32 }}>✓ &nbsp;{sucesso}</p>}

              <p style={{
                fontSize: "0.6rem", fontWeight: 600, letterSpacing: "0.35em",
                textTransform: "uppercase", color: "rgba(196,160,100,0.5)",
                marginBottom: 24, paddingBottom: 12,
                borderBottom: "1px solid rgba(196,160,100,0.1)",
              }}>
                Acesso
              </p>

              <div style={{
                display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: 2, marginBottom: 48,
              }}>
                {[
                  { label: "E-mail",  name: "email", type: "email"    },
                  { label: "Senha",   name: "senha", type: "password" },
                ].map(({ label, name, type }) => (
                  <CampoForm key={name} label={label} name={name} type={type}
                    value={formCadastro[name]} onChange={handleCadastro} />
                ))}
              </div>

              <p style={{
                fontSize: "0.6rem", fontWeight: 600, letterSpacing: "0.35em",
                textTransform: "uppercase", color: "rgba(196,160,100,0.5)",
                marginBottom: 24, paddingBottom: 12,
                borderBottom: "1px solid rgba(196,160,100,0.1)",
              }}>
                Dados Pessoais
              </p>

              <div style={{
                display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: 2, marginBottom: 48,
              }}>
                {[
                  { label: "Nome Completo", name: "nome",    type: "text" },
                  { label: "WhatsApp",      name: "whatsapp", type: "text", placeholder: "(11) 99999-9999" },
                  { label: "CPF",           name: "cpf",      type: "text" },
                  { label: "CNPJ",          name: "cnpj",     type: "text" },
                ].map(({ label, name, type, placeholder }) => (
                  <CampoForm key={name} label={label} name={name} type={type}
                    placeholder={placeholder} value={formCadastro[name]} onChange={handleCadastro} />
                ))}
              </div>

              <p style={{
                fontSize: "0.6rem", fontWeight: 600, letterSpacing: "0.35em",
                textTransform: "uppercase", color: "rgba(196,160,100,0.5)",
                marginBottom: 24, paddingBottom: 12,
                borderBottom: "1px solid rgba(196,160,100,0.1)",
              }}>
                Endereço
              </p>

              <div style={{
                display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: 2, marginBottom: 48,
              }}>
                {[
                { label: "CEP",    name: "cep",    type: "text"   },
                { label: "Rua",    name: "rua",    type: "text"   },
                { label: "Número", name: "numero", type: "number" },
                { label: "Bairro", name: "bairro", type: "text"   },
                { label: "Cidade", name: "cidade", type: "text"   },
                { label: "Estado", name: "estado", type: "text", placeholder: "SP" },
              ].map(({ label, name, type, placeholder }) => (
                <CampoForm key={name} label={label} name={name} type={type}
                  placeholder={placeholder} value={formCadastro[name]} onChange={handleCadastro} />
              ))}
              </div>

              <div style={{
                display: "flex", justifyContent: "flex-end", gap: 12,
                paddingTop: 24, borderTop: "1px solid rgba(196,160,100,0.1)",
              }}>
                <button
                  style={{ ...S.btnSecondary, width: "auto", padding: "12px 24px" }}
                  onClick={voltar}
                >
                  Cancelar
                </button>
                <button
                  style={{ ...S.btnPrimary, width: "auto", padding: "12px 32px", opacity: loading ? 0.6 : 1 }}
                  onClick={cadastrar}
                  disabled={loading}
                >
                  {loading ? "Cadastrando..." : "Criar Conta →"}
                </button>
              </div>

            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        input:-webkit-autofill {
          -webkit-box-shadow: 0 0 0 100px #0a0a0a inset !important;
          -webkit-text-fill-color: #f0ece4 !important;
        }
      `}</style>
    </div>
  );
}