# Point Dog — Redesign do Site Institucional Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a 5-page static institutional website for Point Dog Pet (pet shop, banho & tosa, clínica veterinária) with a modern/futuristic "Dark Pet-Tech" visual identity, fully faithful to the content captured from the old site's screenshots.

**Architecture:** Static HTML/CSS/JS, no framework, no build step. Five HTML pages (`index.html`, `servicos.html`, `sobre.html`, `avaliacoes.html`, `contato.html`) share one stylesheet (`css/style.css`) and one script (`js/main.js`). Header/footer markup is duplicated per page (plain HTML has no includes) but must stay byte-identical in structure so the design system applies uniformly.

**Tech Stack:** HTML5, CSS3 (custom properties, Grid/Flexbox, `backdrop-filter`), vanilla JS (`IntersectionObserver`), Google Fonts (Playfair Display + Inter) via `<link>`.

**Spec:** `docs/superpowers/specs/2026-08-13-site-institucional-redesign-design.md`

## Global Constraints

- No framework, no build tool, no npm dependency — everything must open directly from the filesystem in a browser.
- Palette (from spec, use these exact hex values): `--bg-dark:#0D1210`, `--bg-dark-2:#141B18`, `--bg-light:#F7F5F0`, `--text-dark:#1C2420`, `--text-light:#F7F5F0`, `--orange:#F2762B`, `--orange-light:#FF8A3D`, `--green:#22C55E`, `--green-glow:#00D98B`, `--gold:#D9A441`.
- Typography: display/serif font `"Playfair Display"` for headings, sans-serif `"Inter"` for body text, loaded via Google Fonts `<link>` tags (same two tags, verbatim, on every page — see Task 1).
- No real photographs of the stores (only low-res screenshots exist) — use SVG/CSS illustration, gradients, and icon glyphs instead of `<img>` photos, except the real logo `assets/img/logo-pointdog.webp` in header/footer.
- WhatsApp/phone/map links must be real and functional, built from this data (verbatim from spec):

| Unidade | Endereço completo | Telefone(s) | wa.me (dígitos) | Horário |
|---|---|---|---|---|
| Horto (matriz) | R. Dona Nancy de Vasc. Gomes, 336 - Horto, Belo Horizonte - MG, 31030-072 | (31) 3468-3299 (Geral) · (31) 3463-1877 (Banho e Tosa) | `553134683299` | Fecha às 18:00 |
| Pitangui (Sagrada Família I) | R. Pitangui, 3003 - Sagrada Família, Belo Horizonte - MG, 31030-210 | (31) 3463-6974 | `553134636974` | Fecha às 19:00 |
| São Roque (Sagrada Família II) | R. São Roque, 1231-A - Sagrada Família, Belo Horizonte - MG, 31035-460 | (31) 2552-0043 | `553125520043` | Fecha às 19:00 |
| Formosa (Santa Tereza) | R. Formosa, 113A - Santa Tereza, Belo Horizonte - MG, 31014-045 | (31) 3965-0182 | `553139650182` | Fecha às 18:00 |

  WhatsApp links use `https://wa.me/<digits>?text=<url-encoded message>`. Phone links use `tel:+<digits>`. Map links use `https://www.google.com/maps/search/?api=1&query=<url-encoded address>`.
- Every page's `<nav>` must contain exactly these 5 links in this order: Home (`index.html`), Serviços (`servicos.html`), Sobre (`sobre.html`), Avaliações (`avaliacoes.html`), Contato (`contato.html`), plus the "Comprar Agora" CTA button linking to the Horto WhatsApp number. The link matching the current page gets class `active`.
- Commit after every task.

---

### Task 1: Design system (CSS + JS) and shared header/footer shell

**Files:**
- Create: `css/style.css`
- Create: `js/main.js`
- Create: `index.html` (header + footer only, empty `<main>` placeholder comment removed — main is empty but valid, filled in Task 2)

**Interfaces:**
- Produces: CSS custom properties listed in Global Constraints; utility classes `.container`, `.section`, `.section-light`, `.section-dark`, `.grid-2`, `.grid-3`, `.grid-4`, `.btn`, `.btn-primary`, `.btn-secondary`, `.card`, `.badge`, `.reveal` (+ `.reveal.is-visible`), `.site-header`, `.nav-open`, `.site-footer`; JS behavior: mobile nav toggle via `.site-header` class `nav-open`, scroll-reveal via `IntersectionObserver` adding `is-visible` to `.reveal` elements, and `#year` textContent set to current year.
- Consumes: `assets/img/logo-pointdog.webp` (already present in the repo).

- [ ] **Step 1: Create `css/style.css` with the full design system**

