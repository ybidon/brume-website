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
import { initSlideshow } from './effects/slideshow.js';

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

  // Text reveal disabled — hero logo visibility controlled by video cycle
  // initTextReveal();

  // Initialize interactive fog effect
  initWebGLFog();

  // Initialize droplet journey scrollytelling
  initDropletJourney();

  // Initialize horizontal scroll for feature cards
  initHorizontalScroll();

  // Initialize product slideshow
  initSlideshow();

  // Hero video cycle: plays → ends → show brume logo → pause 20s → fade logo out → replay
  const heroVideo = document.querySelector('.hero-bg-video');
  const heroHeadline = document.querySelector('.hero-headline-large');
  if (heroVideo && heroHeadline) {
    // Hide logo initially
    heroHeadline.classList.add('hero-logo-hidden');

    heroVideo.addEventListener('ended', () => {
      // Video ended: fade in the brume logo
      heroHeadline.classList.remove('hero-logo-hidden');
      heroHeadline.classList.add('hero-logo-visible');

      // After 20s, fade logo out and restart video
      setTimeout(() => {
        heroHeadline.classList.remove('hero-logo-visible');
        heroHeadline.classList.add('hero-logo-hidden');

        // Wait for fade-out to finish, then replay
        setTimeout(() => {
          heroVideo.currentTime = 0;
          heroVideo.play();
        }, 1000);
      }, 20000);
    });
  }

  // Initialize features values (hover to switch images + content)
  const featureItems = document.querySelectorAll('.features-val-item');
  const featureImages = document.querySelectorAll('.features-val-img');
  const featureContents = document.querySelectorAll('.features-val-content');

  if (featureItems.length > 0 && featureImages.length > 0) {
    function activateFeature(item) {
      const feature = item.dataset.feature;

      // Update active nav item
      featureItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');

      // Update active image
      featureImages.forEach(img => img.classList.remove('active'));
      const targetImg = document.querySelector(`.features-val-img[data-feature="${feature}"]`);
      if (targetImg) targetImg.classList.add('active');

      // Update active content (heading + description)
      featureContents.forEach(c => c.classList.remove('active'));
      const targetContent = document.querySelector(`.features-val-content[data-feature="${feature}"]`);
      if (targetContent) targetContent.classList.add('active');
    }

    featureItems.forEach(item => {
      // Desktop: hover
      item.addEventListener('mouseenter', () => activateFeature(item));
      // Mobile: tap
      item.addEventListener('click', () => activateFeature(item));
    });
  }

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
