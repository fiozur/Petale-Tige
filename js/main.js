/**
 * Main application script for Flower Bouquet Shop
 */
import { cart } from './cart.js';
import { COLLECTIONS, getProductById, HARVEST_BLOOMS, HARVEST_SEASONS, PRODUCTS } from './products.js';

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initFloatingNavbar();
  initParallaxBlobs();
  initNewsletterForms();
  initLazyImages();
  initScrollReveal();

  // Route-specific logic
  const path = window.location.pathname;

  if (path.includes('shop.html')) {
    initShopPage();
  } else if (path.includes('product.html')) {
    initProductPage();
  } else if (path.includes('cart.html')) {
    initCartPage();
  } else if (path.includes('order.html')) {
    initOrderPage();
  } else if (path.includes('about.html')) {
    initAboutPage();
  } else if (path.includes('contact.html')) {
    initContactPage();
  } else {
    // Default to Home page logic
    initHomePage();
  }
});

function initFloatingNavbar() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 20);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ==========================================================================
   NAVIGATION & MOBILE MENU (Spring Physics & Glass Backdrop)
   ========================================================================== */
function initMobileNav() {
  const menuBtn = document.getElementById('mobile-menu-toggle');
  const drawer = document.getElementById('mobile-nav-drawer');

  if (!menuBtn || !drawer) return;

  // Ensure backdrop element exists for full-screen blur
  let backdrop = document.getElementById('mobile-nav-backdrop');
  if (!backdrop) {
    backdrop = document.createElement('div');
    backdrop.id = 'mobile-nav-backdrop';
    backdrop.className = 'mobile-nav-backdrop';
    backdrop.setAttribute('aria-hidden', 'true');
    drawer.parentNode.insertBefore(backdrop, drawer);
  }

  const toggleNav = (open) => {
    const shouldOpen = open !== undefined ? open : !drawer.classList.contains('open');
    drawer.classList.toggle('open', shouldOpen);
    backdrop.classList.toggle('open', shouldOpen);
    document.body.classList.toggle('mobile-nav-open', shouldOpen);
    menuBtn.setAttribute('aria-expanded', shouldOpen ? 'true' : 'false');

    menuBtn.innerHTML = shouldOpen
      ? `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`
      : `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>`;
  };

  menuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleNav();
  });

  backdrop.addEventListener('click', () => toggleNav(false));

  // Close when clicking a nav link
  drawer.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', () => toggleNav(false));
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) {
      toggleNav(false);
    }
  });
}

/* ==========================================================================
   PARALLAX BACKGROUND BLOBS
   ========================================================================== */
function initParallaxBlobs() {
  const blobs = document.querySelectorAll('.ambient-blobs-layer .blob');
  if (!blobs.length) return;

  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const scrolled = window.scrollY;
        blobs.forEach((blob, index) => {
          const speed = (index + 1) * 0.04;
          blob.style.transform = `translateY(${scrolled * speed}px)`;
        });
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

/* ==========================================================================
   PRODUCT CARD COMPONENT (Clean direct click to detail page & Glass Sheen)
   ========================================================================== */
export function createProductCardHTML(product) {
  const isFav = cart.isFavorite(product.id);
  const flowersStr = product.flowers.slice(0, 3).join(', ') + (product.flowers.length > 3 ? '...' : '');

  return `
    <article class="product-card scroll-reveal" id="card-${product.id}" data-product-id="${product.id}">
      <div class="product-image-wrap">
        <div class="card-glass-sheen" aria-hidden="true"></div>
        <a href="/product.html?id=${product.id}" aria-label="View ${product.name}">
          <img src="${product.image}" alt="${product.name}" class="product-image" loading="lazy" />
        </a>
        ${product.bestseller ? `<span class="product-badge">Atelier Favorite</span>` : ''}
        <button class="neumorph-icon-btn fav-btn product-fav-btn ${isFav ? 'active' : ''}" data-fav-id="${product.id}" aria-label="${isFav ? 'Remove from favorites' : 'Add to favorites'}">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="${isFav ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </button>
      </div>
      <div class="product-body">
        <a href="/product.html?id=${product.id}">
          <h3 class="font-serif text-lg">${product.name}</h3>
        </a>
        <p class="product-flowers-line" title="${product.flowers.join(', ')}">${flowersStr}</p>
        <div class="product-bottom-row">
          <div class="product-price">$${product.price}</div>
          <button class="neumorph-btn-small quick-add-btn" data-product-id="${product.id}">
            + Quick Add
          </button>
        </div>
      </div>
    </article>
  `;
}

export function bindProductCardEvents(container) {
  if (!container) return;

  // Favorite button toggles
  container.querySelectorAll('.fav-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const id = btn.getAttribute('data-fav-id');
      cart.toggleFavorite(id, btn);
    });
  });

  // Quick Add buttons
  container.querySelectorAll('.quick-add-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const id = btn.getAttribute('data-product-id');
      const prod = getProductById(id);
      if (prod) {
        cart.addItem({
          id: prod.id,
          name: prod.name,
          price: prod.price,
          variant: 'Signature',
          stems: '22 stems',
          image: prod.image,
          quantity: 1
        });
      }
    });
  });

  // Direct card click navigation to details page
  container.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('.fav-btn') || e.target.closest('.quick-add-btn')) {
        return;
      }
      const prodId = card.getAttribute('data-product-id');
      if (prodId) {
        window.location.href = `/product.html?id=${prodId}`;
      }
    });
  });

  // Re-observe and attach interactions for dynamic cards
  initLazyImages(container);
  initScrollReveal(container);
  initMagneticCards(container);
}

/* ==========================================================================
   BOUQUET BAG PAGE INITIALIZATION (Your Selection — cart.html)
   ========================================================================== */