```css
/* ===== Design tokens ===== */
:root {
  --bg-dark: #0D1210;
  --bg-dark-2: #141B18;
  --bg-light: #F7F5F0;
  --text-dark: #1C2420;
  --text-light: #F7F5F0;
  --text-muted: #9BA79F;
  --orange: #F2762B;
  --orange-light: #FF8A3D;
  --green: #22C55E;
  --green-glow: #00D98B;
  --gold: #D9A441;
  --radius: 20px;
  --radius-sm: 12px;
  --radius-pill: 999px;
  --font-display: "Playfair Display", Georgia, serif;
  --font-body: "Inter", system-ui, -apple-system, sans-serif;
  --shadow-glow-orange: 0 0 40px rgba(242, 118, 43, 0.25);
  --shadow-glow-green: 0 0 40px rgba(34, 197, 94, 0.2);
  --container-w: 1200px;
}

/* ===== Reset ===== */
*, *::before, *::after { box-sizing: border-box; }
html { scroll-behavior: smooth; }
body {
  margin: 0;
  background: var(--bg-light);
  color: var(--text-dark);
  font-family: var(--font-body);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}
img { max-width: 100%; display: block; }
a { color: inherit; text-decoration: none; }
ul { list-style: none; margin: 0; padding: 0; }
h1, h2, h3, h4 {
  font-family: var(--font-display);
  font-weight: 700;
  line-height: 1.15;
  margin: 0 0 0.5em;
}
p { margin: 0 0 1em; }
button { font-family: inherit; cursor: pointer; }

/* ===== Layout utilities ===== */
.container { max-width: var(--container-w); margin: 0 auto; padding: 0 24px; }
.section { padding: 96px 0; }
.section-light { background: var(--bg-light); color: var(--text-dark); }
.section-dark {
  background: linear-gradient(160deg, var(--bg-dark) 0%, var(--bg-dark-2) 100%);
  color: var(--text-light);
}
.section-header { max-width: 640px; margin: 0 auto 56px; text-align: center; }
.section-header p { color: var(--text-muted); font-size: 1.1rem; }
.grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 32px; }
.grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 32px; }
.grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }
@media (max-width: 900px) {
  .grid-3, .grid-4 { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 640px) {
  .grid-2, .grid-3, .grid-4 { grid-template-columns: 1fr; }
  .section { padding: 64px 0; }
}

/* ===== Buttons ===== */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 14px 28px;
  border-radius: var(--radius-pill);
  font-weight: 600;
  font-size: 0.95rem;
  border: 1px solid transparent;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.btn:hover { transform: translateY(-2px); }
.btn-primary {
  background: linear-gradient(135deg, var(--orange-light), var(--orange));
  color: #fff;
  box-shadow: var(--shadow-glow-orange);
}
.btn-primary:hover { box-shadow: 0 0 56px rgba(242, 118, 43, 0.4); }
.btn-secondary {
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(255, 255, 255, 0.2);
  color: var(--text-light);
  backdrop-filter: blur(8px);
}
.btn-secondary:hover { border-color: var(--green-glow); }
.btn-outline-dark {
  background: transparent;
  border-color: rgba(28, 36, 32, 0.2);
  color: var(--text-dark);
}
.btn-outline-dark:hover { border-color: var(--orange); color: var(--orange); }

/* ===== Badge / pill ===== */
.badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 18px;
  border-radius: var(--radius-pill);
  background: rgba(34, 197, 94, 0.12);
  border: 1px solid rgba(34, 197, 94, 0.35);
  color: var(--green-glow);
  font-size: 0.85rem;
  font-weight: 600;
}
.eyebrow {
  display: block;
  color: var(--gold);
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  font-size: 0.8rem;
  margin-bottom: 12px;
}

/* ===== Cards (glassmorphism) ===== */
.card {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--radius);
  padding: 32px;
  backdrop-filter: blur(12px);
  transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
}
.section-light .card {
  background: #fff;
  border-color: rgba(28, 36, 32, 0.08);
  box-shadow: 0 8px 30px rgba(28, 36, 32, 0.06);
}
.card:hover {
  transform: translateY(-6px);
  border-color: var(--orange);
  box-shadow: var(--shadow-glow-orange);
}
.card-icon {
  width: 56px;
  height: 56px;
  border-radius: var(--radius-sm);
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, rgba(242, 118, 43, 0.18), rgba(34, 197, 94, 0.18));
  margin-bottom: 20px;
  font-size: 1.6rem;
}
.card-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 16px;
  font-weight: 600;
  color: var(--orange);
}

/* ===== Header ===== */
.site-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(13, 18, 16, 0.85);
  backdrop-filter: blur(14px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}
.site-header .container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 84px;
}
.brand { display: flex; align-items: center; gap: 12px; }
.brand img { height: 44px; width: auto; }
.brand span {
  font-family: var(--font-display);
  color: var(--text-light);
  font-size: 1.2rem;
  font-weight: 700;
}
.nav-links {
  display: flex;
  gap: 32px;
  align-items: center;
}
.nav-links a {
  color: var(--text-light);
  font-weight: 500;
  font-size: 0.95rem;
  opacity: 0.85;
  transition: opacity 0.2s, color 0.2s;
}
.nav-links a:hover, .nav-links a.active { opacity: 1; color: var(--orange-light); }
.header-actions { display: flex; align-items: center; gap: 20px; }
.nav-toggle {
  display: none;
  background: none;
  border: none;
  color: var(--text-light);
  font-size: 1.6rem;
}
@media (max-width: 900px) {
  .nav-links {
    position: absolute;
    top: 84px;
    left: 0;
    right: 0;
    flex-direction: column;
    background: var(--bg-dark-2);
    padding: 24px;
    gap: 20px;
    display: none;
  }
  .site-header.nav-open .nav-links { display: flex; }
  .nav-toggle { display: block; }
}

/* ===== Footer ===== */
.site-footer {
  background: var(--bg-dark);
  color: var(--text-light);
  padding: 72px 0 32px;
}
.footer-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 48px;
  margin-bottom: 48px;
}
.footer-grid h4 { color: var(--gold); font-size: 1rem; margin-bottom: 16px; }
.footer-grid ul li { margin-bottom: 10px; color: var(--text-muted); }
.footer-grid ul li a:hover { color: var(--orange-light); }
.footer-brand { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
.footer-brand img { height: 36px; }
.footer-bottom {
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  padding-top: 24px;
  text-align: center;
  color: var(--text-muted);
  font-size: 0.85rem;
}
@media (max-width: 700px) {
  .footer-grid { grid-template-columns: 1fr; }
}

/* ===== Hero ===== */
.hero {
  position: relative;
  overflow: hidden;
  padding: 120px 0;
}
.hero::before, .hero::after {
  content: "";
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.35;
  z-index: 0;
}
.hero::before {
  width: 480px; height: 480px;
  background: var(--orange);
  top: -120px; right: -100px;
  animation: float 10s ease-in-out infinite;
}
.hero::after {
  width: 380px; height: 380px;
  background: var(--green);
  bottom: -140px; left: -80px;
  animation: float 12s ease-in-out infinite reverse;
}
.hero .container { position: relative; z-index: 1; }
.hero h1 { font-size: clamp(2.4rem, 5vw, 3.6rem); color: var(--text-light); }
.hero h1 em { color: var(--orange-light); font-style: italic; }
.hero p.lead { font-size: 1.15rem; color: var(--text-muted); max-width: 560px; margin-bottom: 32px; }
.hero-actions { display: flex; gap: 16px; flex-wrap: wrap; }

@keyframes float {
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(30px, 30px); }
}

/* ===== Reveal on scroll ===== */
.reveal { opacity: 0; transform: translateY(28px); transition: opacity 0.7s ease, transform 0.7s ease; }
.reveal.is-visible { opacity: 1; transform: none; }

/* ===== Illustration blob (used instead of photos) ===== */
.blob-frame {
  position: relative;
  border-radius: var(--radius);
  background: radial-gradient(circle at 30% 20%, rgba(242, 118, 43, 0.25), transparent 60%),
              radial-gradient(circle at 70% 80%, rgba(34, 197, 94, 0.25), transparent 60%),
              var(--bg-dark-2);
  display: grid;
  place-items: center;
  min-height: 320px;
  font-size: 5rem;
  border: 1px solid rgba(255, 255, 255, 0.08);
}
```

