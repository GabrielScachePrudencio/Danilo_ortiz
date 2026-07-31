


-- Inserindo os Planos
INSERT INTO planos (nome, valor, duracao_meses, ativo) VALUES 
('Plano Mensal', 97.00, 1, true),
('Plano Trimestral', 250.00, 3,true),
('Plano Anual', 800.00, 12, true);

-- Inserindo Configuração Inicial
INSERT INTO configuracoes (nome_site, sobre_voce, texto_informativo, whatsapp_suporte) 
VALUES ('Equipe Danilo SisRun', 'Treinador de elite focado em performance.', 'Após o pagamento, crie sua conta no SisRun para liberação.', '5511999999999');

-- Inserindo um Administrador (Você/Seu Primo)
INSERT INTO alunos (nome, email, whatsapp, tipo_usuario, status_assinatura, senha) 
VALUES ('1', '1@gmail.com', '5511888888888', 'ADMIN', 'ATIVO', '1');



INSERT INTO modelo_mensagem (tipo, descricao, conteudo) VALUES
('CONFIRMACAO_PAGAMENTO', 'Enviada automaticamente quando o pagamento é aprovado',
'✅ *Pagamento confirmado!*

Olá, {{nome}}! Somos da *2DASSESSORIA* e recebemos o seu pagamento com sucesso. 🎉

📋 *Plano:* {{plano}}
💰 *Valor pago:* R$ {{valor}}
📅 *Válido até:* {{validade}}

Agora é só criar sua conta no *SisRun* pelo link abaixo:
🔗 {{linkCadastro}}

Qualquer dúvida estamos à disposição! 🏋️'),

('COBRANCA', 'Disparada manualmente pelo front para cobrar pendência',
'⚠️ *Pagamento pendente*

Olá, {{nome}}! Notamos que sua mensalidade ainda está em aberto.

Para regularizar rapidinho, acesse:
🔗 {{linkPagamento}}

Qualquer dúvida, estamos à disposição! 🏋️'),

('MENSALIDADE_FINAL', 'Aviso de vencimento próximo',
'📅 *Mensalidade chegando ao fim*

Olá, {{nome}}! Sua mensalidade vence em *{{dataVencimento}}*.

Renove pelo link ou fale com a gente pra continuar treinando sem interrupção! 💪'),

('INCENTIVO_VOLTAR_TREINAR', 'Reengajamento de aluno inativo',
'💪 *Sentimos sua falta!*

E aí, {{nome}}! Faz um tempinho que você não aparece por aqui.

Bora voltar a treinar essa semana? A gente te espera! 🔥');




INSERT INTO modelo_mensagem (tipo, descricao, conteudo) VALUES
('CRIACAO_CONTA', 'Enviada quando a conta do aluno é criada pelo admin',
'👤 *Conta criada com sucesso!*

Olá, {{nome}}! Sua conta foi criada por {{adminNome}}. 
Por favor, entre com seu e-mail e seu CPF para definir sua senha de acesso no site:
🔗 {{linkLogin}}

Qualquer dúvida, estamos à disposição! 🏋️'),

('PLANO_ANEXADO', 'Enviada quando um plano/cobrança é anexado ao aluno',
'💳 *Plano atribuído!*

Olá, {{nome}}! {{adminNome}} anexou um plano para você.
Por favor, acesse o link abaixo para realizar o pagamento pelo site:
🔗 {{linkPagamento}}

Qualquer dúvida, estamos à disposição! 🏋️');