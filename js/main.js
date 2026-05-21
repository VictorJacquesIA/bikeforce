import { initCursor }        from './cursor.js';
import {
  initNavShrink,
  initFullscreenMenu,
  initHeroAnimations,
  initBikeParallax,
  initScrollReveal,
  initCountUp,
  initSmoothScroll,
  initTicker,
  initCarousel,
} from './animations.js';

function init() {
  initCursor();
  initNavShrink();
  initFullscreenMenu();
  initHeroAnimations();
  initBikeParallax();
  initScrollReveal();
  initCountUp();
  initSmoothScroll();
  initTicker();
  initCarousel();
}

init();
