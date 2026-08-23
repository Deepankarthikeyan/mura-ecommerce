document.addEventListener('DOMContentLoaded', () => {
  initShopFilters();
  initShopSidebar();
  initForms();
  initProductActions();
});

window.addEventListener('sarees:ready', () => {
  initShopFilters();
});

function initShopSidebar() {
  const sidebar = document.querySelector('.shop-sidebar');
  const toggle = document.querySelector('.shop-filter-toggle');
  if (!sidebar || !toggle) return;

  let overlay = document.querySelector('.shop-sidebar-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'shop-sidebar-overlay';
    document.body.appendChild(overlay);
  }

  const closeBtn = sidebar.querySelector('.shop-sidebar-close');

  function openSidebar() {
    sidebar.classList.add('open');
    overlay.classList.add('open');
    document.body.classList.add('menu-open');
    toggle.setAttribute('aria-expanded', 'true');
  }

  function closeSidebar() {
    sidebar.classList.remove('open');
    overlay.classList.remove('open');
    document.body.classList.remove('menu-open');
    toggle.setAttribute('aria-expanded', 'false');
  }

  if (!toggle.dataset.bound) {
    toggle.dataset.bound = 'true';
    toggle.addEventListener('click', () => {
      if (sidebar.classList.contains('open')) closeSidebar();
      else openSidebar();
    });
  }

  if (closeBtn && !closeBtn.dataset.bound) {
    closeBtn.dataset.bound = 'true';
    closeBtn.addEventListener('click', closeSidebar);
  }

  if (!overlay.dataset.bound) {
    overlay.dataset.bound = 'true';
    overlay.addEventListener('click', closeSidebar);
  }

  window.addEventListener('resize', () => {
    if (window.innerWidth > 991) closeSidebar();
  });
}

function initShopFilters() {
  const categoryLinks = document.querySelectorAll('.sidebar-list a[data-category]');
  const resultsText = document.querySelector('.shop-results');
  const sortSelect = document.querySelector('.shop-sort select');
  const filterBtn = document.querySelector('.price-filter-btn');

  if (!categoryLinks.length) return;

  categoryLinks.forEach((link) => {
    if (link.dataset.bound) return;
    link.dataset.bound = 'true';

    link.addEventListener('click', (e) => {
      e.preventDefault();
      categoryLinks.forEach((l) => l.classList.remove('active'));
      link.classList.add('active');

      const category = link.dataset.category;
      const products = document.querySelectorAll('.shop-products .suruchi-product');
      let visible = 0;

      products.forEach((product) => {
        const match = category === 'all' || product.dataset.category === category;
        product.style.display = match ? '' : 'none';
        if (match) visible++;
      });

      if (resultsText) {
        resultsText.textContent = `Showing ${visible} saree${visible !== 1 ? 's' : ''} on sale`;
      }
    });
  });

  if (sortSelect && !sortSelect.dataset.bound) {
    sortSelect.dataset.bound = 'true';
    sortSelect.addEventListener('change', () => {
      const grid = document.querySelector('.shop-products');
      if (!grid) return;
      const cards = Array.from(grid.querySelectorAll('.suruchi-product'));

      cards.sort((a, b) => {
        const priceA = parseFloat(a.dataset.price);
        const priceB = parseFloat(b.dataset.price);

        switch (sortSelect.value) {
          case 'price-low': return priceA - priceB;
          case 'price-high': return priceB - priceA;
          case 'name': return a.dataset.name.localeCompare(b.dataset.name);
          default: return 0;
        }
      });

      cards.forEach((card) => grid.appendChild(card));
    });
  }

  if (filterBtn && !filterBtn.dataset.bound) {
    filterBtn.dataset.bound = 'true';
    filterBtn.addEventListener('click', () => {
      const min = parseFloat(document.getElementById('price-min')?.value) || 0;
      const max = parseFloat(document.getElementById('price-max')?.value) || Infinity;
      const products = document.querySelectorAll('.shop-products .suruchi-product');
      let visible = 0;

      products.forEach((product) => {
        const price = parseFloat(product.dataset.price);
        const match = price >= min && price <= max;
        product.style.display = match ? '' : 'none';
        if (match) visible++;
      });

      if (resultsText) {
        resultsText.textContent = `Showing ${visible} saree${visible !== 1 ? 's' : ''} on sale`;
      }
    });
  }
}

function initForms() {
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      showNotification('Welcome back! Login successful.');
      loginForm.reset();
    });
  }

  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      showNotification('Thank you! Your message has been sent.');
      contactForm.reset();
    });
  }

  document.querySelectorAll('.newsletter-form').forEach((form) => {
    if (form.dataset.bound) return;
    form.dataset.bound = 'true';
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      showNotification('You have been subscribed to our newsletter!');
      form.reset();
    });
  });
}

let cartCount = 0;

function initProductActions() {
  if (document.body.dataset.cartBound) return;
  document.body.dataset.cartBound = 'true';

  document.addEventListener('click', (e) => {
    const cartBtn = e.target.closest('.add-to-cart');
    if (cartBtn) {
      e.preventDefault();
      cartCount++;
      document.querySelectorAll('.cart-count').forEach((badge) => {
        badge.textContent = cartCount;
        badge.style.display = 'flex';
      });
      const card = cartBtn.closest('.product-card, .suruchi-product');
      const name = card?.querySelector('.product-name, .suruchi-product-name')?.textContent?.trim() || 'Saree';
      showNotification(`${name} added to cart!`);
      return;
    }

    const wishBtn = e.target.closest('.wishlist-btn');
    if (wishBtn) {
      e.preventDefault();
      wishBtn.classList.toggle('active');
      showNotification(wishBtn.classList.contains('active') ? 'Added to wishlist!' : 'Removed from wishlist.');
    }
  });
}

function showNotification(message) {
  const existing = document.querySelector('.notification');
  if (existing) existing.remove();

  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.textContent = message;
  Object.assign(notification.style, {
    position: 'fixed',
    bottom: '24px',
    right: '24px',
    background: '#cf0653',
    color: '#fff',
    padding: '16px 24px',
    borderRadius: '8px',
    boxShadow: '0 4px 20px rgba(207,6,83,0.3)',
    zIndex: '10000',
    fontSize: '14px',
    fontWeight: '500',
    animation: 'slideIn 0.3s ease',
    maxWidth: '320px',
  });

  if (!document.getElementById('notification-style')) {
    const style = document.createElement('style');
    style.id = 'notification-style';
    style.textContent = `
      @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
    `;
    document.head.appendChild(style);
  }

  document.body.appendChild(notification);
  setTimeout(() => {
    notification.style.opacity = '0';
    notification.style.transition = 'opacity 0.3s';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}
