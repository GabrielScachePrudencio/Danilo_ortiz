import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// ─── IMAGENS via Unsplash ───────────────────────────────────────────────────
const IMG_TRAINER2 = "https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=700&q=80&fit=crop";
const isRailway = window.location.hostname.includes("railway.app");
const DANILO_WHATSAPP = "5516996339294";
const EXERCICIOS = [
  {
    img:  "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&q=80&fit=crop",
    nome: "Caminhada Funcional",
    desc: "Protocolo de 45 min com variações de ritmo e inclinação para queima máxima de gordura.",
    tag:  "Cardio",
  },
  {
    img:  "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80&fit=crop",
    nome: "Treino de Força",
    desc: "Movimentos compostos adaptados ao seu nível para construir músculo e acelerar o metabolismo.",
    tag:  "Força",
  },
  {
    img:  "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&q=80&fit=crop",
    nome: "Mobilidade & Core",
    desc: "Rotinas de alongamento ativo e estabilização que eliminam dores posturais do dia a dia.",
    tag:  "Bem-estar",
  },
  {
    img:  "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=600&q=80&fit=crop",
    nome: "HIIT ao Ar Livre",
    desc: "Intervalos de alta intensidade combinados com corrida leve para resultados expressivos em menos tempo.",
    tag:  "Queima",
  },
];


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
    descricao: "Com a conta criada, copie seu nome de usuário do SISRUN e envie para o Danilo pelo WhatsApp.",
    img: "https://placehold.co/480x240/0d0d0d/c4a064?text=Passo+5+%E2%80%94+Avisar+o+Danilo",
  },
];

const DEPOIMENTOS = [
  {
    nome: "Camila Souza", cidade: "São Paulo — SP",
    texto: "Perdi 12 kg em 4 meses sem academia. O Danilo montou um plano que cabia na minha rotina de mãe e funcionou de verdade.",
    resultado: "-12 kg",
    img: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&q=80&fit=crop",
  },
  {
    nome: "Rafael Mendes", cidade: "Curitiba — PR",
    texto: "Comecei só caminhando. Hoje corro 10 km e me sinto 10 anos mais novo. A assessoria online foi melhor do que qualquer personal presencial que já tive.",
    resultado: "8 meses",
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80&fit=crop",
  },
  {
    nome: "Fernanda Lima", cidade: "Belo Horizonte — MG",
    texto: "Tinha pressão alta e sedentarismo total. Em 6 meses normalizei tudo e ainda emagreci 8 kg. Mudança de vida.",
    resultado: "-8 kg",
    img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80&fit=crop",
  },
  {
    nome: "Bruno Carvalho", cidade: "Recife — PE",
    texto: "A planilha é detalhada, o feedback é rápido e o resultado aparece. Simples assim.",
    resultado: "-15 kg",
    img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80&fit=crop",
  },
];
const S = {
  btnPrimary: {
    background: "#c4a064",
    color: "#0a0a0a",
    border: "none",
    cursor: "pointer"
  },
  btnSecondary: {
    background: "transparent",
    color: "#fff",
    border: "1px solid #444",
    cursor: "pointer"
  },
  toast: (ok) => ({
    position: "fixed",
    bottom: 32,
    right: 32,
    padding: "14px 24px",
    background: ok ? "#1f3d2b" : "#3d1f1f",
    border: `1px solid ${ok ? "rgba(90,180,100,0.4)" : "rgba(224,85,85,0.4)"}`,
    color: ok ? "#6fcf7a" : "#e05555",
    fontSize: "0.75rem",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    fontFamily: "'Barlow', sans-serif",
    zIndex: 999,
    animation: "fadeIn 0.3s ease",
  }),

};
// ─── ESTILOS ────────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,300;0,600;0,700;0,800;1,700;1,800&family=Lato:wght@300;400;700&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}

:root{
  --ink:#0c0c0c;
  --ink2:#181818;
  --ink3:#1f1f1f;
  --border:#2a2a2a;
  --gold:#d4a843;
  --gold2:#f0c96a;
  --gold-dim:rgba(212,168,67,.12);
  --snow:#f7f4ee;
  --muted:#7a7a7a;
  --sans:'Lato',sans-serif;
  --cond:'Barlow Condensed',sans-serif;
}

html{scroll-behavior:smooth}
body{background:var(--ink);color:var(--snow)}
.page{font-family:var(--sans);overflow-x:hidden}

/* NAV */
.nav{
  position:fixed;top:0;left:0;right:0;z-index:200;
  display:flex;align-items:center;justify-content:space-between;
  padding:18px 48px;
  background:rgba(12,12,12,.93);backdrop-filter:blur(12px);
  border-bottom:1px solid var(--border);
}
.nav-logo{font-family:var(--cond);font-size:1.3rem;font-weight:800;letter-spacing:.18em;text-transform:uppercase;color:var(--gold)}
.nav-links{display:flex;gap:8px;align-items:center}
.nbtn{border:none;background:none;cursor:pointer;font-family:var(--sans);font-size:.75rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;padding:9px 22px;border-radius:2px;transition:all .2s}
.nbtn-ghost{color:var(--muted);border:1px solid var(--border)}
.nbtn-ghost:hover{color:var(--snow);border-color:var(--snow)}
.nbtn-gold{background:var(--gold);color:var(--ink)}
.nbtn-gold:hover{background:var(--gold2)}

