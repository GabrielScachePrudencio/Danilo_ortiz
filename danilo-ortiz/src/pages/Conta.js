import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

/* ─── estilos extras (escopo local) ─────────────────────────────────── */
const S = {
    
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
  page: {
    minHeight: "100vh",
    background: "#0a0a0a",
    color: "#f0ece4",
    fontFamily: "'Barlow', sans-serif",
  },
  hero: {
    position: "relative",
    zIndex: 1,
    padding: "72px 48px 40px",
    borderBottom: "1px solid rgba(196,160,100,0.12)",
    display: "flex",
    justifyContent: "space-between"
  },
  heroEyebrow: {
    fontSize: "0.65rem",
    fontWeight: 600,
    letterSpacing: "0.3em",
    textTransform: "uppercase",
    color: "rgba(196,160,100,0.6)",
    marginBottom: 12,
  },
  heroName: {
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: "clamp(3rem, 8vw, 6rem)",
    lineHeight: 0.9,
    letterSpacing: "0.04em",
    color: "#f0ece4",
    marginBottom: 8,
  },
  heroBadge: (tipo) => ({
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    marginTop: 16,
    padding: "4px 14px",
    fontSize: "0.65rem",
    fontWeight: 600,
    letterSpacing: "0.2em",
    textTransform: "uppercase",
    border: `1px solid ${tipo === "ADMIN" ? "#c4a064" : "rgba(240,236,228,0.2)"}`,
    color: tipo === "ADMIN" ? "#c4a064" : "rgba(240,236,228,0.4)",
    background: "transparent",
  }),
  content: {
    maxWidth: 860,
    margin: "0 auto",
    padding: "48px 48px 100px",
    position: "relative",
    zIndex: 1,
  },
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
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: 2,
    marginBottom: 48,
  },
  field: {
    background: "rgba(255,255,255,0.02)",
    border: "1px solid rgba(196,160,100,0.1)",
    padding: "20px 24px",
    transition: "all 0.25s ease",
    position: "relative",
  },
  fieldLabel: {
    fontSize: "0.6rem",
    fontWeight: 600,
    letterSpacing: "0.25em",
    textTransform: "uppercase",
    color: "rgba(196,160,100,0.5)",
    marginBottom: 8,
    display: "block",
  },
  fieldValue: {
    fontSize: "0.95rem",
    color: "#f0ece4",
    wordBreak: "break-all",
  },
  input: {
    width: "100%",
    background: "transparent",
    border: "none",
    borderBottom: "1px solid #c4a064",
    color: "#f0ece4",
    fontFamily: "'Barlow', sans-serif",
    fontSize: "0.95rem",
    padding: "4px 0",
    outline: "none",
  },
  editBtn: {
    position: "absolute",
    top: 16,
    right: 16,
    background: "transparent",
    border: "none",
    color: "rgba(196,160,100,0.4)",
    cursor: "pointer",
    fontSize: "0.7rem",
    letterSpacing: "0.1em",
    fontFamily: "'Barlow', sans-serif",
    textTransform: "uppercase",
    transition: "color 0.2s",
    padding: 0,
  },
  saveBar: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 12,
    marginTop: 32,
    paddingTop: 24,
    borderTop: "1px solid rgba(196,160,100,0.1)",
  },
  btnPrimary: {
    fontFamily: "'Barlow', sans-serif",
    fontWeight: 600,
    fontSize: "0.75rem",
    letterSpacing: "0.15em",
    textTransform: "uppercase",
    padding: "12px 28px",
    background: "#c4a064",
    color: "#0a0a0a",
    border: "1px solid #c4a064",
    cursor: "pointer",
    transition: "all 0.25s ease",
  },
  btnSecondary: {
    fontFamily: "'Barlow', sans-serif",
    fontWeight: 400,
    fontSize: "0.75rem",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    padding: "12px 24px",
    background: "transparent",
    color: "rgba(240,236,228,0.4)",
    border: "1px solid rgba(240,236,228,0.15)",
    cursor: "pointer",
    transition: "all 0.25s ease",
  },
  toast: (ok) => ({
    position: "fixed",
    bottom: 32,
    right: 32,
    padding: "14px 24px",
    background: ok ? "rgba(90,180,100,0.12)" : "rgba(224,85,85,0.12)",
    border: `1px solid ${ok ? "rgba(90,180,100,0.4)" : "rgba(224,85,85,0.4)"}`,
    color: ok ? "#6fcf7a" : "#e05555",
    fontSize: "0.75rem",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    fontFamily: "'Barlow', sans-serif",
    zIndex: 999,
    animation: "fadeIn 0.3s ease",
  }),

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
  }
};

