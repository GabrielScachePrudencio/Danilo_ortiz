import React, { useState } from "react";

const API = process.env.REACT_APP_API_URL || "http://localhost:3001";

const FORM_VAZIO = {
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
  cep: "",
  observacao: "",
};

/**
 * Modal de cadastro de aluno para o painel administrativo.
 *
 * Props:
 * - aberto: boolean — controla se o modal é exibido
 * - aoFechar: () => void — chamado ao cancelar ou fechar
 * - aoCadastrar: (alunoCriado) => void — chamado após cadastro com sucesso
 *   (útil para dar refresh na lista de alunos que chamou o modal)
 */
export function ModalCadastroAluno({ aberto, aoFechar, aoCadastrar }) {
  const token = localStorage.getItem("admin_token") || localStorage.getItem("token");

  const [form, setForm] = useState(FORM_VAZIO);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(null);
  const [sucesso, setSucesso] = useState(null);

  if (!aberto) return null;

  function limpar() {
    setErro(null);
    setSucesso(null);
  }

  function fechar() {
    setForm(FORM_VAZIO);
    limpar();
    aoFechar?.();
  }

  function handleChange(e) {
    let { name, value } = e.target;

    if (name === "cep") value = value.replace(/\D/g, "").slice(0, 8);
    if (name === "cpf") value = value.replace(/\D/g, "").slice(0, 11);
    if (name === "cnpj") value = value.replace(/\D/g, "").slice(0, 14);
    if (name === "numero") value = value.replace(/\D/g, "");
    if (name === "whatsapp") {
      value = value.replace(/\D/g, "");
      if (value.startsWith("55")) value = value.slice(2);
      value = value.slice(0, 11);
      value = "55" + value;
    }

    setForm((f) => ({ ...f, [name]: value }));
  }

  async function cadastrar() {
    limpar();

    const obrigatorios = [
      { campo: "nome", label: "Nome Completo" },
      { campo: "email", label: "E-mail" },
      { campo: "whatsapp", label: "WhatsApp" },
      { campo: "cpf", label: "CPF" },
    ];

    for (const { campo, label } of obrigatorios) {
      if (!form[campo] || form[campo].trim() === "") {
        setErro(`O campo "${label}" é obrigatório.`);
        return;
      }
    }
    if (form.whatsapp.length !== 13) {
      setErro("O WhatsApp deve conter DDD + número.");
      return;
    }
   

    setLoading(true);
    try {
      const res = await fetch(`${API}/alunos/admin/criar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        const alunoCriado = await res.json().catch(() => null);
        setSucesso("Aluno cadastrado com sucesso!");
        aoCadastrar?.(alunoCriado);
        setTimeout(() => fechar(), 900);
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
    <div className="overlay" onClick={fechar}>
      <div className="modal modal-cadastro-aluno" onClick={(e) => e.stopPropagation()}>
        <div className="modal-title">Cadastrar Aluno</div>
        
        <p>O Aluno vai definir sua senha ao entrar </p>
        
        {erro && <div className="admin-erro">{erro}</div>}
        {sucesso && <div className="admin-sucesso">✓ {sucesso}</div>}

        <p className="modal-secao">Acesso</p>
        <div className="modal-grid">
          <div className="field">
            <label>E-mail</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} />
          </div>
        </div>

        <p className="modal-secao">Dados Pessoais</p>
        <div className="modal-grid">
          <div className="field">
            <label>Nome Completo</label>
            <input type="text" name="nome" value={form.nome} onChange={handleChange} />
          </div>
          <div className="field">
            <label>WhatsApp</label>
            <input
              type="text"
              name="whatsapp"
              placeholder="(11) 99999-9999"
              value={form.whatsapp}
              onChange={handleChange}
            />
          </div>
          <div className="field">
            <label>CPF</label>
            <input type="text" name="cpf" value={form.cpf} onChange={handleChange} />
          </div>
          <div className="field">
            <label>CNPJ</label>
            <input type="text" name="cnpj" value={form.cnpj} onChange={handleChange} />
          </div>
        </div>

        <p className="modal-secao">Endereço</p>
        <div className="modal-grid">
          <div className="field">
            <label>CEP</label>
            <input type="text" name="cep" value={form.cep} onChange={handleChange} />
          </div>
          <div className="field">
            <label>Rua</label>
            <input type="text" name="rua" value={form.rua} onChange={handleChange} />
          </div>
          <div className="field">
            <label>Número</label>
            <input type="number" name="numero" value={form.numero} onChange={handleChange} />
          </div>
          <div className="field">
            <label>Bairro</label>
            <input type="text" name="bairro" value={form.bairro} onChange={handleChange} />
          </div>
          <div className="field">
            <label>Cidade</label>
            <input type="text" name="cidade" value={form.cidade} onChange={handleChange} />
          </div>
          <div className="field">
            <label>Estado</label>
            <input type="text" name="estado" placeholder="SP" value={form.estado} onChange={handleChange} />
          </div>
        </div>
        <p className="modal-secao">Observações</p>
        <div className="field" style={{ width: "100%", marginBottom: "15px" }}>
          <label>Observação sobre o aluno</label>
          <textarea
            name="observacao"
            rows={3}
            placeholder="Restrições médicas, preferências, avisos..."
            value={form.observacao}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
          />
        </div>


        <div className="modal-row">
          <button className="btn-ghost" onClick={fechar} disabled={loading}>
            Cancelar
          </button>
          <button className="btn-primary" onClick={cadastrar} disabled={loading}>
            {loading ? "Cadastrando..." : "Salvar"}
          </button>
        </div>
      </div>
    </div>
  );
}