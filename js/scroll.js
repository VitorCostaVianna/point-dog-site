// Animações ligadas à rolagem (GSAP + ScrollTrigger).
// Melhoria progressiva: se as libs não carregarem ou o usuário preferir menos
// movimento, o site segue com o comportamento original (.reveal via main.js).
(function () {
  if (!window.gsap || !window.ScrollTrigger) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const { gsap, ScrollTrigger } = window;
  gsap.registerPlugin(ScrollTrigger);
  document.documentElement.classList.add("gsap-on");

  const mm = gsap.matchMedia();

  mm.add("(min-width: 900px)", () => {
    // Cards entram com inclinação 3D que "assenta" conforme rolam
    gsap.utils.toArray(".grid-3, .grid-4").forEach((grid) => {
      const cards = grid.querySelectorAll(".card");
      gsap.set(grid, { perspective: 1100 });
      gsap.from(cards, {
        opacity: 0, y: 70, rotationX: 18, transformOrigin: "50% 100%",
        stagger: 0.12, ease: "power3.out", duration: 1,
        scrollTrigger: { trigger: grid, start: "top 85%", toggleActions: "play none none none" },
      });
    });

    // Fotos com profundidade: giro sutil em Y + parallax interno
    gsap.utils.toArray(".panel-frame.has-photo").forEach((frame) => {
      gsap.fromTo(frame, { rotationY: -9, y: 40 }, {
        rotationY: 0, y: 0, ease: "none", transformPerspective: 1200,
        scrollTrigger: { trigger: frame, start: "top 95%", end: "center 55%", scrub: 0.3 },
      });
    });
  });

  // Todos os tamanhos
  gsap.utils.toArray(".panel-frame.has-photo .panel-photo").forEach((img) => {
    gsap.fromTo(img, { scale: 1.18, yPercent: -7 }, {
      scale: 1.18, yPercent: 7, ease: "none",
      scrollTrigger: { trigger: img.closest(".panel-frame"), start: "top bottom", end: "bottom top", scrub: true },
    });
  });

  // Hero: vídeo desce mais devagar e o texto sobe/desvanece ao rolar
  const hero = document.querySelector(".hero-video");
  if (hero) {
    const st = { trigger: hero, start: "top top", end: "bottom top", scrub: true };
    gsap.to(hero.querySelector(".container"), { yPercent: -12, opacity: 0.15, ease: "none", scrollTrigger: st });
    gsap.from(hero.querySelectorAll(".badge, h1, .lead, .hero-actions"), {
      y: 36, opacity: 0, duration: 0.9, stagger: 0.12, ease: "power3.out", delay: 0.15,
    });
  }

  // Cabeçalhos de seção e textos: revelação suave
  gsap.utils.toArray(".section-header, .section .container > div:not(.grid-3):not(.grid-4) > h2").forEach((el) => {
    gsap.from(el, { y: 36, opacity: 0, duration: 0.9, ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 88%" } });
  });

  // Fontes e imagens podem mudar a altura da página
  window.addEventListener("load", () => ScrollTrigger.refresh());
})();
