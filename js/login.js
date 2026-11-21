/* AuthController (Login): RF-01 e intentos fallidos de bloqueo */
document.addEventListener('DOMContentLoaded', () => {
  UIRenderer.setupPasswordToggle('password', 'toggle-password');

  const loginForm = document.getElementById('login-form');
  const btnLogin = document.getElementById('btn-login');
  let failedAttempts = 0;
  let lockoutTimer = null;

  if (!loginForm) return;

  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    UIRenderer.clearMessage('alert-message');

    const usernameInput = document.getElementById('username').value.trim();
    const passwordInput = document.getElementById('password').value;

    if (!usernameInput || !passwordInput) {
      UIRenderer.showMessage('alert-message', 'Por favor, completa todos los campos.', 'warning');
      return;
    }

    const user = StorageManager.findUser(usernameInput);

    if (!user) {
      registerFailedAttempt();
      UIRenderer.showMessage('alert-message', 'Error: El usuario o correo no existe.', 'error');
      return;
    }

    if (user.password !== passwordInput) {
      registerFailedAttempt();
      UIRenderer.showMessage('alert-message', 'Error: La contraseña es incorrecta.', 'error');
      return;
    }

    failedAttempts = 0;
    UIRenderer.showMessage('alert-message', `¡Acceso exitoso! Bienvenido/a, ${user.nombre || user.username}.`, 'success');
    loginForm.reset();
  });

  function registerFailedAttempt() {
    failedAttempts++;
    if (failedAttempts >= CONFIG.MAX_LOGIN_ATTEMPTS) {
      startLockout();
    }
  }

  function startLockout() {
    btnLogin.disabled = true;
    let secondsLeft = CONFIG.LOCKOUT_TIME_MS / 1000;

    UIRenderer.showMessage('alert-message', `Bloqueo de seguridad: Has fallado 3 intentos. Reintenta en ${secondsLeft} segundos.`, 'error');

    lockoutTimer = setInterval(() => {
      secondsLeft--;
      if (secondsLeft > 0) {
        UIRenderer.showMessage('alert-message', `Bloqueo de seguridad: Has fallado 3 intentos. Reintenta en ${secondsLeft} segundos.`, 'error');
      } else {
        clearInterval(lockoutTimer);
        failedAttempts = 0;
        btnLogin.disabled = false;
        UIRenderer.showMessage('alert-message', 'El bloqueo ha finalizado. Puedes volver a intentarlo.', 'info');
      }
    }, 1000);
  }
});
