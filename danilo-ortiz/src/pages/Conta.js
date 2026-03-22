import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

/* ─── estilos ─────────────────────────────────────────────────────────── */
const S = {
  gateCard: {
    maxWidth: 440, margin: "0 auto", textAlign: "center",
    padding: "64px 48px", background: "rgba(255,255,255,0.02)",
    border: "1px solid rgba(196,160,100,0.15)",
  },
  gateTitulo: {
    fontFamily: "'Bebas Neue', sans-serif", fontSize: "2.5rem",
    letterSpacing: "0.04em", color: "#f0ece4", marginBottom: 12,
  },
  gateDesc: {
    fontSize: "0.85rem", fontWeight: 300,
    color: "rgba(240,236,228,0.4)", letterSpacing: "0.05em", marginBottom: 36,
  },
  page: {
    minHeight: "100vh", background: "#0a0a0a",
    color: "#f0ece4", fontFamily: "'Barlow', sans-serif",
  },
  hero: {
    position: "relative", zIndex: 1, padding: "72px 48px 40px",
    borderBottom: "1px solid rgba(196,160,100,0.12)",
    display: "flex", justifyContent: "space-between",
  },
  heroEyebrow: {
    fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.3em",
    textTransform: "uppercase", color: "rgba(196,160,100,0.6)", marginBottom: 12,
  },
  heroName: {
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: "clamp(3rem, 8vw, 6rem)", lineHeight: 0.9,
    letterSpacing: "0.04em", color: "#f0ece4", marginBottom: 8,
  },
  heroBadge: (tipo) => ({
    display: "inline-flex", alignItems: "center", gap: 6, marginTop: 16,
    padding: "4px 14px", fontSize: "0.65rem", fontWeight: 600,
    letterSpacing: "0.2em", textTransform: "uppercase",
    border: `1px solid ${tipo === "ADMIN" ? "#c4a064" : "rgba(240,236,228,0.2)"}`,
    color: tipo === "ADMIN" ? "#c4a064" : "rgba(240,236,228,0.4)",
    background: "transparent",
  }),
  content: {
    maxWidth: 860, margin: "0 auto", padding: "48px 48px 140px",
    position: "relative", zIndex: 1,
  },
  sectionLabel: {
    fontSize: "0.6rem", fontWeight: 600, letterSpacing: "0.35em",
    textTransform: "uppercase", color: "rgba(196,160,100,0.5)",
    marginBottom: 24, paddingBottom: 12,
    borderBottom: "1px solid rgba(196,160,100,0.1)",
  },
  grid: {
    display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: 2, marginBottom: 48,
  },
  field: {
    background: "rgba(255,255,255,0.02)", border: "1px solid rgba(196,160,100,0.1)",
    padding: "20px 24px", transition: "all 0.25s ease", position: "relative",
  },
  fieldLabel: {
    fontSize: "0.6rem", fontWeight: 600, letterSpacing: "0.25em",
    textTransform: "uppercase", color: "rgba(196,160,100,0.5)",
    marginBottom: 8, display: "block",
  },
  fieldValue: { fontSize: "0.95rem", color: "#f0ece4", wordBreak: "break-all" },
  input: {
    width: "100%", background: "transparent", border: "none",
    borderBottom: "1px solid #c4a064", color: "#f0ece4",
    fontFamily: "'Barlow', sans-serif", fontSize: "0.95rem",
    padding: "4px 0", outline: "none",
  },
  editBtn: {
    position: "absolute", top: 16, right: 16, background: "transparent",
    border: "none", color: "rgba(196,160,100,0.4)", cursor: "pointer",
    fontSize: "0.7rem", letterSpacing: "0.1em", fontFamily: "'Barlow', sans-serif",
    textTransform: "uppercase", transition: "color 0.2s", padding: 0,
  },
  saveBar: {
    display: "flex", justifyContent: "flex-end", gap: 12,
    marginTop: 32, paddingTop: 24, borderTop: "1px solid rgba(196,160,100,0.1)",
  },
  btnPrimary: {
    fontFamily: "'Barlow', sans-serif", fontWeight: 600, fontSize: "0.75rem",
    letterSpacing: "0.15em", textTransform: "uppercase", padding: "12px 28px",
    background: "#c4a064", color: "#0a0a0a", border: "1px solid #c4a064",
    cursor: "pointer", transition: "all 0.25s ease",
  },
  btnSecondary: {
    fontFamily: "'Barlow', sans-serif", fontWeight: 400, fontSize: "0.75rem",
    letterSpacing: "0.1em", textTransform: "uppercase", padding: "12px 24px",
    background: "transparent", color: "rgba(240,236,228,0.4)",
    border: "1px solid rgba(240,236,228,0.15)", cursor: "pointer",
    transition: "all 0.25s ease",
  },
  toast: (ok) => ({
    position: "fixed", bottom: 32, right: 32, padding: "14px 24px",
    background: ok ? "rgba(90,180,100,0.12)" : "rgba(224,85,85,0.12)",
    border: `1px solid ${ok ? "rgba(90,180,100,0.4)" : "rgba(224,85,85,0.4)"}`,
    color: ok ? "#6fcf7a" : "#e05555", fontSize: "0.75rem",
    letterSpacing: "0.1em", textTransform: "uppercase",
    fontFamily: "'Barlow', sans-serif", zIndex: 999, animation: "fadeIn 0.3s ease",
  }),
  planoInfoContainer: { marginTop: 24, display: "flex", flexDirection: "column", gap: 12 },
  planoTexto: { fontSize: "0.8rem", color: "rgba(240,236,228,0.5)", letterSpacing: "0.05em" },
  planoDestaque: { color: "#c4a064", fontWeight: 600 },
  btnPagar: {
    alignSelf: "flex-start", marginTop: 8, fontFamily: "'Barlow', sans-serif",
    fontWeight: 700, fontSize: "0.7rem", letterSpacing: "0.2em",
    textTransform: "uppercase", padding: "10px 20px", background: "#c4a064",
    color: "#0a0a0a", border: "none", cursor: "pointer",
  },
  parcelaCard: {
    padding: "32px",
    background: "linear-gradient(145deg, rgba(196,160,100,0.08) 0%, rgba(255,255,255,0.02) 100%)",
    borderLeft: "4px solid #c4a064", display: "flex", flexDirection: "column",
    gap: 12, minWidth: "380px", boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
  },
  parcelaLabel: {
    fontSize: "0.75rem", letterSpacing: "0.25em", textTransform: "uppercase",
    color: "#c4a064", fontWeight: 700,
  },
  parcelaValor: {
    fontSize: "3.5rem", fontFamily: "'Bebas Neue', sans-serif",
    color: "#f0ece4", lineHeight: 1, margin: "8px 0",
  },
};

