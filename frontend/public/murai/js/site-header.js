(function () {
  const mount = document.getElementById('site-header-mount');
  if (!mount) return;

  const page = document.body.dataset.page || 'home';

  const navItems = [
    { id: 'home', label: 'Home', href: 'index.html' },
    { id: 'shop', label: 'Shop', href: 'shop.html' },
    { id: 'about', label: 'About', href: 'about.html' },
    { id: 'contact', label: 'Contact', href: 'contact.html' },
    { id: 'login', label: 'Login', href: 'login.html' },
  ];

  const navLinks = navItems
    .map((item) => `<li><a href="${item.href}" class="${page === item.id ? 'active' : ''}">${item.label}</a></li>`)
    .join('');

  mount.innerHTML = `
    <div class="suruchi-topbar">
      <div class="suruchi-topbar-inner">
        <div class="suruchi-topbar-left">
          <span>Big Saree Sale — Up to 70% Off</span>
          <a href="shop.html">Shop Sale Sarees</a>
          <a href="mailto:murapodanur@gmail.com">murapodanur@gmail.com</a>
        </div>
        <div class="suruchi-topbar-right">
          <a href="#">English ▾</a>
          <a href="#">₹ INR ▾</a>
        </div>
      </div>
    </div>
    <div class="suruchi-header-main">
      <button class="suruchi-mobile-toggle" aria-label="Open menu" aria-expanded="false" type="button">
        <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
      </button>
      <a href="index.html" class="suruchi-logo" aria-label="MuRa@23 Home">
        <img src="images/mura-newlogo.png" alt="MuRa@23" width="129" height="80" decoding="async">
      </a>
      <form class="suruchi-search" action="shop.html">
        <select aria-label="Category">
          <option>All Sarees</option>
          <option>Silk Sarees</option>
          <option>Cotton Sarees</option>
          <option>Banarasi</option>
          <option>Kanjivaram</option>
          <option>Party Wear</option>
        </select>
        <input type="text" placeholder="Search sarees...">
        <button type="submit" aria-label="Search">
          <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
        </button>
      </form>
      <div class="suruchi-header-actions">
        <a href="login.html" class="suruchi-header-action">
          <svg width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0"/></svg>
          <span>My Account</span>
        </a>
        <a href="shop.html" class="suruchi-header-action">
          <svg width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"/></svg>
          <span>Wish List</span>
        </a>
        <a href="shop.html" class="suruchi-header-action">
          <svg width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z"/></svg>
          <span>My Cart</span>
          <span class="suruchi-badge cart-count">0</span>
        </a>
      </div>
    </div>
  `;

  const overlay = document.createElement('div');
  overlay.className = 'nav-overlay';
  overlay.setAttribute('aria-hidden', 'true');

  const nav = document.createElement('nav');
  nav.className = 'suruchi-nav';
  nav.id = 'suruchi-nav';
  nav.innerHTML = `
    <div class="suruchi-nav-inner">
      <div class="suruchi-nav-header">
        <a href="index.html" class="suruchi-nav-logo" aria-label="MuRa@23 Home">
          <img src="images/mura-newlogo.png" alt="MuRa@23" width="97" height="60" decoding="async">
        </a>
        <button class="suruchi-nav-close" aria-label="Close menu" type="button">
          <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg>
        </button>
      </div>
      <ul>${navLinks}</ul>
    </div>`;

  mount.insertAdjacentElement('afterend', overlay);
  mount.insertAdjacentElement('afterend', nav);

  const toggle = mount.querySelector('.suruchi-mobile-toggle');
  const closeBtn = nav.querySelector('.suruchi-nav-close');

  function openMenu() {
    nav.classList.add('open');
    overlay.classList.add('open');
    document.body.classList.add('menu-open');
    if (toggle) toggle.setAttribute('aria-expanded', 'true');
  }

  function closeMenu() {
    nav.classList.remove('open');
    overlay.classList.remove('open');
    document.body.classList.remove('menu-open');
    if (toggle) toggle.setAttribute('aria-expanded', 'false');
  }

  if (toggle) {
    toggle.addEventListener('click', () => {
      if (nav.classList.contains('open')) closeMenu();
      else openMenu();
    });
  }

  if (closeBtn) closeBtn.addEventListener('click', closeMenu);
  overlay.addEventListener('click', closeMenu);

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) closeMenu();
  });

  const spacer = document.createElement('div');
  spacer.className = 'suruchi-nav-spacer';
  spacer.setAttribute('aria-hidden', 'true');
  nav.insertAdjacentElement('afterend', spacer);

  function updateNavFixed(scrolled) {
    nav.classList.toggle('is-scrolled', scrolled);
    document.body.classList.toggle('nav-is-fixed', scrolled);

    if (scrolled && window.innerWidth > 768) {
      spacer.style.height = `${nav.offsetHeight}px`;
    } else {
      spacer.style.height = '0';
    }
  }

  if (mount) {
    const observer = new IntersectionObserver(
      ([entry]) => {
        updateNavFixed(!entry.isIntersecting);
      },
      { threshold: 0, rootMargin: '0px' }
    );
    observer.observe(mount);
  }

  window.addEventListener('resize', () => {
    if (document.body.classList.contains('nav-is-fixed')) {
      updateNavFixed(true);
    }
  });

  window.addEventListener('scroll', () => {
    if (!mount) return;
    const scrolled = mount.getBoundingClientRect().bottom <= 0;
    updateNavFixed(scrolled);
  }, { passive: true });
})();
