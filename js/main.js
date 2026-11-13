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

  const heroVideo = document.getElementById("hero-video");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (heroVideo) {
    heroVideo.addEventListener("playing", () => heroVideo.classList.add("is-ready"), { once: true });
    if (reducedMotion) {
      heroVideo.removeAttribute("autoplay");
      heroVideo.pause();
      heroVideo.addEventListener("loadeddata", () => heroVideo.classList.add("is-ready"), { once: true });
    } else {
      heroVideo.play().catch(() => {});
    }
  }
});
