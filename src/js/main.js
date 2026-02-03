/**
 * BRUME - Main JavaScript Entry Point
 * Immersive water-themed landing page with advanced interactive features
 */

import { initHeader } from './animations/header.js';
import { initHeroParticles } from './effects/particles.js';
import { initScrollAnimations, initScrollDepth } from './animations/scroll.js';
import { initHowItWorks } from './animations/howItWorks.js';
import { initWaterCursor } from './effects/waterCursor.js';
import { initTextReveal } from './animations/textReveal.js';
import { initWebGLFog } from './effects/webglFog.js';
import { initDropletJourney } from './animations/dropletJourney.js';
import { initHorizontalScroll } from './effects/horizontalScroll.js';

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Initialize header behavior
  initHeader();

  // Initialize hero particle effect
  initHeroParticles();

  // Initialize scroll-triggered animations
  initScrollAnimations();

  // Initialize scroll depth color shift
  initScrollDepth();

  // Initialize How It Works scrollytelling
  initHowItWorks();

  // Initialize custom water cursor
  initWaterCursor();

  // Initialize hero text reveal animation
  initTextReveal();

  // Initialize interactive fog effect
  initWebGLFog();

  // Initialize droplet journey scrollytelling
  initDropletJourney();

  // Initialize horizontal scroll for feature cards
  initHorizontalScroll();

  // Log for debugging
  console.log('🌊 Brume initialized with advanced features');
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});
