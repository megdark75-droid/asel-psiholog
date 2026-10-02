(function () {
  'use strict';

  /* ---------- Шапка: тень при прокрутке ---------- */
  var header = document.getElementById('header');
  var onScroll = function () {
    header.classList.toggle('is-scrolled', window.scrollY > 10);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Мобильное меню ---------- */
  var burger = document.getElementById('burger');
  var nav = document.getElementById('nav');
  var navOverlay = document.getElementById('navOverlay');

  function closeMenu() {
    nav.classList.remove('is-open');
    navOverlay.classList.remove('is-open');
    burger.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
  }

  burger.addEventListener('click', function () {
    var open = nav.classList.toggle('is-open');
    navOverlay.classList.toggle('is-open', open);
    burger.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', String(open));
  });

  navOverlay.addEventListener('click', closeMenu);
  nav.addEventListener('click', function (e) {
    if (e.target.closest('.nav__link')) closeMenu();
  });

  /* ---------- Плавная прокрутка (запасной путь для старых браузеров) ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var id = link.getAttribute('href');
      if (!id || id === '#') return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      closeMenu();
      var top = target.getBoundingClientRect().top + window.pageYOffset
              - (header.offsetHeight + 12);
      window.scrollTo({ top: top, behavior: 'smooth' });
      history.replaceState(null, '', id);
    });
  });

  /* ---------- Кнопка «Наверх» ---------- */
  document.getElementById('toTop').addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------- Появление блоков при прокрутке ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry, i) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var delay = Math.min(i * 70, 280);
        setTimeout(function () { el.classList.add('is-visible'); }, delay);
        io.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------- FAQ: открыт только один пункт ---------- */
  var faqItems = document.querySelectorAll('.faq__item');
  faqItems.forEach(function (item) {
    item.addEventListener('toggle', function () {
      if (!item.open) return;
      faqItems.forEach(function (other) {
        if (other !== item) other.open = false;
      });
    });
  });

  /* ---------- Всплывающее окно через 60 секунд ---------- */
  var modal = document.getElementById('modal');
  var modalClose = document.getElementById('modalClose');
  var modalBackdrop = document.getElementById('modalBackdrop');
  var SESSION_KEY = 'asel_promo_shown';
  var modalShown = false;

  function wasShown() {
    try { return sessionStorage.getItem(SESSION_KEY) === '1'; }
    catch (e) { return false; }
  }
  function markShown() {
    try { sessionStorage.setItem(SESSION_KEY, '1'); } catch (e) {}
  }

  function openModal() {
    if (modalShown || wasShown()) return;
    modalShown = true;
    markShown();
    modal.hidden = false;
    document.body.classList.add('no-scroll');
    requestAnimationFrame(function () { modal.classList.add('is-open'); });
    setTimeout(function () { modalClose.focus(); }, 60);
  }

  function closeModal() {
    modal.classList.remove('is-open');
    document.body.classList.remove('no-scroll');
    setTimeout(function () { modal.hidden = true; }, 350);
  }

  modalClose.addEventListener('click', closeModal);
  modalBackdrop.addEventListener('click', closeModal);
  modal.querySelector('.btn').addEventListener('click', closeModal);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' || e.key === 'Esc') {
      if (!modal.hidden) closeModal();
      else if (nav.classList.contains('is-open')) closeMenu();
    }
  });

  if (!wasShown()) setTimeout(openModal, 60000);
})();