/* ─── campos ──────────────────────────────────────────────────────────── */
const CAMPOS_PESSOAIS = [
  { key: "nome",     label: "Nome Completo", editable: true },
  { key: "email",    label: "E-mail",        editable: true },
  { key: "whatsapp", label: "WhatsApp",      editable: true },
  { key: "senha",    label: "Senha",         editable: true, type: "password" },
  { key: "CPF",      label: "CPF",           editable: true },
  { key: "CNPJ",     label: "CNPJ",          editable: true },
  { key: "rua",      label: "Rua",           editable: true },
  { key: "numero",   label: "Número",        editable: true },
  { key: "cidade",   label: "Cidade",        editable: true },
  { key: "CEP",      label: "CEP",           editable: true },
];

const CAMPOS_CONTA = [
  { key: "tipoUsuario",      label: "Tipo de Usuário",   editable: false },
  { key: "statusAssinatura", label: "Status Assinatura", editable: false },
  { key: "planoAtual.id",    label: "Plano Atual (ID)",  editable: false },
  { key: "dataCadastro",     label: "Data de Cadastro",  editable: false },
  { key: "criouContaSisrun", label: "Conta Sisrun",      editable: false },
];

function getNestedValue(obj, path) {
  return path.split(".").reduce((acc, key) => acc?.[key], obj);
}

