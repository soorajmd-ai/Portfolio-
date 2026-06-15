/* ═══════════════════════════════════════════════════════════════
   SOORAJ MD PORTFOLIO — main.js
   ═══════════════════════════════════════════════════════════════ */

"use strict";

/* ─── CUSTOM CURSOR ───────────────────────────────────────────── */
(function initCursor() {
  const dot     = document.getElementById("cursor-dot");
  const outline = document.getElementById("cursor-outline");
  if (!dot || !outline) return;

  let mouseX = 0, mouseY = 0;
  let outX = 0, outY = 0;
  let raf;

  document.addEventListener("mousemove", e => {
    mouseX = e.clientX; mouseY = e.clientY;
    dot.style.left = mouseX + "px";
    dot.style.top  = mouseY + "px";
  });

  function animateOutline() {
    outX += (mouseX - outX) * 0.12;
    outY += (mouseY - outY) * 0.12;
    outline.style.left = outX + "px";
    outline.style.top  = outY + "px";
    raf = requestAnimationFrame(animateOutline);
  }
  animateOutline();

  const hoverables = "a, button, .project-card, .contact-card, .skill-category, .stat-card, .tag, .stag, .chip";
  document.querySelectorAll(hoverables).forEach(el => {
    el.addEventListener("mouseenter", () => document.body.classList.add("cursor-hovered"));
    el.addEventListener("mouseleave", () => document.body.classList.remove("cursor-hovered"));
  });
})();

/* ─── NAVBAR SCROLL ───────────────────────────────────────────── */
(function initNavbar() {
  const nav = document.getElementById("navbar");
  if (!nav) return;
  const onScroll = () => {
    nav.classList.toggle("scrolled", window.scrollY > 30);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
})();

/* ─── HAMBURGER MENU ──────────────────────────────────────────── */
(function initHamburger() {
  const btn  = document.getElementById("hamburger");
  const menu = document.getElementById("mobile-menu");
  if (!btn || !menu) return;

  btn.addEventListener("click", () => {
    const open = menu.classList.toggle("open");
    btn.classList.toggle("open", open);
    document.body.style.overflow = open ? "hidden" : "";
  });

  document.querySelectorAll(".mob-link").forEach(link => {
    link.addEventListener("click", () => {
      menu.classList.remove("open");
      btn.classList.remove("open");
      document.body.style.overflow = "";
    });
  });
})();

/* ─── HERO CANVAS — PARTICLE FIELD ───────────────────────────── */
(function initHeroCanvas() {
  const canvas = document.getElementById("hero-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  let W, H, particles, lines;
  const PARTICLE_COUNT = 90;
  const CONNECTION_DIST = 150;
  const MOUSE = { x: -9999, y: -9999 };

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  class Particle {
    constructor() { this.reset(true); }
    reset(init) {
      this.x  = Math.random() * W;
      this.y  = init ? Math.random() * H : (Math.random() > 0.5 ? -10 : H + 10);
      this.vx = (Math.random() - 0.5) * 0.35;
      this.vy = (Math.random() - 0.5) * 0.35;
      this.r  = Math.random() * 1.8 + 0.5;
      this.alpha = Math.random() * 0.6 + 0.2;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < -20 || this.x > W + 20 || this.y < -20 || this.y > H + 20) {
        this.reset(false);
      }
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0,212,255,${this.alpha})`;
      ctx.fill();
    }
  }

  function init() {
    resize();
    particles = Array.from({ length: PARTICLE_COUNT }, () => new Particle());
  }

  function drawLines() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d  = Math.sqrt(dx*dx + dy*dy);
        if (d < CONNECTION_DIST) {
          const alpha = (1 - d / CONNECTION_DIST) * 0.25;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0,212,255,${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }
  }

  function drawMouseLines() {
    particles.forEach(p => {
      const dx = p.x - MOUSE.x;
      const dy = p.y - MOUSE.y;
      const d  = Math.sqrt(dx*dx + dy*dy);
      if (d < 160) {
        const alpha = (1 - d / 160) * 0.5;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(MOUSE.x, MOUSE.y);
        ctx.strokeStyle = `rgba(123,97,255,${alpha})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    });
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    drawLines();
    drawMouseLines();
    requestAnimationFrame(loop);
  }

  window.addEventListener("resize", init, { passive: true });
  window.addEventListener("mousemove", e => {
    const rect = canvas.getBoundingClientRect();
    MOUSE.x = e.clientX - rect.left;
    MOUSE.y = e.clientY - rect.top;
  });

  init();
  loop();
})();

/* ─── TYPED TEXT ──────────────────────────────────────────────── */
(function initTyped() {
  const el = document.getElementById("typed-text");
  if (!el) return;

  const phrases = [
    "Real-Time Audio Pipelines",
    "Embedded C++ Systems",
    "DSP Optimization",
    "Automotive-Grade Software",
    "SIMD-Accelerated Code",
  ];

  let pIdx = 0, cIdx = 0, deleting = false;
  const SPEED_TYPE = 65, SPEED_DEL = 35, PAUSE = 2000;

  function tick() {
    const current = phrases[pIdx];
    if (!deleting) {
      el.textContent = current.slice(0, ++cIdx);
      if (cIdx === current.length) {
        deleting = true;
        setTimeout(tick, PAUSE);
        return;
      }
    } else {
      el.textContent = current.slice(0, --cIdx);
      if (cIdx === 0) {
        deleting = false;
        pIdx = (pIdx + 1) % phrases.length;
      }
    }
    setTimeout(tick, deleting ? SPEED_DEL : SPEED_TYPE);
  }
  tick();
})();

