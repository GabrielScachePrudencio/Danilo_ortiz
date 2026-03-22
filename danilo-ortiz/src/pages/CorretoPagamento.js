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
    border: "1px solid rgba(111,207,122,0.4)",
    background: "rgba(255,255,255,0.02)",
    maxWidth: "420px"
  },

  titulo: {
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: "3rem",
    color: "#6fcf7a",
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
    background: "#6fcf7a",
    border: "none",
    color: "#0a0a0a",
    fontWeight: "bold",
    letterSpacing: "0.1em",
    cursor: "pointer",
    textTransform: "uppercase"
  }
};

export default function CorretoPagamento(){

  const navigate = useNavigate();

  return(
    <div style={S.page}>
      <div style={S.card}>

        <h1 style={S.titulo}>Pagamento Aprovado</h1>

        <p style={S.texto}>
          Seu pagamento foi confirmado com sucesso.  
          Sua conta será ativada automaticamente.
        </p>

        <button
          style={S.botao}
          onClick={() => navigate("/")}
        >
          Ir para Conta
        </button>

      </div>
    </div>
  );
}