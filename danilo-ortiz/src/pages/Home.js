import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

// ─── IMAGENS via Unsplash ───────────────────────────────────────────────────
const IMG_TRAINER2 = "https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=700&q=80&fit=crop";
const isRailway = window.location.hostname.includes("railway.app");
const DANILO_WHATSAPP = "5516996339294";
const EXERCICIOS = [
  {
    img: "https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=600&q=80&fit=crop",
    nome: "Grupo de Corrida",
    desc: "Treinos presenciais em grupo com programação periodizada para todos os níveis, do iniciante ao avançado.",
    tag: "Corrida",
  },
  {
    img: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&q=80&fit=crop",
    nome: "Hipertrofia",
    desc: "Protocolos de musculação personalizados para ganho de massa muscular com acompanhamento profissional.",
    tag: "Força",
  },
  {
    img: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80&fit=crop",
    nome: "Emagrecimento",
    desc: "Planejamento completo combinando treino e orientação para queima de gordura de forma saudável e duradoura.",
    tag: "Emagrecimento",
  },
  {
    img: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&q=80&fit=crop",
    nome: "Condicionamento Físico",
    desc: "Melhore sua capacidade cardiorrespiratória e resistência com treinos progressivos e eficientes.",
    tag: "Condicionamento",
  },
  {
  img: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600&q=80&fit=crop",
  nome: "Caminhada Funcional",
  desc: "Protocolo de 45 min com variações de ritmo e inclinação para queima máxima de gordura.",
  tag: "Cardio",
},
  {
  img: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&q=80&fit=crop",
  nome: "Treino de Força",
  desc: "Movimentos compostos adaptados ao seu nível para construir músculo e acelerar o metabolismo.",
  tag: "Força",
},

  {
    img:  "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=600&q=80&fit=crop",
    nome: "HIIT ao Ar Livre",
    desc: "Intervalos de alta intensidade combinados com corrida leve para resultados expressivos em menos tempo.",
    tag:  "Queima",
  }
];