/* HERO */
.hero{position:relative;min-height:100vh;display:grid;grid-template-columns:1fr 640px;align-items:end;overflow:hidden}
.hero-left{position:relative;z-index:2;padding:180px 48px 100px}
.hero-eyebrow{display:inline-flex;align-items:center;gap:10px;font-size:.68rem;letter-spacing:.28em;text-transform:uppercase;color:var(--gold);margin-bottom:24px}
.hero-eyebrow::before{content:'';width:28px;height:1px;background:var(--gold)}
.hero-h1{font-family:var(--cond);font-weight:800;font-style:italic;font-size:clamp(4.5rem,9vw,8.5rem);line-height:.92;text-transform:uppercase;letter-spacing:-.01em}
.hero-h1 em{color:var(--gold)}
.hero-p{margin-top:28px;max-width:440px;font-size:.95rem;font-weight:300;line-height:1.8;color:#aaa}
.hero-cta-row{display:flex;align-items:center;gap:20px;margin-top:44px;flex-wrap:wrap}
.btn-primary{background:var(--gold);color:var(--ink);border:none;cursor:pointer;font-family:var(--sans);font-size:.8rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;padding:16px 36px;border-radius:2px;transition:all .25s}
.btn-primary:hover{background:var(--gold2);transform:translateY(-2px)}
.hero-hint{font-size:.72rem;color:var(--muted);letter-spacing:.06em;display:flex;align-items:center;gap:8px}
.hero-hint::before{content:'✓';color:var(--gold)}
.hero-right{position:relative;height:100vh;overflow:hidden}
.hero-img{width:100%;height:100%;object-fit:cover;object-position:center top;filter:grayscale(0%) contrast(1.05)}
.hero-img-overlay{position:absolute;inset:0;background:linear-gradient(90deg,var(--ink) 0%,transparent 40%),linear-gradient(0deg,var(--ink) 0%,transparent 30%)}
.hero-badge{position:absolute;bottom:80px;left:-28px;background:var(--gold);color:var(--ink);padding:18px 26px;border-radius:3px;font-family:var(--cond);font-weight:800;font-size:.9rem;letter-spacing:.08em;text-transform:uppercase;box-shadow:0 20px 60px rgba(0,0,0,.6);z-index:3}
.hero-badge span{display:block;font-size:2.2rem;line-height:1}
.hero-stats-bar{position:absolute;bottom:0;left:0;right:0;z-index:3;display:grid;grid-template-columns:repeat(3,1fr);border-top:1px solid var(--border);background:rgba(12,12,12,.88);backdrop-filter:blur(10px)}
.stat-cell{padding:24px 32px;text-align:center;border-right:1px solid var(--border)}
.stat-cell:last-child{border-right:none}
.stat-n{font-family:var(--cond);font-size:2.4rem;font-weight:800;color:var(--snow);line-height:1}
.stat-n b{color:var(--gold)}
.stat-l{font-size:.65rem;color:var(--muted);letter-spacing:.12em;text-transform:uppercase;margin-top:4px}

/* SOBRE */
.sobre{display:grid;grid-template-columns:500px 1fr;min-height:580px}
.sobre-img-wrap{position:relative;overflow:hidden}
.sobre-img{width:100%;height:100%;object-fit:cover;filter:grayscale(15%);transition:transform 6s ease}
.sobre-img-wrap:hover .sobre-img{transform:scale(1.04)}
.sobre-stripe{position:absolute;top:0;bottom:0;right:0;width:3px;background:linear-gradient(to bottom,transparent,var(--gold),transparent)}
.sobre-content{padding:80px 64px;background:var(--ink2);display:flex;flex-direction:column;justify-content:center}
.sobre-tag{font-size:.68rem;letter-spacing:.25em;text-transform:uppercase;color:var(--gold);margin-bottom:16px}
.sobre-h2{font-family:var(--cond);font-weight:800;font-style:italic;font-size:clamp(2.4rem,4vw,3.4rem);text-transform:uppercase;line-height:.95;margin-bottom:28px}
.sobre-h2 em{color:var(--gold)}
.sobre-p{font-size:.9rem;font-weight:300;line-height:1.85;color:#aaa;margin-bottom:16px}
.sobre-pills{display:flex;flex-wrap:wrap;gap:10px;margin-top:28px}
.pill{padding:7px 18px;border:1px solid var(--border);border-radius:100px;font-size:.7rem;letter-spacing:.1em;text-transform:uppercase;color:var(--muted);transition:all .2s;cursor:default}
.pill:hover{border-color:var(--gold);color:var(--gold)}

/* EXERCÍCIOS */
.exercicios{padding:100px 48px;background:var(--ink)}
.sec-header{display:flex;align-items:flex-end;justify-content:space-between;margin-bottom:56px;padding-bottom:28px;border-bottom:1px solid var(--border)}
.sec-tag{font-size:.68rem;letter-spacing:.25em;text-transform:uppercase;color:var(--gold);margin-bottom:12px}
.sec-h2{font-family:var(--cond);font-weight:800;font-style:italic;font-size:clamp(2rem,4vw,3rem);text-transform:uppercase;line-height:1}
.sec-note{font-size:.75rem;color:var(--muted);text-align:right;max-width:180px;line-height:1.6}
.ex-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:2px}
.ex-card{position:relative;overflow:hidden;aspect-ratio:3/4;cursor:default}
.ex-card img{width:100%;height:100%;object-fit:cover;filter:grayscale(25%) brightness(.8);transition:transform .5s cubic-bezier(.16,1,.3,1),filter .5s}
.ex-card:hover img{transform:scale(1.06);filter:grayscale(0%) brightness(.65)}
.ex-overlay{position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,.92) 0%,rgba(0,0,0,.25) 50%,transparent 100%);display:flex;flex-direction:column;justify-content:flex-end;padding:28px 24px}
.ex-tag-badge{display:inline-block;background:var(--gold);color:var(--ink);font-size:.6rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;padding:4px 12px;border-radius:1px;margin-bottom:10px;width:fit-content}
.ex-nome{font-family:var(--cond);font-weight:700;font-size:1.4rem;text-transform:uppercase;letter-spacing:.04em;line-height:1.1;margin-bottom:8px}
.ex-desc{font-size:.75rem;font-weight:300;color:#ccc;line-height:1.6;opacity:0;transform:translateY(10px);transition:all .35s cubic-bezier(.16,1,.3,1)}
.ex-card:hover .ex-desc{opacity:1;transform:translateY(0)}

/* DEPOIMENTOS */
.depoi{padding:100px 48px;background:var(--ink2)}
.depoi-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:2px}
.depoi-card{background:var(--ink3);padding:40px;border:1px solid var(--border);position:relative;transition:border-color .25s}
.depoi-card:hover{border-color:rgba(212,168,67,.3)}
.depoi-quote{font-family:var(--cond);font-size:5rem;font-weight:800;color:var(--gold);line-height:.7;margin-bottom:16px;opacity:.4}
.depoi-text{font-size:.9rem;font-weight:300;line-height:1.85;color:#ccc;margin-bottom:28px;font-style:italic}
.depoi-foot{display:flex;align-items:center;gap:16px}
.depoi-foto{width:52px;height:52px;border-radius:50%;object-fit:cover;border:2px solid var(--border);filter:grayscale(20%);flex-shrink:0}
.depoi-nome{font-size:.85rem;font-weight:700;letter-spacing:.04em;margin-bottom:2px}
.depoi-cidade{font-size:.7rem;color:var(--muted);letter-spacing:.06em}
.depoi-result{margin-left:auto;font-family:var(--cond);font-size:1.9rem;font-weight:800;color:var(--gold);letter-spacing:.04em;white-space:nowrap}

/* PLANOS */
.planos-sec{padding:100px 48px;background:var(--ink)}
.planos-list{display:flex;flex-direction:column;gap:3px}
.plano-row{display:grid;grid-template-columns:56px 1fr max-content max-content;align-items:center;gap:24px;padding:24px 32px;background:var(--ink2);border:1px solid var(--border);cursor:pointer;width:100%;font-family:var(--sans);color:var(--snow);text-align:left;transition:all .25s;position:relative;overflow:hidden}
.plano-row::before{content:'';position:absolute;left:0;top:0;bottom:0;width:3px;background:var(--gold);transform:scaleY(0);transition:transform .25s;transform-origin:bottom}
.plano-row:hover{border-color:rgba(212,168,67,.35);transform:translateX(3px)}
.plano-row:hover::before{transform:scaleY(1)}
.plano-num{font-family:var(--cond);font-size:2rem;font-weight:800;color:var(--border);transition:color .25s;line-height:1}
.plano-row:hover .plano-num{color:var(--gold)}
.plano-nome-txt{font-family:var(--cond);font-size:1.5rem;font-weight:700;text-transform:uppercase;letter-spacing:.05em;line-height:1}
.plano-dur{font-size:.7rem;color:var(--muted);letter-spacing:.1em;text-transform:uppercase;margin-top:4px}
.popular-tag{font-size:.58rem;background:var(--gold);color:var(--ink);padding:3px 9px;border-radius:1px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;vertical-align:middle;margin-left:10px}
.plano-price{text-align:right}
.plano-price-label{font-size:.62rem;color:var(--muted);letter-spacing:.1em;text-transform:uppercase;margin-bottom:2px}
.plano-price-val{font-family:var(--cond);font-size:2rem;font-weight:800;line-height:1}
.plano-price-val .cur{font-size:1rem;color:var(--gold);margin-right:2px}
.plano-btn{display:flex;align-items:center;gap:10px;font-size:.7rem;letter-spacing:.12em;text-transform:uppercase;color:var(--muted);transition:color .2s;white-space:nowrap}
.plano-row:hover .plano-btn{color:var(--gold)}
.arrow-circle{width:34px;height:34px;border-radius:50%;border:1px solid var(--border);display:flex;align-items:center;justify-content:center;font-size:.85rem;transition:all .2s;flex-shrink:0}
.plano-row:hover .arrow-circle{background:var(--gold);border-color:var(--gold);color:var(--ink);transform:translateX(4px)}
.planos-note{margin-top:32px;padding:24px 32px;border:1px solid var(--border);background:var(--ink2);display:flex;align-items:flex-start;gap:20px;flex-wrap:wrap}
.note-icon{font-size:1.3rem;margin-top:2px}
.planos-note p{font-size:.82rem;color:var(--muted);font-weight:300;line-height:1.7;flex:1}
.planos-note strong{color:var(--snow)}

.state-box{padding:80px 0;text-align:center;color:var(--muted);font-size:.85rem;letter-spacing:.08em}
.dots span{display:inline-block;width:7px;height:7px;border-radius:50%;background:var(--gold);margin:0 3px;animation:db 1.2s ease-in-out infinite}
.dots span:nth-child(2){animation-delay:.2s}
.dots span:nth-child(3){animation-delay:.4s}

/* FOOTER */
.footer{border-top:1px solid var(--border);padding:36px 48px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:16px;background:var(--ink)}
.footer-brand{font-family:var(--cond);font-size:1.1rem;font-weight:800;letter-spacing:.18em;text-transform:uppercase;color:var(--gold)}
.footer-txt{font-size:.7rem;color:var(--muted);letter-spacing:.06em}

/* ── MODAL PARCELAS ── */
.mp-overlay{
  position:fixed;inset:0;z-index:500;
  background:rgba(0,0,0,.88);
  display:flex;align-items:center;justify-content:center;
  padding:24px;animation:mpFade .2s ease;
}
.mp-box{
  background:#111;border:1px solid rgba(212,168,67,.25);
  width:100%;max-width:560px;
  box-shadow:0 40px 80px rgba(0,0,0,.7);
}
.mp-head{
  display:flex;align-items:center;justify-content:space-between;
  padding:18px 24px;border-bottom:1px solid rgba(212,168,67,.1);
  background:rgba(212,168,67,.03);
}
.mp-title{font-family:var(--cond);font-size:1.1rem;font-weight:800;text-transform:uppercase;letter-spacing:.1em}
.mp-close{background:transparent;border:1px solid rgba(247,244,238,.12);color:rgba(247,244,238,.35);cursor:pointer;width:30px;height:30px;display:flex;align-items:center;justify-content:center;font-size:14px;transition:all .2s}
.mp-close:hover{border-color:rgba(247,244,238,.4);color:var(--snow)}
.mp-body{padding:28px 28px 8px}
.mp-plano-info{
  display:flex;align-items:center;justify-content:space-between;
  padding:16px 20px;background:rgba(212,168,67,.05);border:1px solid rgba(212,168,67,.15);
  margin-bottom:28px;
}
.mp-plano-nome{font-family:var(--cond);font-size:1.2rem;font-weight:700;text-transform:uppercase;letter-spacing:.06em}
.mp-plano-val{font-family:var(--cond);font-size:1.5rem;font-weight:800;color:var(--gold)}
.mp-plano-val small{font-size:.75rem;color:var(--muted);margin-right:4px;font-family:var(--sans)}
.mp-subtitle{font-size:.62rem;letter-spacing:.25em;text-transform:uppercase;color:rgba(212,168,67,.5);margin-bottom:14px}
.mp-opts{display:flex;flex-direction:column;gap:3px;margin-bottom:8px}
.mp-opt{
  display:flex;align-items:center;justify-content:space-between;
  padding:14px 18px;background:var(--ink2);border:1px solid var(--border);
  cursor:pointer;transition:all .2s;position:relative;overflow:hidden;
}
.mp-opt::before{content:'';position:absolute;left:0;top:0;bottom:0;width:3px;background:var(--gold);transform:scaleY(0);transition:transform .2s}
.mp-opt:hover{border-color:rgba(212,168,67,.35)}
.mp-opt:hover::before{transform:scaleY(1)}
.mp-opt.active{border-color:var(--gold);background:rgba(212,168,67,.07)}
.mp-opt.active::before{transform:scaleY(1)}
.mp-opt-left{display:flex;align-items:center;gap:14px}
.mp-radio{width:16px;height:16px;border-radius:50%;border:1.5px solid var(--muted);flex-shrink:0;transition:all .2s;display:flex;align-items:center;justify-content:center}
.mp-opt.active .mp-radio{border-color:var(--gold);background:var(--gold)}
.mp-radio-dot{width:6px;height:6px;border-radius:50%;background:var(--ink);display:none}
.mp-opt.active .mp-radio-dot{display:block}
.mp-opt-label{font-size:.82rem;font-weight:700;letter-spacing:.04em}
.mp-opt-sub{font-size:.68rem;color:var(--muted);margin-top:2px;letter-spacing:.03em}
.mp-opt-price{text-align:right}
.mp-opt-price-val{font-family:var(--cond);font-size:1.4rem;font-weight:800;color:var(--snow);line-height:1}
.mp-opt.active .mp-opt-price-val{color:var(--gold)}
.mp-opt-price-each{font-size:.62rem;color:var(--muted);letter-spacing:.05em;margin-top:2px}
.mp-economy{
  display:inline-block;background:rgba(79,200,100,.12);
  border:1px solid rgba(79,200,100,.3);color:#5dc874;
  font-size:.62rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;
  padding:2px 8px;border-radius:2px;margin-left:8px;vertical-align:middle;
}
.mp-footer{padding:20px 28px 24px;display:flex;gap:10px;justify-content:flex-end;border-top:1px solid rgba(212,168,67,.08);margin-top:16px}
.mp-btn-cancel{background:transparent;border:1px solid var(--border);color:var(--muted);cursor:pointer;font-family:var(--sans);font-size:.72rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;padding:11px 22px;transition:all .2s}
.mp-btn-cancel:hover{color:var(--snow);border-color:rgba(247,244,238,.3)}
.mp-btn-confirm{background:var(--gold);border:none;color:var(--ink);cursor:pointer;font-family:var(--sans);font-size:.72rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;padding:11px 28px;transition:all .2s}
.mp-btn-confirm:hover{background:var(--gold2)}
.mp-btn-confirm:disabled{opacity:.4;cursor:not-allowed}

@keyframes mpFade{from{opacity:0;transform:scale(.97)}to{opacity:1;transform:scale(1)}}
@keyframes db{0%,80%,100%{transform:translateY(0);opacity:.3}40%{transform:translateY(-8px);opacity:1}}

/* RESPONSIVE */
@media(max-width:900px){
  .hero{grid-template-columns:1fr}
  .hero-right{display:none}
  .hero-left{padding:140px 24px 80px}
  .sobre{grid-template-columns:1fr}
  .sobre-img-wrap{height:320px}
  .sobre-content{padding:48px 24px}
  .exercicios,.depoi,.planos-sec{padding:64px 24px}
  .ex-grid{grid-template-columns:repeat(2,1fr)}
  .depoi-grid{grid-template-columns:1fr}
  .nav{padding:14px 20px}
  .sec-header{flex-direction:column;align-items:flex-start;gap:12px}
  .sec-note{text-align:left}
  .plano-row{grid-template-columns:40px 1fr;grid-template-rows:auto auto;gap:12px 10px;padding:18px 20px}
  .plano-price{grid-column:2;grid-row:2;text-align:left}
  .plano-btn{display:none}
  .footer{padding:28px 24px}
  .mp-opts{gap:2px}
}
`;

// ─── MODAL DE PARCELAS ──────────────────────────────────────────────────────
function ModalParcelas({ plano, onConfirmar, onFechar }) {
  const meses = plano?.duracaomeses ?? 1;
  // opcoes: 1x (cobrar toda vez) ou meses vezes (pagar tudo de uma vez)
  const opcoes = [];

  // sempre tem a opção de pagar mês a mês
  opcoes.push({
    parcelas: meses,
    label: `${meses}x mensais`,
    sublabel: "Cobrado todo mês automaticamente",
    tipo: "mensal",
  });

  // se o plano tiver mais de 1 mês, oferecer pagamento à vista
  if (meses > 1) {
    opcoes.push({
      parcelas: 1,
      label: "À vista",
      sublabel: "Pague tudo de uma vez e economize",
      tipo: "avista",
      economia: true,
    });
  }

  const [selecionado, setSelecionado] = useState(opcoes[0]);
  const valorMensal = plano?.valor ?? 0;
  const totalAvista = valorMensal * meses;

 
  return (
    <div className="mp-overlay" onClick={(e) => e.target === e.currentTarget && onFechar()}>
      <div className="mp-box">
        {/* cabeçalho */}
        <div className="mp-head">
          <span className="mp-title">Forma de Pagamento</span>
          <button className="mp-close" onClick={onFechar}>✕</button>
        </div>

        {/* corpo */}
        <div className="mp-body">
          {/* info do plano */}
          <div className="mp-plano-info">
            <div>
              <div className="mp-plano-nome">{plano?.nome}</div>
              <div style={{ fontSize: ".68rem", color: "var(--muted)", marginTop: 3, letterSpacing: ".06em" }}>
                {meses} {meses === 1 ? "mês" : "meses"} de assessoria completa
              </div>
            </div>
            <div className="mp-plano-val">
              <small>R$</small>
              {Number(valorMensal).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              <div style={{ fontSize: ".6rem", color: "var(--muted)", fontFamily: "var(--sans)", textAlign: "right", marginTop: 2, letterSpacing: ".06em" }}>
                por mês
              </div>
            </div>
          </div>

          <p className="mp-subtitle">Escolha como deseja pagar</p>

          <div className="mp-opts">
            {/* opção: parcelado (mês a mês) */}
            <div
              className={`mp-opt ${selecionado.tipo === "mensal" ? "active" : ""}`}
              onClick={() => setSelecionado(opcoes.find(o => o.tipo === "mensal"))}
            >
              <div className="mp-opt-left">
                <div className="mp-radio"><div className="mp-radio-dot" /></div>
                <div>
                  <div className="mp-opt-label">
                    {meses}x de R$ {Number(valorMensal).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    <span style={{ fontSize: ".6rem", color: "var(--muted)", marginLeft: 8, fontFamily: "var(--sans)", textTransform: "none", letterSpacing: 0 }}>
                      mensais
                    </span>
                  </div>
                  <div className="mp-opt-sub">Cobrado mês a mês — {meses} parcelas geradas</div>
                </div>
              </div>
              <div className="mp-opt-price">
                <div className="mp-opt-price-val">
                  R$ {Number(totalAvista).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </div>
                <div className="mp-opt-price-each">total no período</div>
              </div>
            </div>

            {/* opção: à vista (só aparece se meses > 1) */}
            {meses > 1 && (
              <div
                className={`mp-opt ${selecionado.tipo === "avista" ? "active" : ""}`}
                onClick={() => setSelecionado(opcoes.find(o => o.tipo === "avista"))}
              >
                <div className="mp-opt-left">
                  <div className="mp-radio"><div className="mp-radio-dot" /></div>
                  <div>
                    <div className="mp-opt-label">
                      À vista
                      <span className="mp-economy">economize</span>
                    </div>
                    <div className="mp-opt-sub">Pagamento único — 1 parcela gerada</div>
                  </div>
                </div>
                <div className="mp-opt-price">
                  <div className="mp-opt-price-val">
                    R$ {Number(totalAvista).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </div>
                  <div className="mp-opt-price-each">em 1x</div>
                </div>
              </div>
            )}
          </div>

          {/* resumo */}
          <div style={{
            marginTop: 16, padding: "12px 16px",
            background: "rgba(212,168,67,.04)", border: "1px solid rgba(212,168,67,.1)",
            display: "flex", justifyContent: "space-between", alignItems: "center",
          }}>
            <span style={{ fontSize: ".72rem", color: "var(--muted)", letterSpacing: ".08em", textTransform: "uppercase" }}>
              Parcelas que serão criadas
            </span>
            <span style={{ fontFamily: "var(--cond)", fontSize: "1.3rem", fontWeight: 800, color: "var(--gold)" }}>
              {selecionado.tipo === "avista" ? "1" : meses}x
            </span>
          </div>
        </div>

        {/* rodapé */}
        <div className="mp-footer">
          <button className="mp-btn-cancel" onClick={onFechar}>Cancelar</button>
          <button
            className="mp-btn-confirm"
            onClick={() => onConfirmar(plano.id, selecionado.tipo === "avista" ? 1 : meses)}
          >
            Continuar →
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── COMPONENTE PRINCIPAL ───────────────────────────────────────────────────
export default function Home() {
  const navigate = useNavigate();

  const [planos, setPlanos]           = useState([]);
  const [emailLogado, setEmailLogado] = useState(null);
  const [idLogado, setIdLogado]       = useState(null);
  const [aluno, setAluno]             = useState(null);
  const [erro, setErro]               = useState("");
  const [carregando, setCarregando]   = useState(true);
  const [MensalidadeParcelasDTOS, setMensalidadeParcelasDTOS] = useState({});
  const [modalSisrun, setModalSisrun] = useState(false);
  const [toast, setToast] = useState(null);

  // modal de parcelas
  const [modalPlano, setModalPlano]   = useState(null); // plano selecionado ou null

  /*
  const url =
  window.location.hostname === "localhost" || window.location.hostname === "192.168.15.19"
  ? "http://192.168.15.19:3001/planos"
  : "http://201.95.94.106:3001/planos";
  
  const urlAlunos =
  window.location.hostname === "localhost" || window.location.hostname === "192.168.15.19"
  ? "http://192.168.15.19:3001/alunos"
  : "http://201.95.94.106:3001/alunos";
  
  
  const urlMensalidade =
  window.location.hostname === "localhost" || window.location.hostname === "192.168.15.19"
  ? "http://192.168.15.19:3001/mensalidades"
  : "http://201.95.94.106:3001/mensalidades";
  */
  
// 🔥 DEBUG API URL
const RAW_API = process.env.REACT_APP_API_URL;

console.log("==== DEBUG API CONFIG ====");
console.log("process.env.REACT_APP_API_URL:", RAW_API);
console.log("window.location.hostname:", window.location.hostname);

// fallback seguro (NUNCA gera undefined/...)
//const API = isRailway   ? "https://backend-production-af1ab.up.railway.app"  : (process.env.REACT_APP_API_URL || "http://localhost:3001");
const API = isRailway   ? "http://localhost:3001"  : (process.env.REACT_APP_API_URL || "http://localhost:3001");

console.log("API FINAL USADA:", API);
if (!RAW_API) {
  console.warn("⚠️ ENV NÃO CARREGADA! usando fallback");
}
// monta URLs finais
const url = `${API}/planos`;
const urlAlunos = `${API}/alunos`;
const urlMensalidade = `${API}/mensalidades`;

console.log("URL PLANOS:", url);
console.log("URL ALUNOS:", urlAlunos);
console.log("URL MENSALIDADE:", urlMensalidade);
console.log("==== FIM DEBUG API ====");

const syncLogin = () => {
    setEmailLogado(localStorage.getItem("email"));
    setIdLogado(localStorage.getItem("id"));
  };

  useEffect(() => {
    const email = localStorage.getItem("email");
    const id    = localStorage.getItem("id");
    setEmailLogado(email);
    setIdLogado(id);
    if (id) {
      pegarDadosMensalidadeAlunoPorId(id);
      obterAluno(id);
    } 

    fetch(url)
      .then((r) => {
        console.log("STATUS /planos:", r.status);
        console.log("URL CHAMADA REAL:", r.url);
        return r.json();
      })
      .then((d) => {
        console.log("DADOS RECEBIDOS:", d);
        setPlanos(d);
        setCarregando(false);
      })
      .catch((err) => {
        console.error("ERRO FETCH PLANOS:", err);
        setErro("Erro ao carregar planos.");
        setCarregando(false);
      });
    }, [])

    async function confirmarTrocaStatusSisrun() {
      try {
        const res = await fetch(`${urlAlunos}/atualizar-status-contasisrun-aluno/${idLogado}`, {
          method: "POST",
        });

        if (res.ok) {
          // Atualiza localmente
          setAluno((prev) => ({
            ...prev,
            criouContaSisrun: true, // ou muda o campo correto que você usa
          }));

          mostrarToast("Status atualizado com sucesso!", true);
        } else {
          mostrarToast("Erro ao atualizar status.", false);
        }
      } catch (err) {
        mostrarToast("Erro de conexão.", false);
      } finally {
        setModalSisrun(false);
      }
    }


  function mostrarToast(msg, ok) {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  }

  async function obterAluno(id) {
    try {
      const res = await fetch(`${urlAlunos}/${id}`);
      if (res.ok) setAluno(await res.json());
    } catch { /* silencioso */ }
  }

  async function pegarDadosMensalidadeAlunoPorId(id) {
    try {
      const res = await fetch(`${urlMensalidade}/${id}`);
      if (res.ok) { const d = await res.json(); setMensalidadeParcelasDTOS(d); }
    } catch { /* silencioso */ }
  }

  const deslogar     = (e) => { e.preventDefault(); localStorage.clear(); syncLogin(); };
  const scrollPlanos = () => document.getElementById("planos")?.scrollIntoView({ behavior: "smooth" });
  const destaqueIdx  = Math.floor(planos.length / 2);

  const deveExibirSisrun =
    aluno &&
    MensalidadeParcelasDTOS?.statusLiberacao === "ATIVADO" &&
    aluno.criouContaSisrun === false;

  const ultimaParcela = MensalidadeParcelasDTOS?.parcelas?.find(
    (p) => p.status === "PENDENTE" || p.status === "AGUARDANDO"
  );

  // clique no plano: se já tiver plano, vai direto; senão abre modal
  function clicarPlano(e, plano) {
    e.preventDefault();
    const jaTemPlano = aluno?.planoAtual?.id === plano.id;
    if (jaTemPlano) {
      // já assinou — vai para a tela de pagamento normalmente (renovar/pagar parcela)
      navigate(`/home/telapagamento/${plano.id}`);
      return;
    }
    // abre modal para escolher forma de pagamento
    setModalPlano(plano);
  }

  // confirmação do modal: vai para TelaPagamento com parcelas na URL
  // rota: /home/telapagamento/:idplano?parcelas=N
  function confirmarModal(idPlano, numeroParcelas) {
    setModalPlano(null);
    navigate(`/home/telapagamento/${idPlano}?parcelas=${numeroParcelas}`);
  }

  function WaIcon() {
    return (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
    );
  }
  /* ─── modal tutorial sisrun ───────────────────────────────────────────── */
  function ModalSisrun({ onClose, nomeAluno, confirmarTrocaStatus }) {
    const [passo, setPasso] = useState(0);
    const total = SISRUN_STEPS.length;
    const step = SISRUN_STEPS[passo];
    const isUltimo = passo === total - 1;
    const msgWhats = encodeURIComponent(`Olá Danilo! Sou ${nomeAluno || "aluno da plataforma"} e acabei de criar minha conta no SISRUN. Meu usuário é: `);
  
    return (
      <div style={{ position: "fixed", inset: 0, zIndex: 500, background: "rgba(0,0,0,0.88)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, animation: "fadeIn 0.2s ease" }}>
        <div style={{ background: "#111", border: "1px solid rgba(196,160,100,0.2)", width: "100%", maxWidth: 520, overflow: "hidden", boxShadow: "0 40px 80px rgba(0,0,0,0.7)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 22px", borderBottom: "1px solid rgba(196,160,100,0.1)", background: "rgba(196,160,100,0.03)" }}>
            <div>
              <p style={{ fontSize: "0.55rem", letterSpacing: "0.35em", color: "rgba(196,160,100,0.5)", textTransform: "uppercase", marginBottom: 2 }}>Tutorial SISRUN</p>
              <p style={{ fontSize: "0.88rem", color: "#f0ece4", fontWeight: 600 }}>Como criar sua conta</p>
            </div>
            <button onClick={onClose} style={{ background: "transparent", border: "1px solid rgba(240,236,228,0.12)", color: "rgba(240,236,228,0.35)", cursor: "pointer", fontSize: 14, width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "inherit" }}>✕</button>
          </div>
          <div style={{ position: "relative", background: "#0a0a0a" }}>
            <img src={step.img} alt={`Passo ${passo + 1}`} style={{ width: "100%", height: 200, objectFit: "cover", display: "block", opacity: 0.85 }} />
            <div style={{ position: "absolute", bottom: 10, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 6 }}>
              {SISRUN_STEPS.map((_, i) => (
                <div key={i} onClick={() => setPasso(i)} style={{ width: i === passo ? 22 : 6, height: 6, borderRadius: 3, background: i === passo ? "#c4a064" : "rgba(196,160,100,0.25)", cursor: "pointer", transition: "all 0.3s ease" }} />
              ))}
            </div>
          </div>
          <div style={{ padding: "22px 26px 8px" }}>
            <p style={{ fontSize: "0.58rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(196,160,100,0.45)", marginBottom: 7 }}>Passo {passo + 1} de {total}</p>
            <h3 style={{ fontSize: "1rem", color: "#f0ece4", marginBottom: 9, fontWeight: 600, lineHeight: 1.3 }}>{step.titulo}</h3>
            <p style={{ fontSize: "0.83rem", color: "rgba(240,236,228,0.52)", lineHeight: 1.65 }}>{step.descricao}</p>
          </div>
          <div style={{ display: "flex", gap: 8, padding: "16px 26px 22px", justifyContent: "space-between", flexWrap: "wrap", alignItems: "center" }}>
            {isUltimo ? (
              <a href={`https://wa.me/${DANILO_WHATSAPP}?text=${msgWhats}`} target="_blank" rel="noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "10px 16px", background: "#25d366", color: "#fff", fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 700, fontFamily: "'Barlow', sans-serif", textDecoration: "none" }}>
                <WaIcon /> Avisar Danilo
              </a>
            ) : <div />}
            <div style={{ display: "flex", gap: 8 }}>
              {passo > 0 && <button onClick={() => setPasso((p) => p - 1)} style={{ ...S.btnSecondary, padding: "9px 18px", fontSize: "0.7rem" }}>← Voltar</button>}
              {!isUltimo
                ? <button onClick={() => setPasso((p) => p + 1)} style={{ ...S.btnPrimary, padding: "9px 18px", fontSize: "0.7rem" }}>Próximo →</button>
                : <button onClick={confirmarTrocaStatus} style={{ ...S.btnPrimary, padding: "9px 18px", fontSize: "0.7rem" }}>Concluir ✓</button>
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
  

  function BannerSisrun({ nomeAluno, onAbrirTutorial }) {
    const [visivel, setVisivel] = useState(true);
    const msgWhats = encodeURIComponent(`Olá Danilo! Sou ${nomeAluno || "aluno da plataforma"} e quero informar meu usuário do SISRUN. Meu usuário é: `);
    if (!visivel) return null;
    return (
      <div style={{ position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", zIndex: 400, width: "calc(100% - 40px)", maxWidth: 680, background: "linear-gradient(135deg, #150f00 0%, #0f0f0f 70%)", border: "1px solid #c4a064", borderLeft: "5px solid #c4a064", padding: "16px 20px", boxShadow: "0 8px 48px rgba(196,160,100,0.18), 0 2px 12px rgba(0,0,0,0.6)", animation: "slideUp 0.4s ease", display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
        <div style={{ width: 38, height: 38, borderRadius: "50%", background: "rgba(196,160,100,0.1)", border: "1px solid rgba(196,160,100,0.4)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, animation: "pulse 2s infinite", fontSize: 17 }}>⚡</div>
        <div style={{ flex: 1, minWidth: 180 }}>
          <p style={{ fontSize: "0.72rem", fontWeight: 700, color: "#c4a064", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 2 }}>Você ainda não criou sua conta no SISRUN!</p>
          <p style={{ fontSize: "0.76rem", color: "rgba(240,236,228,0.45)", lineHeight: 1.5 }}>Crie agora e avise o Danilo com seu usuário para ele te encontrar no app.</p>
        </div>
        <div style={{ display: "flex", gap: 8, flexShrink: 0, flexWrap: "wrap", alignItems: "center" }}>
          <button onClick={onAbrirTutorial} style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 700, fontSize: "0.66rem", letterSpacing: "0.12em", textTransform: "uppercase", padding: "8px 15px", background: "#c4a064", color: "#0a0a0a", border: "none", cursor: "pointer" }}>Como criar →</button>
          <a href={`https://wa.me/${DANILO_WHATSAPP}?text=${msgWhats}`} target="_blank" rel="noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontFamily: "'Barlow', sans-serif", fontWeight: 600, fontSize: "0.66rem", letterSpacing: "0.1em", textTransform: "uppercase", padding: "8px 13px", background: "transparent", color: "#25d366", border: "1px solid rgba(37,211,102,0.3)", cursor: "pointer", textDecoration: "none" }}><WaIcon /> Falar com Danilo</a>
          <button onClick={() => setVisivel(false)} style={{ background: "transparent", border: "none", color: "rgba(240,236,228,0.2)", cursor: "pointer", fontSize: 15, padding: "8px 6px", lineHeight: 1 }}>✕</button>
        </div>
      </div>
    );
  }


  return (
    <>
       {/* ── MODAL SISRUN ── */}
      {modalSisrun && <ModalSisrun onClose={() => setModalSisrun(false)} nomeAluno={aluno?.nome} confirmarTrocaStatus={confirmarTrocaStatusSisrun}/>}

      {deveExibirSisrun && (
        <BannerSisrun nomeAluno={aluno?.nome} onAbrirTutorial={() => setModalSisrun(true)} />
      )}

      <style>{CSS}</style>
      <div className="page">

        {/* ── MODAL PARCELAS ── */}
        {modalPlano && (
          <ModalParcelas
            plano={modalPlano}
            onConfirmar={confirmarModal}
            onFechar={() => setModalPlano(null)}
          />
        )}

        {/* NAV */}
        <nav className="nav">
          <div className="nav-logo">Danilo Ortiz</div>
          <div className="nav-links">
            {aluno?.planoAtual && (
              <span style={{
                fontSize: ".7rem", color: "#d4a843",
                border: "1px solid rgba(212,168,67,.4)",
                padding: "6px 14px", marginRight: "12px",
                letterSpacing: ".08em", textTransform: "uppercase",
              }}>
                Plano: {aluno.planoAtual.nome}
              </span>
            )}
            {emailLogado ? (
              <>
                <button className="nbtn nbtn-ghost" onClick={() => navigate(`/home/conta/${idLogado}`)}>
                  {emailLogado}
                </button>
                <button className="nbtn nbtn-ghost" onClick={deslogar}>Sair</button>
              </>
            ) : (
              <button className="nbtn nbtn-gold" onClick={() => navigate("/login")}>Entrar</button>
            )}
          </div>
        </nav>

        {/* HERO */}
        <section className="hero">
          <div className="hero-left">
            <p className="hero-eyebrow">Personal Trainer Certificado</p>
            <h1 className="hero-h1">SEU CORPO<br />MERECE<br /><em>MAIS.</em></h1>
            <p className="hero-p">
              Assessoria online personalizada focada em emagrecimento real e saúde duradoura.
              Planos individuais, acompanhamento direto e resultados que você sente na primeira semana.
            </p>
            <div className="hero-cta-row">
              <button className="btn-primary" onClick={scrollPlanos}>Ver planos →</button>
              <span className="hero-hint">Sem mensalidade de academia</span>
            </div>
          </div>
          <div className="hero-right">
            <img src="/img/daniloFamilia.jpg" alt="Danilo Ortiz personal trainer" className="hero-img" />
            <div className="hero-img-overlay" />
            <div className="hero-badge"><span>8+</span>Anos de experiência</div>
          </div>
          <div className="hero-stats-bar">
            <div className="stat-cell"><div className="stat-n">200<b>+</b></div><div className="stat-l">Alunos ativos</div></div>
            <div className="stat-cell"><div className="stat-n">94<b>%</b></div><div className="stat-l">Taxa de resultado</div></div>
            <div className="stat-cell"><div className="stat-n">100<b>%</b></div><div className="stat-l">Online</div></div>
          </div>
        </section>

        {/* SOBRE */}
        <section className="sobre">
          <div className="sobre-img-wrap">
            <img src={IMG_TRAINER2} alt="Danilo Ortiz treinando" className="sobre-img" />
            <div className="sobre-stripe" />
          </div>
          <div className="sobre-content">
            <p className="sobre-tag">Quem é o Danilo</p>
            <h2 className="sobre-h2">TREINAMENTO<br /><em>SEM ENROLAÇÃO.</em></h2>
            <p className="sobre-p">
              Formado em Educação Física com especialização em treinamento funcional e emagrecimento,
              Danilo acredita que o melhor treino é aquele que cabe na sua vida real — sem precisar
              de academia cara ou equipamentos especiais.
            </p>
            <p className="sobre-p">
              Desde caminhadas estruturadas e treinos ao ar livre até protocolos de força e mobilidade,
              cada aluno recebe um plano pensado do zero. Sem receitas prontas, sem planilhas genéricas.
            </p>
            <p className="sobre-p">
              Acompanhamento por WhatsApp, ajustes semanais e suporte constante fazem parte
              de todos os planos — do mais básico ao mais completo.
            </p>
            <div className="sobre-pills">
              {["Caminhada funcional","Treino em casa","Emagrecimento","Mobilidade","Saúde geral","HIIT","Sem academia","Ao ar livre"].map((p) => (
                <span key={p} className="pill">{p}</span>
              ))}
            </div>
          </div>
        </section>

        {/* EXERCÍCIOS */}
        <section className="exercicios">
          <div className="sec-header">
            <div>
              <p className="sec-tag">Metodologia</p>
              <h2 className="sec-h2">O QUE VOCÊ<br />VAI FAZER</h2>
            </div>
            <p className="sec-note">Passe o mouse<br />para ver detalhes</p>
          </div>
          <div className="ex-grid">
            {EXERCICIOS.map((ex) => (
              <div key={ex.nome} className="ex-card">
                <img src={ex.img} alt={ex.nome} loading="lazy" />
                <div className="ex-overlay">
                  <span className="ex-tag-badge">{ex.tag}</span>
                  <p className="ex-nome">{ex.nome}</p>
                  <p className="ex-desc">{ex.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* DEPOIMENTOS */}
        <section className="depoi">
          <div className="sec-header">
            <div>
              <p className="sec-tag">Resultados reais</p>
              <h2 className="sec-h2">QUEM JÁ<br />TRANSFORMOU</h2>
            </div>
            <p className="sec-note">Depoimentos<br />de alunos reais</p>
          </div>
          <div className="depoi-grid">
            {DEPOIMENTOS.map((d) => (
              <div key={d.nome} className="depoi-card">
                <div className="depoi-quote">"</div>
                <p className="depoi-text">{d.texto}</p>
                <div className="depoi-foot">
                  <img src={d.img} alt={d.nome} className="depoi-foto" loading="lazy" />
                  <div>
                    <div className="depoi-nome">{d.nome}</div>
                    <div className="depoi-cidade">{d.cidade}</div>
                  </div>
                  <div className="depoi-result">{d.resultado}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* PLANOS */}
        <section className="planos-sec" id="planos">
          <div className="sec-header">
            <div>
              <p className="sec-tag">Assessoria Online</p>
              <h2 className="sec-h2">ESCOLHA<br />SEU PLANO</h2>
            </div>
            <p className="sec-note">Pagamento via Pix.<br />Acesso em até 24h.</p>
          </div>

          {erro && <p className="state-box">{erro}</p>}

          {carregando ? (
            <div className="state-box"><div className="dots"><span /><span /><span /></div></div>
          ) : (
            <>
              <div className="planos-list">
                {planos.map((plano, i) => {
                  const ehPlanoDoAluno = aluno?.planoAtual?.id === plano.id;
                  return (
                    <button
                      key={plano.id}
                      className="plano-row"
                      onClick={(e) => clicarPlano(e, plano)}
                      style={{
                        border: ehPlanoDoAluno ? "2px solid #d4a843" : undefined,
                        background: ehPlanoDoAluno ? "rgba(212,168,67,.08)" : undefined,
                      }}
                    >
                      <span className="plano-num">{String(i + 1).padStart(2, "0")}</span>
                      <div>
                        <div className="plano-nome-txt">
                          {plano.nome}
                          {ehPlanoDoAluno && (
                            <span style={{
                              marginLeft: 10, fontSize: ".6rem", background: "#d4a843",
                              color: "#0c0c0c", padding: "4px 8px", letterSpacing: ".1em",
                              textTransform: "uppercase", fontWeight: "bold",
                            }}>
                              Seu plano
                            </span>
                          )}
                          {i === destaqueIdx && !ehPlanoDoAluno && (
                            <span className="popular-tag">Mais popular</span>
                          )}
                        </div>
                        <div className="plano-dur">
                          {plano.duracaomeses} {plano.duracaomeses === 1 ? "mês" : "meses"} de assessoria completa
                        </div>
                      </div>
                      <div className="plano-price">
                        <div className="plano-price-label">por mês</div>
                        <div className="plano-price-val">
                          <span className="cur">R$</span>
                          {Number(plano.valor).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </div>
                      </div>
                      <div className="plano-btn">
                        {ehPlanoDoAluno ? "Seu plano atual" : "Contratar"}
                        <div className="arrow-circle">→</div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="planos-note">
                <span className="note-icon">⚡</span>
                <p>
                  <strong>Como funciona:</strong> após o pagamento via Pix, você cria sua conta no SisRun
                  com o mesmo e-mail e entra em contato com o Danilo. O acesso ao grupo é liberado em
                  até <strong>24 horas</strong>. Sem taxa de adesão, sem contrato de fidelidade.
                </p>
              </div>
            </>
          )}
        </section>

          {toast && (
            <div style={S.toast(toast.ok)}>
              {toast.ok ? "✓ " : "✕ "} {toast.msg}
            </div>
          )}
        {/* FOOTER */}
        <footer className="footer">
          <span className="footer-brand">Danilo Ortiz</span>
          <span className="footer-txt">Assessoria esportiva online · Emagrecimento & Saúde</span>
          <span className="footer-txt">© {new Date().getFullYear()}</span>
        </footer>

      </div>
    </>
  );
}
