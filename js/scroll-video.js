// Seção "scrub": a rolagem controla o avanço do vídeo.
// Melhoria progressiva: sem GSAP, sem JS, com movimento reduzido ou erro no vídeo,
// a seção continua estática (poster + textos + botão), sem perder informação.
(function () {
  const section = document.getElementById("scrub");
  const video = document.getElementById("scrub-video");
  if (!section || !video) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  function start() {
    if (!window.gsap || !window.ScrollTrigger || video.dataset.started) return;
    video.dataset.started = "1";
    const { gsap, ScrollTrigger } = window;
    gsap.registerPlugin(ScrollTrigger);

    const w = window.innerWidth;
    video.src = w >= 1200 ? video.dataset.srcLg : w >= 700 ? video.dataset.srcMd : video.dataset.srcSm;
    video.preload = "auto";

    video.addEventListener("error", fallback, { once: true });
    video.addEventListener("loadedmetadata", () => {
      if (!isFinite(video.duration) || video.duration <= 0) return fallback();
      activate();
    }, { once: true });
    video.load();
  }

  function fallback() {
    document.body.classList.remove("scrub-active");
    section.classList.remove("is-scrub");
  }

  function activate() {
    const { gsap, ScrollTrigger } = window;
    const blocks = [...section.querySelectorAll(".scrub-block")];
    const cta = section.querySelector(".scrub-cta");
    section.classList.add("is-scrub");

    let target = 0, current = 0, shown = -1;
    const dur = video.duration;

    function setText(p) {
      blocks.forEach((b) => b.classList.toggle("is-on", p >= +b.dataset.from && p < +b.dataset.to));
      cta.classList.toggle("is-on", p >= 0.85);
    }
    setText(0);

    ScrollTrigger.create({
      trigger: section,
      start: "top top+=72",
      end: "bottom bottom",
      onUpdate: (self) => { target = self.progress; setText(target); },
      onToggle: (self) => document.body.classList.toggle("scrub-active", self.isActive),
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

  // GSAP carrega com defer; espera o load para garantir
  if (document.readyState === "complete") start();
  else window.addEventListener("load", start, { once: true });
})();
