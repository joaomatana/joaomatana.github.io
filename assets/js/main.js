(() => {
  'use strict';

  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  /* ---- Reveal-on-scroll + stat bar fills ---- */
  const targets = $$('.reveal');
  if ('IntersectionObserver' in window && targets.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          // animate stat bar fills
          if (entry.target.classList.contains('stats__bar')) {
            const fill = entry.target.dataset.fill || '0';
            requestAnimationFrame(() => {
              entry.target.style.setProperty('--fill', fill + '%');
            });
          }
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.18, rootMargin: '0px 0px -6% 0px' });
    targets.forEach((el) => io.observe(el));
  } else {
    targets.forEach((el) => {
      el.classList.add('is-in');
      if (el.classList.contains('stats__bar')) {
        el.style.setProperty('--fill', (el.dataset.fill || '0') + '%');
      }
    });
  }

  /* ---- Smooth scroll with topbar offset ---- */
  const topbar = document.querySelector('.topbar');
  $$('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const offset = topbar ? topbar.getBoundingClientRect().height : 0;
      const y = target.getBoundingClientRect().top + window.scrollY - offset - 16;
      window.scrollTo({ top: y, behavior: 'smooth' });
    });
  });

  /* ---- Footer year + ISO build hash ---- */
  const yearEl = document.querySelector('[data-year]');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const isoEl = document.querySelector('[data-iso]');
  if (isoEl) {
    const d = new Date();
    isoEl.textContent =
      d.getFullYear().toString().slice(-2) +
      String(d.getMonth() + 1).padStart(2, '0') +
      String(d.getDate()).padStart(2, '0');
  }

  /* ---- Konami code easter egg (↑↑↓↓←→←→ba) ---- */
  const konami = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
  let buf = [];
  window.addEventListener('keydown', (e) => {
    buf.push(e.key);
    if (buf.length > konami.length) buf.shift();
    if (buf.join(',').toLowerCase() === konami.join(',').toLowerCase()) {
      document.body.style.transition = 'filter 600ms';
      document.body.style.filter = 'hue-rotate(120deg) saturate(1.4)';
      setTimeout(() => { document.body.style.filter = ''; }, 2400);
      buf = [];
    }
  });
})();
