/* ==========================================
  DANIEL LOPEZ | WEBSITE
   acercade.js — About Me Page JavaScript
   ========================================== */

'use strict';

/* ==========================================
   DOM REFERENCES
   ========================================== */
const header    = document.getElementById('header');
const navMenu   = document.getElementById('nav-menu');
const navToggle = document.getElementById('nav-toggle');
const navLinks  = document.querySelectorAll('.nav__link');
const scrollTopBtn = document.getElementById('scroll-top');

/* ==========================================
   NAVBAR — Mobile toggle
   ========================================== */
function toggleMenu() {
  const isOpen = navMenu.classList.toggle('open');
  navToggle.classList.toggle('open', isOpen);
  navToggle.setAttribute('aria-expanded', isOpen);
  navToggle.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
  document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
}

function closeMenu() {
  navMenu.classList.remove('open');
  navToggle.classList.remove('open');
  navToggle.setAttribute('aria-expanded', 'false');
  navToggle.setAttribute('aria-label', 'Open navigation menu');
  document.body.style.overflow = '';
}

if (navToggle) {
  navToggle.addEventListener('click', toggleMenu);
}

navLinks.forEach(link => link.addEventListener('click', closeMenu));

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && navMenu.classList.contains('open')) {
    closeMenu();
  }
});

document.addEventListener('click', (e) => {
  if (navMenu.classList.contains('open') && !navMenu.contains(e.target) && !navToggle.contains(e.target)) closeMenu();
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 768) closeMenu();
});

/* ==========================================
   SCROLL TO TOP — Visibility
   ========================================== */
function handleScrollTop() {
  if (!scrollTopBtn) return;
  if (window.scrollY >= 300) {
    scrollTopBtn.classList.add('visible');
  } else {
    scrollTopBtn.classList.remove('visible');
  }
}

/* ==========================================
   SCROLL EVENTS
   ========================================== */
window.addEventListener('scroll', handleScrollTop, { passive: true });

/* ==========================================
   INTERSECTION OBSERVER — Reveal on scroll
   ========================================== */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.12,
  rootMargin: '0px 0px -60px 0px',
});

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ==========================================
   SKILL BARS — Animate on scroll
   ========================================== */
function initSkillBars() {
  const fills = document.querySelectorAll('.skill-item__fill');
  if (!fills.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Pequeño delay escalonado para efecto waterfall
        const index = [...fills].indexOf(entry.target);
        setTimeout(() => {
          entry.target.classList.add('in-view');
        }, index * 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  fills.forEach(fill => observer.observe(fill));
}

/* ==========================================
   VALUE CARDS — Staggered entrance
   ========================================== */
function initValueCards() {
  const cards = document.querySelectorAll('.value-card');
  if (!cards.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  cards.forEach((card, i) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = `opacity .5s ease ${i * 0.1}s, transform .5s ease ${i * 0.1}s`;
    observer.observe(card);
  });
}

/* ==========================================
   TOOL CHIPS — Staggered entrance
   ========================================== */
function initToolChips() {
  const chips = document.querySelectorAll('.tool-chip');
  if (!chips.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const chip = entry.target;
        const idx = [...chips].indexOf(chip);
        setTimeout(() => {
          chip.style.opacity = '1';
          chip.style.transform = 'scale(1) translateY(0)';
        }, idx * 50);
        observer.unobserve(chip);
      }
    });
  }, { threshold: 0.2 });

  chips.forEach(chip => {
    chip.style.opacity = '0';
    chip.style.transform = 'scale(0.85) translateY(12px)';
    chip.style.transition = 'opacity .4s ease, transform .4s ease';
    observer.observe(chip);
  });
}

/* ==========================================
   STAT CARDS — Counter animation
   ========================================== */
function animateCounter(el, target, suffix, duration) {
  let start = 0;
  const step = target / (duration / 16);

  const update = () => {
    start += step;
    if (start >= target) {
      el.textContent = target + suffix;
      return;
    }
    el.textContent = Math.floor(start) + suffix;
    requestAnimationFrame(update);
  };

  requestAnimationFrame(update);
}

function initStatCounters() {
  const numbers = document.querySelectorAll('.stat-card__number');
  if (!numbers.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const rawText = el.textContent.trim(); // e.g. "2+"
        const numericVal = parseInt(rawText.replace(/\D/g, ''), 10);
        const suffix = rawText.replace(/[0-9]/g, '');
        animateCounter(el, numericVal, suffix, 900);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  numbers.forEach(n => observer.observe(n));
}

/* ==========================================
   CURSOR DOT — Efecto sutil (desktop)
   ========================================== */
function initCursorEffect() {
  if (!window.matchMedia('(pointer: fine)').matches) return;

  const dot = document.createElement('div');
  dot.style.cssText = `
    position: fixed;
    width: 8px; height: 8px;
    border-radius: 50%;
    background: rgba(77,159,255,0.8);
    pointer-events: none;
    z-index: 9999;
    transform: translate(-50%,-50%);
    transition: opacity .3s, transform .15s;
    mix-blend-mode: screen;
  `;
  document.body.appendChild(dot);

  document.addEventListener('mousemove', (e) => {
    dot.style.left = e.clientX + 'px';
    dot.style.top  = e.clientY + 'px';
  });

  document.querySelectorAll('a, button, .btn, .tool-chip, .value-card, .skill-item').forEach(el => {
    el.addEventListener('mouseenter', () => {
      dot.style.transform = 'translate(-50%,-50%) scale(3)';
      dot.style.background = 'rgba(77,159,255,0.35)';
    });
    el.addEventListener('mouseleave', () => {
      dot.style.transform = 'translate(-50%,-50%) scale(1)';
      dot.style.background = 'rgba(77,159,255,0.8)';
    });
  });

  document.addEventListener('mouseleave', () => { dot.style.opacity = '0'; });
  document.addEventListener('mouseenter', () => { dot.style.opacity = '1'; });
}

/* ==========================================
   SMOOTH SCROLL — anchors internos
   ========================================== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const target = document.querySelector(targetId);
    if (!target) return;
    e.preventDefault();
    const navHeight = header ? header.offsetHeight : 0;
    const targetPos = target.getBoundingClientRect().top + window.scrollY - navHeight;
    window.scrollTo({ top: targetPos, behavior: 'smooth' });
  });
});

/* ==========================================
   INIT
   ========================================== */
function init() {
  handleScrollTop();
  initSkillBars();
  initValueCards();
  initToolChips();
  initStatCounters();
  initCursorEffect();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
