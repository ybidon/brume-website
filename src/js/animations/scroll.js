/**
 * Scroll-triggered Animations
 * Uses Intersection Observer for reveal animations
 */

export function initScrollAnimations() {
  // Elements to animate on scroll
  const revealElements = document.querySelectorAll('.reveal, .reveal-blur, .reveal-scale');

  if (!revealElements.length) return;

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    // If user prefers reduced motion, show all elements immediately
    revealElements.forEach(el => el.classList.add('is-visible'));
    return;
  }

  // Intersection Observer options
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -10% 0px',
    threshold: 0.1
  };

  // Create observer
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Add delay if specified via CSS variable
        const delay = getComputedStyle(entry.target).getPropertyValue('--delay');
        if (delay) {
          entry.target.style.transitionDelay = delay;
        }

        entry.target.classList.add('is-visible');

        // Unobserve after animation (one-time reveal)
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe all reveal elements
  revealElements.forEach(el => observer.observe(el));

  // Stagger children animation
  const staggerContainers = document.querySelectorAll('.stagger-children');

  const staggerObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        staggerObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  staggerContainers.forEach(el => staggerObserver.observe(el));
}

/**
 * Parallax effect for elements with data-parallax attribute
 * Value represents the parallax intensity (0.1 = subtle, 1 = strong)
 */
export function initParallax() {
  const parallaxElements = document.querySelectorAll('[data-parallax]');

  if (!parallaxElements.length) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  function updateParallax() {
    const scrollY = window.scrollY;

    parallaxElements.forEach(el => {
      const intensity = parseFloat(el.dataset.parallax) || 0.5;
      const rect = el.getBoundingClientRect();
      const centerY = rect.top + rect.height / 2;
      const viewportCenter = window.innerHeight / 2;
      const offset = (centerY - viewportCenter) * intensity;

      el.style.transform = `translateY(${offset}px)`;
    });
  }

  // Throttled scroll handler
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateParallax();
        ticking = false;
      });
      ticking = true;
    }
  });

  updateParallax();
}

/**
 * Scroll Depth Color Shift
 * Updates --scroll-depth CSS variable (0-1) as user scrolls
 * Creates the feeling of "rising through water"
 */
export function initScrollDepth() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  function updateScrollDepth() {
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollProgress = scrollHeight > 0
      ? Math.min(1, Math.max(0, window.scrollY / scrollHeight))
      : 0;
    document.documentElement.style.setProperty('--scroll-depth', scrollProgress.toFixed(3));
  }

  // Throttled scroll handler
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateScrollDepth();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  // Initial update
  updateScrollDepth();
}