function initCartPage() {
  const itemsContainer = document.getElementById('cart-page-items-list');
  const badgeEl = document.getElementById('cart-page-badge');
  const subtotalEl = document.getElementById('cart-subtotal-val');
  const discountLine = document.getElementById('cart-discount-line');
  const discountValEl = document.getElementById('cart-discount-val');
  const discountPercentEl = document.getElementById('cart-discount-percent');
  const finalTotalEl = document.getElementById('cart-final-total-val');
  const promoInput = document.getElementById('cart-promo-code');
  const promoBtn = document.getElementById('cart-apply-promo');
  const promoFeedback = document.getElementById('cart-promo-feedback');
  const checkoutLink = document.getElementById('cart-checkout-link');

  if (!itemsContainer) return;

  const count = cart.getCount();
  if (badgeEl) {
    badgeEl.textContent = `${count} ${count === 1 ? 'bouquet' : 'bouquets'}`;
  }

  // Render bag items or empty state
  if (cart.cart.length === 0) {
    itemsContainer.innerHTML = `
      <div class="glass-panel text-center py-16 px-6" style="border-radius: 28px;">
        <div style="width: 64px; height: 64px; border-radius: 50%; background: rgba(217, 123, 146, 0.12); display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; color: var(--deep-rose);">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <path d="M16 10a4 4 0 0 1-8 0"></path>
          </svg>
        </div>
        <h3 class="font-serif text-2xl text-deep mb-2">Your Bouquet Bag is Breathing Light</h3>
        <p class="text-muted text-sm max-w-md mx-auto mb-6">No stems currently reserved. Browse our handcrafted morning harvests to begin your arrangement.</p>
        <a href="/shop.html" class="checkout-proceed-btn" style="display: inline-flex; width: auto; padding: 12px 28px;">
          Explore Studio Bouquets &rarr;
        </a>
      </div>
    `;

    if (checkoutLink) {
      checkoutLink.style.opacity = '0.5';
      checkoutLink.style.pointerEvents = 'none';
    }
  } else {
    if (checkoutLink) {
      checkoutLink.style.opacity = '1';
      checkoutLink.style.pointerEvents = 'auto';
    }

    itemsContainer.innerHTML = cart.cart.map(item => `
      <div class="cart-page-item" data-id="${item.id}" data-variant="${item.variant}">
        <a href="/product.html?id=${item.id}" class="cart-page-thumb-link" aria-label="View ${item.name}">
          <img src="${item.image}" alt="${item.name}" class="cart-page-thumb" />
        </a>
        <div class="cart-page-item-info">
          <a href="/product.html?id=${item.id}" class="cart-page-item-title">${item.name}</a>
          <div class="cart-page-meta-row">
            <span class="cart-pill-tag">${item.variant} &bull; ${item.stems}</span>
            ${item.deliveryDate ? `<span class="cart-date-tag">🌿 Courier dispatch: ${item.deliveryDate}</span>` : ''}
          </div>
          ${item.customMessage ? `
            <div class="cart-note-card-preview">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
              <div>
                <span class="block font-bold text-xs uppercase text-primary">Handwritten Deckled Card:</span>
                <em>“${item.customMessage.replace(/"/g, '&quot;')}”</em>
              </div>
            </div>
          ` : ''}
        </div>
        <div class="cart-page-item-actions">
          <div class="cart-page-price-block">
            <div class="cart-page-total-price">$${(item.price * item.quantity).toFixed(2)}</div>
            <div class="cart-page-unit-price">$${item.price} each</div>
          </div>
          <div class="neumorph-stepper">
            <button class="stepper-btn page-step-btn" data-step="-1" data-id="${item.id}" data-variant="${item.variant}" aria-label="Decrease quantity">&minus;</button>
            <span class="stepper-value">${item.quantity}</span>
            <button class="stepper-btn page-step-btn" data-step="1" data-id="${item.id}" data-variant="${item.variant}" aria-label="Increase quantity">&plus;</button>
          </div>
          <button class="cart-page-remove-btn page-remove-btn" data-id="${item.id}" data-variant="${item.variant}" aria-label="Remove ${item.name} from bag">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
            <span>Remove</span>
          </button>
        </div>
      </div>
    `).join('');

    // Attach Stepper click handlers
    itemsContainer.querySelectorAll('.page-step-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const delta = parseInt(btn.getAttribute('data-step') || '0', 10);
        const id = btn.getAttribute('data-id');
        const variant = btn.getAttribute('data-variant');
        cart.updateQuantity(id, variant, delta);
        initCartPage();
      });
    });

    // Attach Remove click handlers
    itemsContainer.querySelectorAll('.page-remove-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const variant = btn.getAttribute('data-variant');
        cart.removeItem(id, variant);
        initCartPage();
      });
    });
  }

  // Update Deduction and Totals
  const subtotal = cart.getSubtotal();
  const total = cart.getTotal();

  if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
  if (finalTotalEl) finalTotalEl.textContent = `$${total.toFixed(2)}`;

  if (discountLine && discountValEl) {
    if (cart.discount > 0) {
      discountLine.style.display = 'flex';
      discountValEl.textContent = `-$${(subtotal * cart.discount).toFixed(2)}`;
      if (discountPercentEl) {
        discountPercentEl.textContent = `${Math.round(cart.discount * 100)}% DEDUCTION`;
      }
    } else {
      discountLine.style.display = 'none';
    }
  }

  // Promo Code Apply handler
  if (promoBtn && promoInput) {
    promoBtn.onclick = () => {
      const res = cart.applyPromo(promoInput.value);
      if (promoFeedback) {
        promoFeedback.style.display = 'block';
        promoFeedback.textContent = res.message;
        promoFeedback.className = `promo-msg ${res.success ? 'success' : 'error'}`;
      }
      initCartPage();
    };
  }
}

/* ==========================================================================
   DEDUCTED ORDER PAGE INITIALIZATION (Checkout & Receipt — order.html)
   ========================================================================== */