- [ ] **Step 2: Create `js/main.js` with nav toggle, scroll reveal and dynamic year**

```javascript
document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".site-header");
  const toggle = document.querySelector(".nav-toggle");
  if (toggle && header) {
    toggle.addEventListener("click", () => {
      const isOpen = header.classList.toggle("nav-open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });
  }

  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealEls.forEach((el) => observer.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});
```

- [ ] **Step 3: Create `index.html` with the shared header + footer shell**

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Point Dog Pet | Cuidado de verdade para quem você ama</title>
  <meta name="description" content="Banho, tosa, clínica veterinária e pet shop completo. Point Dog: 26 anos cuidando dos pets de Belo Horizonte.">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/style.css">
</head>
<body>
  <header class="site-header">
    <div class="container">
      <a class="brand" href="index.html">
        <img src="assets/img/logo-pointdog.webp" alt="Point Dog">
        <span>Point Dog</span>
      </a>
      <nav class="nav-links">
        <a href="index.html" class="active">Home</a>
        <a href="servicos.html">Serviços</a>
        <a href="sobre.html">Sobre</a>
        <a href="avaliacoes.html">Avaliações</a>
        <a href="contato.html">Contato</a>
      </nav>
      <div class="header-actions">
        <a class="btn btn-primary" href="https://wa.me/553134683299?text=Ol%C3%A1%2C%20quero%20agendar%20um%20hor%C3%A1rio!" target="_blank" rel="noopener">Comprar Agora</a>
        <button class="nav-toggle" aria-label="Abrir menu" aria-expanded="false">&#9776;</button>
      </div>
    </div>
  </header>

  <main>
    <!-- home page sections added in Task 2 -->
  </main>

  <footer class="site-footer">
    <div class="container">
      <div class="footer-grid">
        <div>
          <div class="footer-brand">
            <img src="assets/img/logo-pointdog.webp" alt="Point Dog">
            <span style="font-family: var(--font-display); font-size: 1.1rem;">Point Dog</span>
          </div>
          <p>Cuidado de verdade para quem você ama. Banho, tosa e clínica veterinária com a excelência que seu pet merece.</p>
        </div>
        <div>
          <h4>Navegação</h4>
          <ul>
            <li><a href="index.html">Home</a></li>
            <li><a href="servicos.html">Nossos Serviços</a></li>
            <li><a href="sobre.html">Sobre Nós</a></li>
            <li><a href="avaliacoes.html">Avaliações</a></li>
            <li><a href="contato.html">Contato</a></li>
          </ul>
        </div>
        <div>
          <h4>Contato</h4>
          <ul>
            <li>R. Dona Nancy de Vasc. Gomes, 336 - Horto, Belo Horizonte - MG</li>
            <li><a href="tel:+553134683299">+55 (31) 3468-3299</a> (Atendimento)</li>
            <li><a href="tel:+553134631877">+55 (31) 3463-1877</a> (Banho e Tosa)</li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        &copy; <span id="year"></span> Point Dog Pet. Todos os direitos reservados.
      </div>
    </div>
  </footer>

  <script src="js/main.js"></script>
