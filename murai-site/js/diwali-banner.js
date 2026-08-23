/**
 * Diwali Festive Saree Sale Banner
 * Fireworks, parallax, sparkle timing & reduced-motion support
 */
(function initDiwaliBanner() {
  const banner = document.getElementById('diwali-sale-banner');
  if (!banner) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  if (reducedMotion) {
    banner.classList.add('dsb-reduced-motion', 'dsb-loaded');
    return;
  }

  if (!finePointer) {
    banner.classList.add('dsb-no-parallax');
  }

  let scrollTimer = null;
  const pauseDuringScroll = () => {
    banner.classList.add('dsb-is-scrolling');
    if (scrollTimer) window.clearTimeout(scrollTimer);
    scrollTimer = window.setTimeout(() => {
      banner.classList.remove('dsb-is-scrolling');
      scrollTimer = null;
    }, 180);
  };

  window.addEventListener('scroll', pauseDuringScroll, { passive: true });
  window.addEventListener('touchmove', pauseDuringScroll, { passive: true });

  /* Randomize floating particle & light-sweep durations */
  banner.querySelectorAll('.dsb-saree-particles span').forEach((el) => {
    el.style.animationDuration = `${4 + Math.random() * 3}s`;
    el.style.animationDelay = `${3 + Math.random() * 2}s`;
  });

  const panelSweep = banner.querySelector('.dsb-panel-sweep');
  if (panelSweep) {
    panelSweep.style.animationDuration = `${6 + Math.random() * 2}s`;
  }

  const bannerSweep = banner.querySelector('.dsb-banner-sweep');
  if (bannerSweep) {
    bannerSweep.style.animationDuration = `${6 + Math.random() * 2}s`;
  }

  banner.querySelectorAll('.dsb-sparkles span').forEach((el) => {
    el.style.animationDuration = `${3.5 + Math.random() * 2.5}s`;
    el.style.animationDelay = `${3 + Math.random() * 3}s`;
  });

  /* Build elegant fireworks on the right */
  const fireworksEl = document.getElementById('dsb-fireworks');
  if (fireworksEl) {
    const bursts = [
      { x: 35, y: 20, colors: ['#ffc107', '#ff7043', '#ffffff', '#f48fb1'] },
      { x: 65, y: 35, colors: ['#ff5722', '#ffe082', '#fff9c4', '#ff8a65'] },
      { x: 45, y: 52, colors: ['#ffc107', '#e91e63', '#ffffff', '#ff9800'] },
      { x: 75, y: 18, colors: ['#ffd54f', '#ff7043', '#ffffff'] },
      { x: 25, y: 42, colors: ['#ff8f00', '#ffc107', '#f48fb1', '#ffffff'] },
      { x: 58, y: 62, colors: ['#ff5722', '#ffc107', '#ffffff'] },
    ];

    bursts.forEach((burst, index) => {
      const el = document.createElement('div');
      el.className = 'dsb-fw-burst';
      el.style.left = `${burst.x}%`;
      el.style.top = `${burst.y}%`;
      el.style.setProperty('--delay', `${2.7 + index * 0.55}s`);
      el.style.setProperty('--cycle', `${3 + Math.random() * 1.5}s`);

      const particleCount = 10 + Math.floor(Math.random() * 4);
      for (let i = 0; i < particleCount; i += 1) {
        const particle = document.createElement('span');
        const angle = (i / particleCount) * Math.PI * 2 + Math.random() * 0.3;
        const dist = 36 + Math.random() * 40;
        particle.style.setProperty('--tx', `${Math.cos(angle) * dist}px`);
        particle.style.setProperty('--ty', `${Math.sin(angle) * dist}px`);
        particle.style.setProperty('--color', burst.colors[i % burst.colors.length]);
        particle.style.setProperty('--size', `${2 + Math.random() * 3}px`);
        particle.style.setProperty('--pdelay', `${Math.random() * 0.2}s`);
        el.appendChild(particle);
      }

      fireworksEl.appendChild(el);
    });
  }

  /* Subtle mouse parallax — desktop pointer only */
  let parallaxRaf = null;

  const resetParallax = () => {
    banner.style.setProperty('--parallax-x', '0px');
    banner.style.setProperty('--parallax-y', '0px');
  };

  const handlePointerMove = (event) => {
    if (!finePointer || banner.classList.contains('dsb-is-scrolling')) return;
    if (parallaxRaf) return;
    parallaxRaf = requestAnimationFrame(() => {
      const rect = banner.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      banner.style.setProperty('--parallax-x', `${x * 10}px`);
      banner.style.setProperty('--parallax-y', `${y * 7}px`);
      parallaxRaf = null;
    });
  };

  if (finePointer) {
    banner.addEventListener('mousemove', handlePointerMove);
    banner.addEventListener('mouseleave', resetParallax);
  } else {
    resetParallax();
  }

  requestAnimationFrame(() => banner.classList.add('dsb-loaded'));
})();