/* ─── passos do tutorial ──────────────────────────────────────────────── */
const SISRUN_STEPS = [
  {
    titulo: "Acesse o site ou app do SISRUN",
    descricao: "Baixe o aplicativo SISRUN na App Store ou Google Play, ou acesse pelo navegador em sisrun.com.br.",
    img: "https://placehold.co/480x240/0d0d0d/c4a064?text=Passo+1+%E2%80%94+Acessar+o+SISRUN",
  },
  {
    titulo: "Clique em 'Criar Conta'",
    descricao: "Na tela inicial do app, toque no botão 'Criar Conta' ou 'Cadastrar-se' na parte inferior da tela de login.",
    img: "https://placehold.co/480x240/0d0d0d/c4a064?text=Passo+2+%E2%80%94+Criar+Conta",
  },
  {
    titulo: "Preencha seus dados pessoais",
    descricao: "Informe seu nome completo, e-mail e crie uma senha forte. Use o mesmo e-mail cadastrado aqui na plataforma.",
    img: "https://placehold.co/480x240/0d0d0d/c4a064?text=Passo+3+%E2%80%94+Preencher+Dados",
  },
  {
    titulo: "Confirme seu e-mail",
    descricao: "Verifique sua caixa de entrada e clique no link de confirmação enviado pelo SISRUN para ativar sua conta.",
    img: "https://placehold.co/480x240/0d0d0d/c4a064?text=Passo+4+%E2%80%94+Confirmar+E-mail",
  },
  {
    titulo: "Anote seu usuário e avise o Danilo",
    descricao: "Com a conta criada, copie seu nome de usuário do SISRUN e envie para o Danilo pelo WhatsApp — ele te encontrará no app e liberará seu acesso completo.",
    img: "https://placehold.co/480x240/0d0d0d/c4a064?text=Passo+5+%E2%80%94+Avisar+o+Danilo",
  },
];

const DANILO_WHATSAPP = "5516996339294";

/* ─── componente campo ────────────────────────────────────────────────── */
function CampoInfo({ label, value, editable, type = "text", onChange }) {
  const [editando, setEditando] = useState(false);
  const [local, setLocal] = useState(value ?? "—");
  useEffect(() => setLocal(value ?? "—"), [value]);
  const salvar = () => { onChange?.(local); setEditando(false); };

  return (
    <div
      style={S.field}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(196,160,100,0.35)"; e.currentTarget.style.background = "rgba(196,160,100,0.04)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(196,160,100,0.1)"; e.currentTarget.style.background = "rgba(255,255,255,0.02)"; }}
    >
      <span style={S.fieldLabel}>{label}</span>
      {editando ? (
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <input autoFocus type={type} value={local}
            onChange={(e) => setLocal(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && salvar()} style={S.input} />
          <button style={{ ...S.editBtn, position: "static", color: "#c4a064" }} onClick={salvar}>✓</button>
          <button style={{ ...S.editBtn, position: "static" }} onClick={() => { setLocal(value ?? "—"); setEditando(false); }}>✕</button>
        </div>
      ) : (
        <span style={S.fieldValue}>{type === "password" && local !== "—" ? "••••••••" : String(local)}</span>
      )}
      {editable && !editando && (
        <button style={S.editBtn} onClick={() => setEditando(true)}
          onMouseEnter={(e) => (e.target.style.color = "#c4a064")}
          onMouseLeave={(e) => (e.target.style.color = "rgba(196,160,100,0.4)")}>
          editar
        </button>
      )}
    </div>
  );
}

/* ─── modal tutorial sisrun ───────────────────────────────────────────── */
function ModalSisrun({ onClose, nomeAluno }) {
  const [passo, setPasso] = useState(0);
  const total = SISRUN_STEPS.length;
  const step = SISRUN_STEPS[passo];
  const isUltimo = passo === total - 1;

  const msgWhats = encodeURIComponent(
    `Olá Danilo! Sou ${nomeAluno || "aluno da plataforma"} e acabei de criar minha conta no SISRUN. Meu usuário é: `
  );

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 500,
      background: "rgba(0,0,0,0.88)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 24, animation: "fadeIn 0.2s ease",
    }}>
      <div style={{
        background: "#111", border: "1px solid rgba(196,160,100,0.2)",
        width: "100%", maxWidth: 520,
        overflow: "hidden", boxShadow: "0 40px 80px rgba(0,0,0,0.7)",
      }}>
        {/* header */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "16px 22px", borderBottom: "1px solid rgba(196,160,100,0.1)",
          background: "rgba(196,160,100,0.03)",
        }}>
          <div>
            <p style={{ fontSize: "0.55rem", letterSpacing: "0.35em", color: "rgba(196,160,100,0.5)", textTransform: "uppercase", marginBottom: 2 }}>
              Tutorial SISRUN
            </p>
            <p style={{ fontSize: "0.88rem", color: "#f0ece4", fontWeight: 600 }}>Como criar sua conta</p>
          </div>
          <button onClick={onClose} style={{
            background: "transparent", border: "1px solid rgba(240,236,228,0.12)",
            color: "rgba(240,236,228,0.35)", cursor: "pointer", fontSize: 14,
            width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "inherit", transition: "all 0.2s",
          }}>✕</button>
        </div>

        {/* imagem */}
        <div style={{ position: "relative", background: "#0a0a0a" }}>
          <img src={step.img} alt={`Passo ${passo + 1}`}
            style={{ width: "100%", height: 200, objectFit: "cover", display: "block", opacity: 0.85 }} />
          {/* dots */}
          <div style={{
            position: "absolute", bottom: 10, left: "50%", transform: "translateX(-50%)",
            display: "flex", gap: 6,
          }}>
            {SISRUN_STEPS.map((_, i) => (
              <div key={i} onClick={() => setPasso(i)} style={{
                width: i === passo ? 22 : 6, height: 6, borderRadius: 3,
                background: i === passo ? "#c4a064" : "rgba(196,160,100,0.25)",
                cursor: "pointer", transition: "all 0.3s ease",
              }} />
            ))}
          </div>
        </div>

        {/* corpo */}
        <div style={{ padding: "22px 26px 8px" }}>
          <p style={{ fontSize: "0.58rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(196,160,100,0.45)", marginBottom: 7 }}>
            Passo {passo + 1} de {total}
          </p>
          <h3 style={{ fontSize: "1rem", color: "#f0ece4", marginBottom: 9, fontWeight: 600, lineHeight: 1.3 }}>
            {step.titulo}
          </h3>
          <p style={{ fontSize: "0.83rem", color: "rgba(240,236,228,0.52)", lineHeight: 1.65, marginBottom: 0 }}>
            {step.descricao}
          </p>
        </div>

        {/* footer */}
        <div style={{
          display: "flex", gap: 8, padding: "16px 26px 22px",
          justifyContent: "space-between", flexWrap: "wrap", alignItems: "center",
        }}>
          {/* whatsapp sempre visível no último passo */}
          {isUltimo ? (
            <a href={`https://wa.me/${DANILO_WHATSAPP}?text=${msgWhats}`}
              target="_blank" rel="noreferrer"
              style={{
                display: "inline-flex", alignItems: "center", gap: 7,
                padding: "10px 16px", background: "#25d366", color: "#fff",
                fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase",
                fontWeight: 700, fontFamily: "'Barlow', sans-serif", textDecoration: "none",
              }}>
              <WaIcon /> Avisar Danilo
            </a>
          ) : <div />}

          <div style={{ display: "flex", gap: 8 }}>
            {passo > 0 && (
              <button onClick={() => setPasso((p) => p - 1)}
                style={{ ...S.btnSecondary, padding: "9px 18px", fontSize: "0.7rem" }}>
                ← Voltar
              </button>
            )}
            {!isUltimo ? (
              <button onClick={() => setPasso((p) => p + 1)}
                style={{ ...S.btnPrimary, padding: "9px 18px", fontSize: "0.7rem" }}>
                Próximo →
              </button>
            ) : (
              <button onClick={onClose}
                style={{ ...S.btnPrimary, padding: "9px 18px", fontSize: "0.7rem" }}>
                Concluir ✓
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── ícone whatsapp inline ───────────────────────────────────────────── */
function WaIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  );
}