function initOrderPage() {
  const checkoutView = document.getElementById('order-checkout-view');
  const receiptView = document.getElementById('order-receipt-view');
  const form = document.getElementById('order-checkout-form');
  const itemsSummaryList = document.getElementById('order-items-summary-list');
  const subtotalEl = document.getElementById('order-subtotal-val');
  const discountLine = document.getElementById('order-discount-line');
  const discountValEl = document.getElementById('order-discount-val');
  const discountPercentEl = document.getElementById('order-discount-percent');
  const finalTotalEl = document.getElementById('order-final-total-val');
  const submitText = document.getElementById('order-submit-text');
  const noteBox = document.getElementById('order-note-preview-box');
  const noteText = document.getElementById('order-note-text');

  if (!form || !checkoutView) return;

  // If cart is completely empty, prompt user to add bouquets first
  if (cart.cart.length === 0) {
    checkoutView.innerHTML = `
      <div class="glass-panel text-center py-20 px-6 col-span-2" style="border-radius: 32px;">
        <h3 class="font-serif text-3xl text-deep mb-3">No Bouquets to Order</h3>
        <p class="text-muted text-sm max-w-md mx-auto mb-6">Your bouquet bag is empty. Please choose stems from our catalog before initiating deduction checkout.</p>
        <a href="/shop.html" class="checkout-proceed-btn" style="display: inline-flex; width: auto; padding: 12px 30px;">
          Browse Handcrafted Bouquets &rarr;
        </a>
      </div>
    `;
    return;
  }

  // Render Order Items
  if (itemsSummaryList) {
    itemsSummaryList.innerHTML = cart.cart.map(item => `
      <div class="flex items-center gap-3 p-2 rounded-xl bg-white/50 border border-white/80">
        <img src="${item.image}" alt="${item.name}" class="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
        <div class="flex-1 min-w-0">
          <h4 class="font-serif text-sm text-deep truncate">${item.name}</h4>
          <span class="text-xs text-muted">${item.variant} &bull; Qty: ${item.quantity}</span>
        </div>
        <div class="text-right">
          <span class="font-serif text-sm font-semibold text-deep">$${(item.price * item.quantity).toFixed(2)}</span>
        </div>
      </div>
    `).join('');
  }

  // Update Deductions & Total
  const subtotal = cart.getSubtotal();
  const total = cart.getTotal();

  if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
  if (finalTotalEl) finalTotalEl.textContent = `$${total.toFixed(2)}`;
  if (submitText) submitText.textContent = `Authorize Deduction & Place Order ($${total.toFixed(2)})`;

  if (discountLine && discountValEl) {
    if (cart.discount > 0) {
      discountLine.style.display = 'flex';
      discountValEl.textContent = `-$${(subtotal * cart.discount).toFixed(2)}`;
      if (discountPercentEl) {
        discountPercentEl.textContent = `${Math.round(cart.discount * 100)}% VOUCHER`;
      }
    } else {
      discountLine.style.display = 'none';
    }
  }

  // Show note preview if any bouquet has custom message
  const itemWithNote = cart.cart.find(i => Boolean(i.customMessage));
  if (noteBox && noteText) {
    if (itemWithNote) {
      noteBox.style.display = 'flex';
      noteText.textContent = `“${itemWithNote.customMessage}”`;
    } else {
      noteBox.style.display = 'none';
    }
  }

  // Payment method selection pills
  const paymentPills = document.querySelectorAll('.payment-pill-btn');
  const cardFields = document.getElementById('payment-card-fields');

  paymentPills.forEach(pill => {
    pill.addEventListener('click', () => {
      paymentPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      const method = pill.getAttribute('data-method');
      if (cardFields) {
        if (method === 'card') {
          cardFields.style.display = 'block';
        } else {
          cardFields.style.display = 'none';
        }
      }
    });
  });

  // Submit Handler -> Transitions to Confirmed Deducted Receipt
  form.onsubmit = (e) => {
    e.preventDefault();

    const recipientName = document.getElementById('recipient-name')?.value || 'Recipient';
    const deliveryAddress = document.getElementById('delivery-address')?.value || 'Delivery Address';
    const deliveryCity = document.getElementById('delivery-city')?.value || '';
    const senderName = document.getElementById('sender-name')?.value || 'Customer';

    const orderRef = `PT-${Math.floor(100000 + Math.random() * 900000)}`;

    // Populate Receipt View
    const receiptRefEl = document.getElementById('receipt-order-ref');
    const receiptSenderEl = document.getElementById('receipt-sender-name');
    const receiptRecipientEl = document.getElementById('receipt-recipient-info');
    const receiptItemsList = document.getElementById('receipt-items-list');
    const receiptFinalAmount = document.getElementById('receipt-final-amount');
    const receiptNoteContainer = document.getElementById('receipt-note-container');
    const receiptNoteMessage = document.getElementById('receipt-note-message');

    if (receiptRefEl) receiptRefEl.textContent = `#${orderRef}`;
    if (receiptSenderEl) receiptSenderEl.textContent = senderName;
    if (receiptRecipientEl) receiptRecipientEl.textContent = `${recipientName} — ${deliveryAddress}, ${deliveryCity}`;
    if (receiptFinalAmount) receiptFinalAmount.textContent = `$${total.toFixed(2)}`;

    if (receiptItemsList) {
      receiptItemsList.innerHTML = cart.cart.map(item => `
        <div class="flex justify-between items-center text-sm py-1 border-b border-white/60">
          <span>${item.name} (${item.variant}) &times; ${item.quantity}</span>
          <span class="font-medium text-deep">$${(item.price * item.quantity).toFixed(2)}</span>
        </div>
      `).join('') + (cart.discount > 0 ? `
        <div class="flex justify-between items-center text-sm py-1 text-sage font-semibold">
          <span>Seasonal Voucher Deduction</span>
          <span>-$${(subtotal * cart.discount).toFixed(2)}</span>
        </div>
      ` : '');
    }

    if (itemWithNote && receiptNoteContainer && receiptNoteMessage) {
      receiptNoteContainer.style.display = 'block';
      receiptNoteMessage.textContent = `“${itemWithNote.customMessage}”`;
    }

    // Switch screens
    checkoutView.style.display = 'none';
    if (receiptView) {
      receiptView.style.display = 'block';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Clear cart once order is confirmed
    cart.clearCart();
    cart.showToast(`Deducted order #${orderRef} confirmed!`);
  };
}

/* ==========================================================================
   HOME PAGE INITIALIZATION
   ========================================================================== */
function initHomePage() {
  // 1. Featured Collections
  const collectionsContainer = document.getElementById('home-collections-grid');
  if (collectionsContainer) {
    collectionsContainer.innerHTML = COLLECTIONS.map(col => `
      <a href="/shop.html?occasion=${col.id}" class="collection-card scroll-reveal">
        <img src="${col.image}" alt="${col.title}" class="collection-bg-img" loading="lazy" />
        <div class="collection-overlay"></div>
        <div class="collection-content">
          <span class="collection-count-pill">${col.count}</span>
          <h3 class="font-serif text-xl" style="color: #FFFFFF;">${col.title}</h3>
          <p class="text-sm" style="color: rgba(255,255,255,0.85);">${col.subtitle}</p>
        </div>
      </a>
    `).join('');
    initLazyImages(collectionsContainer);
    initScrollReveal(collectionsContainer);
  }

  // 2. Best Sellers Grid
  const bestSellersContainer = document.getElementById('home-bestsellers-grid');
  if (bestSellersContainer) {
    const bestSellers = PRODUCTS.filter(p => p.bestseller).concat(
      PRODUCTS.filter(p => !p.bestseller)
    ).slice(0, 6);

    bestSellersContainer.innerHTML = bestSellers.map(p => createProductCardHTML(p)).join('');
    bindProductCardEvents(bestSellersContainer);
  }
}

/* ==========================================================================
   SHOP / CATALOG PAGE INITIALIZATION (WITH SEASONAL HARVEST CALENDAR)
   ========================================================================== */
function initShopPage() {
  const gridContainer = document.getElementById('shop-products-grid');
  const countLabel = document.getElementById('shop-product-count');
  const sortSelect = document.getElementById('shop-sort-select');

  // Harvest Calendar elements
  const harvestRibbon = document.getElementById('harvest-seasons-ribbon');
  const harvestContainer = document.getElementById('harvest-display-container');
  const btnGrid = document.getElementById('harvest-btn-grid');
  const btnTimeline = document.getElementById('harvest-btn-timeline');
  const filterBanner = document.getElementById('harvest-active-filter-banner');
  const filterTitle = document.getElementById('harvest-filter-title');
  const clearHarvestBtn = document.getElementById('harvest-filter-clear-btn');

  if (!gridContainer) return;

  const urlParams = new URLSearchParams(window.location.search);
  let activeOccasion = urlParams.get('occasion') || 'all';
  let activeColor = 'all';
  let activePrice = 'all'; // 'all', 'under-90', '90-120', 'above-120'
  let activeSeason = 'all'; // 'all', 'autumn', 'spring', 'summer', 'winter'
  let activeBloom = null; // specific bloom filter object
  let currentSort = 'featured';
  let currentHarvestView = 'grid'; // 'grid' | 'timeline'

  // Mark initial occasion pill if from URL
  if (activeOccasion !== 'all') {
    document.querySelectorAll('[data-filter-type="occasion"]').forEach(pill => {
      pill.classList.toggle('active', pill.getAttribute('data-value') === activeOccasion);
    });
  }

  /* --------------------------------------------------------------------------
     Harvest Calendar Renderers
     -------------------------------------------------------------------------- */
  function renderHarvestRibbon() {
    if (!harvestRibbon) return;

    harvestRibbon.innerHTML = HARVEST_SEASONS.map(season => {
      const isSelected = season.id === activeSeason;
      return `
        <button type="button" class="season-ribbon-pill ${isSelected ? 'active' : ''}" data-season-id="${season.id}" role="tab" aria-selected="${isSelected}">
          <div class="season-pill-header">
            <span class="season-pill-name">${season.name}</span>
            ${season.isCurrent ? `<span class="season-peak-tag">Peak Now</span>` : ''}
          </div>
          <div class="season-pill-months">${season.months}</div>
        </button>
      `;
    }).join('');

    harvestRibbon.querySelectorAll('.season-ribbon-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        const sId = btn.getAttribute('data-season-id');
        activeSeason = sId;
        activeBloom = null; // clear single-bloom focus when changing season
        syncSidebarSeasonPills(activeSeason);
        renderHarvestRibbon();
        renderHarvestBlooms();
        filterAndRender();
        updateHarvestBanner();
      });
    });
  }

  function renderHarvestBlooms() {
    if (!harvestContainer) return;

    if (currentHarvestView === 'grid') {
      // Filter blooms by activeSeason (or all if 'all')
      const blooms = (activeSeason === 'all')
        ? HARVEST_BLOOMS
        : HARVEST_BLOOMS.filter(b => b.season === activeSeason);

      harvestContainer.innerHTML = `
        <div class="harvest-blooms-grid">
          ${blooms.map(bloom => `
            <article class="harvest-bloom-card" id="bloom-${bloom.id}">
              <div class="harvest-bloom-media">
                <img src="${bloom.image}" alt="${bloom.name}" class="harvest-bloom-img" loading="lazy" />
                <span class="harvest-bloom-tag ${bloom.isPeakNow ? '' : 'upcoming'}">
                  ${bloom.isPeakNow ? 'Peak Harvest Now' : 'Seasonal Atelier'}
                </span>
              </div>
              <div class="harvest-bloom-body">
                <h3 class="harvest-bloom-common">${bloom.name}</h3>
                <div class="harvest-bloom-botanical">${bloom.botanicalName}</div>
                <div class="harvest-bloom-window">${bloom.peakWindow}</div>
                <p class="harvest-bloom-notes">${bloom.summary}</p>
                <div class="harvest-bloom-specs">
                  <div><strong>Scent:</strong> ${bloom.scent}</div>
                  <div><strong>Longevity:</strong> ${bloom.vaseLife}</div>
                </div>
                <button type="button" class="harvest-bloom-link-btn" data-harvest-bloom-id="${bloom.id}">
                  <span>View Bouquets with ${bloom.name}</span> &rarr;
                </button>
              </div>
            </article>
          `).join('')}
        </div>
      `;

      // Bind link buttons to filter bouquets
      harvestContainer.querySelectorAll('[data-harvest-bloom-id]').forEach(btn => {
        btn.addEventListener('click', () => {
          const bloomId = btn.getAttribute('data-harvest-bloom-id');
          const found = HARVEST_BLOOMS.find(b => b.id === bloomId);
          if (found) {
            activeBloom = found;
            filterAndRender();
            updateHarvestBanner();
            // Smoothly scroll to product grid
            gridContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        });
      });
    } else {
      // Timeline View Ribbon
      harvestContainer.innerHTML = `
        <div class="harvest-timeline-view">
          <div class="text-center mb-4">
            <span class="eyebrow">Botanical Bloom Sequence</span>
            <h4 class="font-serif text-lg text-deep">Annual Harvest Cycle & Terroir Highlights</h4>
          </div>
          <div class="harvest-timeline-track">
            ${HARVEST_SEASONS.filter(s => s.id !== 'all').map(s => `
              <div class="timeline-season-node ${s.id === activeSeason ? 'active' : ''} ${s.isCurrent ? 'peak-now' : ''}" data-timeline-season="${s.id}">
                <div class="timeline-node-circle"></div>
                <div class="timeline-season-title">${s.name}</div>
                <div class="timeline-season-blooms">${s.months}</div>
              </div>
            `).join('')}
          </div>
        </div>
      `;

      harvestContainer.querySelectorAll('.timeline-season-node').forEach(node => {
        node.addEventListener('click', () => {
          const sId = node.getAttribute('data-timeline-season');
          activeSeason = sId;
          activeBloom = null;
          syncSidebarSeasonPills(activeSeason);
          renderHarvestRibbon();
          renderHarvestBlooms();
          filterAndRender();
          updateHarvestBanner();
        });
      });
    }
  }

  function syncSidebarSeasonPills(seasonVal) {
    document.querySelectorAll('[data-filter-type="season"]').forEach(p => {
      p.classList.toggle('active', p.getAttribute('data-value') === seasonVal);
    });
  }

  function updateHarvestBanner() {
    if (!filterBanner || !filterTitle) return;

    if (activeBloom) {
      filterBanner.style.display = 'flex';
      filterTitle.textContent = `${activeBloom.name} (${activeBloom.peakWindow})`;
    } else if (activeSeason !== 'all') {
      const s = HARVEST_SEASONS.find(item => item.id === activeSeason);
      filterBanner.style.display = 'flex';
      filterTitle.textContent = s ? `${s.name} (${s.months})` : activeSeason;
    } else {
      filterBanner.style.display = 'none';
    }
  }

  // View toggle buttons
  if (btnGrid && btnTimeline) {
    btnGrid.addEventListener('click', () => {
      currentHarvestView = 'grid';
      btnGrid.classList.add('active');
      btnGrid.setAttribute('aria-pressed', 'true');
      btnTimeline.classList.remove('active');
      btnTimeline.setAttribute('aria-pressed', 'false');
      renderHarvestBlooms();
    });

    btnTimeline.addEventListener('click', () => {
      currentHarvestView = 'timeline';
      btnTimeline.classList.add('active');
      btnTimeline.setAttribute('aria-pressed', 'true');
      btnGrid.classList.remove('active');
      btnGrid.setAttribute('aria-pressed', 'false');
      renderHarvestBlooms();
    });
  }

  // Clear harvest filter link in banner
  if (clearHarvestBtn) {
    clearHarvestBtn.addEventListener('click', () => {
      activeSeason = 'all';
      activeBloom = null;
      syncSidebarSeasonPills('all');
      renderHarvestRibbon();
      renderHarvestBlooms();
      updateHarvestBanner();
      filterAndRender();
    });
  }

  // Initial Harvest Calendar render
  renderHarvestRibbon();
  renderHarvestBlooms();

  /* --------------------------------------------------------------------------
     Main Catalog Filter & Render
     -------------------------------------------------------------------------- */
  function filterAndRender() {
    let list = [...PRODUCTS];

    // Filter Occasion
    if (activeOccasion !== 'all') {
      list = list.filter(p => p.occasion.includes(activeOccasion));
    }

    // Filter Color
    if (activeColor !== 'all') {
      list = list.filter(p => p.color === activeColor);
    }

    // Filter Price
    if (activePrice === 'under-90') {
      list = list.filter(p => p.price < 90);
    } else if (activePrice === '90-120') {
      list = list.filter(p => p.price >= 90 && p.price <= 120);
    } else if (activePrice === 'above-120') {
      list = list.filter(p => p.price > 120);
    }

    // Filter by Harvest Bloom (specific flower species)
    if (activeBloom) {
      list = list.filter(p => {
        if (activeBloom.matchingBouquets && activeBloom.matchingBouquets.includes(p.id)) {
          return true;
        }
        return p.flowers.some(f => f.toLowerCase().includes(activeBloom.flowerQuery.toLowerCase()));
      });
    } else if (activeSeason !== 'all') {
      // Filter by Harvest Season
      list = list.filter(p => {
        if (!p.season) return true;
        if (Array.isArray(p.season)) {
          return p.season.includes(activeSeason) || p.season.includes('year-round');
        }
        return p.season === activeSeason || p.season === 'year-round';
      });
    }

    // Sort
    if (currentSort === 'price-low') {
      list.sort((a, b) => a.price - b.price);
    } else if (currentSort === 'price-high') {
      list.sort((a, b) => b.price - a.price);
    } else if (currentSort === 'name') {
      list.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      // Featured
      list.sort((a, b) => (b.bestseller ? 1 : 0) - (a.bestseller ? 1 : 0));
    }

    if (countLabel) {
      countLabel.textContent = `${list.length} ${list.length === 1 ? 'Bouquet' : 'Bouquets'}`;
    }

    if (list.length === 0) {
      gridContainer.innerHTML = `
        <div class="cart-empty-state" style="grid-column: 1 / -1; padding: 60px 20px;">
          <div class="empty-icon-bubble">
            <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" class="text-primary">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="8" y1="12" x2="16" y2="12"></line>
            </svg>
          </div>
          <h3 class="font-serif text-xl">No blooms match this criteria</h3>
          <p class="text-muted text-sm mt-1 max-w-sm">Try relaxing your color, season, or price filters to view more of our studio arrangements.</p>
          <button id="reset-filters-btn" class="neumorph-btn-small mt-4">Reset All Filters</button>
        </div>
      `;
      const resetBtn = document.getElementById('reset-filters-btn');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          activeOccasion = 'all';
          activeColor = 'all';
          activePrice = 'all';
          activeSeason = 'all';
          activeBloom = null;
          document.querySelectorAll('.neu-pill').forEach(p => {
            p.classList.toggle('active', p.getAttribute('data-value') === 'all');
          });
          renderHarvestRibbon();
          renderHarvestBlooms();
          updateHarvestBanner();
          filterAndRender();
        });
      }
    } else {
      gridContainer.innerHTML = list.map(p => createProductCardHTML(p)).join('');
      bindProductCardEvents(gridContainer);
    }
  }

  // Sidebar Pill click handlers
  document.querySelectorAll('[data-filter-type]').forEach(pill => {
    pill.addEventListener('click', () => {
      const type = pill.getAttribute('data-filter-type');
      const val = pill.getAttribute('data-value');

      // Unset active for sibling pills
      document.querySelectorAll(`[data-filter-type="${type}"]`).forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      if (type === 'occasion') activeOccasion = val;
      if (type === 'color') activeColor = val;
      if (type === 'price') activePrice = val;
      if (type === 'season') {
        activeSeason = val;
        activeBloom = null;
        renderHarvestRibbon();
        renderHarvestBlooms();
        updateHarvestBanner();
      }

      filterAndRender();
    });
  });

  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      currentSort = e.target.value;
      filterAndRender();
    });
  }

  filterAndRender();
}

