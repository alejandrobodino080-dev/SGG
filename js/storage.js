/* StorageManager & UIRenderer: Utilidades centralizadas (Principios DRY y Ortogonalidad) */
const StorageManager = {
  getUsers: function() {
    const data = localStorage.getItem(CONFIG.STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveUsers: function(users) {
    localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(users));
  },

  initDefaultUsers: function() {
    const users = this.getUsers();
    if (users.length === 0) {
      const defaultUsers = [
        {
          username: 'admin',
          email: 'admin@sgg.com',
          nombre: 'Admin',
          apellido: 'Sistema',
          fecha_nacimiento: '1990-01-01',
          password: 'Password123!'
        },
        {
          username: 'usuario1',
          email: 'usuario1@sgg.com',
          nombre: 'Juan',
          apellido: 'Pérez',
          fecha_nacimiento: '2000-05-15',
          password: 'Clave456!'
        }
      ];
      this.saveUsers(defaultUsers);
    }
  },

  findUser: function(identifier) {
    const users = this.getUsers();
    const cleanId = identifier.trim().toLowerCase();
    return users.find(u => 
      (u.username && u.username.toLowerCase() === cleanId) || 
      (u.email && u.email.toLowerCase() === cleanId)
    );
  },

  emailExists: function(email) {
    const users = this.getUsers();
    const cleanEmail = email.trim().toLowerCase();
    return users.some(u => u.email && u.email.toLowerCase() === cleanEmail);
  },

  addUser: function(userObj) {
    const users = this.getUsers();
    users.push(userObj);
    this.saveUsers(users);
  },

  updatePassword: function(identifier, newPassword) {
    const users = this.getUsers();
    const cleanId = identifier.trim().toLowerCase();
    const index = users.findIndex(u => 
      (u.username && u.username.toLowerCase() === cleanId) || 
      (u.email && u.email.toLowerCase() === cleanId)
    );
    if (index !== -1) {
      users[index].password = newPassword;
      this.saveUsers(users);
      return true;
    }
    return false;
  }
};

const UIRenderer = {
  showMessage: function(elementId, message, type = 'info') {
    const el = document.getElementById(elementId);
    if (!el) return;
    el.className = `alert alert-${type} show`;
    el.textContent = message;
  },

  clearMessage: function(elementId) {
    const el = document.getElementById(elementId);
    if (!el) return;
    el.className = 'alert';
    el.textContent = '';
  },

  setupPasswordToggle: function(inputId, buttonId) {
    const input = document.getElementById(inputId);
    const button = document.getElementById(buttonId);
    if (!input || !button) return;

    button.addEventListener('click', function() {
      const isPassword = input.type === 'password';
      input.type = isPassword ? 'text' : 'password';
      button.textContent = isPassword ? '🙈' : '👁️';
      button.setAttribute('aria-label', isPassword ? 'Ocultar contraseña' : 'Mostrar contraseña');
    });
  }
};

document.addEventListener('DOMContentLoaded', () => {
  StorageManager.initDefaultUsers();
});