</body>
</html>
```

- [ ] **Step 4: Verify in browser and by content check**

Open `index.html` directly in a browser (double-click or `start index.html` on Windows). Confirm: logo + "Point Dog" wordmark visible in header, nav links present, "Comprar Agora" button visible, resizing the window below 900px hides the nav and shows a hamburger button that toggles the menu, footer shows the year automatically (not hardcoded).

Run:
```bash
grep -c "553134683299" index.html
grep -c "nav-toggle" js/main.js
```
Expected: both commands print a number ≥ 1.

- [ ] **Step 5: Commit**

```bash
git add css/style.css js/main.js index.html
git commit -m "feat: add design system, shared JS and header/footer shell"
```

---

### Task 2: Home page content

**Files:**
- Modify: `index.html` (replace the `<!-- home page sections added in Task 2 -->` comment inside `<main>`)

**Interfaces:**
- Consumes: CSS classes and header/footer from Task 1 (`.hero`, `.badge`, `.grid-3`, `.card`, `.card-icon`, `.card-link`, `.section`, `.section-light`, `.section-dark`, `.reveal`, `.blob-frame`, `.btn-primary`, `.btn-secondary`, `.btn-outline-dark`).
- Produces: nothing consumed by later tasks (Home is a leaf page), but the section markup pattern (pillars/why-us/testimonials/units) is the reference other tasks may look at for card structure.

- [ ] **Step 1: Replace the `<main>` placeholder with the Home sections**

```html
<main>
  <section class="hero section-dark">
    <div class="container">
      <span class="badge">✨ Seu pet tratado como família</span>
      <h1>Cuidado de verdade,<br><em>confiança</em> desde o primeiro banho.</h1>
      <p class="lead">Banho, tosa, clínica veterinária e todo tipo de produto. A melhor qualidade, preços competitivos e o atendimento que seu pet merece.</p>
      <div class="hero-actions">
        <a class="btn btn-primary" href="https://wa.me/553134683299?text=Ol%C3%A1%2C%20quero%20agendar%20um%20hor%C3%A1rio!" target="_blank" rel="noopener">Agendar no WhatsApp</a>
        <a class="btn btn-secondary" href="servicos.html">Conhecer Serviços</a>
      </div>
    </div>
  </section>

  <section class="section section-light">
    <div class="container">
      <div class="section-header reveal">
        <h2>Tudo para o seu pet</h2>
        <p>Reunimos os melhores serviços e produtos em um ambiente pensado para o bem-estar animal.</p>
      </div>
      <div class="grid-3">
        <div class="card reveal">
          <div class="card-icon">🛁</div>
          <h3>Banho & Tosa Profissional</h3>
          <p>Estética animal com produtos premium e profissionais carinhosos. Acompanhe tudo por vídeo se desejar.</p>
          <a class="card-link" href="servicos.html">Saiba mais →</a>
        </div>
        <div class="card reveal">
          <div class="card-icon">🩺</div>
          <h3>Clínica Veterinária</h3>
          <p>Consultas, vacinas e exames com quem entende. Saúde preventiva para garantir a longevidade do seu melhor amigo.</p>
          <a class="card-link" href="servicos.html">Saiba mais →</a>
        </div>
        <div class="card reveal">
          <div class="card-icon">🦴</div>
          <h3>Pet Shop Completo</h3>
          <p>A melhor seleção de produtos da cidade. Rações super premium, farmácia completa, brinquedos importados e acessórios exclusivos.</p>
          <a class="card-link" href="servicos.html">Saiba mais →</a>
        </div>
      </div>
    </div>
  </section>

  <section class="section section-dark">
    <div class="container grid-2" style="align-items: center;">
      <div class="reveal">
        <h2>Por que somos a escolha nº 1 do bairro?</h2>
        <div style="display: grid; gap: 28px; margin-top: 32px;">
          <div>
            <h3 style="font-size: 1.1rem; color: var(--gold);">🏅 Tradição de 26 Anos</h3>
            <p>Com vasta experiência, construímos uma história de confiança e seriedade. Cuidamos de gerações de pets com a mesma dedicação.</p>
          </div>
          <div>
            <h3 style="font-size: 1.1rem; color: var(--gold);">✨ Higiene Rigorosa</h3>
            <p>Protocolos sanitários de nível hospitalar. Ambientes climatizados, esterilizados e seguros para garantir a saúde integral do seu amigo.</p>
          </div>
          <div>
            <h3 style="font-size: 1.1rem; color: var(--gold);">🌟 Produtos Premium</h3>
            <p>Curadoria exclusiva das melhores marcas de ração, farmácia e acessórios. Qualidade superior para quem você ama.</p>
          </div>
          <div>
            <h3 style="font-size: 1.1rem; color: var(--gold);">💰 Preços Justos</h3>
            <p>Valores competitivos sem abrir mão da qualidade. O melhor custo-benefício para cuidar do seu pet com excelência.</p>
          </div>
        </div>
      </div>
      <div class="blob-frame reveal">🐾</div>
    </div>
  </section>

  <section class="section section-light">
    <div class="container">
      <div class="section-header reveal">
        <h2>Quem ama, recomenda</h2>
        <p>⭐⭐⭐⭐⭐ 4.8 de 5 no Google</p>
      </div>
      <div class="grid-4">
        <div class="card reveal">
          <p>★★★★★</p>
          <p>"Atendimento impecável! Meu cachorro é super medroso e foi tratado com muito carinho. O vídeo do banho me deixou super tranquila."</p>
          <strong>Ana Clara</strong>
        </div>
        <div class="card reveal">
          <p>★★★★★</p>
          <p>"Melhor pet shop do bairro. Preço justo, entrega grátis e a tosa ficou perfeita. Recomendo demais!"</p>
          <strong>Ricardo Mendes</strong>
        </div>
        <div class="card reveal">
          <p>★★★★★</p>
          <p>"A clínica veterinária é excelente. Dra. Juliana foi muito atenciosa com minha gatinha. Confiança total."</p>
          <strong>Fernanda Costa</strong>
        </div>
        <div class="card reveal">
          <p>★★★★★</p>
          <p>"Produtos de qualidade e atendimento excepcional. Sempre comprei a ração aqui e a entrega é super rápida."</p>
          <strong>Carlos Eduardo</strong>
        </div>
      </div>
      <p style="text-align:center; margin-top: 40px;"><a class="card-link" href="avaliacoes.html">Ver todas as 532 avaliações no Google →</a></p>
    </div>
  </section>

  <section class="section section-dark">
    <div class="container">
      <div class="section-header reveal">
        <h2>Nossas Unidades</h2>
        <p>Encontre a Point Dog mais próxima de você. Estamos presentes em 4 endereços para melhor te atender.</p>
      </div>
      <div class="grid-4">
        <div class="card reveal">
          <span class="badge">Unidade Completa</span>
          <h3 style="margin-top:12px;">Unidade Horto</h3>
          <p>R. Dona Nancy de Vasc. Gomes, 336 - Horto, BH</p>
          <p>Fecha às 18:00</p>
          <a class="card-link" href="contato.html">Agendar nesta unidade →</a>
        </div>
        <div class="card reveal">
          <h3>Unidade Pitangui</h3>
          <p>R. Pitangui, 3003 - Sagrada Família, BH</p>
          <p>Fecha às 19:00</p>
          <a class="card-link" href="contato.html">Pedir produtos aqui →</a>
        </div>
        <div class="card reveal">
          <h3>Unidade São Roque</h3>
          <p>R. São Roque, 1231-A - Sagrada Família, BH</p>
          <p>Fecha às 19:00</p>
          <a class="card-link" href="contato.html">Pedir produtos aqui →</a>
        </div>
        <div class="card reveal">
          <h3>Unidade Formosa</h3>
          <p>R. Formosa, 113A - Santa Tereza, BH</p>
          <p>Fecha às 18:00</p>
          <a class="card-link" href="contato.html">Pedir produtos aqui →</a>
        </div>
      </div>
    </div>
  </section>
</main>
```

- [ ] **Step 2: Verify content fidelity**

Run:
```bash
grep -c "26 Anos" index.html
grep -c "532 avaliações" index.html
grep -c "Ana Clara" index.html
```
Expected: each ≥ 1. Then open `index.html` in a browser, scroll through and confirm cards fade in on scroll (the `.reveal` animation), and all 4 unit cards + 4 testimonials render.

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: build Home page content"
```

---

### Task 3: Serviços page

**Files:**
- Create: `servicos.html`

**Interfaces:**
- Consumes: header/footer pattern from `index.html` (Task 1), CSS classes from `css/style.css` (Task 1).

- [ ] **Step 1: Create `servicos.html`**

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Serviços | Point Dog Pet</title>
  <meta name="description" content="Banho & Tosa, Clínica Veterinária e Pet Shop & Farmácia. Conheça todos os serviços da Point Dog.">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/style.css">
