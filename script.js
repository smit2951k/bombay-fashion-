// ===== DATA =====
const products = [
  { id: 1, name: "Midnight Velvet Gown", price: 55000, category: "Dresses", img: "./product_velvet_gown_1778051880089.png", desc: "Elegant velvet gown with intricate gold zari work, perfect for evening galas. The modern silhouette meets traditional craftsmanship.", sizes: ['S', 'M', 'L'] },
  { id: 2, name: "Ivory Silk Saree", price: 42000, category: "Sarees", img: "./product_silk_saree_1778051895587.png", desc: "Pure silk saree with minimal modern borders. A timeless classic reimagined for the contemporary woman.", sizes: ['Free Size'] },
  { id: 3, name: "Golden Aura Lehenga", price: 85000, category: "Lehengas", img: "./product_gold_lehenga_1778051911288.png", desc: "Stunning bridal lehenga in gold and champagne. Features architectural motifs and structural elegance.", sizes: ['S', 'M', 'L', 'XL'] },
  { id: 4, name: "Noir Sequin Blazer", price: 35000, category: "Outerwear", img: "./product_sequin_blazer_1778051928075.png", desc: "Sharp tailored blazer with subtle sequin details. Exudes confidence and urban sophistication.", sizes: ['M', 'L'] },
  { id: 5, name: "Crimson Draped Dress", price: 48000, category: "Dresses", img: "./product_crimson_dress_1778051941275.png", desc: "Modern draped dress in striking crimson red. Designed to flatter and turn heads at any luxury event.", sizes: ['XS', 'S', 'M'] },
  { id: 6, name: "Pearl Embroidered Kurta", price: 28000, category: "Kurtas", img: "./product_pearl_kurta_1778051958546.png", desc: "Contemporary kurta with delicate pearl handwork. Effortlessly chic and perfectly balanced.", sizes: ['S', 'M', 'L', 'XL'] },
];

// ===== STATE =====
let cart = [];
let wishlist = [];
let currentView = 'home';
let selectedProduct = null;
let selectedSize = null;
let currentFilter = 'All';

// ===== HELPERS =====
function formatPrice(price) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);
}