/* ==========================================================================
   PRODUCT DETAIL PAGE INITIALIZATION (WITH CUSTOM MESSAGE & CHARACTER TRACKING)
   ========================================================================== */
function initProductPage() {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id') || 'aurore-rose';
  const product = getProductById(productId);

  // Update page title
  document.title = `${product.name} — Flower Bouquet Shop`;

  // Main gallery
  const mainImage = document.getElementById('product-detail-main-img');
  const thumbsContainer = document.getElementById('product-thumbs-container');
  if (mainImage) mainImage.src = product.image;

  if (thumbsContainer && product.gallery) {
    thumbsContainer.innerHTML = product.gallery.map((imgUrl, index) => `
      <button class="thumb-btn ${index === 0 ? 'active' : ''}" data-img-url="${imgUrl}" aria-label="View gallery image ${index + 1}">
        <img src="${imgUrl}" alt="${product.name} photo ${index + 1}" />
      </button>
    `).join('');

    thumbsContainer.querySelectorAll('.thumb-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        thumbsContainer.querySelectorAll('.thumb-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const targetUrl = btn.getAttribute('data-img-url');
        if (mainImage) {
          mainImage.style.opacity = '0.3';
          setTimeout(() => {
            mainImage.src = targetUrl;
            mainImage.style.opacity = '1';
          }, 150);
        }
      });
    });
  }

  // Populate info
  const nameEl = document.getElementById('product-detail-name');
  const subtitleEl = document.getElementById('product-detail-subtitle');
  const priceEl = document.getElementById('product-detail-price');
  const descEl = document.getElementById('product-detail-desc');
  const ratingEl = document.getElementById('product-detail-rating');
  const flowersContainer = document.getElementById('product-flowers-tags');
  const vaseNoticeEl = document.getElementById('product-vase-notice');

  if (nameEl) nameEl.textContent = product.name;
  if (subtitleEl) subtitleEl.textContent = product.subtitle;
  if (descEl) descEl.textContent = product.description;
  if (ratingEl) ratingEl.textContent = `${product.rating} ★ (${product.reviewsCount} reviews)`;
  if (vaseNoticeEl) vaseNoticeEl.textContent = product.vaseIncluded;

  if (flowersContainer && product.flowers) {
    flowersContainer.innerHTML = product.flowers.map(f => `<span class="flower-tag">${f}</span>`).join('');
  }

  // Size variant selector & dynamic price
  let selectedVariant = product.sizes ? product.sizes.find(s => s.isDefault) || product.sizes[0] : { name: 'Signature', price: product.price, stems: '22 stems' };
  let currentQuantity = 1;

  function updatePriceDisplay() {
    if (priceEl) {
      priceEl.textContent = `$${(selectedVariant.price * currentQuantity).toFixed(2)}`;
    }
  }

  const sizesContainer = document.getElementById('product-sizes-container');
  if (sizesContainer && product.sizes) {
    sizesContainer.innerHTML = product.sizes.map(size => `
      <div class="size-pill-card ${size.id === selectedVariant.id ? 'active' : ''}" data-size-id="${size.id}">
        <span class="font-serif text-base font-medium">${size.name}</span>
        <span class="text-xs text-muted">${size.stems} &bull; $${size.price}</span>
      </div>
    `).join('');

    sizesContainer.querySelectorAll('.size-pill-card').forEach(card => {
      card.addEventListener('click', () => {
        sizesContainer.querySelectorAll('.size-pill-card').forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        const sizeId = card.getAttribute('data-size-id');
        selectedVariant = product.sizes.find(s => s.id === sizeId);
        updatePriceDisplay();
      });
    });
  }

  updatePriceDisplay();

  // Quantity Stepper
  const stepperMinus = document.getElementById('detail-stepper-minus');
  const stepperPlus = document.getElementById('detail-stepper-plus');
  const stepperVal = document.getElementById('detail-stepper-val');

  if (stepperMinus && stepperPlus && stepperVal) {
    stepperMinus.addEventListener('click', () => {
      if (currentQuantity > 1) {
        currentQuantity--;
        stepperVal.textContent = currentQuantity;
        updatePriceDisplay();
      }
    });

    stepperPlus.addEventListener('click', () => {
      currentQuantity++;
      stepperVal.textContent = currentQuantity;
      updatePriceDisplay();
    });
  }

  // Delivery date picker minimum set to tomorrow
  const dateInput = document.getElementById('delivery-date-input');
  if (dateInput) {
    const tomorrow = new Date(Date.now() + 86400000);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    dateInput.min = tomorrowStr;
    dateInput.value = tomorrowStr;
  }

  // Favorite button on Detail Page
  const favBtn = document.getElementById('detail-fav-btn');
  if (favBtn) {
    favBtn.setAttribute('data-fav-id', product.id);
    const isFav = cart.isFavorite(product.id);
    favBtn.classList.toggle('active', isFav);
    favBtn.addEventListener('click', () => {
      cart.toggleFavorite(product.id, favBtn);
    });
  }

  /* --------------------------------------------------------------------------
     Custom Message Field with Character Count Tracking & Visual Counter
     -------------------------------------------------------------------------- */
  const customMsgInput = document.getElementById('custom-message-input');
  const customMsgCount = document.getElementById('custom-message-count');
  const customMsgCounter = document.getElementById('custom-message-counter');
  const customMsgCircle = document.getElementById('custom-message-circle');
  const charMeterFill = document.getElementById('char-meter-fill');
  const customMsgClearBtn = document.getElementById('custom-message-clear-btn');
  const MAX_MESSAGE_CHARS = 200;
  const CIRCUMFERENCE = 56.5; // 2 * Math.PI * 9 (radius)

  function updateCharacterTracker() {
    if (!customMsgInput) return;
    const count = customMsgInput.value.length;

    // Update numerical pill
    if (customMsgCount) {
      customMsgCount.textContent = count;
    }

    // Update SVG gauge ring
    if (customMsgCircle) {
      const ratio = Math.min(count / MAX_MESSAGE_CHARS, 1);
      const dashOffset = CIRCUMFERENCE - (ratio * CIRCUMFERENCE);
      customMsgCircle.style.strokeDashoffset = dashOffset;

      customMsgCircle.classList.toggle('near-limit', count >= 175 && count < MAX_MESSAGE_CHARS);
      customMsgCircle.classList.toggle('at-limit', count >= MAX_MESSAGE_CHARS);
    }

    // Update linear meter fill
    if (charMeterFill) {
      const pct = Math.min((count / MAX_MESSAGE_CHARS) * 100, 100);
      charMeterFill.style.width = `${pct}%`;
      charMeterFill.classList.toggle('near-limit', count >= 175 && count < MAX_MESSAGE_CHARS);
      charMeterFill.classList.toggle('at-limit', count >= MAX_MESSAGE_CHARS);
    }

    // Pill styling
    if (customMsgCounter) {
      customMsgCounter.classList.toggle('near-limit', count >= 175 && count < MAX_MESSAGE_CHARS);
      customMsgCounter.classList.toggle('at-limit', count >= MAX_MESSAGE_CHARS);
    }

    // Show/hide clear button
    if (customMsgClearBtn) {
      customMsgClearBtn.style.display = count > 0 ? 'inline-block' : 'none';
    }
  }

  if (customMsgInput) {
    customMsgInput.addEventListener('input', updateCharacterTracker);

    // Wire up quick sentiment chips
    document.querySelectorAll('.sentiment-quick-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const template = chip.getAttribute('data-sentiment');
        if (template) {
          customMsgInput.value = template;
          updateCharacterTracker();
          customMsgInput.focus();
        }
      });
    });

    // Wire up clear button
    if (customMsgClearBtn) {
      customMsgClearBtn.addEventListener('click', () => {
        customMsgInput.value = '';
        updateCharacterTracker();
        customMsgInput.focus();
      });
    }

    // Initial state check
    updateCharacterTracker();
  }

  // Add to cart primary CTA with Custom Message
  const addToCartBtn = document.getElementById('detail-add-to-cart-btn');
  if (addToCartBtn) {
    addToCartBtn.addEventListener('click', () => {
      const personalMessage = customMsgInput ? customMsgInput.value.trim() : '';

      cart.addItem({
        id: product.id,
        name: product.name,
        price: selectedVariant.price,
        variant: selectedVariant.name,
        stems: selectedVariant.stems,
        image: product.image,
        quantity: currentQuantity,
        deliveryDate: dateInput ? dateInput.value : '',
        customMessage: personalMessage
      });
    });
  }

  // Accordion Expand/Collapse
  document.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', () => {
      const item = header.closest('.accordion-item');
      item.classList.toggle('open');
    });
  });

  // Related products row
  const relatedGrid = document.getElementById('related-products-grid');
  if (relatedGrid) {
    const related = PRODUCTS.filter(p => p.id !== product.id).slice(0, 3);
    relatedGrid.innerHTML = related.map(p => createProductCardHTML(p)).join('');
    bindProductCardEvents(relatedGrid);
  }
}