</head>
<body>
  <header class="site-header">
    <div class="container">
      <a class="brand" href="index.html">
        <img src="assets/img/logo-pointdog.webp" alt="Point Dog">
        <span>Point Dog</span>
      </a>
      <nav class="nav-links">
        <a href="index.html">Home</a>
        <a href="servicos.html" class="active">Serviços</a>
        <a href="sobre.html">Sobre</a>
        <a href="avaliacoes.html">Avaliações</a>
        <a href="contato.html">Contato</a>
      </nav>
      <div class="header-actions">
        <a class="btn btn-primary" href="https://wa.me/553134683299?text=Ol%C3%A1%2C%20quero%20agendar%20um%20hor%C3%A1rio!" target="_blank" rel="noopener">Comprar Agora</a>
        <button class="nav-toggle" aria-label="Abrir menu" aria-expanded="false">&#9776;</button>
      </div>
    </div>
  </header>

  <main>
  <section class="hero section-dark" style="padding: 100px 0 60px;">
    <div class="container" style="text-align:center;">
      <h1>Nossos Serviços</h1>
      <p class="lead" style="margin:0 auto;">Excelência e carinho em cada detalhe. Do banho refrescante à saúde preventiva.</p>
    </div>
  </section>

  <section class="section section-light">
    <div class="container grid-2" style="align-items:center;">
      <div class="reveal">
        <div class="card-icon">🛁</div>
        <h2>Banho & Tosa</h2>
        <p>Um spa completo para o seu pet. Utilizamos apenas produtos de linha premium, toalhas esterilizadas individualmente e secadores silenciosos.</p>
        <div class="grid-2" style="gap:8px;">
          <p>✔ Banho relaxante</p>
          <p>✔ Tosa na tesoura</p>
          <p>✔ Tosa higiênica</p>
          <p>✔ Hidratação profunda</p>
        </div>
        <a class="btn btn-outline-dark" style="margin-top:16px;" href="https://wa.me/553134683299?text=Ol%C3%A1%2C%20quero%20agendar%20Banho%20%26%20Tosa" target="_blank" rel="noopener">Agendar Banho & Tosa →</a>
      </div>
      <div class="blob-frame reveal">🛁</div>
    </div>
  </section>

  <section class="section section-dark">
    <div class="container grid-2" style="align-items:center;">
      <div class="blob-frame reveal">🩺</div>
      <div class="reveal">
        <div class="card-icon">🩺</div>
        <h2>Clínica Veterinária</h2>
        <p>Saúde em primeiro lugar. Nossa clínica conta com equipamentos modernos e profissionais apaixonados pelo que fazem.</p>
        <div class="grid-2" style="gap:8px;">
          <p>✔ Consultas de rotina</p>
          <p>✔ Vacinação importada</p>
          <p>✔ Exames laboratoriais</p>
          <p>✔ Orientação nutricional</p>
        </div>
        <a class="btn btn-secondary" style="margin-top:16px;" href="https://wa.me/553134683299?text=Ol%C3%A1%2C%20quero%20agendar%20a%20Cl%C3%ADnica%20Veterin%C3%A1ria" target="_blank" rel="noopener">Agendar Clínica Veterinária →</a>
      </div>
    </div>
  </section>

  <section class="section section-light">
    <div class="container grid-2" style="align-items:center;">
      <div class="reveal">
        <div class="card-icon">🦴</div>
        <h2>Pet Shop & Farmácia</h2>
        <p>Tudo o que seu pet precisa. Trabalhamos com as melhores marcas de ração, petiscos naturais e farmácia completa.</p>
        <div class="grid-2" style="gap:8px;">
          <p>✔ Rações Super Premium</p>
          <p>✔ Farmácia veterinária</p>
          <p>✔ Brinquedos interativos</p>
          <p>✔ Camas e roupas</p>
          <p>✔ Acessórios de passeio</p>
        </div>
        <a class="btn btn-outline-dark" style="margin-top:16px;" href="https://wa.me/553134683299?text=Ol%C3%A1%2C%20quero%20fazer%20um%20pedido%20no%20Pet%20Shop" target="_blank" rel="noopener">Agendar Pet Shop & Farmácia →</a>
      </div>
      <div class="blob-frame reveal">🦴</div>
    </div>
  </section>
  </main>

  <footer class="site-footer">
    <div class="container">
      <div class="footer-grid">
        <div>
          <div class="footer-brand">
            <img src="assets/img/logo-pointdog.webp" alt="Point Dog">
            <span style="font-family: var(--font-display); font-size: 1.1rem;">Point Dog</span>
          </div>
          <p>Cuidado de verdade para quem você ama. Banho, tosa e clínica veterinária com a excelência que seu pet merece.</p>
        </div>
        <div>
          <h4>Navegação</h4>
          <ul>
            <li><a href="index.html">Home</a></li>
            <li><a href="servicos.html">Nossos Serviços</a></li>
            <li><a href="sobre.html">Sobre Nós</a></li>
            <li><a href="avaliacoes.html">Avaliações</a></li>
            <li><a href="contato.html">Contato</a></li>
          </ul>
        </div>
        <div>
          <h4>Contato</h4>
          <ul>
            <li>R. Dona Nancy de Vasc. Gomes, 336 - Horto, Belo Horizonte - MG</li>
            <li><a href="tel:+553134683299">+55 (31) 3468-3299</a> (Atendimento)</li>
            <li><a href="tel:+553134631877">+55 (31) 3463-1877</a> (Banho e Tosa)</li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        &copy; <span id="year"></span> Point Dog Pet. Todos os direitos reservados.
      </div>
    </div>
  </footer>

  <script src="js/main.js"></script>
