import { lerp, easeOutQuad, isTouchDevice } from './utils.js';

/* ─── Nav shrink on scroll ─── */
export function initNavShrink() {
  const nav = document.getElementById('main-nav');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });
}

/* ─── Fullscreen menu ─── */
export function initFullscreenMenu() {
  const btn      = document.getElementById('nav-hamburger');
  const overlay  = document.getElementById('nav-fullscreen');
  if (!btn || !overlay) return;

  function openMenu() {
    btn.classList.add('open');
    overlay.classList.add('open');
    btn.setAttribute('aria-expanded', 'true');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    btn.classList.remove('open');
    overlay.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  btn.addEventListener('click', () => {
    btn.classList.contains('open') ? closeMenu() : openMenu();
  });

  overlay.querySelectorAll('.fs-link, .fs-cta').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });
}

/* ─── Hero entrance animations (fire on load) ─── */
export function initHeroAnimations() {
  window.addEventListener('load', () => {
    [
      { id: 'eyebrow',          delay: 200  },
      { id: 'hero-bg-headline', delay: 300  },
      { id: 'hero-bike-center', delay: 450  },
      { id: 'hero-title-front', delay: 600  },
      { id: 'hero-badges',      delay: 720  },
      { id: 'hero-buttons',     delay: 840  },
      { id: 'hero-stats',       delay: 1000 },
    ].forEach(({ id, delay }) => {
      setTimeout(() => document.getElementById(id)?.classList.add('visible'), delay);
    });
  });
}

/* ─── Bike 3D parallax ─── */
export function initBikeParallax() {
  if (isTouchDevice()) return;

  const bikeWrap = document.getElementById('bike-wrap');
  if (!bikeWrap) return;

  let lastX = 0, lastY = 0;
  let targetX = 0, targetY = 0;

  document.addEventListener('mousemove', (e) => {
    const rect = bikeWrap.getBoundingClientRect();
    const cx = rect.left + rect.width  / 2;
    const cy = rect.top  + rect.height / 2;
    targetX = -((e.clientY - cy) / window.innerHeight) * 5;
    targetY =  ((e.clientX - cx) / window.innerWidth)  * 10;
  });

  function animateTilt() {
    lastX = lerp(lastX, targetX, 0.06);
    lastY = lerp(lastY, targetY, 0.06);

    const floatY = -Math.sin(((performance.now() % 7000) / 7000) * Math.PI * 2) * 18;
    bikeWrap.style.animation  = 'none';
    bikeWrap.style.transform  =
      `translateY(${floatY}px) perspective(1000px) rotateY(${lastY}deg) rotateX(${lastX}deg)`;
    requestAnimationFrame(animateTilt);
  }
  animateTilt();
}

/* ─── Scroll reveal (IntersectionObserver) ─── */
export function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

/* ─── CountUp for hero stats ─── */
export function initCountUp() {
  const statsEl = document.getElementById('hero-stats');
  if (!statsEl) return;

  let started = false;

  const observer = new IntersectionObserver((entries) => {
    if (!entries[0].isIntersecting || started) return;
    started = true;
    observer.disconnect();

    document.querySelectorAll('.stat-number[data-target]').forEach(counter => {
      const target   = parseInt(counter.dataset.target, 10);
      const prefix   = counter.dataset.prefix || '';
      const suffix   = counter.dataset.suffix || '';
      const duration = target >= 500 ? 1500 : 1200;
      const start    = performance.now();

      function step(now) {
        const progress = Math.min((now - start) / duration, 1);
        counter.textContent = prefix + Math.floor(easeOutQuad(progress) * target) + suffix;
        if (progress < 1) requestAnimationFrame(step);
        else counter.textContent = prefix + target + suffix;
      }
      requestAnimationFrame(step);
    });
  }, { threshold: 0.5 });

  observer.observe(statsEl);
}

/* ─── Products carousel ─── */
export function initCarousel() {
  const carousel = document.getElementById('products-carousel');
  if (!carousel) return;

  const slides  = [...carousel.querySelectorAll('.carousel-slide')];
  const dots    = [...document.querySelectorAll('.carousel-dot')];
  const btnPrev = document.getElementById('carousel-prev');
  const btnNext = document.getElementById('carousel-next');
  let current   = 0;
  let timer;
  let paused    = false;

  function goTo(next, direction) {
    if (next === current) return;
    const prev = current;
    const enterClass = direction === 'right' ? 'enter-from-right' : 'enter-from-left';
    const exitClass  = direction === 'right' ? 'exit-to-left'     : 'exit-to-right';

    slides[prev].classList.add(exitClass);
    slides[prev].addEventListener('animationend', () => {
      slides[prev].classList.remove('active', exitClass);
    }, { once: true });

    slides[next].classList.add('active', enterClass);
    slides[next].addEventListener('animationend', () => {
      slides[next].classList.remove(enterClass);
    }, { once: true });

    dots.forEach(d => d.classList.remove('active'));
    dots[next]?.classList.add('active');
    current = next;
  }

  function advance() { goTo((current + 1) % slides.length, 'right'); }
  function retreat() { goTo((current - 1 + slides.length) % slides.length, 'left'); }

  function startTimer() {
    clearInterval(timer);
    timer = setInterval(() => { if (!paused) advance(); }, 5000);
  }

  // Arrows
  btnNext?.addEventListener('click', () => { advance(); startTimer(); });
  btnPrev?.addEventListener('click', () => { retreat(); startTimer(); });

  // Dots
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const idx = parseInt(dot.dataset.index);
      goTo(idx, idx > current ? 'right' : 'left');
      startTimer();
    });
  });

  // Hold to pause
  const holdEl = carousel.parentElement;
  holdEl.addEventListener('mousedown',   () => paused = true);
  holdEl.addEventListener('mouseup',     () => paused = false);
  holdEl.addEventListener('touchstart',  () => paused = true,  { passive: true });
  holdEl.addEventListener('touchend',    () => paused = false, { passive: true });

  // Swipe
  let touchStartX = 0;
  carousel.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });
  carousel.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      diff > 0 ? advance() : retreat();
      startTimer();
    }
    paused = false;
  }, { passive: true });

  startTimer();
}

/* ─── Smooth ticker via rAF ─── */
export function initTicker() {
  const track = document.querySelector('.ticker-track');
  if (!track) return;

  let x = 0;
  const speed = 0.4;
  let paused = false;
  let half = 0;

  function measure() { half = track.scrollWidth / 2; }
  window.addEventListener('load',   measure, { once: true });
  window.addEventListener('resize', measure, { passive: true });
  measure();

  track.parentElement.addEventListener('mouseenter', () => paused = true);
  track.parentElement.addEventListener('mouseleave', () => paused = false);

  function tick() {
    if (!paused && half > 0) {
      x -= speed;
      if (Math.abs(x) >= half) x = 0;
      track.style.transform = `translate3d(${x}px, 0, 0)`;
    }
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

/* ─── Smooth scroll for anchor links ─── */
export function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      window.scrollTo({
        top: target.getBoundingClientRect().top + window.scrollY - 70,
        behavior: 'smooth',
      });
    });
  });
}