/* ==========================================================================
   ABOUT PAGE
   ========================================================================== */
function initAboutPage() {
  // Care Tips Accordions or smooth reveal handlers
  document.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', () => {
      const item = header.closest('.accordion-item');
      item.classList.toggle('open');
    });
  });
}

/* ==========================================================================
   CONTACT PAGE
   ========================================================================== */
function initContactPage() {
  const form = document.getElementById('contact-form');
  const statusEl = document.getElementById('contact-status-msg');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (statusEl) {
        statusEl.innerHTML = `
          <div class="glass-panel" style="padding: 16px; margin-top: 14px; border-color: rgba(168, 184, 154, 0.8);">
            <p class="text-sage font-medium">Thank you for your note!</p>
            <p class="text-muted text-sm mt-1">A boutique florist from our studio will respond within 3 business hours.</p>
          </div>
        `;
        form.reset();
      }
      cart.showToast('Message received by our studio florists');
    });
  }
}

/* ==========================================================================
   NEWSLETTER FORMS
   ========================================================================== */
function initNewsletterForms() {
  document.querySelectorAll('.newsletter-form').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      if (input && input.value) {
        cart.showToast('Welcome to Pétale & Tige Journal');
        input.value = '';
      }
    });
  });
}

/* ==========================================================================
   MAGNETIC TACTILE HOVER EFFECT (Bestsellers Grid & Premium Cards)
   ========================================================================== */
