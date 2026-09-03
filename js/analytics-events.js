(function () {
  'use strict';

  if (typeof window.gtag !== 'function') return;

  function track(eventName, parameters) {
    window.gtag('event', eventName, parameters || {});
  }

  function getLinkLabel(link) {
    return (link.getAttribute('aria-label') || link.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 100);
  }

  document.addEventListener('click', function (event) {
    const link = event.target.closest('a');
    const button = event.target.closest('button');

    if (link) {
      const href = link.href;
      const url = new URL(href, window.location.href);
      const label = getLinkLabel(link);
      const isDownload = link.hasAttribute('download') || /\.pdf(?:$|\?)/i.test(url.pathname);
      const isExternal = url.origin !== window.location.origin;

      if (isDownload) {
        track('portfolio_file_download', {
          file_name: url.pathname.split('/').pop() || label,
          file_extension: 'pdf',
          link_text: label
        });
      } else if (isExternal) {
        track('portfolio_outbound_click', {
          link_url: href,
          link_domain: url.hostname,
          link_text: label
        });
      } else if (url.pathname !== window.location.pathname || url.hash) {
        track('navigation_click', {
          link_url: href,
          link_text: label
        });
      }
    }

    if (button) {
      const filter = button.dataset.filter;
      track('button_click', {
        button_text: (button.textContent || '').trim(),
        button_type: filter ? 'certificate_filter' : 'interface'
      });

      if (filter) {
        track('certificate_filter', { filter_category: filter });
      }
    }
  });

  const trackedDepths = new Set();
  function trackScrollDepth() {
    const pageHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (pageHeight <= 0) return;

    const depth = Math.min(100, Math.round((window.scrollY / pageHeight) * 100));
    [25, 50, 75, 90].forEach(function (threshold) {
      if (depth >= threshold && !trackedDepths.has(threshold)) {
        trackedDepths.add(threshold);
        track('portfolio_scroll_depth', { percent_scrolled: threshold });
      }
    });
  }

  window.addEventListener('scroll', trackScrollDepth, { passive: true });

  const sections = document.querySelectorAll('main section[id]');
  if ('IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          track('section_view', { section_id: entry.target.id });
          sectionObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });

    sections.forEach(function (section) { sectionObserver.observe(section); });
  }
})();