/* ─── banner fixo sisrun ──────────────────────────────────────────────── */
function BannerSisrun({ nomeAluno, onAbrirTutorial }) {
  const [visivel, setVisivel] = useState(true);
  const msgWhats = encodeURIComponent(
    `Olá Danilo! Sou ${nomeAluno || "aluno da plataforma"} e quero informar meu usuário do SISRUN. Meu usuário é: `
  );

  if (!visivel) return null;

  return (
    <div style={{
      position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)",
      zIndex: 400, width: "calc(100% - 40px)", maxWidth: 680,
      background: "linear-gradient(135deg, #150f00 0%, #0f0f0f 70%)",
      border: "1px solid #c4a064",
      borderLeft: "5px solid #c4a064",
      padding: "16px 20px",
      boxShadow: "0 8px 48px rgba(196,160,100,0.18), 0 2px 12px rgba(0,0,0,0.6)",
      animation: "slideUp 0.4s ease",
      display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap",
    }}>
      {/* ícone */}
      <div style={{
        width: 38, height: 38, borderRadius: "50%",
        background: "rgba(196,160,100,0.1)", border: "1px solid rgba(196,160,100,0.4)",
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0, animation: "pulse 2s infinite",
        fontSize: 17,
      }}>⚡</div>

      {/* texto */}
      <div style={{ flex: 1, minWidth: 180 }}>
        <p style={{ fontSize: "0.72rem", fontWeight: 700, color: "#c4a064", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 2 }}>
          Você ainda não criou sua conta no SISRUN!
        </p>
        <p style={{ fontSize: "0.76rem", color: "rgba(240,236,228,0.45)", lineHeight: 1.5 }}>
          Crie agora e avise o Danilo com seu usuário para ele te encontrar no app.
        </p>
      </div>

      {/* botões */}
      <div style={{ display: "flex", gap: 8, flexShrink: 0, flexWrap: "wrap", alignItems: "center" }}>
        <button onClick={onAbrirTutorial} style={{
          fontFamily: "'Barlow', sans-serif", fontWeight: 700, fontSize: "0.66rem",
          letterSpacing: "0.12em", textTransform: "uppercase", padding: "8px 15px",
          background: "#c4a064", color: "#0a0a0a", border: "none", cursor: "pointer",
        }}>
          Como criar →
        </button>
        <a href={`https://wa.me/${DANILO_WHATSAPP}?text=${msgWhats}`}
          target="_blank" rel="noreferrer"
          style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            fontFamily: "'Barlow', sans-serif", fontWeight: 600, fontSize: "0.66rem",
            letterSpacing: "0.1em", textTransform: "uppercase", padding: "8px 13px",
            background: "transparent", color: "#25d366",
            border: "1px solid rgba(37,211,102,0.3)", cursor: "pointer",
            textDecoration: "none",
          }}>
          <WaIcon /> Falar com Danilo
        </a>
        <button onClick={() => setVisivel(false)} style={{
          background: "transparent", border: "none",
          color: "rgba(240,236,228,0.2)", cursor: "pointer",
          fontSize: 15, padding: "8px 6px", lineHeight: 1,
        }}>✕</button>
      </div>
    </div>
  );
}

