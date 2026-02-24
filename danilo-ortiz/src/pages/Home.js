import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


export default function Home() {
  const navigate = useNavigate();
  const [todosPlanos, setTodosPlanos] = useState([]);
  const [emaillogado, setEmaillogado] = useState(null);
  const [idLogado, setIdLogado] = useState(null);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(true);

  const url = "http://localhost:8080/planos";

  const atualizarStatusLogin = () => {
    const email = localStorage.getItem("email");
    const id = localStorage.getItem("id");
    setEmaillogado(email);
    setIdLogado(id);
  };

  useEffect(() => {
    atualizarStatusLogin();

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setTodosPlanos(data);
        setCarregando(false);
      })
      .catch((err) => {
        console.error(err);
        setErro("Erro ao carregar planos");
        setCarregando(false);
      });
  }, []);

  const deslogar = (e) => {
    e.preventDefault();
    localStorage.clear();
    atualizarStatusLogin();
  };

  const irParaPagamento = (e, planoId) => {
    e.preventDefault();
    navigate(`/home/telapagamento/${planoId}`);
  };

  return (
    <>
      <div className="home-container">
        <nav className="nav-bar">
          <button
            className="btn-login"
            onClick={() =>
              navigate(emaillogado ? `/home/conta/${idLogado}` : "/login")
            }
          >
            {emaillogado ? emaillogado : "Cadastrar-se"}
          </button>
          {emaillogado && (
            <button className="btn-sair" onClick={deslogar}>
              Sair
            </button>
          )}
        </nav>

        <section className="hero">
          <p className="hero-eyebrow">Personal Trainer</p>
          <h1>Danilo Ortiz</h1>
          <p className="hero-sub">Escolha seu plano de treinamento</p>
          <div className="hero-divider" />
        </section>

        {erro && <p className="erro-msg">{erro}</p>}

        <section className="planos-section">
          <p className="planos-label">Planos disponíveis</p>
          <div className="planos">
            {carregando ? (
              <p className="loading">Carregando planos...</p>
            ) : (
              todosPlanos.map((plano, index) => (
                <button
                  key={plano.id}
                  className="plano-card"
                  onClick={(e) => irParaPagamento(e, plano.id)}
                >
                  <span className="plano-numero">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="plano-nome">{plano.nome}</span>
                  <span className="plano-nome">{plano.duracaomeses} MESES </span>
                  <span className="plano-nome">R$ <strong>{plano.valor}</strong></span>
                  <span className="plano-cta">
                    Contratar plano <span className="plano-arrow">→</span>
                  </span>
                </button>
              ))
            )}
          </div>
        </section>
      </div>
    </>
  );
}