/* ─── SCROLL REVEAL ───────────────────────────────────────────── */
(function initReveal() {
  const revealEls = document.querySelectorAll(".reveal-up, .reveal-left, .reveal-right");

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -60px 0px" });

  revealEls.forEach(el => io.observe(el));
})();

/* ─── SKILL BAR ANIMATION ─────────────────────────────────────── */
(function initSkillBars() {
  const fills = document.querySelectorAll(".skill-bar-fill");

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill = entry.target;
        const w    = fill.dataset.width;
        setTimeout(() => { fill.style.width = w + "%"; }, 200);
        io.unobserve(fill);
      }
    });
  }, { threshold: 0.4 });

  fills.forEach(f => io.observe(f));
})();

/* ─── COUNTER ANIMATION ───────────────────────────────────────── */
(function initCounters() {
  const stats = document.querySelectorAll(".stat-value");

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el  = entry.target;
      const end = parseInt(el.dataset.count, 10);
      let   cur = 0;
      const dur = 1400;
      const step = end / (dur / 16);
      const timer = setInterval(() => {
        cur = Math.min(cur + step, end);
        el.textContent = Math.floor(cur);
        if (cur >= end) clearInterval(timer);
      }, 16);
      io.unobserve(el);
    });
  }, { threshold: 0.5 });

  stats.forEach(s => io.observe(s));
})();

/* ─── AUDIO WAVE CANVAS ───────────────────────────────────────── */
(function initWaveCanvas() {
  const canvas = document.getElementById("wave-canvas-1");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  let t = 0;
  const W = canvas.width, H = canvas.height;

  function drawWave() {
    ctx.clearRect(0, 0, W, H);

    // Gradient fill
    const grad = ctx.createLinearGradient(0, 0, W, 0);
    grad.addColorStop(0,   "rgba(0,212,255,0.05)");
    grad.addColorStop(0.5, "rgba(0,212,255,0.15)");
    grad.addColorStop(1,   "rgba(123,97,255,0.05)");

    // Wave 1
    ctx.beginPath();
    ctx.moveTo(0, H / 2);
    for (let x = 0; x <= W; x++) {
      const y = H / 2
        + Math.sin(x * 0.025 + t)         * 14
        + Math.sin(x * 0.055 + t * 1.3)   * 7
        + Math.sin(x * 0.01  + t * 0.7)   * 10;
      ctx.lineTo(x, y);
    }
    ctx.lineTo(W, H);
    ctx.lineTo(0, H);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    // Stroke
    ctx.beginPath();
    ctx.moveTo(0, H / 2);
    for (let x = 0; x <= W; x++) {
      const y = H / 2
        + Math.sin(x * 0.025 + t)         * 14
        + Math.sin(x * 0.055 + t * 1.3)   * 7
        + Math.sin(x * 0.01  + t * 0.7)   * 10;
      ctx.lineTo(x, y);
    }
    ctx.strokeStyle = "rgba(0,212,255,0.6)";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Wave 2 (purple)
    ctx.beginPath();
    ctx.moveTo(0, H / 2);
    for (let x = 0; x <= W; x++) {
      const y = H / 2
        + Math.sin(x * 0.03 + t * 1.2 + 1.5) * 9
        + Math.sin(x * 0.07 + t * 0.9)        * 5;
      ctx.lineTo(x, y);
    }
    ctx.strokeStyle = "rgba(123,97,255,0.4)";
    ctx.lineWidth = 1;
    ctx.stroke();

    t += 0.025;
    requestAnimationFrame(drawWave);
  }

  drawWave();
})();

/* ─── ACTIVE NAV LINK HIGHLIGHT ───────────────────────────────── */
(function initActiveNav() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.style.color = "";
          if (link.getAttribute("href") === "#" + entry.target.id) {
            link.style.color = "var(--accent-cyan)";
          }
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => io.observe(s));
})();

/* ─── CARD TILT EFFECT ────────────────────────────────────────── */
(function initTilt() {
  const cards = document.querySelectorAll(".project-card, .skill-category, .contact-card");

  cards.forEach(card => {
    card.addEventListener("mousemove", e => {
      const rect   = card.getBoundingClientRect();
      const cx     = rect.left + rect.width  / 2;
      const cy     = rect.top  + rect.height / 2;
      const dx     = (e.clientX - cx) / (rect.width  / 2);
      const dy     = (e.clientY - cy) / (rect.height / 2);
      card.style.transform = `translateY(-6px) rotateX(${-dy * 4}deg) rotateY(${dx * 4}deg)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });
})();

/* ─── SMOOTH SECTION TRANSITIONS ─────────────────────────────── */
(function initSmoothNav() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", e => {
      const id  = anchor.getAttribute("href").slice(1);
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 72;
      window.scrollTo({ top, behavior: "smooth" });
    });
  });
})();
