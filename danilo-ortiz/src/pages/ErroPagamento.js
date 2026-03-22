import { useNavigate } from "react-router-dom";

const S = {
  page: {
    minHeight: "100vh",
    background: "#0a0a0a",
    color: "#f0ece4",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Barlow', sans-serif"
  },

  card: {
    textAlign: "center",
    padding: "60px 50px",
    border: "1px solid rgba(224,85,85,0.3)",
    background: "rgba(255,255,255,0.02)",
    maxWidth: "420px"
  },

  titulo: {
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: "3rem",
    color: "#e05555",
    marginBottom: "10px"
  },

  texto: {
    fontSize: "0.9rem",
    color: "rgba(240,236,228,0.6)",
    marginBottom: "30px",
    letterSpacing: "0.05em"
  },

  botao: {
    padding: "12px 28px",
    background: "#e05555",
    border: "none",
    color: "#0a0a0a",
    fontWeight: "bold",
    letterSpacing: "0.1em",
    cursor: "pointer",
    textTransform: "uppercase"
  }
};

export default function ErroPagamento(){

  const navigate = useNavigate();

  return(
    <div style={S.page}>
      <div style={S.card}>

        <h1 style={S.titulo}>Pagamento Falhou</h1>

        <p style={S.texto}>
          Não foi possível confirmar o pagamento.  
          Verifique seus dados ou tente novamente.
        </p>

        <button
          style={S.botao}
          onClick={() => navigate("/")}
        >
          Voltar
        </button>

      </div>
    </div>
  );
}