/* RecuperarController: RF-04 con validación de no repetición de clave */
document.addEventListener('DOMContentLoaded', () => {
  UIRenderer.setupPasswordToggle('new_password', 'toggle-new-password');
  UIRenderer.setupPasswordToggle('confirm_new_password', 'toggle-confirm-new-password');

  const recoverForm = document.getElementById('recover-form');
  const newPasswordInput = document.getElementById('new_password');
  const confirmNewPasswordInput = document.getElementById('confirm_new_password');
  const identifierInput = document.getElementById('identifier');
  const btnRecuperar = document.getElementById('btn-recuperar');

  if (!recoverForm) return;

  const rules = {
    length: val => val.length >= 8,
    upper: val => /[A-Z]/.test(val),
    lower: val => /[a-z]/.test(val),
    number: val => /[0-9]/.test(val),
    special: val => /[!@#$%^&*(),.?":{}|<>]/.test(val)
  };

  function evaluatePasswordRules() {
    const val = newPasswordInput.value;
    let allValid = true;

    for (const key in rules) {
      const isPassed = rules[key](val);
      const li = document.getElementById(`rule-${key}`);
      if (li) {
        if (isPassed) {
          li.className = 'fulfilled';
          li.textContent = li.textContent.replace('❌', '✔️');
        } else {
          li.className = '';
          li.textContent = li.textContent.replace('✔️', '❌');
          allValid = false;
        }
      }
    }
    return allValid;
  }

  function validateForm() {
    const passValid = evaluatePasswordRules();
    const passwordsMatch = newPasswordInput.value && newPasswordInput.value === confirmNewPasswordInput.value;
    
    btnRecuperar.disabled = !(passValid && passwordsMatch);
  }

  newPasswordInput.addEventListener('input', validateForm);
  confirmNewPasswordInput.addEventListener('input', validateForm);

  recoverForm.addEventListener('submit', (e) => {
    e.preventDefault();
    UIRenderer.clearMessage('alert-message');

    const identifier = identifierInput.value.trim();
    const newPassword = newPasswordInput.value;
    const confirmNewPassword = confirmNewPasswordInput.value;

    if (!identifier) {
      UIRenderer.showMessage('alert-message', 'Por favor, ingresa tu usuario o correo electrónico.', 'warning');
      return;
    }

    const user = StorageManager.findUser(identifier);
    if (!user) {
      UIRenderer.showMessage('alert-message', 'Error: El usuario o correo no existe en el sistema.', 'error');
      return;
    }

    if (user.password === newPassword) {
      UIRenderer.showMessage('alert-message', 'La nueva contraseña no puede ser igual a la contraseña actual.', 'error');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      UIRenderer.showMessage('alert-message', 'Las contraseñas no coinciden.', 'error');
      return;
    }

    StorageManager.updatePassword(identifier, newPassword);
    UIRenderer.showMessage('alert-message', '¡Contraseña actualizada exitosamente! Ya puedes iniciar sesión con tu nueva clave.', 'success');
    recoverForm.reset();
    evaluatePasswordRules();
  });
});