/* ─── campos editáveis ───────────────────────────────────────────────── */
const CAMPOS_PESSOAIS = [
  { key: "nome",      label: "Nome Completo",  editable: true  },
  { key: "email",     label: "E-mail",         editable: true  },
  { key: "whatsapp",  label: "WhatsApp",       editable: true  },
  { key: "senha",     label: "Senha",          editable: true, type: "password" },
  { key: "CPF",     label: "CPF",          editable: true },
  { key: "CNPJ",     label: "CNPJ",          editable: true},

  { key: "rua",     label: "rua",          editable: true},
  { key: "numero",     label: "numero",          editable: true},
  { key: "cidade",     label: "cidade",          editable: true},
  { key: "CEP",     label: "CEP",          editable: true}

  
];

const CAMPOS_CONTA = [
  { key: "tipoUsuario",       label: "Tipo de Usuário",    editable: false },
  { key: "statusAssinatura",  label: "Status Assinatura",  editable: false },
  { key: "planoAtual.id",     label: "Plano Atual (ID)",   editable: false },
  { key: "dataCadastro",      label: "Data de Cadastro",   editable: false },
  { key: "criouContaSisrun",  label: "Conta Sisrun",       editable: false },
];

/* utilitário para acessar chaves aninhadas como "planoAtual.id" */
function getNestedValue(obj, path) {
  return path.split(".").reduce((acc, key) => acc?.[key], obj);
}

/* ─── componente de campo ────────────────────────────────────────────── */
function CampoInfo({ label, value, editable, type = "text", onChange }) {
  const [editando, setEditando] = useState(false);
  const [local, setLocal] = useState(value ?? "—");

  useEffect(() => setLocal(value ?? "—"), [value]);

  const salvar = () => {
    onChange?.(local);
    setEditando(false);
  };

  return (
    <div
      style={S.field}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "rgba(196,160,100,0.35)";
        e.currentTarget.style.background = "rgba(196,160,100,0.04)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "rgba(196,160,100,0.1)";
        e.currentTarget.style.background = "rgba(255,255,255,0.02)";
      }}
    >
      <span style={S.fieldLabel}>{label}</span>

      {editando ? (
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <input
            autoFocus
            type={type}
            value={local}
            onChange={(e) => setLocal(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && salvar()}
            style={S.input}
          />
          <button style={{ ...S.editBtn, position: "static", color: "#c4a064" }} onClick={salvar}>
            ✓
          </button>
          <button
            style={{ ...S.editBtn, position: "static" }}
            onClick={() => { setLocal(value ?? "—"); setEditando(false); }}
          >
            ✕
          </button>
        </div>
      ) : (
        <span style={S.fieldValue}>
          {type === "password" && local !== "—" ? "••••••••" : String(local)}
        </span>
      )}

      {editable && !editando && (
        <button
          style={S.editBtn}
          onClick={() => setEditando(true)}
          onMouseEnter={(e) => (e.target.style.color = "#c4a064")}
          onMouseLeave={(e) => (e.target.style.color = "rgba(196,160,100,0.4)")}
        >
          editar
        </button>
      )}
    </div>
  );
}

