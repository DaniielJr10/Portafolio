/* ==========================================
  DANIEL LOPEZ | WEBSITE
   main.js — Main JavaScript
   ========================================== */

'use strict';

/* ==========================================
   CONSTANTS — DOM References
   ========================================== */
const header     = document.getElementById('header');
const navMenu    = document.getElementById('nav-menu');
const navToggle  = document.getElementById('nav-toggle');
const navLinks   = document.querySelectorAll('.nav__link');
const scrollTop  = document.getElementById('scroll-top');
const sections   = document.querySelectorAll('section[id]');

/* ==========================================
   NAVBAR — Scroll effect (glassmorphism)
   ========================================== */
function handleHeaderScroll() {
  if (window.scrollY >= 60) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
}

/* ==========================================
   NAVBAR — Mobile toggle
   ========================================== */
function toggleMenu() {
  navMenu.classList.toggle('open');
  navToggle.classList.toggle('open');

  // Bloquea scroll del body cuando menú está abierto
  document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
}

function closeMenu() {
  navMenu.classList.remove('open');
  navToggle.classList.remove('open');
  document.body.style.overflow = '';
}

if (navToggle) {
  navToggle.addEventListener('click', toggleMenu);
}

// Cerrar menú al hacer clic en un link
navLinks.forEach(link => {
  link.addEventListener('click', closeMenu);
});

// Cerrar menú al presionar Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && navMenu.classList.contains('open')) {
    closeMenu();
  }
});

/* ==========================================
   ACTIVE LINK — Scrollspy
   ========================================== */
function setActiveLink() {
  const scrollY = window.scrollY + window.innerHeight * 0.4;

  sections.forEach(section => {
    const sectionTop    = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const sectionId     = section.getAttribute('id');

    const correspondingLink = document.querySelector(`.nav__link[href="#${sectionId}"]`);
    if (!correspondingLink) return;

    if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
      navLinks.forEach(l => l.classList.remove('active-link'));
      correspondingLink.classList.add('active-link');
    }
  });
}

/* ==========================================
   SCROLL TO TOP — Visibility
   ========================================== */
function handleScrollTop() {
  if (!scrollTop) return;

  if (window.scrollY >= 300) {
    scrollTop.classList.add('visible');
  } else {
    scrollTop.classList.remove('visible');
  }
}

/* ==========================================
   SCROLL EVENTS — Centralized listener
   ========================================== */
function onScroll() {
  handleHeaderScroll();
  setActiveLink();
  handleScrollTop();
}

window.addEventListener('scroll', onScroll, { passive: true });

/* ==========================================
   INTERSECTION OBSERVER — Reveal on scroll
   ========================================== */
const revealOptions = {
  threshold: 0.15,
  rootMargin: '0px 0px -60px 0px',
};

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      revealObserver.unobserve(entry.target);
    }
  });
}, revealOptions);

// Observar elementos con clase .reveal
document.querySelectorAll('.reveal').forEach(el => {
  revealObserver.observe(el);
});

/* ==========================================
   SMOOTH SCROLL — Para anchors internos
   ========================================== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;

    const target = document.querySelector(targetId);
    if (!target) return;

    e.preventDefault();

    const navHeight = header ? header.offsetHeight : 0;
    const targetPos = target.getBoundingClientRect().top + window.scrollY - navHeight;

    window.scrollTo({
      top: targetPos,
      behavior: 'smooth',
    });
  });
});

/* ==========================================
   CURSOR DOT — Efecto sutil de cursor (desktop)
   ========================================== */
function initCursorEffect() {
  // Solo en dispositivos con puntero fino (mouse)
  if (!window.matchMedia('(pointer: fine)').matches) return;

  const dot = document.createElement('div');
  dot.className = 'cursor-dot';
  dot.style.cssText = `
    position: fixed;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: rgba(77, 159, 255, 0.8);
    pointer-events: none;
    z-index: 9999;
    transform: translate(-50%, -50%);
    transition: opacity .3s, transform .15s;
    mix-blend-mode: screen;
  `;
  document.body.appendChild(dot);

  let mouseX = 0, mouseY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top  = mouseY + 'px';
  });

  // Agrandar en links/botones
  document.querySelectorAll('a, button, .btn').forEach(el => {
    el.addEventListener('mouseenter', () => {
      dot.style.transform = 'translate(-50%, -50%) scale(3)';
      dot.style.background = 'rgba(77, 159, 255, 0.35)';
    });
    el.addEventListener('mouseleave', () => {
      dot.style.transform = 'translate(-50%, -50%) scale(1)';
      dot.style.background = 'rgba(77, 159, 255, 0.8)';
    });
  });

  document.addEventListener('mouseleave', () => {
    dot.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    dot.style.opacity = '1';
  });
}

/* ==========================================
   SKILLS — Animate bars on scroll
   ========================================== */
function initSkillBars() {
  const fills = document.querySelectorAll('.hskill__fill');
  if (!fills.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  fills.forEach(fill => observer.observe(fill));
}

/* ==========================================
   INIT
   ========================================== */
function init() {
  // Estado inicial del scroll
  onScroll();

  // Cursor effect
  initCursorEffect();

  // Skills bars
  initSkillBars();
}

// Lanzar cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
