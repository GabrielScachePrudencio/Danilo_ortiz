import React, { useState } from "react";
import { S } from "./estilosAluno";

export function ModalTrocarSenha({ onClose, idAluno, token, API, mostrarToast }) {
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [erro, setErro] = useState(null);
  const [salvando, setSalvando] = useState(false);

  async function salvar() {
    setErro(null);

    if (!senhaAtual || !novaSenha || !confirmarSenha) {
      setErro("Preencha todos os campos.");
      return;
    }
    if (novaSenha.length < 6) {
      setErro("A nova senha deve ter pelo menos 6 caracteres.");
      return;
    }
    if (novaSenha !== confirmarSenha) {
      setErro("As senhas não coincidem.");
      return;
    }

    setSalvando(true);
    try {
      const res = await fetch(`${API}/alunos/${idAluno}/trocar-senha`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ senhaAtual, novaSenha }),
      });

      if (res.ok) {
        mostrarToast?.("Senha alterada com sucesso!", true);
        onClose();
      } else if (res.status === 401) {
        setErro("Senha atual incorreta.");
      } else {
        setErro("Erro ao trocar a senha. Tente novamente.");
      }
    } catch {
      setErro("Erro de conexão com o servidor.");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div style={S.modalOverlay} onClick={onClose}>
      <div style={S.modalCard} onClick={(e) => e.stopPropagation()}>
        <p style={S.modalTitulo}>Trocar Senha</p>

        {erro && (
          <p
            style={{
              fontSize: "0.75rem",
              color: "#e05555",
              border: "1px solid rgba(224,85,85,0.3)",
              background: "rgba(224,85,85,0.05)",
              padding: "10px 14px",
              marginBottom: 18,
            }}
          >
            {erro}
          </p>
        )}

        <div style={S.inputGroup}>
          <label style={S.inputLabel}>Senha Atual</label>
          <input
            type="password"
            style={S.input}
            value={senhaAtual}
            onChange={(e) => setSenhaAtual(e.target.value)}
          />
        </div>

        <div style={S.inputGroup}>
          <label style={S.inputLabel}>Nova Senha</label>
          <input
            type="password"
            style={S.input}
            value={novaSenha}
            onChange={(e) => setNovaSenha(e.target.value)}
          />
        </div>

        <div style={S.inputGroup}>
          <label style={S.inputLabel}>Confirmar Nova Senha</label>
          <input
            type="password"
            style={S.input}
            value={confirmarSenha}
            onChange={(e) => setConfirmarSenha(e.target.value)}
          />
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 24, justifyContent: "flex-end" }}>
          <button style={S.btnSecondary} onClick={onClose} disabled={salvando}>
            Cancelar
          </button>
          <button style={{ ...S.btnPrimary, opacity: salvando ? 0.6 : 1 }} onClick={salvar} disabled={salvando}>
            {salvando ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </div>
    </div>
  );
}
