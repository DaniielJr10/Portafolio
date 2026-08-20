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
  navMenu.classList.toggle('open');
  navToggle.classList.toggle('open');
  document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
});

document.querySelectorAll('.nav__link').forEach(link => link.addEventListener('click', closeMenu));

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