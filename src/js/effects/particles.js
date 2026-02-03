/**
 * Hero Particle Effect
 * Creates floating orbs with glow effect using Canvas API
 * Particles move with organic, water-like motion
 */

export function initHeroParticles() {
  const canvas = document.getElementById('heroParticles');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let particles = [];
  let animationId;
  let mouseX = 0;
  let mouseY = 0;

  // Particle configuration
  const config = {
    particleCount: 60,
    minSize: 2,
    maxSize: 6,
    minSpeed: 0.2,
    maxSpeed: 0.8,
    glowColor: 'rgba(95, 255, 239, 0.6)',
    particleColor: 'rgba(255, 255, 255, 0.8)',
    mouseInfluence: 0.02,
    noiseScale: 0.003,
    noiseStrength: 0.5
  };

  // Simple noise function for organic movement
  function noise(x, y, t) {
    return Math.sin(x * 0.01 + t) * Math.cos(y * 0.01 + t) * 0.5 +
           Math.sin(x * 0.02 - t * 0.5) * Math.cos(y * 0.02 + t * 0.3) * 0.3 +
           Math.sin((x + y) * 0.01 + t * 0.7) * 0.2;
  }

  // Resize canvas to fill container
  function resize() {
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
  }

  // Create a particle
  function createParticle() {
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: config.minSize + Math.random() * (config.maxSize - config.minSize),
      speedX: (Math.random() - 0.5) * config.maxSpeed,
      speedY: -config.minSpeed - Math.random() * (config.maxSpeed - config.minSpeed),
      opacity: 0.3 + Math.random() * 0.5,
      phase: Math.random() * Math.PI * 2,
      noiseOffsetX: Math.random() * 1000,
      noiseOffsetY: Math.random() * 1000
    };
  }

  // Initialize particles
  function init() {
    particles = [];
    for (let i = 0; i < config.particleCount; i++) {
      particles.push(createParticle());
    }
  }

  // Draw a single particle with glow
  function drawParticle(p) {
    // Glow effect
    const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3);
    gradient.addColorStop(0, `rgba(95, 255, 239, ${p.opacity * 0.5})`);
    gradient.addColorStop(0.5, `rgba(95, 255, 239, ${p.opacity * 0.2})`);
    gradient.addColorStop(1, 'rgba(95, 255, 239, 0)');

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();

    // Core particle
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
    ctx.fill();
  }

  // Update particle positions
  function update(time) {
    particles.forEach((p, index) => {
      // Organic movement using noise
      const noiseX = noise(p.x + p.noiseOffsetX, p.y, time * 0.001) * config.noiseStrength;
      const noiseY = noise(p.x, p.y + p.noiseOffsetY, time * 0.001) * config.noiseStrength;

      // Apply noise and base velocity
      p.x += p.speedX + noiseX;
      p.y += p.speedY + noiseY;

      // Gentle mouse influence
      const dx = mouseX - p.x;
      const dy = mouseY - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 200) {
        const force = (200 - dist) / 200 * config.mouseInfluence;
        p.x -= dx * force;
        p.y -= dy * force;
      }

      // Pulse opacity
      p.opacity = 0.3 + Math.sin(time * 0.002 + p.phase) * 0.2;

      // Reset particle when it goes off screen
      if (p.y < -20 || p.x < -20 || p.x > canvas.width + 20) {
        particles[index] = createParticle();
        particles[index].y = canvas.height + 20;
      }
    });
  }

  // Animation loop
  function animate(time) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    update(time);

    particles.forEach(p => drawParticle(p));

    animationId = requestAnimationFrame(animate);
  }

  // Track mouse position
  function handleMouseMove(e) {
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
  }

  // Event listeners
  window.addEventListener('resize', () => {
    resize();
  });

  canvas.parentElement.addEventListener('mousemove', handleMouseMove);

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!prefersReducedMotion) {
    resize();
    init();
    animate(0);
  }

  // Cleanup function (not used in this context but good practice)
  return () => {
    cancelAnimationFrame(animationId);
    window.removeEventListener('resize', resize);
    canvas.parentElement.removeEventListener('mousemove', handleMouseMove);
  };
}