export function initMagneticCards(container = document) {
  // Gracefully skip on touch devices or if prefers-reduced-motion is enabled
  if (window.matchMedia('(hover: none) or (prefers-reduced-motion: reduce)').matches) {
    return;
  }

  const cards = container.querySelectorAll(
    '#home-bestsellers-grid .product-card, .magnetic-card, [data-magnetic="true"]'
  );

  cards.forEach(card => {
    if (card.dataset.magneticBound) return;
    card.dataset.magneticBound = 'true';

    const imageWrap = card.querySelector('.product-image-wrap');
    const image = card.querySelector('.product-image');
    let sheen = card.querySelector('.card-glass-sheen');

    if (!sheen && imageWrap) {
      sheen = document.createElement('div');
      sheen.className = 'card-glass-sheen';
      sheen.setAttribute('aria-hidden', 'true');
      imageWrap.insertBefore(sheen, imageWrap.firstChild);
    }

    let rafId = null;
    let targetRotateX = 0;
    let targetRotateY = 0;
    let targetTranslateImgX = 0;
    let targetTranslateImgY = 0;
    let targetSheenX = 50;
    let targetSheenY = 50;

    const onMouseMove = (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Normalized coordinates from -1 to 1
      const normX = Math.max(-1, Math.min(1, (x - centerX) / centerX));
      const normY = Math.max(-1, Math.min(1, (y - centerY) / centerY));

      // Subtle tactile tilt (5.5 degrees)
      const maxTilt = 5.5;
      targetRotateX = -normY * maxTilt;
      targetRotateY = normX * maxTilt;

      // Parallax shifts inside the card
      targetTranslateImgX = normX * 6.5;
      targetTranslateImgY = normY * 6.5;

      targetSheenX = Math.round((x / rect.width) * 100);
      targetSheenY = Math.round((y / rect.height) * 100);

      if (!rafId) {
        rafId = requestAnimationFrame(updateTransform);
      }
    };

    const updateTransform = () => {
      card.style.transform = `perspective(1000px) rotateX(${targetRotateX.toFixed(2)}deg) rotateY(${targetRotateY.toFixed(2)}deg) translateY(-8px) scale(1.02)`;

      if (image) {
        image.style.transform = `scale(1.06) translate3d(${targetTranslateImgX.toFixed(1)}px, ${targetTranslateImgY.toFixed(1)}px, 12px)`;
      }

      if (sheen) {
        sheen.style.background = `radial-gradient(circle at ${targetSheenX}% ${targetSheenY}%, rgba(255, 255, 255, 0.48) 0%, rgba(255, 255, 255, 0.08) 45%, transparent 75%)`;
        sheen.style.opacity = '1';
        sheen.style.transform = `translate3d(${(targetTranslateImgX * 1.5).toFixed(1)}px, ${(targetTranslateImgY * 1.5).toFixed(1)}px, 18px)`;
      }

      rafId = null;
    };

    const onMouseEnter = () => {
      card.style.transition = 'transform 0.12s ease-out, box-shadow 0.25s ease-out, border-color 0.25s ease-out';
      if (image) {
        image.style.transition = 'transform 0.14s ease-out, filter 0.65s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.65s cubic-bezier(0.16, 1, 0.3, 1)';
      }
      if (sheen) {
        sheen.style.transition = 'opacity 0.25s ease-out, transform 0.14s ease-out';
      }
    };

    const onMouseLeave = () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      card.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.5s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.35s ease';
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0) scale(1)';

      if (image) {
        image.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), filter 0.65s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.65s cubic-bezier(0.16, 1, 0.3, 1)';
        image.style.transform = 'scale(1) translate3d(0, 0, 0)';
      }

      if (sheen) {
        sheen.style.transition = 'opacity 0.35s ease, transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
        sheen.style.opacity = '0';
        sheen.style.transform = 'translate3d(0, 0, 0)';
      }
    };

    card.addEventListener('mousemove', onMouseMove, { passive: true });
    card.addEventListener('mouseenter', onMouseEnter);
    card.addEventListener('mouseleave', onMouseLeave);
  });
}