/* ─── página principal ────────────────────────────────────────────────── */
export default function Conta() {
  const navigate = useNavigate();
  const { idAluno } = useParams();
  const [emailLogado, setEmailLogado] = useState(null);

  const [aluno, setAluno]                                     = useState(null);
  const [MensalidadeParcelasDTOS, setMensalidadeParcelasDTOS] = useState({});
  const [editado, setEditado]                                 = useState({});
  const [erro, setErro]                                       = useState(null);
  const [salvando, setSalvando]                               = useState(false);
  const [toast, setToast]                                     = useState(null);
  const [modalSisrun, setModalSisrun]                         = useState(false);

  const url =
    window.location.hostname === "localhost" || window.location.hostname === "192.168.15.19"
      ? "http://192.168.15.19:3001/alunos"
      : "http://201.95.94.106:3001/alunos";

  const urlMensalidade =
    window.location.hostname === "localhost" || window.location.hostname === "192.168.15.19"
      ? "http://192.168.15.19:3001/mensalidades"
      : "http://201.95.94.106:3001/mensalidades";

  useEffect(() => {
    setEmailLogado(localStorage.getItem("email"));
    pegarAlunoPorId();
    pegarDadosMensalidadeAlunoPorId();
  }, []);

  async function pegarAlunoPorId() {
    try {
      const res = await fetch(`${url}/${idAluno}`);
      if (res.ok) { const d = await res.json(); setAluno(d); setEditado(d); }
      else setErro("Aluno não encontrado no banco.");
    } catch { setErro("Erro de conexão com o servidor."); }
  }

  async function pegarDadosMensalidadeAlunoPorId() {
    try {
      const res = await fetch(`${urlMensalidade}/${idAluno}`);
      if (res.ok) { const d = await res.json(); setMensalidadeParcelasDTOS(d); }
      // silencioso se não tiver mensalidade
    } catch { /* silencioso */ }
  }

  function atualizarCampo(key, valor) {
    setEditado((prev) => {
      const keys = key.split(".");
      if (keys.length === 1) return { ...prev, [key]: valor };
      return { ...prev, [keys[0]]: { ...prev[keys[0]], [keys[1]]: valor } };
    });
  }

  async function salvarAlteracoes() {
    setSalvando(true);
    try {
      const res = await fetch(`${url}/${idAluno}`, {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editado),
      });
      if (res.ok) {
        const updated = await res.json();
        setAluno(updated); setEditado(updated);
        mostrarToast("Alterações salvas com sucesso!", true);
      } else mostrarToast("Erro ao salvar alterações.", false);
    } catch { mostrarToast("Erro de conexão ao salvar.", false); }
    finally { setSalvando(false); }
  }

  function formatarValor(valor) {
    if (!valor && valor !== 0) return "—";
    return Number(valor).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  }

  function mostrarToast(msg, ok) {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  }

  const deslogar = (e) => { e.preventDefault(); localStorage.clear(); navigate("/"); };

  /* condição banner: ativo + sisrun false */
  const deveExibirSisrun =
    aluno &&
    MensalidadeParcelasDTOS?.statusLiberacao === "ATIVADO" &&
    aluno.criouContaSisrun === false;

  /* ── carregando ── */
  if (!aluno && !erro) {
    return (
      <div style={{ ...S.page, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ fontSize: "0.75rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(240,236,228,0.25)" }}>
          Carregando...
        </p>
      </div>
    );
  }

  if (erro && !aluno) {
    return (
      <div style={{ ...S.page, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 24 }}>
        <p style={{ color: "#e05555" }}>{erro}</p>
        <button style={S.btnPrimary} onClick={() => navigate("/login")}>Fazer Login</button>
        <button style={S.btnSecondary} onClick={() => navigate("/")}>Voltar</button>
      </div>
    );
  }

  if (!emailLogado) {
    return (
      <div style={S.page}>
        <div style={{ ...S.content, display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", paddingTop: 0 }}>
          <div style={S.gateCard}>
            <h2 style={S.gateTitulo}>Login necessário</h2>
            <p style={S.gateDesc}>Para continuar, você precisa estar logado na plataforma.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <button style={S.btnPrimary} onClick={() => navigate("/login")}>Fazer Login</button>
              <button style={S.btnSecondary} onClick={() => navigate("/")}>← Voltar</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const ultimaParcela = MensalidadeParcelasDTOS?.parcelas?.length
    ? MensalidadeParcelasDTOS.parcelas[MensalidadeParcelasDTOS.parcelas.length - 1]
    : null;

  return (
    <div className="home-container" style={S.page}>

      {/* ── MODAL SISRUN ── */}
      {modalSisrun && <ModalSisrun onClose={() => setModalSisrun(false)} nomeAluno={aluno?.nome} />}

      {/* ── BANNER FIXO SISRUN ── */}
      {deveExibirSisrun && (
        <BannerSisrun nomeAluno={aluno?.nome} onAbrirTutorial={() => setModalSisrun(true)} />
      )}

      {/* ── NAV ── */}
      <nav className="nav-bar">
        <span style={{ marginRight: "auto", fontSize: "0.65rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(196,160,100,0.4)" }}>
          #{idAluno}
        </span>
        {aluno?.tipoUsuario === "ADMIN" && (
          <button className="btn-login" onClick={() => navigate("/home/administrativo")}>Administrativo</button>
        )}
        <button className="btn-sair" onClick={deslogar}>Sair</button>
      </nav>

      {/* ── HERO ── */}
      <header style={{ ...S.hero, alignItems: "flex-end" }}>
        <div style={{ flex: 1 }}>
          <p style={S.heroEyebrow}>Perfil do aluno</p>
          <h1 style={S.heroName}>{aluno?.nome ?? "—"}</h1>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24 }}>
            <span style={S.heroBadge(aluno?.tipoUsuario)}>{aluno?.tipoUsuario}</span>
            <span style={S.heroBadge(aluno?.statusAssinatura)}>{aluno?.statusAssinatura}</span>
            {/* badge de alerta sisrun */}
            {aluno?.criouContaSisrun === false && (
              <span
                onClick={() => setModalSisrun(true)}
                title="Clique para ver como criar"
                style={{
                  display: "inline-flex", alignItems: "center", gap: 6, marginTop: 16,
                  padding: "4px 14px", fontSize: "0.65rem", fontWeight: 700,
                  letterSpacing: "0.18em", textTransform: "uppercase",
                  border: "1px solid rgba(224,85,85,0.55)", color: "#e05555",
                  background: "rgba(224,85,85,0.07)", cursor: "pointer",
                  animation: "pulse 2.5s infinite",
                }}
              >
                ⚠ SISRUN não criado — clique aqui
              </span>
            )}
          </div>

          {MensalidadeParcelasDTOS?.nomePlano && (
            <div style={S.planoInfoContainer}>
              <p style={{ ...S.planoTexto, margin: "2px 0" }}>
                PLANO: <span style={S.planoDestaque}>{MensalidadeParcelasDTOS.nomePlano}</span>
              </p>
              <p style={{ ...S.planoTexto, margin: "2px 0" }}>
                VALOR MENSAL: <span style={S.planoDestaque}>R$ {MensalidadeParcelasDTOS.valorMensalidade}</span>
              </p>
              <p style={{ ...S.planoTexto, margin: "2px 0" }}>
                VIGÊNCIA:{" "}
                {new Date(MensalidadeParcelasDTOS.dataInicio).toLocaleDateString("pt-BR")} até{" "}
                {new Date(MensalidadeParcelasDTOS.dataFim).toLocaleDateString("pt-BR")}
              </p>
              {MensalidadeParcelasDTOS.statusLiberacao === "DESATIVADO" && (
                <button style={S.btnPagar} onClick={() => navigate(`/home/telapagamento/${MensalidadeParcelasDTOS.planoId}`)}>
                  Pagar e Ativar Conta
                </button>
              )}
            </div>
          )}
        </div>

        {/* card próxima parcela */}
        <div style={{ minWidth: "280px" }}>
          {ultimaParcela ? (
            <div style={{ ...S.parcelaCard, marginTop: 0 }}>
              <span style={S.parcelaLabel}>Próxima Parcela</span>
              <div style={S.parcelaValor}>
                R$ {ultimaParcela.valor.toFixed(2).replace(".", ",")}
              </div>
              <p style={{ ...S.planoTexto, fontSize: "0.7rem", margin: "4px 0" }}>
                Vencimento:{" "}
                <span style={{ color: "#f0ece4" }}>
                  {new Date(ultimaParcela.dataVencimento).toLocaleDateString("pt-BR")}
                </span>
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
                <span style={{
                  width: 8, height: 8, borderRadius: "50%",
                  background: ultimaParcela.status === "PENDENTE" ? "#e05555" : "#6fcf7a",
                }} />
                <span style={{
                  fontSize: "0.65rem", letterSpacing: "0.1em", fontWeight: "bold",
                  textTransform: "uppercase",
                  color: ultimaParcela.status === "PENDENTE" ? "#e05555" : "#6fcf7a",
                }}>
                  {ultimaParcela.status}
                </span>
              </div>
            </div>
          ) : (
            <div style={{ ...S.parcelaCard, opacity: 0.5, borderLeftColor: "rgba(196,160,100,0.1)" }}>
              <span style={S.parcelaLabel}>Nenhuma parcela</span>
              <div style={{ ...S.parcelaValor, fontSize: "0.9rem" }}>Sem débitos</div>
            </div>
          )}
        </div>
      </header>

      {/* ── CONTEÚDO ── */}
      <main style={S.content}>
        {erro && <p style={{ color: "#e05555", marginBottom: 16, fontSize: "0.82rem" }}>{erro}</p>}

        {/* bloco sisrun dentro da página */}
        {deveExibirSisrun && (
          <div style={{
            marginBottom: 36,
            background: "linear-gradient(135deg, rgba(196,160,100,0.05) 0%, transparent 100%)",
            border: "1px solid rgba(196,160,100,0.22)",
            borderLeft: "4px solid #c4a064",
            padding: "18px 22px",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            flexWrap: "wrap", gap: 14,
          }}>
            <div>
              <p style={{ fontSize: "0.68rem", fontWeight: 700, color: "#c4a064", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 5 }}>
                ⚡ Conta SISRUN pendente
              </p>
              <p style={{ fontSize: "0.8rem", color: "rgba(240,236,228,0.48)", lineHeight: 1.6, maxWidth: 420 }}>
                Sua assinatura está ativa mas você ainda não criou sua conta no SISRUN.
                Crie e informe seu usuário ao Danilo para ter acesso completo ao app.
              </p>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button onClick={() => setModalSisrun(true)}
                style={{ ...S.btnPrimary, padding: "9px 18px", fontSize: "0.68rem" }}>
                Ver tutorial
              </button>
              <a
                href={`https://wa.me/${DANILO_WHATSAPP}?text=${encodeURIComponent(`Olá Danilo! Sou ${aluno?.nome} e criei minha conta no SISRUN. Meu usuário é: `)}`}
                target="_blank" rel="noreferrer"
                style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  fontFamily: "'Barlow', sans-serif", fontWeight: 600, fontSize: "0.68rem",
                  letterSpacing: "0.1em", textTransform: "uppercase", padding: "9px 14px",
                  background: "transparent", color: "#25d366",
                  border: "1px solid rgba(37,211,102,0.28)", cursor: "pointer",
                  textDecoration: "none",
                }}>
                <WaIcon /> Conversar com Danilo
              </a>
            </div>
          </div>
        )}

        {/* histórico de parcelas */}
        <p style={S.sectionLabel}>Últimos meses / Parcelas</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 48 }}>
          {MensalidadeParcelasDTOS.parcelas?.map((p, index) => (
            <div key={p.id} style={{
              display: "grid", gridTemplateColumns: "50px 1fr 1fr 120px",
              alignItems: "center", padding: "15px 22px",
              background: "rgba(255,255,255,0.015)",
              border: "1px solid rgba(196,160,100,0.06)",
              opacity: p.status === "FINALIZADO" ? 0.7 : 1,
              borderLeft: p.status === "FINALIZADO" ? "2px solid #6fcf7a" : "2px solid #c4a064",
            }}>
              <span style={{ fontSize: "0.62rem", color: "rgba(196,160,100,0.35)", letterSpacing: "0.1em" }}>#{index + 1}</span>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ fontSize: "0.52rem", letterSpacing: "0.2em", color: "rgba(196,160,100,0.4)", textTransform: "uppercase", marginBottom: 2 }}>Vencimento</span>
                <span style={{ fontSize: "0.88rem", color: "#f0ece4" }}>{new Date(p.dataVencimento).toLocaleDateString("pt-BR")}</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ fontSize: "0.52rem", letterSpacing: "0.2em", color: "rgba(196,160,100,0.4)", textTransform: "uppercase", marginBottom: 2 }}>Valor</span>
                <span style={{ fontSize: "0.88rem", color: "#c4a064", fontWeight: 600 }}>{formatarValor(p.valor)}</span>
              </div>
              <div style={{ textAlign: "right" }}>
                <span style={{
                  fontSize: "0.6rem", fontWeight: 800, letterSpacing: "0.08em",
                  padding: "3px 10px", borderRadius: 3, textTransform: "uppercase",
                  background: p.status === "FINALIZADO" ? "rgba(111,207,122,0.1)" : "rgba(196,160,100,0.1)",
                  color: p.status === "FINALIZADO" ? "#6fcf7a" : "#c4a064",
                }}>
                  {p.status}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* dados pessoais */}
        <p style={S.sectionLabel}>Dados Pessoais</p>
        <div style={S.grid}>
          {CAMPOS_PESSOAIS.map(({ key, label, editable, type }) => (
            <CampoInfo key={key} label={label} type={type} editable={editable}
              value={getNestedValue(editado, key)} onChange={(val) => atualizarCampo(key, val)} />
          ))}
        </div>

        {/* dados da conta */}
        <p style={S.sectionLabel}>Dados da Conta</p>
        <div style={S.grid}>
          {CAMPOS_CONTA.map(({ key, label, editable }) => (
            <CampoInfo key={key} label={label} editable={editable}
              value={getNestedValue(editado, key)} onChange={(val) => atualizarCampo(key, val)} />
          ))}
        </div>

        {/* salvar */}
        <div style={S.saveBar}>
          <button style={S.btnSecondary} onClick={() => setEditado(aluno)}
            onMouseEnter={(e) => { e.target.style.color = "#f0ece4"; e.target.style.borderColor = "rgba(240,236,228,0.5)"; }}
            onMouseLeave={(e) => { e.target.style.color = "rgba(240,236,228,0.4)"; e.target.style.borderColor = "rgba(240,236,228,0.15)"; }}>
            Descartar
          </button>
          <button style={{ ...S.btnPrimary, opacity: salvando ? 0.6 : 1 }}
            onClick={salvarAlteracoes} disabled={salvando}
            onMouseEnter={(e) => { if (!salvando) { e.target.style.background = "transparent"; e.target.style.color = "#c4a064"; } }}
            onMouseLeave={(e) => { e.target.style.background = "#c4a064"; e.target.style.color = "#0a0a0a"; }}>
            {salvando ? "Salvando..." : "Salvar Alterações"}
          </button>
        </div>
      </main>

      {/* toast */}
      {toast && <div style={S.toast(toast.ok)}>{toast.ok ? "✓" : "✕"} &nbsp; {toast.msg}</div>}

      <style>{`
        @keyframes fadeIn  { from { opacity:0; transform:translateY(8px);      } to { opacity:1; transform:translateY(0);         } }
        @keyframes slideUp { from { opacity:0; transform:translate(-50%,20px); } to { opacity:1; transform:translate(-50%,0);     } }
        @keyframes pulse   { 0%,100% { box-shadow:0 0 0 0 rgba(196,160,100,0.3); } 50% { box-shadow:0 0 0 8px rgba(196,160,100,0); } }
      `}</style>
    </div>
  );
}