function heartSVG(filled) {
  if (filled) {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>`;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>`;
}

// ===== NAVIGATION =====
function navigate(page, productId) {
  currentView = page;
  // Hide all pages
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  // Show target
  document.getElementById('page-' + page).classList.add('active');

  if (page === 'product' && productId) {
    selectedProduct = products.find(p => p.id === productId);
    selectedSize = null;
    renderProductDetail();
  }
  if (page === 'shop') {
    renderShopGrid();
  }

  updateNavbar();
  window.scrollTo(0, 0);
}

// ===== NAVBAR =====
function updateNavbar() {
  const navbar = document.getElementById('navbar');
  const isScrolled = window.scrollY > 50;

  if (currentView === 'home' && !isScrolled) {
    navbar.classList.add('transparent-hero');
    navbar.classList.remove('scrolled', 'not-home');
  } else if (currentView === 'home' && isScrolled) {
    navbar.classList.remove('transparent-hero');
    navbar.classList.add('scrolled');
    navbar.classList.remove('not-home');
  } else {
    navbar.classList.remove('transparent-hero');
    navbar.classList.remove('scrolled');
    navbar.classList.add('not-home');
  }
}

window.addEventListener('scroll', updateNavbar);

// ===== MOBILE MENU =====
document.getElementById('menuToggle').addEventListener('click', () => {
  document.getElementById('mobileMenu').classList.add('open');
});
document.getElementById('mobileClose').addEventListener('click', closeMobileMenu);
function closeMobileMenu() {
  document.getElementById('mobileMenu').classList.remove('open');
}

// ===== PRODUCT CARD HTML =====
function createProductCard(product, animDelay) {
  const isWished = wishlist.includes(product.id);
  return `
    <div class="product-card animate-on-scroll animate-delay-${animDelay}" onclick="navigate('product', ${product.id})">
      <div class="img-wrap">
        <img src="${product.img}" alt="${product.name}" loading="lazy">
        <button class="wishlist-btn ${isWished ? 'active text-gold' : ''}" onclick="event.stopPropagation(); toggleWishlist(${product.id});" aria-label="Add to wishlist">
          ${heartSVG(isWished)}
        </button>
        <div class="quick-add-overlay">
          <button class="quick-add-btn" onclick="event.stopPropagation(); addToCart(${product.id});">Quick Add</button>
        </div>
      </div>
      <div class="product-info">
        <h3 class="product-name">${product.name}</h3>
        <p class="product-price">${formatPrice(product.price)}</p>
      </div>
    </div>
  `;
}

// ===== RENDER NEW ARRIVALS =====
function renderNewArrivals() {
  const grid = document.getElementById('newArrivalsGrid');
  grid.innerHTML = products.slice(0, 3).map((p, i) => createProductCard(p, (i % 3) + 1)).join('');
  observeAnimations();
}

// ===== RENDER SHOP GRID =====
function renderShopGrid() {
  const grid = document.getElementById('shopGrid');
  const filtered = currentFilter === 'All' ? products : products.filter(p => p.category === currentFilter);
  grid.innerHTML = filtered.map((p, i) => createProductCard(p, (i % 3) + 1)).join('');
  observeAnimations();
}

// ===== FILTER =====
function filterProducts(category, btn) {
  currentFilter = category;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderShopGrid();
}

// ===== PRODUCT DETAIL =====
function renderProductDetail() {
  if (!selectedProduct) return;
  document.getElementById('breadcrumbName').textContent = selectedProduct.name;
  document.getElementById('detailImg').src = selectedProduct.img;
  document.getElementById('detailImg').alt = selectedProduct.name;
  document.getElementById('detailName').textContent = selectedProduct.name;
  document.getElementById('detailPrice').textContent = formatPrice(selectedProduct.price);
  document.getElementById('detailDesc').textContent = selectedProduct.desc;

  // Sizes
  const sizesEl = document.getElementById('detailSizes');
  sizesEl.innerHTML = selectedProduct.sizes.map(s =>
    `<button class="size-btn" onclick="selectSize('${s}', this)">${s}</button>`
  ).join('');

  // Add to cart
  document.getElementById('detailAddToCart').onclick = () => {
    addToCart(selectedProduct.id, selectedSize || selectedProduct.sizes[0]);
  };

  // Wishlist
  const isWished = wishlist.includes(selectedProduct.id);
  const wishBtn = document.getElementById('detailWishlist');
  wishBtn.style.color = isWished ? 'var(--gold)' : 'var(--black)';
  wishBtn.querySelector('svg').setAttribute('fill', isWished ? 'currentColor' : 'none');
  wishBtn.onclick = () => {
    toggleWishlist(selectedProduct.id);
    renderProductDetail();
  };
}

function selectSize(size, btn) {
  selectedSize = size;
  document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
}

// ===== CART =====
function addToCart(productId, size) {
  const product = products.find(p => p.id === productId);
  if (!product) return;
  cart.push({ ...product, cartId: Date.now(), selectedSize: size || product.sizes[0] });
  updateCartUI();
  openCart();
}

function removeFromCart(cartId) {
  cart = cart.filter(item => item.cartId !== cartId);
  updateCartUI();
}

function updateCartUI() {
  // Badge
  const badge = document.getElementById('cartBadge');
  if (cart.length > 0) {
    badge.classList.remove('hidden');
    badge.textContent = cart.length;
  } else {
    badge.classList.add('hidden');
  }

  // Cart items
  const empty = document.getElementById('cartEmpty');
  const items = document.getElementById('cartItems');
  const footer = document.getElementById('cartFooter');

  if (cart.length === 0) {
    empty.style.display = 'block';
    items.innerHTML = '';
    footer.classList.add('hidden');
  } else {
    empty.style.display = 'none';
    footer.classList.remove('hidden');
    items.innerHTML = cart.map(item => `
      <div class="cart-item">
        <img src="${item.img}" alt="${item.name}">
        <div class="cart-item-info">
          <div>
            <h3 class="cart-item-name">${item.name}</h3>
            <p class="cart-item-size">Size: ${item.selectedSize}</p>
            <p class="cart-item-price">${formatPrice(item.price)}</p>
          </div>
          <button class="cart-item-remove" onclick="removeFromCart(${item.cartId})">Remove</button>
        </div>
      </div>
    `).join('');
    document.getElementById('cartSubtotal').textContent = formatPrice(cart.reduce((t, i) => t + i.price, 0));
  }
}

function openCart() {
  document.getElementById('cartOverlay').classList.add('open');
  document.getElementById('cartDrawer').classList.add('open');
}

function closeCart() {
  document.getElementById('cartOverlay').classList.remove('open');
  document.getElementById('cartDrawer').classList.remove('open');
}

// ===== WISHLIST =====
function toggleWishlist(productId) {
  if (wishlist.includes(productId)) {
    wishlist = wishlist.filter(id => id !== productId);
  } else {
    wishlist.push(productId);
  }
  updateWishlistUI();
  // Re-render current view cards
  if (currentView === 'home') renderNewArrivals();
  if (currentView === 'shop') renderShopGrid();
}

function updateWishlistUI() {
  const badge = document.getElementById('wishlistBadge');
  if (wishlist.length > 0) {
    badge.classList.remove('hidden');
    badge.textContent = wishlist.length;
  } else {
    badge.classList.add('hidden');
  }
}

// ===== SCROLL ANIMATIONS =====
function observeAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.animate-on-scroll, .animate-slide-left, .animate-slide-right').forEach(el => {
    observer.observe(el);
  });
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  renderNewArrivals();
  renderShopGrid();
  updateNavbar();
  observeAnimations();
  // Init Lucide icons
  if (window.lucide) lucide.createIcons();
});
