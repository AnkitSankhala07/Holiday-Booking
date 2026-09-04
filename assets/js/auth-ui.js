// =========================================================
// RULEMYHOLIDAY — Auth UI Modal & Navigation Controller
// =========================================================

document.addEventListener('DOMContentLoaded', () => {
  initAuthUI();
});

function initAuthUI() {
  injectAuthModalHTML();
  renderHeaderAuthState();
  setupAuthEventListeners();
}

function injectAuthModalHTML() {
  if (document.getElementById('authModalBackdrop')) return;

  const modalHTML = `
    <div class="auth-modal-backdrop" id="authModalBackdrop">
      <div class="auth-modal-card">
        <button class="auth-modal-close" id="authModalClose">✕</button>
        
        <div class="auth-modal-header">
          <h3>Welcome to RuleMyHoliday</h3>
          <p>Login or create an account to manage your bookings</p>
        </div>

        <div class="auth-tabs">
          <button class="auth-tab-btn active" id="tabLoginBtn">Sign In</button>
          <button class="auth-tab-btn" id="tabRegisterBtn">Create Account</button>
        </div>

        <div class="auth-form-container">
          <div class="auth-error-msg" id="authErrorMsg"></div>

          <!-- Login Form -->
          <form id="loginForm">
            <div class="auth-form-group">
              <label for="loginEmail">Email Address</label>
              <input type="email" id="loginEmail" class="auth-input" placeholder="name@example.com" required>
            </div>
            <div class="auth-form-group">
              <label for="loginPassword">Password</label>
              <input type="password" id="loginPassword" class="auth-input" placeholder="••••••••" required>
            </div>
            <button type="submit" class="btn-auth-submit" id="loginSubmitBtn">Sign In</button>
          </form>

          <!-- Register Form -->
          <form id="registerForm" style="display: none;">
            <div class="auth-form-group">
              <label for="regName">Full Name</label>
              <input type="text" id="regName" class="auth-input" placeholder="John Doe" required>
            </div>
            <div class="auth-form-group">
              <label for="regEmail">Email Address</label>
              <input type="email" id="regEmail" class="auth-input" placeholder="name@example.com" required>
            </div>
            <div class="auth-form-group">
              <label for="regPhone">Phone Number</label>
              <input type="tel" id="regPhone" class="auth-input" placeholder="+91 9876543210">
            </div>
            <div class="auth-form-group">
              <label for="regPassword">Password</label>
              <input type="password" id="regPassword" class="auth-input" placeholder="Min. 6 characters" minlength="6" required>
            </div>
            <button type="submit" class="btn-auth-submit" id="registerSubmitBtn">Create Account</button>
          </form>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHTML);
}

function renderHeaderAuthState() {
  const navRight = document.querySelector('.nav-right');
  if (!navRight) return;

  const existingAuthBtn = document.getElementById('headerAuthBtn');
  const existingUserPill = document.getElementById('headerUserPill');

  if (existingAuthBtn) existingAuthBtn.remove();
  if (existingUserPill) existingUserPill.remove();

  if (window.ApiClient && window.ApiClient.isLoggedIn()) {
    const user = window.ApiClient.getUser();
    const firstInitial = user.name ? user.name.charAt(0).toUpperCase() : 'U';

    const userPillHTML = `
      <div class="user-menu-pill" id="headerUserPill">
        <button class="btn-user-profile" id="btnUserProfile">
          <span class="user-avatar-circle">${firstInitial}</span>
          <span>${escapeHTML(user.name.split(' ')[0])}</span>
          <span style="font-size: 10px;">▼</span>
        </button>
        <div class="user-dropdown-menu" id="userDropdownMenu">
          <div style="padding: 10px 16px; border-bottom: 1px solid #F1F5F9;">
            <strong style="display: block; font-size: 13px; color: #0F172A;">${escapeHTML(user.name)}</strong>
            <span style="font-size: 11px; color: #64748B;">${escapeHTML(user.email)}</span>
          </div>
          <button class="user-dropdown-item logout-item" id="btnLogout">Sign Out</button>
        </div>
      </div>
    `;
    navRight.insertAdjacentHTML('afterbegin', userPillHTML);

    const btnProfile = document.getElementById('btnUserProfile');
    const dropdownMenu = document.getElementById('userDropdownMenu');
    const btnLogout = document.getElementById('btnLogout');

    if (btnProfile && dropdownMenu) {
      btnProfile.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdownMenu.classList.toggle('active');
      });

      document.addEventListener('click', () => {
        dropdownMenu.classList.remove('active');
      });
    }

    if (btnLogout) {
      btnLogout.addEventListener('click', () => {
        window.ApiClient.logout();
      });
    }
  } else {
    const loginBtnHTML = `
      <button class="btn-contact-pill" id="headerAuthBtn" style="background: rgba(255, 5, 84, 0.15); color: #FF0554; border: 1px solid rgba(255, 5, 84, 0.4);">
        Sign In / Register
      </button>
    `;
    navRight.insertAdjacentHTML('afterbegin', loginBtnHTML);

    const btnAuth = document.getElementById('headerAuthBtn');
    if (btnAuth) {
      btnAuth.addEventListener('click', () => openAuthModal());
    }
  }
}

function setupAuthEventListeners() {
  const backdrop = document.getElementById('authModalBackdrop');
  const closeBtn = document.getElementById('authModalClose');
  const tabLoginBtn = document.getElementById('tabLoginBtn');
  const tabRegisterBtn = document.getElementById('tabRegisterBtn');
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const errorMsg = document.getElementById('authErrorMsg');

  if (!backdrop) return;

  if (closeBtn) {
    closeBtn.addEventListener('click', closeAuthModal);
  }

  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) closeAuthModal();
  });

  if (tabLoginBtn && tabRegisterBtn) {
    tabLoginBtn.addEventListener('click', () => {
      tabLoginBtn.classList.add('active');
      tabRegisterBtn.classList.remove('active');
      loginForm.style.display = 'block';
      registerForm.style.display = 'none';
      hideAuthError();
    });

    tabRegisterBtn.addEventListener('click', () => {
      tabRegisterBtn.classList.add('active');
      tabLoginBtn.classList.remove('active');
      loginForm.style.display = 'none';
      registerForm.style.display = 'block';
      hideAuthError();
    });
  }

  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      hideAuthError();
      const email = document.getElementById('loginEmail').value.trim();
      const password = document.getElementById('loginPassword').value.trim();

      try {
        await window.ApiClient.login(email, password);
        closeAuthModal();
        renderHeaderAuthState();
        showNotification('Successfully logged in!', 'success');
      } catch (err) {
        showAuthError(err.message || 'Login failed');
      }
    });
  }

  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      hideAuthError();
      const name = document.getElementById('regName').value.trim();
      const email = document.getElementById('regEmail').value.trim();
      const phone = document.getElementById('regPhone').value.trim();
      const password = document.getElementById('regPassword').value.trim();

      try {
        await window.ApiClient.register(name, email, password, phone);
        closeAuthModal();
        renderHeaderAuthState();
        showNotification('Account created successfully!', 'success');
      } catch (err) {
        showAuthError(err.message || 'Registration failed');
      }
    });
  }
}

function openAuthModal(defaultTab = 'login') {
  const backdrop = document.getElementById('authModalBackdrop');
  if (!backdrop) return;
  backdrop.classList.add('active');

  if (defaultTab === 'register') {
    document.getElementById('tabRegisterBtn').click();
  } else {
    document.getElementById('tabLoginBtn').click();
  }
}

function closeAuthModal() {
  const backdrop = document.getElementById('authModalBackdrop');
  if (backdrop) backdrop.classList.remove('active');
}

function showAuthError(msg) {
  const errorMsg = document.getElementById('authErrorMsg');
  if (errorMsg) {
    errorMsg.textContent = msg;
    errorMsg.style.display = 'block';
  }
}

function hideAuthError() {
  const errorMsg = document.getElementById('authErrorMsg');
  if (errorMsg) {
    errorMsg.style.display = 'none';
    errorMsg.textContent = '';
  }
}

function showNotification(msg, type = 'info') {
  const toast = document.createElement('div');
  toast.style.cssText = `
    position: fixed;
    bottom: 24px;
    right: 24px;
    background: ${type === 'success' ? '#10B981' : '#FF0554'};
    color: #FFF;
    padding: 12px 20px;
    border-radius: 12px;
    font-weight: 600;
    box-shadow: 0 10px 25px rgba(0,0,0,0.2);
    z-index: 10000;
    transition: transform 0.3s ease;
  `;
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

function escapeHTML(str) {
  return str ? str.replace(/[&<>'"]/g, tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag])) : '';
}

window.openAuthModal = openAuthModal;
