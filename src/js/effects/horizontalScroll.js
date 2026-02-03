/**
 * Horizontal Scroll - Drag-to-scroll feature cards
 * Enables smooth drag scrolling with momentum on desktop
 */

export function initHorizontalScroll() {
  const container = document.querySelector('.features-scroll-container');
  if (!container) return;

  let isDown = false;
  let startX;
  let scrollLeft;
  let velX = 0;
  let momentumID = null;

  // Configuration
  const config = {
    dragMultiplier: 2,      // How fast to scroll relative to drag distance
    momentumDecay: 0.95,    // Velocity decay per frame (0-1)
    minVelocity: 0.5        // Minimum velocity before stopping
  };

  // Mouse down - start drag
  function handleMouseDown(e) {
    isDown = true;
    container.classList.add('is-dragging');
    container.style.cursor = 'grabbing';
    startX = e.pageX - container.offsetLeft;
    scrollLeft = container.scrollLeft;
    velX = 0;

    // Cancel any ongoing momentum
    if (momentumID) {
      cancelAnimationFrame(momentumID);
      momentumID = null;
    }
  }

  // Mouse leave - end drag
  function handleMouseLeave() {
    if (isDown) {
      isDown = false;
      container.classList.remove('is-dragging');
      container.style.cursor = 'grab';
      startMomentum();
    }
  }

  // Mouse up - end drag
  function handleMouseUp() {
    if (isDown) {
      isDown = false;
      container.classList.remove('is-dragging');
      container.style.cursor = 'grab';
      startMomentum();
    }
  }

  // Mouse move - drag
  let lastX = 0;
  let lastTime = Date.now();

  function handleMouseMove(e) {
    if (!isDown) return;
    e.preventDefault();

    const x = e.pageX - container.offsetLeft;
    const walk = (x - startX) * config.dragMultiplier;

    // Calculate velocity for momentum
    const now = Date.now();
    const dt = now - lastTime;
    if (dt > 0) {
      velX = (lastX - x) / dt * 16; // Normalize to ~60fps
    }
    lastX = x;
    lastTime = now;

    container.scrollLeft = scrollLeft - walk;
    updateScrollIndicator();
  }

  // Momentum scrolling after release
  function startMomentum() {
    if (Math.abs(velX) < config.minVelocity) return;

    function momentumLoop() {
      velX *= config.momentumDecay;

      if (Math.abs(velX) < config.minVelocity) {
        momentumID = null;
        return;
      }

      container.scrollLeft += velX;
      updateScrollIndicator();
      momentumID = requestAnimationFrame(momentumLoop);
    }

    momentumID = requestAnimationFrame(momentumLoop);
  }

  // Wheel scroll support (horizontal scrolling with vertical wheel)
  // Only active when user explicitly interacts with container
  function handleWheel(e) {
    // Don't hijack scroll - let page scroll naturally
    // Horizontal scroll is only via drag or touch
  }

  // Update visual indicator when scrolled
  function updateScrollIndicator() {
    const hasScrolled = container.scrollLeft > 20;
    container.classList.toggle('has-scrolled', hasScrolled);
  }

  // Touch support for mobile
  let touchStartX = 0;

  function handleTouchStart(e) {
    touchStartX = e.touches[0].pageX;
    scrollLeft = container.scrollLeft;
  }

  function handleTouchMove(e) {
    const touchX = e.touches[0].pageX;
    const diff = touchStartX - touchX;
    container.scrollLeft = scrollLeft + diff;
    updateScrollIndicator();
  }

  // Add event listeners
  container.addEventListener('mousedown', handleMouseDown);
  container.addEventListener('mouseleave', handleMouseLeave);
  container.addEventListener('mouseup', handleMouseUp);
  container.addEventListener('mousemove', handleMouseMove);
  container.addEventListener('wheel', handleWheel, { passive: false });

  // Touch events (for mobile)
  container.addEventListener('touchstart', handleTouchStart, { passive: true });
  container.addEventListener('touchmove', handleTouchMove, { passive: true });

  // Keyboard navigation for accessibility
  container.setAttribute('tabindex', '0');
  container.addEventListener('keydown', (e) => {
    const scrollAmount = 200;
    if (e.key === 'ArrowLeft') {
      container.scrollLeft -= scrollAmount;
      updateScrollIndicator();
    } else if (e.key === 'ArrowRight') {
      container.scrollLeft += scrollAmount;
      updateScrollIndicator();
    }
  });

  // Initial state
  updateScrollIndicator();

  // Cleanup function
  return function cleanup() {
    container.removeEventListener('mousedown', handleMouseDown);
    container.removeEventListener('mouseleave', handleMouseLeave);
    container.removeEventListener('mouseup', handleMouseUp);
    container.removeEventListener('mousemove', handleMouseMove);
    container.removeEventListener('wheel', handleWheel);
    container.removeEventListener('touchstart', handleTouchStart);
    container.removeEventListener('touchmove', handleTouchMove);

    if (momentumID) {
      cancelAnimationFrame(momentumID);
    }
  };
}