const DEPOIMENTOS = [
  {
    nome: "jonatan dutra",
    cidade: "São Paulo — SP",
    resultado: "-20 kg",
    tipo: "foto",
    img: "/img/jonatan2.jpeg",
  },
  {
    nome: "jonatan dutra",
    cidade: "São Paulo — SP",
    resultado: "Media de velocidade 14 kmh",
    tipo: "stats",
    img: "/img/jonatan1.jpeg",
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
  /*
  --gold:#d4a843;
  --gold2:#f0c96a;
  --gold-dim:rgba(212,168,67,.12);
  */
 --gold:#a9ec31;      /* verde 2D */
  --gold2:#c4ff4d;     /* versão mais clara no hover */
  --gold-dim:rgba(169,236,49,.12);
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
.hero {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr auto;  /* conteúdo + stats-bar */
  min-height: 100vh;
  align-items: stretch;
}
.hero-right{position:relative;height:560px;overflow:hidden;width:100%}
.hero-left{position:relative;z-index:2;padding:180px 48px 60px;text-align:center;display:flex;flex-direction:column;align-items:center}
.hero-eyebrow{display:inline-flex;align-items:center;gap:10px;font-size:.68rem;letter-spacing:.28em;text-transform:uppercase;color:var(--gold);margin-bottom:24px}
.hero-eyebrow::before{content:'';width:28px;height:1px;background:var(--gold)}
.hero-h1{font-family:var(--cond);font-weight:800;font-style:italic;font-size:clamp(4.5rem,9vw,8.5rem);line-height:.92;text-transform:uppercase;letter-spacing:-.01em}
.hero-h1 em{color:var(--gold)}
.hero-p{margin-top:28px;max-width:560px;font-size:.95rem;font-weight:300;line-height:1.8;color:#aaa;text-align:center}
.hero-cta-row{display:flex;align-items:center;gap:20px;margin-top:44px;flex-wrap:wrap}
.btn-primary{background:var(--gold);color:var(--ink);border:none;cursor:pointer;font-family:var(--sans);font-size:.8rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;padding:16px 36px;border-radius:2px;transition:all .25s}
.btn-primary:hover{background:var(--gold2);transform:translateY(-2px)}
.hero-hint{font-size:.72rem;color:var(--muted);letter-spacing:.06em;display:flex;align-items:center;gap:8px}
.hero-hint::before{content:'✓';color:var(--gold)}
.hero-right{position:relative;height:100vh;overflow:hidden}
.hero-img{width:100%;height:100%;object-fit:cover;object-position:center 20%}
.hero-img-overlay{position:absolute;inset:0;background:linear-gradient(to bottom,var(--ink) 0%,transparent 25%),linear-gradient(to top,var(--ink) 0%,transparent 25%)}
.hero-badge{position:absolute;bottom:80px;left:-28px;background:var(--gold);color:var(--ink);padding:18px 26px;border-radius:3px;font-family:var(--cond);font-weight:800;font-size:.9rem;letter-spacing:.08em;text-transform:uppercase;box-shadow:0 20px 60px rgba(0,0,0,.6);z-index:3}
.hero-badge span{display:block;font-size:2.2rem;line-height:1}
.hero-stats-bar{position:absolute;bottom:0;left:0;right:0;z-index:3;display:grid;grid-template-columns:repeat(3,1fr);border-top:1px solid var(--border);background:rgba(12,12,12,.88);backdrop-filter:blur(10px)}
.stat-cell{padding:24px 32px;text-align:center;border-right:1px solid var(--border)}
.stat-cell:last-child{border-right:none}
.stat-n{font-family:var(--cond);font-size:2.4rem;font-weight:800;color:var(--snow);line-height:1}
.stat-n b{color:var(--gold)}
.stat-l{font-size:.65rem;color:var(--muted);letter-spacing:.12em;text-transform:uppercase;margin-top:4px}

/* substitua ou adicione */
.depoi-grid-real {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 3px;
}

.depoi-grid-real > div {
  min-height: 600px;
}



/* ── PROFESSORES ── */
.professores-sec{
  padding:100px 48px;
  background:var(--ink);
}

.prof-header{
  margin-bottom:48px;
}

.prof-tag{
  font-size:.68rem;
  letter-spacing:.25em;
  text-transform:uppercase;
  color:var(--gold);
  margin-bottom:14px;
}

.prof-header h2{
  font-family:var(--cond);
  font-size:clamp(2.8rem,5vw,5rem);
  font-weight:800;
  font-style:italic;
  line-height:.92;
  text-transform:uppercase;
}

.prof-header h2 em{
  color:var(--gold);
}

.prof-grid{
  display:grid;
  grid-template-columns:1fr 1fr;
  gap:28px;
}

.prof-card {
  border: none; /* tira a borda */
  overflow: hidden;
  transition: transform .3s ease;
}

.prof-card:hover{
  transform:translateY(-6px);
  border-color:rgba(169,236,49,.35);
}

.prof-img-wrap {
  height: 720px;
  background: transparent; /* sem fundo */
  overflow: hidden;
}

.prof-img-wrap img {
  width: 100%;
  height: 100%;
  object-fit: cover;    /* cover em vez de contain — preenche sem sobra */
  display: block;
  background: transparent;
}

.prof-card:hover img{
  transform:scale(1.03);
  filter:brightness(.62);
}

.prof-info{
  padding:26px 24px 30px;
  border-top:1px solid var(--border);
}

.prof-info h3{
  font-family:var(--cond);
  font-size:2rem;
  font-weight:800;
  text-transform:uppercase;
  letter-spacing:.05em;
  margin-bottom:6px;
}

.prof-info p{
  font-size:.78rem;
  color:var(--muted);
  letter-spacing:.08em;
  text-transform:uppercase;
}

/* RESPONSIVO */
@media(max-width:900px){

  .professores-sec{
    padding:64px 24px;
  }

  .prof-grid{
    grid-template-columns:1fr;
  }

  .prof-img-wrap{
    height:520px;
  }
}

@media(max-width: 700px) {
  .depoi + div,
  .depoi > div:last-child {
    grid-template-columns: 1fr !important;
  }
}

/* ── BANNERS TREINO ── */
.dupla-sec{
  padding:90px 48px;
  background:var(--ink2);
  display:flex;
  flex-direction:column;
  gap:28px;
}

.grupo-card{
  position:relative;
  height:420px;
  overflow:hidden;
  border:1px solid var(--border);
}

.grupo-card img{
  width:100%;
  height:100%;
  object-fit:cover;
  display:block;
  filter:brightness(.5);
  transition:transform .6s ease, filter .4s ease;
}

.grupo-card:hover img{
  transform:scale(1.04);
  filter:brightness(.38);
}

.grupo-overlay{
  position:absolute;
  inset:0;
  display:flex;
  flex-direction:column;
  justify-content:center;
  padding:60px;
  max-width:650px;
  background:linear-gradient(
    90deg,
    rgba(0,0,0,.82) 0%,
    rgba(0,0,0,.45) 45%,
    transparent 100%
  );
}

.grupo-card.invertido .grupo-overlay{
  margin-left:auto;
  text-align:right;
  align-items:flex-end;

  background:linear-gradient(
    -90deg,
    rgba(0,0,0,.82) 0%,
    rgba(0,0,0,.45) 45%,
    transparent 100%
  );
}

.grupo-tag{
  font-size:.68rem;
  letter-spacing:.25em;
  text-transform:uppercase;
  color:var(--gold);
  margin-bottom:18px;
}

.grupo-overlay h3{
  font-family:var(--cond);
  font-size:clamp(3rem,6vw,5.5rem);
  font-style:italic;
  font-weight:800;
  line-height:.9;
  text-transform:uppercase;
  margin-bottom:22px;
}

.grupo-overlay h3 em{
  color:var(--gold);
}

.grupo-overlay p{
  font-size:.95rem;
  line-height:1.9;
  color:#d0d0d0;
  max-width:520px;
}

/* RESPONSIVO */
@media(max-width:900px){
  .depoi-grid-real > div {
    min-height: 420px;
  }
  .dupla-sec{
    padding:64px 24px;
  }

  .grupo-card{
    height:340px;
  }

  .grupo-overlay{
    padding:32px 24px;
    max-width:100%;
  }

  .grupo-overlay h3{
    font-size:clamp(2.5rem,10vw,4rem);
  }

  .grupo-overlay p{
    font-size:.85rem;
    line-height:1.7;
  }
}

/* RESPONSIVO */
@media(max-width:900px){

  .dupla-sec{
    padding:64px 24px;
  }

  .dupla-card,
  .dupla-card.direita{
    grid-template-columns:1fr;
    gap:28px;
  }

  .dupla-img-wrap{
    min-height:340px;
  }

  .dupla-card.direita .dupla-img-wrap{
    order:-1;
  }
}

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

/* ── CARROSSEL DE PLANOS ── */
.planos-carousel-wrap{position:relative;overflow:hidden;margin-bottom:48px}
.planos-carousel{display:flex;gap:16px;overflow-x:auto;scroll-snap-type:x mandatory;scrollbar-width:none;padding:8px 4px 16px;cursor:grab}
.planos-carousel::-webkit-scrollbar{display:none}
.planos-carousel.grabbing{cursor:grabbing}
.plan-card{
  flex:0 0 280px;scroll-snap-align:start;
  background:var(--ink2);border:1px solid var(--border);
  position:relative;overflow:hidden;transition:border-color .25s,transform .25s;
}
.plan-card:hover{border-color:rgba(212,168,67,.4);transform:translateY(-4px)}
.plan-card.active-plan{border-color:var(--gold);background:rgba(212,168,67,.06)}
.plan-card-img{width:100%;height:180px;object-fit:cover;filter:grayscale(20%) brightness(.75);display:block;transition:filter .4s}
.plan-card:hover .plan-card-img{filter:grayscale(0%) brightness(.65)}
.plan-card-img-overlay{position:absolute;top:0;left:0;right:0;height:180px;background:linear-gradient(to bottom,transparent 40%,rgba(0,0,0,.85) 100%)}
.plan-card-tag{position:absolute;top:12px;left:12px;background:var(--gold);color:var(--ink);font-size:.58rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;padding:4px 10px}
.plan-card-body{padding:24px 22px 22px}
.plan-card-num{font-family:var(--cond);font-size:3rem;font-weight:800;color:rgba(212,168,67,.15);line-height:1;position:absolute;top:148px;right:16px}
.plan-card-nome{font-family:var(--cond);font-size:1.4rem;font-weight:800;text-transform:uppercase;letter-spacing:.05em;line-height:1.1;margin-bottom:6px}
.plan-card-dur{font-size:.68rem;color:var(--muted);letter-spacing:.1em;text-transform:uppercase;margin-bottom:18px}
.plan-card-price{display:flex;align-items:baseline;gap:4px;margin-bottom:20px}
.plan-card-cur{font-size:.85rem;color:var(--gold);font-family:var(--cond);font-weight:700}
.plan-card-val{font-family:var(--cond);font-size:2.6rem;font-weight:800;line-height:1}
.plan-card-per{font-size:.65rem;color:var(--muted);letter-spacing:.08em;align-self:flex-end;padding-bottom:4px}
.plan-card-btn{
  width:100%;padding:12px;background:var(--gold);color:var(--ink);
  border:none;cursor:pointer;font-family:var(--sans);font-size:.72rem;
  font-weight:700;letter-spacing:.12em;text-transform:uppercase;transition:background .2s;
}
.plan-card-btn:hover{background:var(--gold2)}
.plan-card-btn.btn-ghost-gold{background:transparent;border:1px solid var(--gold);color:var(--gold)}
.plan-card-btn.btn-ghost-gold:hover{background:rgba(212,168,67,.1)}
.carousel-dots{display:flex;justify-content:center;gap:6px;margin-top:4px}
.carousel-dot{width:6px;height:6px;border-radius:50%;background:var(--border);border:none;cursor:pointer;transition:all .2s;padding:0}
.carousel-dot.active{background:var(--gold);width:22px;border-radius:3px}

/* ── TABELA DE PLANOS ── */
.planos-table{width:100%;border-collapse:collapse;margin-bottom:32px}
.planos-table thead tr{border-bottom:2px solid var(--gold)}
.planos-table th{padding:14px 20px;font-size:.62rem;letter-spacing:.2em;text-transform:uppercase;color:var(--muted);text-align:left;font-weight:700}
.planos-table th:last-child{text-align:center}
.planos-table tbody tr{border-bottom:1px solid var(--border);transition:background .2s;cursor:pointer}
.planos-table tbody tr:hover{background:rgba(212,168,67,.04)}
.planos-table tbody tr.tr-active{background:rgba(212,168,67,.07)}
.planos-table td{padding:16px 20px;font-size:.85rem;vertical-align:middle}
.td-num{font-family:var(--cond);font-size:1.4rem;font-weight:800;color:rgba(212,168,67,.25);width:48px}
.td-nome{font-family:var(--cond);font-size:1.1rem;font-weight:700;text-transform:uppercase;letter-spacing:.05em}
.td-dur{font-size:.7rem;color:var(--muted);letter-spacing:.08em;margin-top:3px}
.td-price{font-family:var(--cond);font-size:1.5rem;font-weight:800;white-space:nowrap}
.td-price small{font-size:.75rem;color:var(--gold);margin-right:3px;font-family:var(--sans)}
.td-action{text-align:center;width:160px}
.td-btn{
  padding:9px 20px;background:var(--gold);color:var(--ink);
  border:none;cursor:pointer;font-family:var(--sans);font-size:.65rem;
  font-weight:700;letter-spacing:.1em;text-transform:uppercase;
  transition:all .2s;white-space:nowrap;
}
.td-btn:hover{background:var(--gold2)}
.td-btn.ghost{background:transparent;border:1px solid rgba(212,168,67,.4);color:var(--gold)}
.td-btn.ghost:hover{background:rgba(212,168,67,.1)}
.td-tag-seu{display:inline-block;background:var(--gold);color:var(--ink);font-size:.55rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;padding:3px 8px;margin-left:8px;vertical-align:middle}
.td-tag-popular{display:inline-block;background:transparent;border:1px solid rgba(212,168,67,.4);color:var(--gold);font-size:.55rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;padding:3px 8px;margin-left:8px;vertical-align:middle}



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
  .hero{grid-template-columns:1fr; min-height:auto}
  .hero-right{
    display:block;          /* reativa */
    height:340px;           /* altura controlada */
    order:-1;               /* foto ACIMA do texto */
  }
  .hero-img{object-position:center 15%}  /* enquadra rosto */
  .hero-img-overlay{
    background:linear-gradient(to top,var(--ink) 0%,transparent 40%),
               linear-gradient(to bottom,var(--ink) 0%,transparent 20%);
  }
  .hero-left{padding:40px 24px 80px} 
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


/* RESPONSIVE */
@media(max-width:1400px){
  /* hero continua em 2 colunas, mas proporções ajustadas */
  .hero{grid-template-columns:1fr 1fr; min-height:100vh; align-items:stretch}
  .hero-right{
    display:block;
    height:100%;
    min-height:100vh;
    order:0; /* mantém à direita */
  }
  .hero-img{object-position:center top}
  .hero-img-overlay{
    background:linear-gradient(90deg,var(--ink) 0%,transparent 40%),
               linear-gradient(0deg,var(--ink) 0%,transparent 30%);
  }
  .hero-left{padding:140px 32px 100px}
  /* resto igual */
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

/* só em telas realmente pequenas (celular) aí empilha */
@media(max-width:700px){
  .hero{grid-template-columns:1fr; min-height:auto}
  .hero-right{height:300px; order:-1}
  .hero-img{object-position:center 20%}
  .hero-img-overlay{
    background:linear-gradient(to top,var(--ink) 0%,transparent 45%),
               linear-gradient(to bottom,var(--ink) 0%,transparent 20%);
  }
  .hero-left{padding:32px 24px 80px}
}
A lógica é:

1200px–700px: mantém lado a lado com 1fr 1fr — texto à esquerda, foto à direita alinhada
abaixo de 700px: aí sim empilha, foto em cima com altura fixa de 300px



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
  const token = localStorage.getItem("token");

  
  const navigate = useNavigate();

  const [planos, setPlanos]           = useState([]);
  const [emailLogado, setEmailLogado] = useState(null);
  const [idLogado, setIdLogado]       = useState(null);
  const [aluno, setAluno]             = useState(null);
  const [erro, setErro]               = useState("");
  const [carregando, setCarregando]   = useState(true);
  const [MensalidadeParcelasDTOS, setMensalidadeParcelasDTOS] = useState({});
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

// fallback seguro (NUNCA gera undefined/...)
//const API = isRailway   ? "https://backend-production-af1ab.up.railway.app"  : (process.env.REACT_APP_API_URL || "http://localhost:3001");
const API = process.env.REACT_APP_API_URL || "http://localhost:3001";

// monta URLs finais
const url = `${API}/planos`;
const urlAlunos = `${API}/alunos`;
const urlMensalidade = `${API}/mensalidades`;


const syncLogin = () => {
    setEmailLogado(localStorage.getItem("email"));
    setIdLogado(localStorage.getItem("id"));
  };

  useEffect(() => {

      if (!token) {
        setCarregando(false);
        return;
      }

      fetch(`${API}/alunos/me`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(res => {
          if (!res.ok) throw new Error("Não autenticado");
          return res.json();
        })
        .then(data => {
          setEmailLogado(data.email);
          setIdLogado(data.id);

          // já aproveita:
          pegarDadosMensalidadeAlunoPorId(data.id);
          obterAluno(data.id);
        })
        .catch(() => {
          localStorage.removeItem("token"); // token inválido
        })
        .finally(() => setCarregando(false));
    }, []);



    useEffect(() => {

      fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(res => res.json())
        .then(data => setPlanos(data))
        .catch(() => setErro("Erro ao carregar planos"));
    }, []);



    

  function mostrarToast(msg, ok) {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  }

  async function obterAluno(id) {
    try {
      const res = await fetch(`${urlAlunos}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }

      );
      if (res.ok) setAluno(await res.json());
    } catch { /* silencioso */ }
  }

  async function confirmarTrocaStatusSisrun() {
      const token = localStorage.getItem("token");


      try {
        const res = await fetch(`${urlAlunos}/atualizar-status-contasisrun-aluno/${idLogado}`, {
          method: "POST",
          headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`  // <-- adicionar
        },
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
      } 
    }


  
  async function pegarDadosMensalidadeAlunoPorId(id) {
    try {
      const res = await fetch(`${urlMensalidade}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
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
  
/* ─── banner fixo sisrun ──────────────────────────────────────────────── */
function BannerSisrun({ nomeAluno, onConfirmarCriou  }) {
  const [visivel, setVisivel] = useState(true);

  const msgWhats = encodeURIComponent(
    `Olá Danilo! Sou ${
      nomeAluno || "aluno da plataforma"
    } e acabei de criar minha conta no SISRUN. Meu usuário é: `
  );

  if (!visivel) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 24,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 400,
        width: "calc(100% - 40px)",
        maxWidth: 680,
        background: "linear-gradient(135deg, #150f00 0%, #0f0f0f 70%)",
        border: "1px solid #c4a064",
        borderLeft: "5px solid #c4a064",
        padding: "16px 20px",
        boxShadow:
          "0 8px 48px rgba(196,160,100,0.18), 0 2px 12px rgba(0,0,0,0.6)",
        display: "flex",
        alignItems: "center",
        gap: 14,
        flexWrap: "wrap",
      }}
    >
      <div
        style={{
          width: 38,
          height: 38,
          borderRadius: "50%",
          background: "rgba(196,160,100,0.1)",
          border: "1px solid rgba(196,160,100,0.4)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          fontSize: 17,
        }}
      >
        ⚡
      </div>

      <div style={{ flex: 1, minWidth: 180 }}>
        <p
          style={{
            fontSize: "0.72rem",
            fontWeight: 700,
            color: "#c4a064",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            marginBottom: 2,
          }}
        >
          Você ainda não criou sua conta no SISRUN!
        </p>

        <p
          style={{
            fontSize: "0.76rem",
            color: "rgba(240,236,228,0.45)",
            lineHeight: 1.5,
          }}
        >
          Crie agora e avise o Danilo com seu usuário para ter acesso
          completo ao app.
        </p>
      </div>

      <div
        style={{
          display: "flex",
          gap: 8,
          flexShrink: 0,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <button
          onClick={() =>
            window.open(
              "https://appsisrun.com.br/sisrun/forms/cadastro.xhtml?assessoria=2dassessoriaesportiva",
              "_blank"
            )
          }
          style={{
            fontFamily: "'Barlow', sans-serif",
            fontWeight: 700,
            fontSize: "0.66rem",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            padding: "8px 15px",
            background: "#c4a064",
            color: "#0a0a0a",
            border: "none",
            cursor: "pointer",
          }}
        >
          Criar conta →
        </button>

        <a
          href={`https://wa.me/${DANILO_WHATSAPP}?text=${msgWhats}`}
          target="_blank"
          rel="noreferrer"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            fontFamily: "'Barlow', sans-serif",
            fontWeight: 600,
            fontSize: "0.66rem",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            padding: "8px 13px",
            background: "transparent",
            color: "#25d366",
            border: "1px solid rgba(37,211,102,0.3)",
            textDecoration: "none",
          }}
        >
          <WaIcon /> Falar com Danilo
        </a>

        {/* 3. ← NOVO: confirma que já criou */}
        <button
          onClick={onConfirmarCriou}
          style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 600, fontSize: "0.66rem", letterSpacing: "0.1em", textTransform: "uppercase", padding: "8px 13px", background: "transparent", color: "rgba(240,236,228,0.5)", border: "1px solid rgba(240,236,228,0.15)", cursor: "pointer" }}
        >
          ✓ Já criei minha conta
        </button>

        <button
          onClick={() => setVisivel(false)}
          style={{
            background: "transparent",
            border: "none",
            color: "rgba(240,236,228,0.2)",
            cursor: "pointer",
            fontSize: 15,
            padding: "8px 6px",
          }}
        >
          ✕
        </button>
      </div>
    </div>
  );
}


  return (
    <>
      {deveExibirSisrun && (
<BannerSisrun nomeAluno={aluno?.nome} onConfirmarCriou={confirmarTrocaStatusSisrun} />
      )}

      <style>{CSS}</style>
      <div className="page">
        {/* ── BOTÃO FLUTUANTE PLANOS ── */}
<button
  onClick={scrollPlanos}
  style={{
    position: "fixed",
    right: 20,
    bottom: "1%",
    transform: "translateY(-50%)",
    zIndex: 300,
    background: "#d4a843",
    color: "#0a0a0a",
    border: "none",
    cursor: "pointer",
    textOrientation: "mixed",
    fontFamily: "'Barlow Condensed', sans-serif",
    fontWeight: 800,
    fontSize: ".75rem",
    letterSpacing: ".2em",
    textTransform: "uppercase",
    padding: "18px 10px",
    borderRadius: "2px",
    boxShadow: "0 8px 32px rgba(212,168,67,.35)",
    transition: "all .25s",
  }}
  onMouseEnter={e => e.currentTarget.style.background = "#f0c96a"}
  onMouseLeave={e => e.currentTarget.style.background = "#d4a843"}
>
  Ver Planos →
</button>


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
          <div className="nav-logo">2D Assessoria</div>
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
            {/* ── ADMIN ── */}
            {aluno?.tipoUsuario === "ADMIN" && (
              <button className="nbtn nbtn-ghost" onClick={() => navigate("/home/administrativo")} >
                Administrativo
              </button>
            )}
            {emailLogado ? (
              <>
                <button className="nbtn nbtn-ghost" onClick={() => navigate("/home/conta")}>
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
        
      {/* COLUNA ESQUERDA — texto */}
      <div className="hero-left">
        <p className="hero-eyebrow">Assessoria Esportiva & Personal Trainer</p>
        <h1 className="hero-h1">2D<br />ASSESSORIA<br /><em>ESPORTIVA.</em></h1>
        <p className="hero-p">
          A 2D Assessoria é uma plataforma completa de saúde e exercício físico.
          Combinamos grupos de corrida presenciais com planilhas de treinamento online,
          100% personalizadas para o seu objetivo.
        </p>
        <div className="hero-cta-row">
          <button className="btn-primary" onClick={scrollPlanos}>Ver planos →</button>
          <span className="hero-hint">Sem mensalidade de academia</span>
        </div>
      </div>

      {/* COLUNA DIREITA — foto ← estava DENTRO do hero-left, esse é o bug */}
      <div className="hero-right">
        <img src="/img/img2danilos2.jpeg" alt="Corredores 2D Assessoria" className="hero-img" />
        <div className="hero-img-overlay" />
       
      </div>

      {/* barra de stats fica por último, ocupa as 2 colunas */}
      <div className="hero-stats-bar">
        <div className="stat-cell"><div className="stat-n">200<b>+</b></div><div className="stat-l">Alunos ativos</div></div>
        <div className="stat-cell"><div className="stat-n">94<b>%</b></div><div className="stat-l">Taxa de resultado</div></div>
        <div className="stat-cell"><div className="stat-n">100<b>%</b></div><div className="stat-l">Online</div></div>
      </div>

      </section>
            {/* PROFESSORES */}
<section className="professores-sec">

  <div className="prof-header">
    <p className="prof-tag">Equipe 2D Assessoria</p>

    <h2>
      OS 
      <em> PROFESSORES</em>
    </h2>
  </div>

  <div className="prof-grid">

    <div className="prof-card">
      <div className="prof-img-wrap">
        <img src="/img/imgDanilo4.png" alt="Professor 1" />
      </div>

      <div className="prof-info">
        <h3>Danilo Ortiz</h3>
      </div>
    </div>

    <div className="prof-card">
      <div className="prof-img-wrap">
        <img src="/img/imgOutroDanilo2.jpeg" alt="Professor 2" />
      </div>

      <div className="prof-info">
        <h3>Danilo Alves</h3>
      </div>
    </div>

  </div>
</section>



      {/* TREINOS EM GRUPO */}
      <section className="dupla-sec">

        <div className="grupo-card">
          <img src="/img/corrida3.jpg" alt="Treino em grupo" />

          <div className="grupo-overlay">
            <p className="grupo-tag">Corrida & Performance</p>

            <h3>
              TREINOS EM<br />
              <em>GRUPO.</em>
            </h3>

            <p>
              A energia do grupo transforma o treino. 
              Mais motivação, constância e evolução em um ambiente leve e competitivo na medida certa.
            </p>
          </div>
        </div>

        <div className="grupo-card invertido">
          <img src="/img/corrida2.jpg" alt="Assessoria esportiva" />

          <div className="grupo-overlay">
            <p className="grupo-tag">Assessoria 2D</p>

            <h3>
              EVOLUÇÃO<br />
              <em>CONSTANTE.</em>
            </h3>

            <p>
              Cada aluno recebe acompanhamento próximo, ajustes frequentes e suporte contínuo
              para evoluir sem extremos e sem abandonar a rotina.
            </p>
          </div>
        </div>

      </section>
        

        {/* SOBRE */}
        <section className="sobre">
          <div className="sobre-img-wrap">
            <img src={IMG_TRAINER2} alt="Danilo Ortiz treinando" className="sobre-img" />
            <div className="sobre-stripe" />
          </div>
          <div className="sobre-content">
            <p className="sobre-tag">Sobre a 2D Assessoria</p>
            <h2 className="sobre-h2">TREINAMENTO<br /><em>SEM ENROLAÇÃO.</em></h2>
            <p className="sobre-p">
              Formado em Educação Física com especialização em Personal Trainer,
              Danilo acredita que o melhor treino é aquele que cabe na sua vida real.
            </p>
            <p className="sobre-p">
              A 2D Assessoria combina grupos de corrida presenciais com planilhas 
              de treinamento online, tudo 100% personalizado para o seu objetivo 
              e rotina. Sem receitas prontas, sem planilhas genéricas.
            </p>
            <p className="sobre-p">
              Acompanhamento por WhatsApp, ajustes semanais e suporte constante 
              fazem parte de todos os planos — do mais básico ao mais completo.
            </p>
            <div className="sobre-pills">
              {["Grupo de corrida","Hipertrofia","Emagrecimento","Condicionamento","Personal Trainer","Planilha online","Mobilidade","Saúde geral"].map((p) => (
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
    <p className="sec-note">Prints reais<br />de alunos</p>
  </div>

  <div style={{
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: 3,
  }}>
    {DEPOIMENTOS.map((d, i) => (
      <div key={i} style={{
        display: "flex",
        flexDirection: "column",
        border: "1px solid var(--border)",
        background: "var(--ink3)",
        overflow: "hidden",
        margin: "10px"
      }}>

        {/* ── TOPO: nome + resultado ── */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 20px",
          borderBottom: "1px solid var(--border)",
          background: "var(--ink2)",
        }}>
          <div>
            <div style={{
              fontFamily: "var(--cond)",
              fontSize: "1.1rem",
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: ".06em",
              color: "var(--snow)",
            }}>
              {d.nome}
            </div>
            <div style={{
              fontSize: ".65rem",
              color: "var(--muted)",
              letterSpacing: ".1em",
              marginTop: 2,
            }}>
              {d.cidade}
            </div>
          </div>
          <div style={{
            fontFamily: "var(--cond)",
            fontSize: "2rem",
            fontWeight: 800,
            color: "var(--gold)",
            letterSpacing: ".04em",
          }}>
            {d.resultado}
          </div>
        </div>

        {/* ── IMAGEM ── */}
        <div style={{ flex: 1, overflow: "hidden", minHeight: 420 }}>
          <img
            src={d.img}
            alt={d.nome}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "top",
              display: "block",
              filter: "brightness(.92)",
              transition: "transform .5s ease",
            }}
            onMouseEnter={e => e.currentTarget.style.transform = "scale(1.03)"}
            onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
          />
        </div>

        {/* ── BLOCO VERDE EMBAIXO ── */}
        <div style={{
          background: "var(--gold)",
          color: "var(--ink)",
          padding: "14px 20px",
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}>
          <span style={{
            fontFamily: "var(--cond)",
            fontSize: "1.1rem",
            fontWeight: 800,
            textTransform: "uppercase",
            letterSpacing: ".06em",
            lineHeight: 1.2,
          }}>
            {d.enfase}
          </span>
          <span style={{
            marginLeft: "auto",
            fontSize: "1.4rem",
            flexShrink: 0,
          }}>
            🏃
          </span>
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

    <div style={{
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
  gap: 16,
  marginBottom: 48,
}}>
  {planos.map((plano, i) => {
    const ehPlanoDoAluno = aluno?.planoAtual?.id === plano.id;
    return (
      <div
        key={plano.id}
        style={{
          background: ehPlanoDoAluno ? "rgba(212,168,67,.06)" : "var(--ink2)",
          border: `1px solid ${ehPlanoDoAluno ? "var(--gold)" : "var(--border)"}`,
          padding: "32px 28px",
          position: "relative",
          transition: "border-color .25s, transform .25s",
          cursor: "pointer",
        }}
        onMouseEnter={e => e.currentTarget.style.transform = "translateY(-4px)"}
        onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
        onClick={(e) => clicarPlano(e, plano)}
      >
        {/* número decorativo */}
        <div style={{
          position: "absolute", top: 20, right: 20,
          fontFamily: "var(--cond)", fontSize: "3.5rem", fontWeight: 800,
          color: "rgba(212,168,67,.1)", lineHeight: 1, userSelect: "none",
        }}>
          {String(i + 1).padStart(2, "0")}
        </div>

        {/* tags */}
        <div style={{ marginBottom: 20, display: "flex", gap: 8, flexWrap: "wrap" }}>
          {ehPlanoDoAluno && (
            <span style={{ background: "var(--gold)", color: "var(--ink)", fontSize: ".58rem",
              fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase", padding: "4px 10px" }}>
              Seu plano
            </span>
          )}
          {i === destaqueIdx && !ehPlanoDoAluno && (
            <span style={{ background: "transparent", border: "1px solid rgba(212,168,67,.4)",
              color: "var(--gold)", fontSize: ".58rem", fontWeight: 700,
              letterSpacing: ".12em", textTransform: "uppercase", padding: "4px 10px" }}>
              Mais popular
            </span>
          )}
        </div>

        {/* nome */}
        <div style={{ fontFamily: "var(--cond)", fontSize: "1.5rem", fontWeight: 800,
          textTransform: "uppercase", letterSpacing: ".05em", lineHeight: 1.1, marginBottom: 6 }}>
          {plano.nome}
        </div>

        {/* duração */}
        <div style={{ fontSize: ".68rem", color: "var(--muted)", letterSpacing: ".1em",
          textTransform: "uppercase", marginBottom: 24 }}>
          {plano.duracaomeses} {plano.duracaomeses === 1 ? "mês" : "meses"} de assessoria
        </div>

        {/* preço */}
        <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 28 }}>
          <span style={{ fontSize: ".85rem", color: "var(--gold)", fontFamily: "var(--cond)", fontWeight: 700 }}>R$</span>
          <span style={{ fontFamily: "var(--cond)", fontSize: "2.8rem", fontWeight: 800, lineHeight: 1 }}>
            {Number(plano.valor).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </span>
          <span style={{ fontSize: ".65rem", color: "var(--muted)", alignSelf: "flex-end", paddingBottom: 4 }}>/mês</span>
        </div>

        {/* botão */}
        <button
          onClick={(e) => { e.stopPropagation(); clicarPlano(e, plano); }}
          style={{
            width: "100%", padding: "13px",
            background: ehPlanoDoAluno ? "transparent" : "var(--gold)",
            color: ehPlanoDoAluno ? "var(--gold)" : "var(--ink)",
            border: ehPlanoDoAluno ? "1px solid var(--gold)" : "none",
            cursor: "pointer", fontFamily: "var(--sans)",
            fontSize: ".72rem", fontWeight: 700,
            letterSpacing: ".12em", textTransform: "uppercase",
            transition: "background .2s",
          }}
        >
          {ehPlanoDoAluno ? "Plano atual" : "Contratar →"}
        </button>
      </div>
    );
  })}
</div>


    {/* ── TABELA ── */}
    <table className="planos-table">
      <thead>
        <tr>
          <th style={{width:48}}>#</th>
          <th>Plano</th>
          <th>Duração</th>
          <th>Valor / mês</th>
          <th>Ação</th>
        </tr>
      </thead>
      <tbody>
        {planos.map((plano, i) => {
          const ehPlanoDoAluno = aluno?.planoAtual?.id === plano.id;
          return (
            <tr
              key={plano.id}
              className={ehPlanoDoAluno ? "tr-active" : ""}
              onClick={(e) => clicarPlano(e, plano)}
            >
              <td className="td-num">{String(i + 1).padStart(2, "0")}</td>
              <td>
                <div className="td-nome">
                  {plano.nome}
                  {ehPlanoDoAluno && <span className="td-tag-seu">Seu plano</span>}
                  {i === destaqueIdx && !ehPlanoDoAluno && <span className="td-tag-popular">Popular</span>}
                </div>
              </td>
              <td className="td-dur" style={{fontSize:".8rem",color:"var(--muted)"}}>
                {plano.duracaomeses} {plano.duracaomeses === 1 ? "mês" : "meses"}
              </td>
              <td className="td-price">
                <small>R$</small>
                {Number(plano.valor).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </td>
              <td className="td-action">
                <button
                  className={`td-btn ${ehPlanoDoAluno ? "ghost" : ""}`}
                  onClick={(e) => clicarPlano(e, plano)}
                >
                  {ehPlanoDoAluno ? "Plano atual" : "Contratar →"}
                </button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>

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
          <span className="footer-brand">2D Assessoria</span>
          <span className="footer-txt">Assessoria esportiva online · Corrida · Hipertrofia · Emagrecimento</span>
          <span className="footer-txt">© {new Date().getFullYear()}</span>
        </footer>

      </div>
    </>
  );
}
