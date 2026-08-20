/*   modal.js - Certificate Viewer (PDF.js)==========================================
  DANIEL LOPEZ | WEBSITE
   modal.js � Certificate Viewer (PDF.js)
   ========================================== */

'use strict';

import * as pdfjsLib from 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.min.mjs';

/* Worker necesario para PDF.js */
pdfjsLib.GlobalWorkerOptions.workerSrc =
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.worker.min.mjs';

/* ==========================================
   ELEMENTS
   ========================================== */
const modal         = document.getElementById('cert-modal');
const backdrop      = document.getElementById('modal-backdrop');
const modalClose    = document.getElementById('modal-close');
const modalLoader   = document.getElementById('modal-loader');
const modalTitle    = document.getElementById('modal-title');
const modalLabel    = document.getElementById('modal-label');
const modalIcon     = document.getElementById('modal-icon');
const modalIconWrap = document.getElementById('modal-icon-wrap');
const modalDownload = document.getElementById('modal-download');
const canvasWrap    = document.getElementById('modal-canvas-wrap');
const btnZoomIn     = document.getElementById('modal-zoom-in');
const btnZoomOut    = document.getElementById('modal-zoom-out');
const btnZoomReset  = document.getElementById('modal-zoom-reset');
const zoomValue     = document.getElementById('modal-zoom-value');

/* ==========================================
   STATE
   ========================================== */
let currentZoom = 1.4;
const ZOOM_STEP = 0.2;
const ZOOM_MIN  = 0.5;
const ZOOM_MAX  = 3.0;
const BASE_ZOOM = 1.4;

let pdfDoc     = null;
let renderTask = null;

/* ==========================================
   RENDER � dibuja todas las paginas en canvas
   ========================================== */
async function renderAllPages() {
  if (!pdfDoc) return;

  if (renderTask) { renderTask.cancel(); renderTask = null; }

  canvasWrap.innerHTML = '';

  for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
    const page     = await pdfDoc.getPage(pageNum);
    const viewport = page.getViewport({ scale: currentZoom });

    const canvas     = document.createElement('canvas');
    canvas.className = 'pdf-canvas';
    canvas.width     = viewport.width;
    canvas.height    = viewport.height;
    canvasWrap.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    renderTask = page.render({ canvasContext: ctx, viewport });
    try {
      await renderTask.promise;
    } catch (e) {
      if (e?.name !== 'RenderingCancelledException') console.warn(e);
    }
    renderTask = null;
  }

  modalLoader.classList.add('hidden');
}

/* ==========================================
   ZOOM
   ========================================== */
function updateZoomLabel() {
  if (zoomValue) zoomValue.textContent = Math.round(currentZoom / BASE_ZOOM * 100) + '%';
}

btnZoomIn.addEventListener('click', () => {
  if (currentZoom < ZOOM_MAX) {
    currentZoom = Math.min(+(currentZoom + ZOOM_STEP).toFixed(1), ZOOM_MAX);
    updateZoomLabel();
    renderAllPages();
  }
});

btnZoomOut.addEventListener('click', () => {
  if (currentZoom > ZOOM_MIN) {
    currentZoom = Math.max(+(currentZoom - ZOOM_STEP).toFixed(1), ZOOM_MIN);
    updateZoomLabel();
    renderAllPages();
  }
});

btnZoomReset.addEventListener('click', () => {
  currentZoom = BASE_ZOOM;
  updateZoomLabel();
  renderAllPages();
});

/* ==========================================
   OPEN MODAL
   ========================================== */
async function openModal({ pdf, title, label, icon, color }) {
  modalTitle.textContent  = title;
  modalLabel.textContent  = label;
  modalIcon.className     = icon;
  modalIconWrap.style.background = `linear-gradient(135deg, ${color}cc, ${color})`;
  modalIconWrap.style.boxShadow  = `0 4px 20px ${color}66`;

  modalDownload.href     = pdf;
  modalDownload.download = title + '.pdf';

  pdfDoc      = null;
  currentZoom = BASE_ZOOM;
  updateZoomLabel();
  canvasWrap.innerHTML = '';
  modalLoader.classList.remove('hidden');

  modal.classList.add('open');
  document.body.style.overflow = 'hidden';

  try {
    pdfDoc = await pdfjsLib.getDocument(pdf).promise;
    await renderAllPages();
  } catch (err) {
    console.error('Error al cargar el PDF:', err);
    modalLoader.innerHTML = '<p class="modal-loader__error">Error al cargar el certificado.</p>';
  }
}

/* ==========================================
   CLOSE MODAL
   ========================================== */
function closeModal() {
  modal.classList.remove('open');
  document.body.style.overflow = '';

  setTimeout(() => {
    canvasWrap.innerHTML = '';
    pdfDoc = null;
    modalLoader.classList.remove('hidden');
    modalLoader.innerHTML = `
      <div class="cert-modal__spinner"></div>
      <p>Loading certificate...</p>`;
  }, 400);
}

/* ==========================================
   TRIGGERS � Tarjetas de certificados
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
   CERRAR
   ========================================== */
modalClose.addEventListener('click', closeModal);
backdrop.addEventListener('click', closeModal);
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
});
