/* ThemeController: Manejo de temas Día/Noche con variables CSS (RF-02) */
const ThemeController = {
  init: function() {
    const themeToggleBtn = document.getElementById('theme-toggle');
    if (!themeToggleBtn) return;

    const savedTheme = localStorage.getItem(CONFIG.THEME_KEY) || 'light';
    this.applyTheme(savedTheme);

    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      this.applyTheme(newTheme);
      localStorage.setItem(CONFIG.THEME_KEY, newTheme);
    });
  },

  applyTheme: function(theme) {
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const themeText = document.getElementById('theme-text');

    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      if (themeIcon) themeIcon.textContent = '☀️';
      if (themeText) themeText.textContent = 'Modo Día';
      if (themeToggleBtn) themeToggleBtn.setAttribute('aria-pressed', 'true');
    } else {
      document.documentElement.removeAttribute('data-theme');
      if (themeIcon) themeIcon.textContent = '🌙';
      if (themeText) themeText.textContent = 'Modo Noche';
      if (themeToggleBtn) themeToggleBtn.setAttribute('aria-pressed', 'false');
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  ThemeController.init();
});