/* ==========================================================================
   LAZY LOADING WITH INTERSECTION OBSERVER & CROSS-FADE (Prevents Layout Shifts)
   ========================================================================== */
export function initLazyImages(container = document) {
  const images = container.querySelectorAll(
    '.product-image, .hero-img, .collection-bg-img, .product-main-image, .harvest-bloom-img, img[loading="lazy"], img[data-src]'
  );

  const markImageLoaded = (img) => {
    img.classList.add('image-loaded');
    const wrap = img.closest('.product-image-wrap, .hero-image-wrap, .harvest-bloom-media');
    if (wrap) {
      wrap.classList.add('image-ready');
    }
  };

  if (!('IntersectionObserver' in window)) {
    images.forEach(img => {
      if (img.dataset.src) {
        img.src = img.dataset.src;
      }
      markImageLoaded(img);
    });
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;

        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
        }

        if (img.complete && img.naturalWidth > 0) {
          markImageLoaded(img);
        } else {
          img.addEventListener('load', () => markImageLoaded(img), { once: true });
          img.addEventListener('error', () => markImageLoaded(img), { once: true });
        }

        obs.unobserve(img);
      }
    });
  }, {
    root: null,
    rootMargin: '180px 0px 180px 0px',
    threshold: 0.01
  });

  images.forEach(img => {
    if (img.complete && img.naturalWidth > 0) {
      markImageLoaded(img);
    } else {
      observer.observe(img);
    }
  });
}

