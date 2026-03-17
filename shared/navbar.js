function initNavbar() {
  function safeQuery(sel, ctx=document) { return Array.from((ctx || document).querySelectorAll(sel) || []); }
  const userRaw = localStorage.getItem('he_user');
  const user = userRaw ? JSON.parse(userRaw) : null;
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';

  // Active nav highlighting
  const setActiveNav = () => {
    safeQuery('.nav-link').forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === currentPath) {
        link.classList.add('active');
      }
    });
  };

  // Search handler
  const searchInput = document.getElementById('navbar-search');
  if (searchInput) {
    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        const term = searchInput.value.trim();
        if (term) {
          window.location.href = `shop.html?search=${encodeURIComponent(term)}`;
        }
      }
    });
  }

  // Cart preview
  const cartPreview = document.getElementById('cart-dropdown');
  if (cartPreview && typeof getCartItems === 'function') {
    const updateCartPreview = () => {
      const items = getCartItems();
      cartPreview.innerHTML = items.length ? 
        items.map(item => `
          <li>
            <div class="dropdown-item cart-item">
              <div>${item.name}</div>
              <div class="small text-muted">Qty: ${item.qty || 1} × SRD ${item.price.toFixed(2)}</div>
            </div>
          </li>
        `).join('') + '<li><hr class="dropdown-divider"></li><li><a class="dropdown-item text-center fw-bold" href="checkout.html">View Cart</a></li>' :
        '<li><span class="dropdown-item text-center py-2">Cart empty</span></li>';
    };
    updateCartPreview();
    // Listen for cart changes
    window.addEventListener('storage', (e) => {
      if (e.key === 'he_cart') updateCartPreview();
    });
  }

  // Replace login links with logout/account
  safeQuery('a[href="login.html"]').forEach(a => {
    if (user) {
      a.textContent = 'Logout';
      a.href = '#';
      a.addEventListener('click', (e) => { 
        e.preventDefault(); 
        localStorage.removeItem('he_user'); 
        localStorage.removeItem('he_token'); 
        window.location.reload(); 
      });
    } else {
      a.addEventListener('click', () => sessionStorage.setItem('returnTo', currentPath));
    }
  });

  // User badge in right-nav
  const rightNav = document.querySelector('.right-nav');
  if (rightNav && !rightNav.querySelector('.he-user-badge')) {
    const div = document.createElement('div');
    div.className = 'he-user-badge d-flex align-items-center gap-2 px-3 py-2 rounded-pill shadow-sm flex-shrink-0';
    
    if (user) {
      const initials = user.email?.charAt(0).toUpperCase() || 'U';
      div.innerHTML = `
        <div style="width:32px;height:32px;border-radius:50%;background:#0c3b5d;color:white;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:700;flex-shrink:0;">
          ${initials}
        </div>
        <div style="color:#0c3b5d;font-size:12px;font-weight:600;max-width:120px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex-grow:1;">
          ${user.email}
        </div>
        <button class="btn btn-sm text-danger p-0 ms-1" style="font-size:11px;">Logout</button>
      `;
      div.querySelector('button').addEventListener('click', (e) => {
        e.stopPropagation();
        localStorage.removeItem('he_user');
        localStorage.removeItem('he_token');
        window.location.reload();
      });
    } else {
      div.innerHTML = `<a href="login.html" class="text-decoration-none small fw-semibold text-muted">Login</a>`;
    }
    
    rightNav.insertBefore(div, rightNav.firstChild);
  }

  setActiveNav();
  if (typeof updateCartBadge === 'function') updateCartBadge();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initNavbar, { once: true });
} else {
  initNavbar();
}
