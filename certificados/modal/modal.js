/* ==========================================
   DANIEL LOPEZ | PORTFOLIO
   modal.js — Certificate Viewer Modal
   ========================================== */

'use strict';

/* ==========================================
   ELEMENTS
   ========================================== */
const modal        = document.getElementById('cert-modal');
const backdrop     = document.getElementById('modal-backdrop');
const modalClose   = document.getElementById('modal-close');
const modalIframe  = document.getElementById('modal-iframe');
const modalLoader  = document.getElementById('modal-loader');
const modalTitle   = document.getElementById('modal-title');
const modalLabel   = document.getElementById('modal-label');
const modalIcon    = document.getElementById('modal-icon');
const modalIconWrap= document.getElementById('modal-icon-wrap');
const modalDownload= document.getElementById('modal-download');

/* ==========================================
   OPEN MODAL
   ========================================== */
function openModal({ pdf, title, label, icon, color }) {
  /* Populate header */
  modalTitle.textContent   = title;
  modalLabel.textContent   = label;
  modalIcon.className      = icon;
  modalIconWrap.style.background = `linear-gradient(135deg, ${color}cc, ${color})`;
  modalIconWrap.style.boxShadow  = `0 4px 20px ${color}66`;

  /* Download button */
  modalDownload.href     = pdf;
  modalDownload.download = title;

  /* Reset iframe and show loader */
  modalIframe.classList.remove('loaded');
  modalLoader.classList.remove('hidden');
  modalIframe.src = '';

  /* Open modal */
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';

  /* Load PDF after paint — #view=FitV forces vertical fit */
  requestAnimationFrame(() => {
    modalIframe.src = pdf + '#toolbar=1&navpanes=0&view=FitV&zoom=page-fit';
  });
}

/* ==========================================
   CLOSE MODAL
   ========================================== */
function closeModal() {
  modal.classList.remove('open');
  document.body.style.overflow = '';

  /* Clear iframe after transition to save memory */
  setTimeout(() => {
    modalIframe.src = '';
    modalIframe.classList.remove('loaded');
    modalLoader.classList.remove('hidden');
  }, 400);
}

/* ==========================================
   IFRAME LOAD EVENT
   ========================================== */
modalIframe.addEventListener('load', () => {
  if (!modalIframe.src || modalIframe.src === window.location.href) return;
  modalIframe.classList.add('loaded');
  modalLoader.classList.add('hidden');
});

/* ==========================================
   TRIGGER — Cert card links
   ========================================== */
document.querySelectorAll('.cert-card__link[data-modal-pdf]').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    openModal({
      pdf  : link.dataset.modalPdf,
      title: link.dataset.modalTitle,
      label: link.dataset.modalLabel,
      icon : link.dataset.modalIcon,
      color: link.dataset.modalColor,
    });
  });
});

/* ==========================================
   CLOSE TRIGGERS
   ========================================== */
modalClose.addEventListener('click', closeModal);
backdrop.addEventListener('click', closeModal);

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
});

/* ==========================================
   PREVENT CLOSE when clicking inside panel
   ========================================== */
document.querySelector('.cert-modal__panel').addEventListener('click', (e) => {
  e.stopPropagation();
});
