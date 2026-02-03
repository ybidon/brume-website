/**
 * How It Works - Scrollytelling Animation
 * Activates steps as user scrolls through the section
 */

export function initHowItWorks() {
  const section = document.querySelector('.how-it-works');
  const steps = document.querySelectorAll('.step');
  const progressFill = document.querySelector('.steps-progress-fill');
  const productRing = document.querySelector('.product-showcase-ring');
  const waterStream = document.querySelector('.water-stream');

  if (!section || !steps.length) return;

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    // Show all steps immediately
    steps.forEach(step => step.classList.add('is-active'));
    if (progressFill) progressFill.style.height = '100%';
    return;
  }

  // Calculate which step should be active based on scroll position
  function updateActiveStep() {
    const sectionRect = section.getBoundingClientRect();
    const sectionTop = sectionRect.top;
    const sectionHeight = sectionRect.height;
    const viewportHeight = window.innerHeight;

    // Calculate progress through the section (0 to 1)
    const scrollProgress = Math.max(0, Math.min(1,
      (viewportHeight - sectionTop) / (sectionHeight + viewportHeight)
    ));

    // Update progress bar
    if (progressFill) {
      progressFill.style.height = `${scrollProgress * 100}%`;
    }

    // Determine active step (divide section into equal parts)
    const stepCount = steps.length;
    const activeIndex = Math.min(
      stepCount - 1,
      Math.floor(scrollProgress * stepCount * 1.2) // 1.2 makes steps activate slightly earlier
    );

    // Update step states
    steps.forEach((step, index) => {
      if (index <= activeIndex) {
        step.classList.add('is-active');
      } else {
        step.classList.remove('is-active');
      }
    });

    // Activate visual elements based on progress
    if (productRing) {
      if (scrollProgress > 0.2) {
        productRing.classList.add('is-active');
      } else {
        productRing.classList.remove('is-active');
      }
    }

    if (waterStream) {
      if (scrollProgress > 0.7) {
        waterStream.classList.add('is-active');
      } else {
        waterStream.classList.remove('is-active');
      }
    }
  }

  // Throttled scroll handler
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateActiveStep();
        ticking = false;
      });
      ticking = true;
    }
  });

  // Initial check
  updateActiveStep();
}