</body>
</html>
```

- [ ] **Step 2: Verify**

Run:
```bash
grep -c "Tosa na tesoura" servicos.html
grep -c "class=\"active\">Serviços" servicos.html
```
Expected: both ≥ 1. Open `servicos.html` in the browser, confirm nav highlights "Serviços", header/footer match `index.html` visually, all three service blocks render with working WhatsApp links.

- [ ] **Step 3: Commit**

```bash
git add servicos.html
git commit -m "feat: add Serviços page"
```

---

### Task 4: Sobre page

**Files:**
- Create: `sobre.html`

**Interfaces:**
- Consumes: header/footer pattern from `index.html`, CSS classes from `css/style.css`.

- [ ] **Step 1: Create `sobre.html`**

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sobre | Point Dog Pet</title>
  <meta name="description" content="26 anos de história cuidando dos pets de Belo Horizonte. Conheça a história da Point Dog.">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/style.css">
</head>
<body>
  <header class="site-header">
    <div class="container">
      <a class="brand" href="index.html">
        <img src="assets/img/logo-pointdog.webp" alt="Point Dog">
        <span>Point Dog</span>
      </a>
      <nav class="nav-links">
        <a href="index.html">Home</a>
        <a href="servicos.html">Serviços</a>
        <a href="sobre.html" class="active">Sobre</a>
        <a href="avaliacoes.html">Avaliações</a>
        <a href="contato.html">Contato</a>
      </nav>
      <div class="header-actions">
        <a class="btn btn-primary" href="https://wa.me/553134683299?text=Ol%C3%A1%2C%20quero%20agendar%20um%20hor%C3%A1rio!" target="_blank" rel="noopener">Comprar Agora</a>
        <button class="nav-toggle" aria-label="Abrir menu" aria-expanded="false">&#9776;</button>
      </div>
    </div>
  </header>

  <main>
  <section class="section section-light" style="padding-top:140px; text-align:center;">
    <div class="container reveal">
      <span class="eyebrow">Nossa História</span>
      <h1>Paixão por animais,<br>compromisso com você</h1>
    </div>
  </section>

  <section class="section section-light" style="padding-top:0;">
    <div class="container grid-2" style="align-items:center;">
      <div class="blob-frame reveal">🐾</div>
      <div class="reveal">
        <h2>Tradição, inovação e carinho.</h2>
        <p>Com mais de 26 anos de história, a Point Dog é referência em Belo Horizonte. Fomos pioneiros no agendamento automático, unindo a seriedade de uma equipe altamente qualificada com um atendimento onde o bem-estar emocional do seu pet é prioridade absoluta.</p>
        <p>Aqui, entregamos excelência completa: do tratamento carinhoso e individualizado no banho e tosa à curadoria rigorosa de produtos em nossa loja. Oferecemos apenas o melhor em rações super premium, farmácia e acessórios, porque a saúde e a felicidade do seu melhor amigo são a nossa missão.</p>
        <div class="grid-2">
          <div class="card">
            <div style="font-size:1.6rem;">🤝</div>
            <h3 style="font-size:1.05rem;">Confiança</h3>
            <p>Transparência total em todos os procedimentos.</p>
          </div>
          <div class="card">
            <div style="font-size:1.6rem;">❤️</div>
            <h3 style="font-size:1.05rem;">Carinho</h3>
            <p>Amor incondicional em cada gesto.</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="section section-dark">
    <div class="container" style="text-align:center;">
      <h2 class="reveal" style="font-style:italic;">"Cuidar é a nossa forma de amar."</h2>
    </div>
  </section>
  </main>

  <footer class="site-footer">
    <div class="container">
      <div class="footer-grid">
        <div>
          <div class="footer-brand">
            <img src="assets/img/logo-pointdog.webp" alt="Point Dog">
            <span style="font-family: var(--font-display); font-size: 1.1rem;">Point Dog</span>
          </div>
          <p>Cuidado de verdade para quem você ama. Banho, tosa e clínica veterinária com a excelência que seu pet merece.</p>
        </div>
        <div>
          <h4>Navegação</h4>
          <ul>
            <li><a href="index.html">Home</a></li>
            <li><a href="servicos.html">Nossos Serviços</a></li>
            <li><a href="sobre.html">Sobre Nós</a></li>
            <li><a href="avaliacoes.html">Avaliações</a></li>
            <li><a href="contato.html">Contato</a></li>
          </ul>
        </div>
        <div>
          <h4>Contato</h4>
          <ul>
            <li>R. Dona Nancy de Vasc. Gomes, 336 - Horto, Belo Horizonte - MG</li>
            <li><a href="tel:+553134683299">+55 (31) 3468-3299</a> (Atendimento)</li>
            <li><a href="tel:+553134631877">+55 (31) 3463-1877</a> (Banho e Tosa)</li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        &copy; <span id="year"></span> Point Dog Pet. Todos os direitos reservados.
      </div>
    </div>
  </footer>

  <script src="js/main.js"></script>
</body>
</html>
```

- [ ] **Step 2: Verify**

Run:
```bash
grep -c "26 anos de hist" sobre.html
grep -c "Cuidar é a nossa forma de amar" sobre.html
```
Expected: both ≥ 1. Open in the browser and confirm the header nav highlights "Sobre".

- [ ] **Step 3: Commit**

```bash
git add sobre.html
git commit -m "feat: add Sobre page"
```

---

### Task 5: Avaliações page

**Files:**
- Create: `avaliacoes.html`

**Interfaces:**
- Consumes: header/footer pattern from `index.html`, CSS classes from `css/style.css`.

- [ ] **Step 1: Create `avaliacoes.html`**

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Avaliações | Point Dog Pet</title>
  <meta name="description" content="4.8 de 5 estrelas com 532 avaliações no Google. Veja o que nossos clientes dizem sobre a Point Dog.">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/style.css">
