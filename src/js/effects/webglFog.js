/**
 * Interactive Fog Effect
 * Canvas-based fog particles that part around the cursor
 */

export function initWebGLFog() {
  const canvas = document.getElementById('heroFog');
  if (!canvas) return;

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  // Check if touch device (disable interactive fog on mobile)
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  const ctx = canvas.getContext('2d');
  const particles = [];
  const mouse = { x: -1000, y: -1000 };
  let animationId = null;

  // Configuration
  const config = {
    particleDensity: isTouchDevice ? 12000 : 8000, // Fewer particles on mobile
    minSize: 60,
    maxSize: 140,
    minOpacity: 0.015,
    maxOpacity: 0.045,
    driftSpeed: 0.25,
    repelRadius: 180,
    repelStrength: 2.5
  };

  // Resize handler
  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    ctx.scale(dpr, dpr);
    initParticles();
  }

  // Create fog particles
  function initParticles() {
    particles.length = 0;
    const count = Math.floor((window.innerWidth * window.innerHeight) / config.particleDensity);

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        baseX: 0, // Store original position for returning
        baseY: 0,
        vx: (Math.random() - 0.5) * config.driftSpeed,
        vy: (Math.random() - 0.5) * config.driftSpeed * 0.7,
        size: config.minSize + Math.random() * (config.maxSize - config.minSize),
        opacity: config.minOpacity + Math.random() * (config.maxOpacity - config.minOpacity),
        phase: Math.random() * Math.PI * 2 // For subtle pulsing
      });

      // Store base positions
      particles[i].baseX = particles[i].x;
      particles[i].baseY = particles[i].y;
    }
  }

  // Mouse tracking
  function handleMouseMove(e) {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  }

  function handleMouseLeave() {
    mouse.x = -1000;
    mouse.y = -1000;
  }

  // Touch support
  function handleTouchMove(e) {
    if (e.touches.length > 0) {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.touches[0].clientX - rect.left;
      mouse.y = e.touches[0].clientY - rect.top;
    }
  }

  function handleTouchEnd() {
    mouse.x = -1000;
    mouse.y = -1000;
  }

  // Animation loop
  let lastTime = 0;
  function animate(currentTime) {
    const deltaTime = Math.min((currentTime - lastTime) / 16.67, 2); // Cap delta to prevent jumps
    lastTime = currentTime;

    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    particles.forEach(p => {
      // Calculate distance from cursor
      const dx = p.x - mouse.x;
      const dy = p.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Repel from cursor
      if (dist < config.repelRadius && dist > 0) {
        const force = (config.repelRadius - dist) / config.repelRadius;
        const easeForce = force * force; // Quadratic easing for smoother effect
        p.x += (dx / dist) * easeForce * config.repelStrength * deltaTime;
        p.y += (dy / dist) * easeForce * config.repelStrength * deltaTime;
      }

      // Natural drift
      p.x += p.vx * deltaTime;
      p.y += p.vy * deltaTime;

      // Subtle pulsing
      p.phase += 0.01 * deltaTime;
      const pulseScale = 1 + Math.sin(p.phase) * 0.05;

      // Wrap around edges with padding
      const padding = p.size;
      if (p.x < -padding) p.x = window.innerWidth + padding;
      if (p.x > window.innerWidth + padding) p.x = -padding;
      if (p.y < -padding) p.y = window.innerHeight + padding;
      if (p.y > window.innerHeight + padding) p.y = -padding;

      // Draw fog particle with radial gradient
      const radius = p.size * pulseScale;
      const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, radius);
      gradient.addColorStop(0, `rgba(255, 255, 255, ${p.opacity})`);
      gradient.addColorStop(0.5, `rgba(248, 250, 252, ${p.opacity * 0.5})`);
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
      ctx.fill();
    });

    animationId = requestAnimationFrame(animate);
  }

  // Initialize
  resize();

  // Event listeners
  window.addEventListener('resize', resize);

  if (!isTouchDevice) {
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);
  } else {
    canvas.addEventListener('touchmove', handleTouchMove, { passive: true });
    canvas.addEventListener('touchend', handleTouchEnd);
  }

  // Start animation
  animationId = requestAnimationFrame(animate);

  // Cleanup function (for potential future use)
  return function cleanup() {
    if (animationId) {
      cancelAnimationFrame(animationId);
    }
    window.removeEventListener('resize', resize);
    canvas.removeEventListener('mousemove', handleMouseMove);
    canvas.removeEventListener('mouseleave', handleMouseLeave);
    canvas.removeEventListener('touchmove', handleTouchMove);
    canvas.removeEventListener('touchend', handleTouchEnd);
  };
}
