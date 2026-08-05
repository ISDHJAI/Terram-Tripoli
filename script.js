/* ---------- Menú móvil ---------- */
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
menuToggle.addEventListener('click', () => {
  navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
  navLinks.style.flexDirection = 'column';
  navLinks.style.position = 'absolute';
  navLinks.style.top = '72px';
  navLinks.style.left = '0';
  navLinks.style.right = '0';
  navLinks.style.background = '#fff';
  navLinks.style.padding = '20px 24px';
  navLinks.style.borderBottom = '1px solid #e9e0d5';
});

/* ---------- Tabs Distribución ---------- */
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(btn.dataset.tab).classList.add('active');
    if (typeof gtag === 'function') {
      gtag('event', 'select_content', { content_type: 'distribucion_tab', item_id: btn.dataset.tab });
    }
  });
});

/* ---------- Lightbox galería ---------- */
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
document.querySelectorAll('.gallery-grid figure').forEach(fig => {
  fig.addEventListener('click', () => {
    const img = fig.querySelector('img');
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightbox.classList.add('open');
  });
});
document.getElementById('lightboxClose').addEventListener('click', () => lightbox.classList.remove('open'));
lightbox.addEventListener('click', e => { if (e.target === lightbox) lightbox.classList.remove('open'); });

/* ---------- FAQ analytics ---------- */
document.querySelectorAll('.faq-item').forEach(item => {
  item.addEventListener('toggle', () => {
    if (item.open && typeof gtag === 'function') {
      gtag('event', 'select_content', {
        content_type: 'faq',
        item_id: item.querySelector('summary').textContent.trim()
      });
    }
  });
});

/* ============================================================
   GA4 — EVENTOS DE CONVERSIÓN
   Cualquier elemento con data-ga-event dispara un evento GA4
   usando data-ga-content como identificador del elemento.
   ============================================================ */
document.querySelectorAll('[data-ga-event]').forEach(el => {
  el.addEventListener('click', () => {
    if (typeof gtag !== 'function') return;
    const eventName = el.dataset.gaEvent;
    const contentId = el.dataset.gaContent || 'sin_id';
    gtag('event', eventName, {
      content_type: contentId,
      page_location: window.location.href,
      page_title: document.title
    });
  });
});

/* ============================================================
   GA4 — SCROLL TRACKING (25% / 50% / 75% / 100%)
   ============================================================ */
(function scrollTracking(){
  const thresholds = [25, 50, 75, 100];
  const fired = {};
  function onScroll(){
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (docHeight <= 0) return;
    const percent = Math.round((scrollTop / docHeight) * 100);
    thresholds.forEach(t => {
      if (percent >= t && !fired[t]) {
        fired[t] = true;
        if (typeof gtag === 'function') {
          gtag('event', 'scroll_depth', {
            percent_scrolled: t,
            page_location: window.location.href
          });
        }
      }
    });
  }
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => { onScroll(); ticking = false; });
      ticking = true;
    }
  });
})();