</head>
<body>
  <header class="site-header">
    <div class="container">
      <a class="brand" href="index.html">
        <img src="assets/img/logo-pointdog.webp" alt="Point Dog">
        <span>Point Dog</span>
      </a>
      <nav class="nav-links">
        <a href="index.html">Home</a>
        <a href="servicos.html">Serviços</a>
        <a href="sobre.html">Sobre</a>
        <a href="avaliacoes.html" class="active">Avaliações</a>
        <a href="contato.html">Contato</a>
      </nav>
      <div class="header-actions">
        <a class="btn btn-primary" href="https://wa.me/553134683299?text=Ol%C3%A1%2C%20quero%20agendar%20um%20hor%C3%A1rio!" target="_blank" rel="noopener">Comprar Agora</a>
        <button class="nav-toggle" aria-label="Abrir menu" aria-expanded="false">&#9776;</button>
      </div>
    </div>
  </header>

  <main>
  <section class="hero section-dark" style="padding: 100px 0 60px;">
    <div class="container" style="text-align:center;">
      <h1>O que dizem sobre nós</h1>
      <p class="lead" style="margin:0 auto;">⭐ 4.8 de 5 <span style="color:var(--gold);">(532 avaliações no Google)</span></p>
    </div>
  </section>

  <section class="section section-light">
    <div class="container">
      <div class="grid-3">
        <div class="card reveal">
          <p>★★★★★</p>
          <p>"Atendimento impecável! Meu cachorro é super medroso e foi tratado com muito carinho. O vídeo do banho me deixou super tranquila."</p>
          <strong>Ana Clara</strong>
          <p style="color:var(--green); font-size:0.85rem;">Cliente Verificado ✔</p>
        </div>
        <div class="card reveal">
          <p>★★★★★</p>
          <p>"Melhor pet shop do bairro. Preço justo, entrega grátis e a tosa ficou perfeita. Recomendo demais!"</p>
          <strong>Ricardo Mendes</strong>
          <p style="color:var(--green); font-size:0.85rem;">Cliente Verificado ✔</p>
        </div>
        <div class="card reveal">
          <p>★★★★★</p>
          <p>"A clínica veterinária é excelente. Dra. Juliana foi muito atenciosa com minha gatinha. Confiança total."</p>
          <strong>Fernanda Costa</strong>
          <p style="color:var(--green); font-size:0.85rem;">Cliente Verificado ✔</p>
        </div>
        <div class="card reveal">
          <p>★★★★★</p>
          <p>"Produtos de qualidade e atendimento excepcional. Sempre comprei a ração aqui e a entrega é super rápida."</p>
          <strong>Carlos Eduardo</strong>
          <p style="color:var(--green); font-size:0.85rem;">Cliente Verificado ✔</p>
        </div>
        <div class="card reveal">
          <p>★★★★☆</p>
          <p>"Ótimo atendimento, só acho que poderia ter mais horários disponíveis aos sábados."</p>
          <strong>Cliente Point Dog</strong>
          <p style="color:var(--green); font-size:0.85rem;">Cliente Verificado ✔</p>
        </div>
        <div class="card reveal">
          <p>★★★★★</p>
          <p>"Lugar limpo, cheiroso e organizado. Meus pets sempre saem felizes de lá."</p>
          <strong>Cliente Point Dog</strong>
          <p style="color:var(--green); font-size:0.85rem;">Cliente Verificado ✔</p>
        </div>
      </div>
      <p style="text-align:center; margin-top:48px;">
        <a class="btn btn-outline-dark" href="https://www.google.com/maps/search/?api=1&query=Point+Dog+Pet+Belo+Horizonte" target="_blank" rel="noopener">Ver todas as avaliações no Google →</a>
      </p>
    </div>
  </section>
  </main>

  <footer class="site-footer">
    <div class="container">
      <div class="footer-grid">
        <div>
          <div class="footer-brand">
            <img src="assets/img/logo-pointdog.webp" alt="Point Dog">
            <span style="font-family: var(--font-display); font-size: 1.1rem;">Point Dog</span>
          </div>
          <p>Cuidado de verdade para quem você ama. Banho, tosa e clínica veterinária com a excelência que seu pet merece.</p>
        </div>
        <div>
          <h4>Navegação</h4>
          <ul>
            <li><a href="index.html">Home</a></li>
            <li><a href="servicos.html">Nossos Serviços</a></li>
            <li><a href="sobre.html">Sobre Nós</a></li>
            <li><a href="avaliacoes.html">Avaliações</a></li>
            <li><a href="contato.html">Contato</a></li>
          </ul>
        </div>
        <div>
          <h4>Contato</h4>
          <ul>
            <li>R. Dona Nancy de Vasc. Gomes, 336 - Horto, Belo Horizonte - MG</li>
            <li><a href="tel:+553134683299">+55 (31) 3468-3299</a> (Atendimento)</li>
            <li><a href="tel:+553134631877">+55 (31) 3463-1877</a> (Banho e Tosa)</li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        &copy; <span id="year"></span> Point Dog Pet. Todos os direitos reservados.
      </div>
    </div>
  </footer>

  <script src="js/main.js"></script>
</body>
</html>
```

- [ ] **Step 2: Verify**

Run:
```bash
grep -c "532 avalia" avaliacoes.html
grep -c "Cliente Verificado" avaliacoes.html
```
Expected: first ≥ 1, second ≥ 6. Open in browser, confirm the nav highlights "Avaliações" and the review grid displays correctly on mobile width (1 column) and desktop (3 columns).

- [ ] **Step 3: Commit**

```bash
git add avaliacoes.html
git commit -m "feat: add Avaliações page"
```

---

### Task 6: Contato page

**Files:**
- Create: `contato.html`

**Interfaces:**
- Consumes: header/footer pattern from `index.html`, CSS classes from `css/style.css`, unit data table from Global Constraints.

- [ ] **Step 1: Create `contato.html`**

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Contato | Point Dog Pet</title>
  <meta name="description" content="Encontre a unidade Point Dog mais próxima de você. 4 endereços em Belo Horizonte.">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/style.css">
</head>
<body>
  <header class="site-header">
    <div class="container">
      <a class="brand" href="index.html">
        <img src="assets/img/logo-pointdog.webp" alt="Point Dog">
        <span>Point Dog</span>
      </a>
      <nav class="nav-links">
        <a href="index.html">Home</a>
        <a href="servicos.html">Serviços</a>
        <a href="sobre.html">Sobre</a>
        <a href="avaliacoes.html">Avaliações</a>
        <a href="contato.html" class="active">Contato</a>
      </nav>
      <div class="header-actions">
        <a class="btn btn-primary" href="https://wa.me/553134683299?text=Ol%C3%A1%2C%20quero%20agendar%20um%20hor%C3%A1rio!" target="_blank" rel="noopener">Comprar Agora</a>
        <button class="nav-toggle" aria-label="Abrir menu" aria-expanded="false">&#9776;</button>
      </div>
    </div>
  </header>

  <main>
  <section class="hero section-dark" style="padding: 100px 0 60px;">
    <div class="container" style="text-align:center;">
      <h1>Contato</h1>
      <p class="lead" style="margin:0 auto;">Estamos esperando sua visita.</p>
    </div>
  </section>

  <section class="section section-light">
    <div class="container">
      <div class="card reveal" style="border-left: 4px solid var(--gold); margin-bottom:32px;">
        <span class="badge" style="background:rgba(217,164,65,0.12); border-color:rgba(217,164,65,0.4); color:var(--gold);">Matriz • Completa</span>
        <h2 style="margin-top:12px;">Unidade Horto</h2>
        <p>Nossa unidade principal com clínica veterinária, centro estético completo e pet shop.</p>
        <div class="grid-2">
          <p>📍 R. Dona Nancy de Vasc. Gomes, 336 - Horto, Belo Horizonte - MG, 31030-072</p>
          <p>🕒 Fecha às 18:00</p>
          <p>📞 <a href="tel:+553134683299">+55 (31) 3468-3299</a> (Geral)</p>
          <p>🛁 <a href="tel:+553134631877">+55 (31) 3463-1877</a> (Banho e Tosa)</p>
        </div>
        <div class="hero-actions" style="margin-top:20px;">
          <a class="btn btn-primary" href="https://wa.me/553134683299?text=Ol%C3%A1%2C%20quero%20agendar%20um%20hor%C3%A1rio%20na%20Unidade%20Horto" target="_blank" rel="noopener">Agendar Horário</a>
          <a class="btn btn-outline-dark" href="https://www.google.com/maps/search/?api=1&query=R.+Dona+Nancy+de+Vasc.+Gomes%2C+336+-+Horto%2C+Belo+Horizonte+-+MG" target="_blank" rel="noopener">Ver no Mapa</a>
        </div>
      </div>

      <div class="grid-3">
        <div class="card reveal">
          <h3>Unidade Pitangui</h3>
          <p>Sagrada Família I</p>
          <p>📍 R. Pitangui, 3003 - Sagrada Família, Belo Horizonte - MG, 31030-210</p>
          <p>📞 <a href="tel:+553134636974">(31) 3463-6974</a></p>
          <p>🕒 Até 19:00</p>
          <a class="btn btn-outline-dark" href="https://wa.me/553134636974?text=Ol%C3%A1%2C%20quero%20fazer%20um%20pedido" target="_blank" rel="noopener">Pedir Produto</a>
        </div>
        <div class="card reveal">
          <h3>Unidade São Roque</h3>
          <p>Sagrada Família II</p>
          <p>📍 R. São Roque, 1231-A - Sagrada Família, Belo Horizonte - MG, 31035-460</p>
          <p>📞 <a href="tel:+553125520043">(31) 2552-0043</a></p>
          <p>🕒 Até 19:00</p>
          <a class="btn btn-outline-dark" href="https://wa.me/553125520043?text=Ol%C3%A1%2C%20quero%20fazer%20um%20pedido" target="_blank" rel="noopener">Pedir Produto</a>
        </div>
        <div class="card reveal">
          <h3>Unidade Formosa</h3>
          <p>Santa Tereza</p>
          <p>📍 R. Formosa, 113A - Santa Tereza, Belo Horizonte - MG, 31014-045</p>
          <p>📞 <a href="tel:+553139650182">(31) 3965-0182</a></p>
          <p>🕒 Até 18:00</p>
          <a class="btn btn-outline-dark" href="https://wa.me/553139650182?text=Ol%C3%A1%2C%20quero%20fazer%20um%20pedido" target="_blank" rel="noopener">Pedir Produto</a>
        </div>
      </div>
    </div>
  </section>

  <section class="section section-dark" style="text-align:center;">
    <div class="container reveal">
      <h2>Redes Sociais</h2>
      <div class="hero-actions" style="justify-content:center;">
        <a class="btn btn-secondary" href="https://instagram.com" target="_blank" rel="noopener">📷 Instagram</a>
        <a class="btn btn-secondary" href="https://facebook.com" target="_blank" rel="noopener">📘 Facebook</a>
        <a class="btn btn-secondary" href="https://linktr.ee" target="_blank" rel="noopener">🔗 Linktree</a>
      </div>
    </div>
  </section>
  </main>

  <footer class="site-footer">
    <div class="container">
      <div class="footer-grid">
        <div>
          <div class="footer-brand">
            <img src="assets/img/logo-pointdog.webp" alt="Point Dog">
            <span style="font-family: var(--font-display); font-size: 1.1rem;">Point Dog</span>
          </div>
          <p>Cuidado de verdade para quem você ama. Banho, tosa e clínica veterinária com a excelência que seu pet merece.</p>
        </div>
        <div>
          <h4>Navegação</h4>
          <ul>
            <li><a href="index.html">Home</a></li>
            <li><a href="servicos.html">Nossos Serviços</a></li>
            <li><a href="sobre.html">Sobre Nós</a></li>
            <li><a href="avaliacoes.html">Avaliações</a></li>
            <li><a href="contato.html">Contato</a></li>
          </ul>
        </div>
        <div>
          <h4>Contato</h4>
          <ul>
            <li>R. Dona Nancy de Vasc. Gomes, 336 - Horto, Belo Horizonte - MG</li>
            <li><a href="tel:+553134683299">+55 (31) 3468-3299</a> (Atendimento)</li>
            <li><a href="tel:+553134631877">+55 (31) 3463-1877</a> (Banho e Tosa)</li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        &copy; <span id="year"></span> Point Dog Pet. Todos os direitos reservados.
      </div>
    </div>
  </footer>

  <script src="js/main.js"></script>
</body>
</html>
```