/* ─── página principal ───────────────────────────────────────────────── */
export default function Conta() {
  const navigate = useNavigate();
  const { idAluno } = useParams();
  const [emailLogado, setEmailLogado] = useState(null);

  const [aluno, setAluno]         = useState(null);
  const [MensalidadeParcelasDTOS, setMensalidadeParcelasDTOS] = useState({});
  const [editado, setEditado]     = useState({});
  const [erro, setErro]           = useState(null);
  const [salvando, setSalvando]   = useState(false);
  const [toast, setToast]         = useState(null); // { msg, ok }

  const url = "http://localhost:8080/alunos";
  const urlMensalidade = "http://localhost:8080/mensalidades";

  useEffect(() => { 
    setEmailLogado(localStorage.getItem("email"));
    pegarDadosMensalidadeAlunoPorId();
    pegarAlunoPorId(); 
  }, []);

  async function pegarAlunoPorId() {
    try {
      const res = await fetch(`${url}/${idAluno}`);
      if (res.ok) {
        const data = await res.json();
        console.log("aluno", data);
        setAluno(data);
        setEditado(data);
      } else {
        setErro("Aluno não encontrado no banco.");
      }
    } catch {
      setErro("Erro de conexão com o servidor.");
    }
  }
  
  async function pegarDadosMensalidadeAlunoPorId(){
    try {
        const res = await fetch(`${urlMensalidade}/${idAluno}`);
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
  
  /* atualiza campo no estado local */
  function atualizarCampo(key, valor) {
    setEditado((prev) => {
      const keys = key.split(".");
      if (keys.length === 1) return { ...prev, [key]: valor };
      // nested (ex: planoAtual.id)
      return {
        ...prev,
        [keys[0]]: { ...prev[keys[0]], [keys[1]]: valor },
      };
    });
  }

  async function salvarAlteracoes() {
    setSalvando(true);
    try {
      const res = await fetch(`${url}/${idAluno}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editado),
      });
      if (res.ok) {
        const updated = await res.json();
        setAluno(updated);
        setEditado(updated);
        mostrarToast("Alterações salvas com sucesso!", true);
      } else {
        mostrarToast("Erro ao salvar alterações.", false);
      }
    } catch {
      mostrarToast("Erro de conexão ao salvar.", false);
    } finally {
      setSalvando(false);
    }
  }

    function formatarValor(valor) {
        if (!valor && valor !== 0) return "—";
        return Number(valor).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
    }

  function mostrarToast(msg, ok) {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  }

  const deslogar = (e) => {
    e.preventDefault();
    localStorage.clear();
    navigate("/");
  };

  /* ── sem sessão ── */
  if (!aluno && !erro) {
    return (
      <div style={{ ...S.page, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 24 }}>
        <p style={{ fontSize: "0.75rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(240,236,228,0.3)" }}>
          Carregando...
        </p>
      </div>
    );
  }

  if (erro && !aluno) {
    return (
      <div style={{ ...S.page, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 24 }}>
        <p className="erro-msg">{erro}</p>
        <button style={S.btnPrimary} onClick={() => navigate("/login")}>Fazer Login</button>
        <button style={S.btnSecondary} onClick={() => navigate("/")}>Voltar</button>
      </div>
    );
  }


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
  } else {

      
      return (
        <div className="home-container" style={S.page}>

      {/* ── NAV ── */}
      <nav className="nav-bar">
        <span style={{ marginRight: "auto", fontSize: "0.65rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(196,160,100,0.4)" }}>
          #{idAluno}
        </span>

        {aluno?.tipoUsuario === "ADMIN" && (
            <button className="btn-login" onClick={() => navigate("/home/administrativo")}>
            Administrativo
          </button>
        )}
        <button className="btn-sair" onClick={deslogar}>Sair</button>
      </nav>

      {/* ── HERO ── */}
      <header style={{...S.hero, alignItems: "flex-end"}}>
        {/* Lado Esquerdo: Identificação e Plano */}
        <div style={{ flex: 1 }}>
          <p style={S.heroEyebrow}>Perfil do aluno</p>
          <h1 style={S.heroName}>{aluno?.nome ?? "—"}</h1>
          
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24 }}>
            <span style={S.heroBadge(aluno?.tipoUsuario)}>{aluno?.tipoUsuario}</span>
            <span style={S.heroBadge(aluno?.statusAssinatura)}>{aluno?.statusAssinatura}</span>
          </div>

          {MensalidadeParcelasDTOS?.nomePlano && (
            <div style={S.planoInfoContainer}>
              <p style={{...S.planoTexto, margin: "2px 0"}}>
                PLANO: <span style={S.planoDestaque}>{MensalidadeParcelasDTOS.nomePlano}</span>
              </p>
              <p style={{...S.planoTexto, margin: "2px 0"}}>
                VALOR MENSAL: <span style={S.planoDestaque}>R$ {MensalidadeParcelasDTOS.valorMensalidade}</span>
              </p>
              <p style={{...S.planoTexto, margin: "2px 0"}}>
                VIGÊNCIA: {new Date(MensalidadeParcelasDTOS.dataInicio).toLocaleDateString('pt-BR')} até {new Date(MensalidadeParcelasDTOS.dataFim).toLocaleDateString('pt-BR')}
              </p>

              {MensalidadeParcelasDTOS.statusLiberacao === "DESATIVADO" && (
                <button 
                  style={S.btnPagar}
                  onClick={() => navigate(`/home/telapagamento/${MensalidadeParcelasDTOS.planoId}`)}
                >
                  Pagar e Ativar Conta
                </button>
              )}
            </div>
          )}
        </div>

        {/* Lado Direito: Próxima Parcela */}
        <div style={{ minWidth: "280px" }}>
          {MensalidadeParcelasDTOS.parcelas && MensalidadeParcelasDTOS.parcelas.length > 0 ? (
            <div style={{...S.parcelaCard, marginTop: 0}}>
              <span style={S.parcelaLabel}>Próxima Parcela</span>
              <div style={S.parcelaValor}>
                R$ {MensalidadeParcelasDTOS.parcelas[MensalidadeParcelasDTOS.parcelas.length-1].valor.toFixed(2).replace('.', ',')}
              </div>
              <p style={{ ...S.planoTexto, fontSize: '0.7rem', margin: "4px 0" }}>
                Vencimento: <span style={{color: '#f0ece4'}}>{new Date(MensalidadeParcelasDTOS.parcelas[MensalidadeParcelasDTOS.parcelas.length-1].dataVencimento).toLocaleDateString('pt-BR')}</span>
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                <span style={{
                    width: 8, height: 8, borderRadius: '50%',
                    background: MensalidadeParcelasDTOS.parcelas[0].status === 'PENDENTE' ? '#e05555' : '#6fcf7a'
                }} />
                <span style={{
                    fontSize: '0.65rem',
                    letterSpacing: '0.1em',
                    color: MensalidadeParcelasDTOS.parcelas[0].status === 'PENDENTE' ? '#e05555' : '#6fcf7a',
                    fontWeight: 'bold', textTransform: 'uppercase'
                }}>
                  {MensalidadeParcelasDTOS.parcelas[MensalidadeParcelasDTOS.parcelas.length-1].status}
                </span>
              </div>
            </div>
          ) : (
             <div style={{...S.parcelaCard, opacity: 0.5, borderLeftColor: 'rgba(196,160,100,0.1)'}}>
                <span style={S.parcelaLabel}>Nenhuma parcela</span>
                <div style={{...S.parcelaValor, fontSize: '0.9rem'}}>Sem débitos pendentes</div>
             </div>
          )}
        </div>
      </header>

      {/* ── CONTEÚDO ── */}
      <main style={S.content}>
        {erro && <p className="erro-msg">{erro}</p>}

        {/* todas as parcelas */}
        {/* ── HISTÓRICO DE PARCELAS ── */}
        <p style={S.sectionLabel}>Últimos meses / Parcelas</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 48 }}>
        {MensalidadeParcelasDTOS.parcelas && MensalidadeParcelasDTOS.parcelas.map((p, index) => (
            <div 
            key={p.id} 
            style={{
                ...S.infoBox, 
                display: "grid", 
                gridTemplateColumns: "50px 1fr 1fr 120px", 
                alignItems: "center",
                padding: "16px 24px",
                opacity: p.status === 'FINALIZADO' ? 0.7 : 1, // Parcela paga fica levemente opaca
                borderLeft: p.status === 'FINALIZADO' ? "2px solid #6fcf7a" : "2px solid #c4a064"
            }}
            >
            {/* ID ou Número */}
            <span style={{ ...S.infoLabel, marginBottom: 0 }}>#{index + 1}</span>
            
            {/* Data */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={S.infoLabel}>Vencimento</span>
                <span style={S.infoValue}>{new Date(p.dataVencimento).toLocaleDateString('pt-BR')}</span>
            </div>

            {/* Valor */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={S.infoLabel}>Valor</span>
                <span style={{ ...S.infoValue, color: "#c4a064", fontWeight: 600 }}>
                {formatarValor(p.valor)}
                </span>
            </div>

            {/* Status */}
            <div style={{ textAlign: 'right' }}>
                <span style={{
                fontSize: '0.65rem',
                fontWeight: 800,
                letterSpacing: '0.1em',
                padding: '4px 10px',
                borderRadius: '4px',
                background: p.status === 'FINALIZADO' ? 'rgba(111, 207, 122, 0.1)' : 'rgba(196, 160, 100, 0.1)',
                color: p.status === 'FINALIZADO' ? '#6fcf7a' : '#c4a064',
                textTransform: 'uppercase'
                }}>
                {p.status}
                </span>
            </div>
            </div>
        ))}
        </div>

        {/* Dados pessoais (editáveis) */}
        <p style={S.sectionLabel}>Dados Pessoais</p>
        <div style={S.grid}>
          {CAMPOS_PESSOAIS.map(({ key, label, editable, type }) => (
              <CampoInfo
              key={key}
              label={label}
              type={type}
              editable={editable}
              value={getNestedValue(editado, key)}
              onChange={(val) => atualizarCampo(key, val)}
              />
            ))}
        </div>

        {/* Dados da conta (somente leitura) */}
        <p style={S.sectionLabel}>Dados da Conta</p>
        <div style={S.grid}>
          {CAMPOS_CONTA.map(({ key, label, editable }) => (
              <CampoInfo
              key={key}
              label={label}
              editable={editable}
              value={getNestedValue(editado, key)}
              onChange={(val) => atualizarCampo(key, val)}
              />
            ))}
        </div>

        {/* Botão salvar */}
        <div style={S.saveBar}>
          <button
            style={S.btnSecondary}
            onClick={() => setEditado(aluno)}
            onMouseEnter={(e) => { e.target.style.color = "#f0ece4"; e.target.style.borderColor = "rgba(240,236,228,0.5)"; }}
            onMouseLeave={(e) => { e.target.style.color = "rgba(240,236,228,0.4)"; e.target.style.borderColor = "rgba(240,236,228,0.15)"; }}
            >
            Descartar
          </button>
          <button
            style={{ ...S.btnPrimary, opacity: salvando ? 0.6 : 1 }}
            onClick={salvarAlteracoes}
            disabled={salvando}
            onMouseEnter={(e) => { if (!salvando) { e.target.style.background = "transparent"; e.target.style.color = "#c4a064"; } }}
            onMouseLeave={(e) => { e.target.style.background = "#c4a064"; e.target.style.color = "#0a0a0a"; }}
            >
            {salvando ? "Salvando..." : "Salvar Alterações"}
          </button>
        </div>
      </main>

      {/* ── TOAST ── */}
      {toast && (
          <div style={S.toast(toast.ok)}>
          {toast.ok ? "✓" : "✕"} &nbsp; {toast.msg}
        </div>
      )}

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        `}</style>
    </div>
  );
}
}
