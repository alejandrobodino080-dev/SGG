/**
 * ==========================================================================
 * PROYECTO SGG - LÓGICA DE AUTENTICACIÓN Y TEMA
 * Principios aplicados: DRY, ETC, Ortogonalidad y Accesibilidad (WCAG)
 * ==========================================================================
 */

// 1. CONFIGURACIÓN CENTRALIZADA (Principio ETC - Easy To Change)
const CONFIG = {
  KEYS: {
    USERS: 'sgg_users_db',
    THEME: 'sgg_theme_preference'
  },
  DEFAULT_USERS: [
    { username: 'admin', password: 'password123' },
    { username: 'usuario1', password: 'clave456' }
  ],
  THEMES: {
    LIGHT: 'light',
    DARK: 'dark'
  }
};

// 2. GESTIÓN DEL ESTADO Y PERSISTENCIA (Ortogonalidad: Capa de Datos)
const StorageManager = {
  getUsers() {
    const data = localStorage.getItem(CONFIG.KEYS.USERS);
    if (!data) {
      // Inicializar con usuarios predeterminados de prueba si no existen
      this.saveUsers(CONFIG.DEFAULT_USERS);
      return CONFIG.DEFAULT_USERS;
    }
    return JSON.parse(data);
  },

  saveUsers(users) {
    localStorage.setItem(CONFIG.KEYS.USERS, JSON.stringify(users));
  },

  findUser(username) {
    const users = this.getUsers();
    return users.find(u => u.username.toLowerCase() === username.toLowerCase());
  },

  addUser(newUser) {
    const users = this.getUsers();
    users.push(newUser);
    this.saveUsers(users);
  },

  getTheme() {
    return localStorage.getItem(CONFIG.KEYS.THEME) || CONFIG.THEMES.LIGHT;
  },

  saveTheme(theme) {
    localStorage.setItem(CONFIG.KEYS.THEME, theme);
  }
};

// 3. FUNCIONES AUXILIARES DE UI (Principio DRY - Don't Repeat Yourself)
const UIRenderer = {
  showMessage(targetId, text, isSuccess) {
    const el = document.getElementById(targetId);
    if (!el) return;
    
    el.textContent = text;
    el.className = `message-banner ${isSuccess ? 'success' : 'error'}`;
  },

  clearMessages() {
    document.querySelectorAll('.message-banner').forEach(el => {
      el.textContent = '';
      el.className = 'message-banner';
    });
  }
};

// 4. MÓDULO DE INTERRUPTOR DE TEMA DÍA/NOCHE (Ortogonalidad y WCAG)
const ThemeController = {
  init() {
    const savedTheme = StorageManager.getTheme();
    this.setTheme(savedTheme);

    const toggleBtn = document.getElementById('theme-toggle');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => this.toggleTheme());
    }
  },

  setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    StorageManager.saveTheme(theme);

    const toggleBtn = document.getElementById('theme-toggle');
    const themeIcon = document.querySelector('.theme-icon');
    const themeText = document.getElementById('theme-text');

    const isDark = theme === CONFIG.THEMES.DARK;
    if (toggleBtn) {
      toggleBtn.setAttribute('aria-pressed', isDark ? 'true' : 'false');
    }
    if (themeIcon) {
      themeIcon.textContent = isDark ? '🌙' : '☀️';
    }
    if (themeText) {
      themeText.textContent = isDark ? 'Modo Claro' : 'Modo Oscuro';
    }
  },

  toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || CONFIG.THEMES.LIGHT;
    const nextTheme = currentTheme === CONFIG.THEMES.LIGHT ? CONFIG.THEMES.DARK : CONFIG.THEMES.LIGHT;
    this.setTheme(nextTheme);
  }
};

// 5. MÓDULO DE AUTENTICACIÓN Y REGISTRO (Logica de Negocio)
const AuthController = {
  init() {
    this.setupTabs();
    this.setupLoginForm();
    this.setupRegisterForm();
    // Asegurar que existan los usuarios por defecto al cargar
    StorageManager.getUsers();
  },

  setupTabs() {
    const tabLogin = document.getElementById('tab-login');
    const tabRegister = document.getElementById('tab-register');
    const panelLogin = document.getElementById('panel-login');
    const panelRegister = document.getElementById('panel-register');

    if (!tabLogin || !tabRegister) return;

    tabLogin.addEventListener('click', () => {
      tabLogin.classList.add('active');
      tabLogin.setAttribute('aria-selected', 'true');
      tabRegister.classList.remove('active');
      tabRegister.setAttribute('aria-selected', 'false');

      panelLogin.classList.remove('hidden');
      panelRegister.classList.add('hidden');
      UIRenderer.clearMessages();
    });

    tabRegister.addEventListener('click', () => {
      tabRegister.classList.add('active');
      tabRegister.setAttribute('aria-selected', 'true');
      tabLogin.classList.remove('active');
      tabLogin.setAttribute('aria-selected', 'false');

      panelRegister.classList.remove('hidden');
      panelLogin.classList.add('hidden');
      UIRenderer.clearMessages();
    });
  },

  setupLoginForm() {
    const form = document.getElementById('login-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      UIRenderer.clearMessages();

      const usernameInput = document.getElementById('login-username');
      const passwordInput = document.getElementById('login-password');

      const username = usernameInput.value.trim();
      const password = passwordInput.value.trim();

      // Validaciones básicas
      if (!username || !password) {
        UIRenderer.showMessage('login-message', 'Por favor, completa todos los campos.', false);
        return;
      }

      // Verificación de credenciales
      const user = StorageManager.findUser(username);

      if (!user) {
        UIRenderer.showMessage('login-message', 'Error: El usuario no existe.', false);
        return;
      }

      if (user.password !== password) {
        UIRenderer.showMessage('login-message', 'Error: La contraseña es incorrecta.', false);
        return;
      }

      // Éxito
      UIRenderer.showMessage('login-message', `¡Acceso exitoso! Bienvenido/a, ${user.username}.`, true);
      form.reset();
    });
  },

  setupRegisterForm() {
    const form = document.getElementById('register-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      UIRenderer.clearMessages();

      const usernameInput = document.getElementById('reg-username');
      const passwordInput = document.getElementById('reg-password');

      const username = usernameInput.value.trim();
      const password = passwordInput.value.trim();

      if (!username || !password) {
        UIRenderer.showMessage('register-message', 'Por favor, llena todos los campos.', false);
        return;
      }

      if (username.length < 3) {
        UIRenderer.showMessage('register-message', 'El nombre de usuario debe tener al menos 3 caracteres.', false);
        return;
      }

      if (password.length < 4) {
        UIRenderer.showMessage('register-message', 'La contraseña debe tener al menos 4 caracteres.', false);
        return;
      }

      // Comprobar existencia
      const existingUser = StorageManager.findUser(username);
      if (existingUser) {
        UIRenderer.showMessage('register-message', 'El usuario ya existe. Por favor elige otro nombre.', false);
        return;
      }

      // Guardar nuevo usuario
      StorageManager.addUser({ username, password });
      UIRenderer.showMessage('register-message', '¡Usuario registrado con éxito! Ya puedes iniciar sesión.', true);
      form.reset();
    });
  }
};

// 6. INICIALIZACIÓN AL CARGAR EL DOM
document.addEventListener('DOMContentLoaded', () => {
  ThemeController.init();
  AuthController.init();
});
