// Seção "scrub": a rolagem controla o avanço do vídeo.
// Melhoria progressiva: sem GSAP, sem JS, com movimento reduzido ou erro no vídeo,
// a seção continua estática (poster + textos + botão), sem perder informação.
(function () {
  const section = document.getElementById("scrub");
  const video = document.getElementById("scrub-video");
  if (!section || !video) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  function start() {
    if (video.dataset.started) return;
    if (!window.gsap || !window.ScrollTrigger) return fallback();
    video.dataset.started = "1";
    const { gsap, ScrollTrigger } = window;
    gsap.registerPlugin(ScrollTrigger);

    const w = window.innerWidth;
    video.src = w >= 700 ? video.dataset.srcLg : video.dataset.srcSm;
    video.preload = "auto";

    video.addEventListener("error", fallback, { once: true });
    video.addEventListener("loadedmetadata", () => {
      if (!isFinite(video.duration) || video.duration <= 0) return fallback();
      activate();
    }, { once: true });
    video.load();
  }

  function fallback() {
    document.documentElement.classList.remove("scrub-js");
    section.classList.remove("is-scrub");
    const n = section.nextElementSibling;
    if (n) n.classList.remove("scrub-curtain");
  }

  function activate() {
    const { gsap, ScrollTrigger } = window;
    section.classList.add("is-scrub");
    const next = section.nextElementSibling;
    if (next) next.classList.add("scrub-curtain");

    const points = [...section.querySelectorAll(".scrub-points li")];
    function setPoints(p) {
      points.forEach((li) => li.classList.toggle("is-on", p >= +li.dataset.from && p < +li.dataset.to));
    }
    setPoints(0);

    let target = 0, current = 0, shown = -1;
    const dur = video.duration;


    ScrollTrigger.create({
      trigger: section,
      start: "top top+=85",
      end: () => "+=" + window.innerHeight * 1.5,
      onUpdate: (self) => { target = self.progress; setPoints(target); },
    });

    // Aproxima o quadro atual do alvo, sem inundar o vídeo de buscas
    gsap.ticker.add(() => {
      current += (target - current) * 0.25;
      if (Math.abs(target - current) < 0.0005) current = target;
      const t = Math.min(current * dur, dur - 0.04);
      if (!video.seeking && Math.abs(t - shown) > 0.02) { video.currentTime = t; shown = t; }
    });

    ScrollTrigger.refresh();
  }

  // Economia de dados ou rede 2g: nunca baixa o vídeo; fica o poster estático (plano B)
  const conn = navigator.connection || {};
  if (conn.saveData || /(^|-)2g$/.test(conn.effectiveType || "")) return;

  // O poster é o LCP: o vídeo só baixa depois do load e de um momento ocioso
  function later() {
    if ("requestIdleCallback" in window) requestIdleCallback(start, { timeout: 2000 });
    else setTimeout(start, 300);
  }
  if (document.readyState === "complete") later();
  else window.addEventListener("load", later, { once: true });
})();