- [ ] **Step 2: Verify**

Run:
```bash
grep -c "553134636974" contato.html
grep -c "553125520043" contato.html
grep -c "553139650182" contato.html
grep -c "google.com/maps/search" contato.html
```
Expected: each ≥ 1. Open in the browser, click each `tel:` and `wa.me` link to confirm the href values match the Global Constraints table exactly, and confirm the nav highlights "Contato".

- [ ] **Step 3: Commit**

```bash
git add contato.html
git commit -m "feat: add Contato page"
```

---

### Task 7: Cross-page QA, consistency pass and final polish

**Files:**
- Modify: any of `index.html`, `servicos.html`, `sobre.html`, `avaliacoes.html`, `contato.html` (fixes only, no new sections)

**Interfaces:**
- Consumes: all files created in Tasks 1–6.

- [ ] **Step 1: Verify every page has an identical header/footer structure**

Run:
```bash
grep -c "class=\"site-header\"" index.html servicos.html sobre.html avaliacoes.html contato.html
grep -c "class=\"site-footer\"" index.html servicos.html sobre.html avaliacoes.html contato.html
```
Expected: every file reports exactly `1` for both. If any file is missing the header/footer or has a mismatched structure, fix it by copying the exact block from `index.html`.

- [ ] **Step 2: Verify exactly one `active` nav link per page and it matches the page**

Run:
```bash
grep -o 'class="active">[A-Za-zçãõáéíóú]*' index.html servicos.html sobre.html avaliacoes.html contato.html
```
Expected output pairs each filename with its own section name (`index.html` → `Home`, `servicos.html` → `Serviços`, `sobre.html` → `Sobre`, `avaliacoes.html` → `Avaliações`, `contato.html` → `Contato`). Fix any file where the wrong link is marked active.

- [ ] **Step 3: Verify all internal links resolve to files that exist**

Run:
```bash
for f in index.html servicos.html sobre.html avaliacoes.html contato.html; do echo "== $f =="; grep -oE 'href="[a-z]+\.html"' "$f" | sort -u; done
```
Expected: only `index.html`, `servicos.html`, `sobre.html`, `avaliacoes.html`, `contato.html` appear — confirm all 5 exist via `ls *.html` (they do, from Tasks 1–6).

- [ ] **Step 4: Manual responsive + visual pass**

Open each of the 5 pages in a browser. For each: resize the window to ~375px (mobile), ~768px (tablet) and ~1440px (desktop) and confirm no horizontal scrollbar appears, the hamburger menu works below 900px, cards stack to 1 column below 640px, and text stays legible (light text on dark sections, dark text on light sections — no white-on-white or dark-on-dark).

- [ ] **Step 5: Commit final polish**

```bash
git add -A
git commit -m "chore: cross-page QA pass — consistent nav, header/footer and working links"
```
