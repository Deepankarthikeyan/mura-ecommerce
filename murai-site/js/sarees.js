// Shared saree product data — sale sarees only (local images)
const IMG = 'images/sarees';

function sareeProductCard(s, style = 'shop') {
  const badge = s.badge || 'Sale';
  const actions = style === 'bestseller' ? '' : `<div class="suruchi-product-actions">
          <button class="suruchi-action-btn primary add-to-cart" type="button">+ Add to cart</button>
          <button class="suruchi-action-btn wishlist-btn" type="button">♡</button>
        </div>`;
  const dataAttrs = style === 'shop'
    ? ` data-category="${s.category}" data-price="${s.price}" data-name="${s.name}"`
    : '';

  return `<div class="suruchi-product"${dataAttrs}>
      <div class="suruchi-product-img">
        <a href="shop.html"><img src="${s.img}" alt="${s.name}" loading="lazy"></a>
        <span class="suruchi-product-badge">${badge}</span>
      </div>
      <div class="suruchi-product-info">
        <span class="suruchi-product-cat">${s.cat}</span>
        <h3 class="suruchi-product-name"><a href="shop.html">${s.name}</a></h3>
        <div class="suruchi-product-price"><span class="current">₹${s.price.toLocaleString('en-IN')}</span><span class="old">₹${s.old.toLocaleString('en-IN')}</span></div>
        <div class="suruchi-stars">★★★★★</div>
        ${actions}
      </div>
    </div>`;
}

const ALL_SAREES = [
  { name: 'Banarasi Silk Saree', cat: 'Silk Saree', category: 'silk', price: 3599, old: 5999, img: `${IMG}/banarasi.webp` },
  { name: 'Kanjivaram Silk Saree', cat: 'Kanjivaram', category: 'kanjivaram', price: 4999, old: 7999, img: `${IMG}/kanjivaram.webp` },
  { name: 'Cotton Block Print Saree', cat: 'Cotton Saree', category: 'cotton', price: 899, old: 1499, img: `${IMG}/cotton-block.webp` },
  { name: 'Georgette Party Saree', cat: 'Party Wear', category: 'party', price: 1299, old: 2199, img: `${IMG}/georgette-party.webp` },
  { name: 'Chiffon Embroidered Saree', cat: 'Designer Saree', category: 'party', price: 1599, old: 2499, img: `${IMG}/chiffon.webp` },
  { name: 'Tussar Silk Saree', cat: 'Silk Saree', category: 'silk', price: 2199, old: 3499, img: `${IMG}/tussar.webp` },
  { name: 'Patola Silk Saree', cat: 'Silk Saree', category: 'silk', price: 5499, old: 8999, img: `${IMG}/patola.webp` },
  { name: 'Linen Cotton Saree', cat: 'Cotton Saree', category: 'cotton', price: 1099, old: 1799, img: `${IMG}/linen-cotton.webp` },
  { name: 'Organza Designer Saree', cat: 'Designer Saree', category: 'party', price: 1899, old: 2999, img: `${IMG}/organza.webp` },
  { name: 'Mysore Silk Saree', cat: 'Silk Saree', category: 'silk', price: 3999, old: 5999, img: `${IMG}/mysore.webp` },
  { name: 'Kalamkari Cotton Saree', cat: 'Cotton Saree', category: 'cotton', price: 999, old: 1599, img: `${IMG}/kalamkari.webp` },
  { name: 'Net Party Wear Saree', cat: 'Party Wear', category: 'party', price: 1499, old: 2299, img: `${IMG}/net-party.webp` },
  { name: 'Kanchipuram Silk Saree', cat: 'Kanjivaram', category: 'kanjivaram', price: 5999, old: 8999, img: `${IMG}/kanchipuram.webp` },
];

function renderSarees() {
  const shopGrid = document.querySelector('.shop-products[data-render="sarees"]');
  if (shopGrid) {
    shopGrid.innerHTML = ALL_SAREES.map((s) => sareeProductCard(s, 'shop')).join('');
    const results = document.querySelector('.shop-results');
    if (results) results.textContent = `Showing ${ALL_SAREES.length} sarees on sale`;
  }

  const featured = document.getElementById('sarees-featured');
  const trending = document.getElementById('sarees-trending');
  const newArrival = document.getElementById('sarees-newarrival');
  const bestseller = document.getElementById('sarees-bestseller');

  if (featured) featured.innerHTML = ALL_SAREES.filter((s) => s.category === 'silk').map((s) => sareeProductCard(s, 'home')).join('');
  if (trending) trending.innerHTML = ALL_SAREES.filter((s) => s.category === 'cotton').map((s) => sareeProductCard(s, 'home')).join('');
  if (newArrival) newArrival.innerHTML = ALL_SAREES.filter((s) => s.category === 'party' || s.category === 'kanjivaram').map((s) => sareeProductCard(s, 'home')).join('');
  if (bestseller) bestseller.innerHTML = ALL_SAREES.slice(0, 4).map((s) => sareeProductCard(s, 'bestseller')).join('');

  const dealImg = document.querySelector('.deals-product-img img');
  if (dealImg) {
    dealImg.src = ALL_SAREES[0].img;
    dealImg.alt = ALL_SAREES[0].name;
  }

  window.dispatchEvent(new CustomEvent('sarees:ready'));
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', renderSarees);
} else {
  renderSarees();
}
