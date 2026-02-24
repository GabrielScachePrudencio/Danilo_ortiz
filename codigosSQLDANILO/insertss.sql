-- Inserindo os Planos
INSERT INTO planos (nome, valor, duracao_meses) VALUES 
('Plano Mensal', 97.00, 1),
('Plano Trimestral', 250.00, 3),
('Plano Anual', 800.00, 12);

-- Inserindo Configuração Inicial
INSERT INTO configuracoes (nome_site, sobre_voce, texto_informativo, whatsapp_suporte) 
VALUES ('Equipe Danilo SisRun', 'Treinador de elite focado em performance.', 'Após o pagamento, crie sua conta no SisRun para liberação.', '5511999999999');

-- Inserindo um Administrador (Você/Seu Primo)
INSERT INTO alunos (nome, email, whatsapp, tipo_usuario, status_assinatura) 
VALUES ('Danilo Admin', 'danilo@email.com', '5511888888888', 'ADMIN', 'ATIVO');

-- Inserindo um Aluno Exemplo (Aguardando pagamento)
INSERT INTO alunos (nome, email, whatsapp, tipo_usuario, status_assinatura) 
VALUES ('João Silva', 'joao@email.com', '5511777777777', 'ALUNO', 'PENDENTE');