'use strict';

const navMenu = document.getElementById('nav-menu');
const navToggle = document.getElementById('nav-toggle');
const scrollTop = document.getElementById('scroll-top');

function closeMenu() {
  navMenu.classList.remove('open');
  navToggle.classList.remove('open');
  document.body.style.overflow = '';
}

navToggle.addEventListener('click', () => {
  const isOpen = navMenu.classList.toggle('open');
  navToggle.classList.toggle('open', isOpen);
  navToggle.setAttribute('aria-expanded', isOpen);
  navToggle.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
  document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
});

document.querySelectorAll('.nav__link').forEach(link => link.addEventListener('click', closeMenu));

document.addEventListener('click', event => {
  if (navMenu.classList.contains('open') && !navMenu.contains(event.target) && !navToggle.contains(event.target)) closeMenu();
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 768) closeMenu();
});

window.addEventListener('scroll', () => {
  scrollTop.classList.toggle('visible', window.scrollY >= 300);
}, { passive: true });

scrollTop.addEventListener('click', event => {
  event.preventDefault();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach(element => revealObserver.observe(element));