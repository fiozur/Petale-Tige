/**
 * Cart and local storage state manager
 */
const CART_STORAGE_KEY = 'flora_atelier_cart';
const FAVORITES_STORAGE_KEY = 'flora_atelier_favorites';

export class CartManager {
  constructor() {
    this.cart = this.loadCart();
    this.favorites = this.loadFavorites();
    this.discount = 0;
    this.discountCode = '';
    this.init();
  }

  loadCart() {
    try {
      const data = localStorage.getItem(CART_STORAGE_KEY);
      return data ? JSON.parse(data) : [
        // Seed default item for instant tactile experience
        {
          id: 'aurore-rose',
          name: "L'Aurore Rose",
          variant: 'Signature',
          stems: '22 stems',
          price: 88,
          image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=400&q=80",
          quantity: 1,
          deliveryDate: new Date(Date.now() + 86400000).toISOString().split('T')[0]
        }
      ];
    } catch (e) {
      return [];
    }
  }

  saveCart() {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(this.cart));
    } catch (e) {
      console.warn('Storage quota or disabled', e);
    }
    this.updateBadges();
    this.renderDrawer();
  }

  loadFavorites() {
    try {
      const data = localStorage.getItem(FAVORITES_STORAGE_KEY);
      return data ? JSON.parse(data) : ['aurore-rose'];
    } catch (e) {
      return [];
    }
  }

  saveFavorites() {
    try {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(this.favorites));
    } catch (e) {}
    this.updateFavoriteButtons();
  }

  toggleFavorite(productId, buttonEl = null) {
    const idx = this.favorites.indexOf(productId);
    let added = false;
    if (idx > -1) {
      this.favorites.splice(idx, 1);
    } else {
      this.favorites.push(productId);
      added = true;
    }
    this.saveFavorites();

    if (buttonEl) {
      buttonEl.classList.toggle('active', added);
      buttonEl.classList.add('heart-pop');
      setTimeout(() => buttonEl.classList.remove('heart-pop'), 450);
    }

    this.showToast(added ? 'Added to your favorites' : 'Removed from favorites');
    return added;
  }

  isFavorite(productId) {
    return this.favorites.includes(productId);
  }

  addItem(item, options = { openDrawer: false }) {
    const variantName = item.variant || 'Signature';
    const existing = this.cart.find(
      i => i.id === item.id && i.variant === variantName
    );
    const addedQty = item.quantity || 1;

    if (existing) {
      existing.quantity += addedQty;
      if (item.customMessage) {
        existing.customMessage = item.customMessage;
      }
      if (item.deliveryDate) {
        existing.deliveryDate = item.deliveryDate;
      }
    } else {
      this.cart.push({
        id: item.id,
        name: item.name,
        variant: variantName,
        stems: item.stems || '22 stems',
        price: Number(item.price),
        image: item.image,
        quantity: addedQty,
        deliveryDate: item.deliveryDate || '',
        customMessage: item.customMessage ? item.customMessage.trim() : ''
      });
    }

    this.saveCart();

    // Define the Undo callback
    const undoCallback = () => {
      const target = this.cart.find(
        i => i.id === item.id && i.variant === variantName
      );
      if (target) {
        if (existing) {
          target.quantity -= addedQty;
          if (target.quantity <= 0) {
            this.cart = this.cart.filter(i => !(i.id === item.id && i.variant === variantName));
          }
        } else {
          this.cart = this.cart.filter(i => !(i.id === item.id && i.variant === variantName));
        }
        this.saveCart();
      }
    };

    // Trigger subtle glass-morphic popup with Undo action
    this.showAddToCartToast(item, undoCallback);

    if (options && options.openDrawer) {
      this.openDrawer();
    }
  }

  updateQuantity(id, variant, delta) {
    const item = this.cart.find(i => i.id === id && i.variant === variant);
    if (!item) return;

    item.quantity += delta;
    if (item.quantity <= 0) {
      this.removeItem(id, variant);
      return;
    }

    this.saveCart();
  }

  removeItem(id, variant) {
    this.cart = this.cart.filter(i => !(i.id === id && i.variant === variant));
    this.saveCart();
    this.showToast('Item removed from bouquet bag');
  }

  clearCart() {
    this.cart = [];
    this.discount = 0;
    this.discountCode = '';
    this.saveCart();
  }

  applyPromo(code) {
    const clean = code.trim().toUpperCase();
    if (clean === 'BLOOM15' || clean === 'SPRING15') {
      this.discount = 0.15;
      this.discountCode = clean;
      this.saveCart();
      this.showToast('15% Bloom discount applied!');
      return { success: true, message: '15% discount applied' };
    } else if (clean === 'FRESH10') {
      this.discount = 0.10;
      this.discountCode = clean;
      this.saveCart();
      this.showToast('10% Fresh discount applied!');
      return { success: true, message: '10% discount applied' };
    } else {
      return { success: false, message: 'Invalid code. Try "BLOOM15"' };
    }
  }

  getCount() {
    return this.cart.reduce((sum, item) => sum + item.quantity, 0);
  }

  getSubtotal() {
    return this.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  getTotal() {
    const sub = this.getSubtotal();
    return Math.max(0, sub * (1 - this.discount));
  }

  updateBadges() {
    const count = this.getCount();
    document.querySelectorAll('.cart-badge-count').forEach(el => {
      el.textContent = count;
      el.style.display = count > 0 ? 'flex' : 'none';
      el.classList.add('badge-pop');
      setTimeout(() => el.classList.remove('badge-pop'), 300);
    });
  }

  updateFavoriteButtons() {
    document.querySelectorAll('[data-fav-id]').forEach(btn => {
      const id = btn.getAttribute('data-fav-id');
      const isFav = this.isFavorite(id);
      btn.classList.toggle('active', isFav);
      btn.setAttribute('aria-label', isFav ? 'Remove from favorites' : 'Add to favorites');
    });
  }

  init() {
    this.injectCartDrawer();
    this.bindEvents();
    this.updateBadges();
    this.renderDrawer();
    this.updateFavoriteButtons();
  }

  injectCartDrawer() {
    if (document.getElementById('cart-drawer')) return;

    const drawerHtml = `
      <div id="cart-backdrop" class="cart-backdrop" aria-hidden="true"></div>
      <aside id="cart-drawer" class="cart-drawer" role="dialog" aria-modal="true" aria-label="Shopping Bag">
        <div class="cart-header">
          <div class="cart-header-title">
            <span class="eyebrow">Your Selection</span>
            <h3 class="font-serif">Bouquet Bag (<span class="cart-badge-count">0</span>)</h3>
          </div>
          <button id="cart-close-btn" class="neumorph-icon-btn" aria-label="Close cart">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div class="cart-body" id="cart-items-container">
          <!-- Cart items rendered via JS -->
        </div>

        <div class="cart-footer">
          <div class="cart-promo-row">
            <div class="neumorph-input-wrap">
              <input type="text" id="cart-promo-input" class="neumorph-input" placeholder="Promo code (e.g. BLOOM15)" />
            </div>
            <button id="cart-apply-promo-btn" class="neumorph-btn-small">Apply</button>
          </div>
          <div id="promo-status" class="promo-status"></div>

          <div class="cart-summary-line">
            <span class="text-muted">Subtotal</span>
            <span id="cart-subtotal" class="font-medium">$0.00</span>
          </div>
          <div id="cart-discount-row" class="cart-summary-line text-primary" style="display:none;">
            <span>Atelier Discount</span>
            <span id="cart-discount-amount">-$0.00</span>
          </div>
          <div class="cart-summary-line">
            <span class="text-muted">Courier Delivery</span>
            <span class="text-sage font-medium">Complimentary</span>
          </div>
          <div class="cart-summary-divider"></div>
          <div class="cart-summary-line total-line">
            <span class="font-serif text-lg">Estimated Total</span>
            <span id="cart-total" class="font-serif text-2xl text-deep">$0.00</span>
          </div>

          <button id="cart-checkout-btn" class="neumorph-btn-primary w-full mt-4">
            Proceed to Checkout
          </button>
          <p class="cart-reassurance">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            Hand-tied fresh on the morning of dispatch
          </p>
        </div>
      </aside>

      <!-- Checkout Confirmation Modal -->
      <div id="checkout-modal" class="modal-backdrop" style="display: none;">
        <div class="glass-modal">
          <div class="modal-icon-wrap">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
            </svg>
          </div>
          <h3 class="font-serif text-2xl mt-3">Order Confirmed</h3>
          <p class="text-muted text-sm mt-2">
            Thank you for choosing Pétale &amp; Tige. Your artisan florists will hand-select your blooms on the morning of delivery.
          </p>
          <div class="modal-order-card">
            <div class="modal-line"><span>Order Reference:</span> <strong>#PT-${Math.floor(100000 + Math.random() * 900000)}</strong></div>
            <div class="modal-line"><span>Estimated Dispatch:</span> <strong>Tomorrow, 8:30 AM</strong></div>
            <div class="modal-line"><span>Total Charged:</span> <strong id="modal-order-total">$0.00</strong></div>
          </div>
          <button id="modal-close-btn" class="neumorph-btn-primary w-full mt-5">Return to Boutique</button>
        </div>
      </div>
    `;

    const container = document.createElement('div');
    container.innerHTML = drawerHtml;
    document.body.appendChild(container);
  }

  bindEvents() {
    // Open cart page triggers (dedicated Bouquet Bag page)
    document.querySelectorAll('.open-cart-trigger').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = '/cart.html';
      });
    });

    const closeBtn = document.getElementById('cart-close-btn');
    const backdrop = document.getElementById('cart-backdrop');
    if (closeBtn) closeBtn.addEventListener('click', () => this.closeDrawer());
    if (backdrop) backdrop.addEventListener('click', () => this.closeDrawer());

    // Escape key closes drawer
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeDrawer();
        const modal = document.getElementById('checkout-modal');
        if (modal) modal.style.display = 'none';
      }
    });

    // Promo code apply
    const promoBtn = document.getElementById('cart-apply-promo-btn');
    const promoInput = document.getElementById('cart-promo-input');
    if (promoBtn && promoInput) {
      promoBtn.addEventListener('click', () => {
        const res = this.applyPromo(promoInput.value);
        const statusEl = document.getElementById('promo-status');
        if (statusEl) {
          statusEl.textContent = res.message;
          statusEl.className = `promo-status ${res.success ? 'success' : 'error'}`;
        }
      });
    }

    // Checkout button -> direct to dedicated order page
    const checkoutBtn = document.getElementById('cart-checkout-btn');
    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', () => {
        if (this.cart.length === 0) {
          this.showToast('Your bag is empty! Browse our bouquets first.');
          return;
        }
        window.location.href = '/order.html';
      });
    }

    const modalCloseBtn = document.getElementById('modal-close-btn');
    if (modalCloseBtn) {
      modalCloseBtn.addEventListener('click', () => {
        const modal = document.getElementById('checkout-modal');
        if (modal) modal.style.display = 'none';
        this.clearCart();
        this.closeDrawer();
      });
    }
  }

  openDrawer() {
    const drawer = document.getElementById('cart-drawer');
    const backdrop = document.getElementById('cart-backdrop');
    if (drawer && backdrop) {
      drawer.classList.add('open');
      backdrop.classList.add('open');
      document.body.style.overflow = 'hidden';
      this.renderDrawer();
    }
  }

  closeDrawer() {
    const drawer = document.getElementById('cart-drawer');
    const backdrop = document.getElementById('cart-backdrop');
    if (drawer && backdrop) {
      drawer.classList.remove('open');
      backdrop.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  openCheckoutModal() {
    const modal = document.getElementById('checkout-modal');
    const totalEl = document.getElementById('modal-order-total');
    if (modal && totalEl) {
      totalEl.textContent = `$${this.getTotal().toFixed(2)}`;
      modal.style.display = 'flex';
    }
  }

  renderDrawer() {
    const container = document.getElementById('cart-items-container');
    if (!container) return;

    if (this.cart.length === 0) {
      container.innerHTML = `
        <div class="cart-empty-state">
          <div class="empty-icon-bubble">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="text-primary-light">
              <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z"/>
              <path d="M12 7v5l3 3"/>
            </svg>
          </div>
          <p class="font-serif text-lg text-text">Your bag is breathing light</p>
          <p class="text-muted text-sm mt-1 max-w-xs text-center">No stems selected yet. Explore our handcrafted arrangements to fill your day with fragrance.</p>
          <a href="/shop.html" class="neumorph-btn-small mt-4">Browse Bouquets</a>
        </div>
      `;
    } else {
      container.innerHTML = this.cart.map(item => `
        <div class="cart-item-card" data-id="${item.id}" data-variant="${item.variant}">
          <img src="${item.image}" alt="${item.name}" class="cart-item-thumb" loading="lazy" />
          <div class="cart-item-details">
            <div class="cart-item-top">
              <h4 class="font-serif text-base text-text">${item.name}</h4>
              <button class="cart-item-remove-btn" data-remove-id="${item.id}" data-remove-variant="${item.variant}" aria-label="Remove item">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <div class="cart-item-meta">
              <span class="pill-mini">${item.variant} &bull; ${item.stems}</span>
              ${item.deliveryDate ? `<span class="pill-mini-date">Delivering ${item.deliveryDate}</span>` : ''}
            </div>
            ${item.customMessage ? `
              <div class="cart-item-custom-note">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
                <span class="cart-note-text">Note: “${item.customMessage.replace(/"/g, '&quot;')}”</span>
              </div>
            ` : ''}
            <div class="cart-item-bottom">
              <div class="neumorph-stepper">
                <button class="stepper-btn" data-step="-1" data-id="${item.id}" data-variant="${item.variant}" aria-label="Decrease quantity">&minus;</button>
                <span class="stepper-value">${item.quantity}</span>
                <button class="stepper-btn" data-step="1" data-id="${item.id}" data-variant="${item.variant}" aria-label="Increase quantity">&plus;</button>
              </div>
              <div class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
            </div>
          </div>
        </div>
      `).join('');

      // Stepper click events
      container.querySelectorAll('.stepper-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const delta = parseInt(btn.getAttribute('data-step') || '0', 10);
          const id = btn.getAttribute('data-id');
          const variant = btn.getAttribute('data-variant');
          this.updateQuantity(id, variant, delta);
        });
      });

      // Remove click events
      container.querySelectorAll('.cart-item-remove-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.getAttribute('data-remove-id');
          const variant = btn.getAttribute('data-remove-variant');
          this.removeItem(id, variant);
        });
      });
    }

    // Update totals
    const subtotal = this.getSubtotal();
    const total = this.getTotal();
    const subtotalEl = document.getElementById('cart-subtotal');
    const totalEl = document.getElementById('cart-total');
    const discountRow = document.getElementById('cart-discount-row');
    const discountAmountEl = document.getElementById('cart-discount-amount');

    if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;

    if (discountRow && discountAmountEl) {
      if (this.discount > 0) {
        discountRow.style.display = 'flex';
        discountAmountEl.textContent = `-$${(subtotal * this.discount).toFixed(2)}`;
      } else {
        discountRow.style.display = 'none';
      }
    }
  }

  showToast(message) {
    let toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
      toastContainer = document.createElement('div');
      toastContainer.id = 'toast-container';
      toastContainer.className = 'toast-container';
      document.body.appendChild(toastContainer);
    }

    const toast = document.createElement('div');
    toast.className = 'glass-toast';
    toast.innerHTML = `
      <div class="toast-dot"></div>
      <span>${message}</span>
    `;

    toastContainer.appendChild(toast);
    setTimeout(() => toast.classList.add('visible'), 10);
    setTimeout(() => {
      toast.classList.remove('visible');
      setTimeout(() => toast.remove(), 400);
    }, 2800);
  }

  showAddToCartToast(item, undoCallback) {
    let toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
      toastContainer = document.createElement('div');
      toastContainer.id = 'toast-container';
      toastContainer.className = 'toast-container';
      document.body.appendChild(toastContainer);
    }

    // Remove any previous add-to-cart toast to prevent stacking clutter
    toastContainer.querySelectorAll('.glass-toast-card').forEach(t => t.remove());

    const toast = document.createElement('div');
    toast.className = 'glass-toast glass-toast-card';
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'polite');

    const qty = item.quantity || 1;
    const variantStr = item.variant || 'Signature';
    const stemsStr = item.stems || '22 stems';
    const totalPrice = (item.price * qty).toFixed(2);
    const safeNote = item.customMessage ? item.customMessage.replace(/"/g, '&quot;') : '';

    toast.innerHTML = `
      <div class="toast-card-inner">
        <div class="toast-thumb-frame">
          <img src="${item.image}" alt="${item.name}" class="toast-thumb" />
          <span class="toast-check-bubble" aria-hidden="true">✓</span>
        </div>
        <div class="toast-details">
          <div class="toast-meta-line">
            <span class="toast-status-pill">Added to bouquet bag</span>
            <span class="toast-price-val">$${totalPrice}</span>
          </div>
          <h4 class="toast-title">${item.name}</h4>
          <p class="toast-subtext">${variantStr} &bull; ${stemsStr} &bull; Qty: ${qty}</p>
          ${safeNote ? `
            <div class="toast-note-preview">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
              <span>Note attached</span>
            </div>
          ` : ''}
        </div>
        <div class="toast-actions-stack">
          <button type="button" class="toast-undo-btn" id="toast-undo-action" aria-label="Undo adding ${item.name}">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 7v6h6"></path>
              <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"></path>
            </svg>
            <span>Undo</span>
          </button>
          <button type="button" class="toast-view-btn" id="toast-view-bag-action" aria-label="Open bouquet bag">
            Bag (${this.getCount()})
          </button>
        </div>
        <button type="button" class="toast-dismiss-btn" aria-label="Close notification">&times;</button>
      </div>
      <div class="toast-progress-track">
        <div class="toast-progress-fill" id="toast-timer-bar"></div>
      </div>
    `;

    toastContainer.appendChild(toast);
    setTimeout(() => toast.classList.add('visible'), 20);

    let dismissed = false;
    let timerId = null;
    const DURATION = 6000;
    let startTime = Date.now();
    let remaining = DURATION;

    const startTimer = () => {
      startTime = Date.now();
      timerId = setTimeout(() => {
        dismissToast();
      }, remaining);
    };

    const pauseTimer = () => {
      if (timerId) {
        clearTimeout(timerId);
        timerId = null;
        remaining -= Date.now() - startTime;
        const bar = toast.querySelector('#toast-timer-bar');
        if (bar) bar.style.animationPlayState = 'paused';
      }
    };

    const resumeTimer = () => {
      if (!dismissed && remaining > 0) {
        const bar = toast.querySelector('#toast-timer-bar');
        if (bar) bar.style.animationPlayState = 'running';
        startTimer();
      }
    };

    const dismissToast = () => {
      if (dismissed) return;
      dismissed = true;
      if (timerId) clearTimeout(timerId);
      toast.classList.remove('visible');
      setTimeout(() => toast.remove(), 350);
    };

    // Pause on hover
    toast.addEventListener('mouseenter', pauseTimer);
    toast.addEventListener('mouseleave', resumeTimer);

    // Close button
    const closeBtn = toast.querySelector('.toast-dismiss-btn');
    if (closeBtn) closeBtn.addEventListener('click', dismissToast);

    // View Bag button -> directs to dedicated Bouquet Bag page
    const viewBtn = toast.querySelector('#toast-view-bag-action');
    if (viewBtn) {
      viewBtn.addEventListener('click', () => {
        dismissToast();
        window.location.href = '/cart.html';
      });
    }

    // Undo button
    const undoBtn = toast.querySelector('#toast-undo-action');
    if (undoBtn) {
      undoBtn.addEventListener('click', () => {
        if (dismissed) return;
        dismissed = true;
        if (timerId) clearTimeout(timerId);

        // Perform the undo callback
        if (typeof undoCallback === 'function') {
          undoCallback();
        }

        // Display animated undo confirmation inside the toast
        toast.classList.add('undone-state');
        toast.innerHTML = `
          <div class="toast-undone-message">
            <div class="toast-undone-icon">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <span>Removed <strong>${item.name}</strong> from bag. Action undone.</span>
          </div>
        `;

        setTimeout(() => {
          toast.classList.remove('visible');
          setTimeout(() => toast.remove(), 350);
        }, 2000);
      });
    }

    startTimer();
  }
}

// Instantiate global singleton
export const cart = new CartManager();
