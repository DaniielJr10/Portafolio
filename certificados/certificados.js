/* ==========================================
  DANIEL LOPEZ | WEBSITE
   certificados.js — Certificates Page JavaScript
   ========================================== */

'use strict';

/* ==========================================
   CONSTANTS
   ========================================== */
const header    = document.getElementById('header');
const navMenu   = document.getElementById('nav-menu');
const navToggle = document.getElementById('nav-toggle');
const navLinks  = document.querySelectorAll('.nav__link');
const scrollTop = document.getElementById('scroll-top');
const filterBtns = document.querySelectorAll('.filter-btn');
const certCards  = document.querySelectorAll('.cert-card');

/* ==========================================
   NAVBAR — Always scrolled on this page
   ========================================== */
function handleHeaderScroll() {
  header.classList.add('scrolled');
}

/* ==========================================
   NAVBAR — Mobile toggle
   ========================================== */
function toggleMenu() {
  navMenu.classList.toggle('open');
  navToggle.classList.toggle('open');
  document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
}

function closeMenu() {
  navMenu.classList.remove('open');
  navToggle.classList.remove('open');
  document.body.style.overflow = '';
}

if (navToggle) navToggle.addEventListener('click', toggleMenu);
navLinks.forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && navMenu.classList.contains('open')) closeMenu();
});

/* ==========================================
   SCROLL TO TOP
   ========================================== */
function handleScrollTop() {
  if (!scrollTop) return;
  scrollTop.classList.toggle('visible', window.scrollY >= 300);
}

/* ==========================================
   SCROLL EVENT
   ========================================== */
window.addEventListener('scroll', () => {
  handleHeaderScroll();
  handleScrollTop();
}, { passive: true });

/* ==========================================
   FILTER SYSTEM
   ========================================== */
function filterCertificates(category) {
  certCards.forEach(card => {
    if (category === 'all' || card.dataset.category === category) {
      card.classList.remove('hidden');
      /* Restart entry animation */
      card.style.animation = 'none';
      card.offsetHeight; /* reflow */
      card.style.animation = '';
    } else {
      card.classList.add('hidden');
    }
  });
}

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    filterCertificates(btn.dataset.filter);
  });
});

/* ==========================================
   STATS COUNTER — Animated number count-up
   ========================================== */
function animateCounter(el, target, duration = 1400) {
  let start = 0;
  const step = target / (duration / 16);

  function update() {
    start += step;
    if (start >= target) {
      el.textContent = target;
      return;
    }
    el.textContent = Math.floor(start);
    requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

function initCounters() {
  const statsSection = document.querySelector('.certs-stats');
  if (!statsSection) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        document.querySelectorAll('.certs-stat__number').forEach(el => {
          animateCounter(el, parseInt(el.dataset.target, 10));
        });
        observer.disconnect();
      }
    });
  }, { threshold: 0.4 });

  observer.observe(statsSection);
}

/* ==========================================
   CARD ENTRANCE — Intersection Observer
   (staggered fade-in on scroll)
   ========================================== */
function initCardAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        entry.target.style.transitionDelay = `${i * 0.07}s`;
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  certCards.forEach(card => observer.observe(card));
}

/* ==========================================
   CURSOR DOT — Subtle effect (desktop)
   ========================================== */
function initCursorEffect() {
  if (!window.matchMedia('(pointer: fine)').matches) return;

  const dot = document.createElement('div');
  dot.style.cssText = `
    position: fixed;
    width: 8px; height: 8px;
    border-radius: 50%;
    background: rgba(77, 159, 255, 0.8);
    pointer-events: none;
    z-index: 9999;
    transform: translate(-50%, -50%);
    transition: opacity .3s, transform .15s;
    mix-blend-mode: screen;
  `;
  document.body.appendChild(dot);

  document.addEventListener('mousemove', (e) => {
    dot.style.left = e.clientX + 'px';
    dot.style.top  = e.clientY + 'px';
  });

  document.querySelectorAll('a, button, .cert-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      dot.style.transform = 'translate(-50%, -50%) scale(3)';
      dot.style.background = 'rgba(77, 159, 255, 0.3)';
    });
    el.addEventListener('mouseleave', () => {
      dot.style.transform = 'translate(-50%, -50%) scale(1)';
      dot.style.background = 'rgba(77, 159, 255, 0.8)';
    });
  });

  document.addEventListener('mouseleave', () => { dot.style.opacity = '0'; });
  document.addEventListener('mouseenter', () => { dot.style.opacity = '1'; });
}

/* ==========================================
   INIT
   ========================================== */
function init() {
  handleHeaderScroll();
  initCounters();
  initCardAnimations();
  initCursorEffect();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