/* ==========================================================================
   SCROLLTRIGGER-LIKE REVEAL INTERACTIONS (Organic Soft Boutique Motion)
   ========================================================================== */
export function initScrollReveal(scope = document) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    scope.querySelectorAll('.scroll-reveal').forEach(el => el.classList.add('is-revealed'));
    return;
  }

  const candidates = scope.querySelectorAll(
    'section:not(.hero-section), .section-header, .catalog-top-bar, .collections-grid .collection-card, .products-grid .product-card, .why-card, .newsletter-card, .story-card, .story-text-col, .craft-step-card, .testimonial-card, .faq-item, .contact-card, .harvest-calendar-card, .glass-panel'
  );

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        obs.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    rootMargin: '0px 0px -36px 0px',
    threshold: 0.08
  });

  candidates.forEach(el => {
    // Never hide hero elements
    if (el.closest('.hero-section')) return;

    if (!el.classList.contains('scroll-reveal')) {
      el.classList.add('scroll-reveal');
    }

    // Gentle stagger for siblings inside grids
    const parentGrid = el.parentElement?.closest('.collections-grid, .products-grid, .why-us-grid, .story-grid, .values-grid');
    if (parentGrid) {
      const siblings = Array.from(parentGrid.querySelectorAll('.scroll-reveal'));
      const index = siblings.indexOf(el);
      if (index >= 0) {
        el.style.transitionDelay = `${(index % 4) * 0.08}s`;
      }
    }

    // If already visible in viewport on initial load
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      requestAnimationFrame(() => el.classList.add('is-revealed'));
    } else {
      observer.observe(el);
    }
  });
}
