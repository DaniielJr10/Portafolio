/* ==========================================
   DANIEL LOPEZ | PORTFOLIO
   contacto.js — Contact Page JavaScript
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

window.addEventListener('scroll', handleScrollTop, { passive: true });

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

  document.querySelectorAll('a, button, .contact-channel').forEach(el => {
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
   LOCATION CARD — Live Colombia time (UTC−5)
   ========================================== */
function initLocalTime() {
  const timeEl = document.getElementById('local-time');
  if (!timeEl) return;

  function updateTime() {
    const now = new Date();
    const colombiaTime = new Date(
      now.toLocaleString('en-US', { timeZone: 'America/Bogota' })
    );
    const h = colombiaTime.getHours();
    const m = String(colombiaTime.getMinutes()).padStart(2, '0');
    const s = String(colombiaTime.getSeconds()).padStart(2, '0');
    const ampm = h >= 12 ? 'PM' : 'AM';
    const h12 = String(h % 12 || 12).padStart(2, '0');
    timeEl.textContent = `${h12}:${m}:${s} ${ampm}`;
  }

  updateTime();
  setInterval(updateTime, 1000);
}

/* ==========================================
   INIT
   ========================================== */
function init() {
  initCursorEffect();
  initLocalTime();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}


/* ==========================================
   NAVBAR — Scroll glassmorphism
   ========================================== */
function handleHeaderScroll() {
  if (window.scrollY >= 60) {
    header.classList.add('scrolled');
  } else {
    header.classList.add('scrolled'); // always visible on contact page
  }
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
  if (window.scrollY >= 300) {
    scrollTop.classList.add('visible');
  } else {
    scrollTop.classList.remove('visible');
  }
}

/* ==========================================
   SCROLL EVENTS
   ========================================== */
window.addEventListener('scroll', () => {
  handleHeaderScroll();
  handleScrollTop();
}, { passive: true });

/* ==========================================
   FORM — Validation helpers
   ========================================== */
function showFeedback(type, message) {
  feedback.className = `form-feedback ${type}`;
  feedback.innerHTML = type === 'success'
    ? `<i class="fas fa-check-circle"></i> ${message}`
    : `<i class="fas fa-exclamation-circle"></i> ${message}`;
}

function hideFeedback() {
  feedback.className = 'form-feedback';
  feedback.textContent = '';
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/* ==========================================
   FORM — Submit handler
   (Demo: simulates a network request)
   ========================================== */
if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideFeedback();

    const name    = form.name.value.trim();
    const email   = form.email.value.trim();
    const subject = form.subject.value.trim();
    const message = form.message.value.trim();

    // Basic validation
    if (!name) {
      showFeedback('error', 'Please enter your full name.');
      form.name.focus();
      return;
    }
    if (!validateEmail(email)) {
      showFeedback('error', 'Please enter a valid email address.');
      form.email.focus();
      return;
    }
    if (!subject) {
      showFeedback('error', 'Please enter a subject.');
      form.subject.focus();
      return;
    }
    if (message.length < 10) {
      showFeedback('error', 'Message must be at least 10 characters.');
      form.message.focus();
      return;
    }

    // Loading state
    btnSend.classList.add('loading');
    btnSend.disabled = true;

    try {
      // ---- Replace this block with your real API call (e.g. EmailJS, Formspree) ----
      await new Promise(resolve => setTimeout(resolve, 1800)); // simulated delay
      // -------------------------------------------------------------------------------

      showFeedback('success', 'Your message was sent! I\'ll get back to you soon 🚀');
      form.reset();
    } catch {
      showFeedback('error', 'Something went wrong. Please try again or use one of the contact channels.');
    } finally {
      btnSend.classList.remove('loading');
      btnSend.disabled = false;
    }
  });

  // Clear feedback on any input change
  form.addEventListener('input', () => {
    if (feedback.classList.contains('error')) hideFeedback();
  });
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

  document.querySelectorAll('a, button, .btn-send, .contact-channel').forEach(el => {
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
  initCursorEffect();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
