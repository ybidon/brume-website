/**
 * Droplet Journey - Scroll-triggered storytelling animation
 * Animates a water droplet along a curved path as user scrolls
 */

export function initDropletJourney() {
  const section = document.querySelector('.droplet-journey');
  const droplet = document.getElementById('droplet');
  const stages = document.querySelectorAll('.journey-stage');
  const progressDots = document.querySelectorAll('.journey-progress-dot');

  if (!section || !droplet || !stages.length) return;

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Define the droplet's curved path (percentage positions)
  // Creates a gentle S-curve through the viewport
  const path = [
    { x: 50, y: 12 },   // Stage 1: Top center
    { x: 25, y: 32 },   // Stage 2: Left-upper
    { x: 75, y: 55 },   // Stage 3: Right-middle
    { x: 50, y: 82 }    // Stage 4: Bottom center
  ];

  // Easing function for smooth interpolation
  function easeInOutCubic(t) {
    return t < 0.5
      ? 4 * t * t * t
      : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  // Quadratic bezier interpolation for smoother path
  function getPointOnPath(progress) {
    const numSegments = path.length - 1;
    const scaledProgress = progress * numSegments;
    const segmentIndex = Math.min(Math.floor(scaledProgress), numSegments - 1);
    const segmentProgress = scaledProgress - segmentIndex;

    // Apply easing to segment progress
    const easedProgress = prefersReducedMotion ? segmentProgress : easeInOutCubic(segmentProgress);

    const start = path[segmentIndex];
    const end = path[Math.min(segmentIndex + 1, path.length - 1)];

    // Simple linear interpolation with easing
    return {
      x: start.x + (end.x - start.x) * easedProgress,
      y: start.y + (end.y - start.y) * easedProgress
    };
  }

  // Calculate rotation based on movement direction
  function getRotation(progress, deltaProgress) {
    if (prefersReducedMotion) return 0;

    const current = getPointOnPath(progress);
    const next = getPointOnPath(Math.min(progress + 0.01, 1));

    const dx = next.x - current.x;
    const dy = next.y - current.y;

    // Subtle tilt based on horizontal movement
    return dx * 1.5;
  }

  let lastProgress = 0;
  let ticking = false;

  function updateDroplet() {
    const rect = section.getBoundingClientRect();
    const sectionTop = rect.top;
    const sectionHeight = section.offsetHeight - window.innerHeight;

    // Calculate scroll progress through the section (0 to 1)
    const scrolled = -sectionTop;
    const progress = Math.max(0, Math.min(1, scrolled / sectionHeight));

    // Get position on path
    const position = getPointOnPath(progress);

    // Calculate rotation
    const rotation = getRotation(progress, progress - lastProgress);
    lastProgress = progress;

    // Update droplet position
    droplet.style.left = `${position.x}%`;
    droplet.style.top = `${position.y}%`;
    droplet.style.transform = `translate(-50%, -50%) rotate(${rotation}deg)`;

    // Scale droplet slightly based on position (perspective effect)
    const scale = 0.9 + (position.y / 100) * 0.3;
    droplet.style.transform += ` scale(${scale})`;

    // Determine active stage (0-3)
    const activeStageIndex = Math.min(Math.floor(progress * 4), 3);

    // Update stages visibility
    stages.forEach((stage, i) => {
      const isActive = i === activeStageIndex;
      stage.classList.toggle('is-active', isActive);
    });

    // Update progress dots
    progressDots.forEach((dot, i) => {
      const isPast = i <= activeStageIndex;
      const isActive = i === activeStageIndex;
      dot.classList.toggle('is-active', isActive);
      dot.classList.toggle('is-past', isPast && !isActive);
    });

    ticking = false;
  }

  // Scroll handler with requestAnimationFrame for performance
  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(updateDroplet);
      ticking = true;
    }
  }

  // Initialize
  window.addEventListener('scroll', onScroll, { passive: true });

  // Set initial state
  updateDroplet();

  // Cleanup function
  return function cleanup() {
    window.removeEventListener('scroll', onScroll);
  };
}
