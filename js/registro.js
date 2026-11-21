/* RegistroController: RF-03 con validaciones estrictas y UX en tiempo real */
document.addEventListener('DOMContentLoaded', () => {
  UIRenderer.setupPasswordToggle('password', 'toggle-password');
  UIRenderer.setupPasswordToggle('confirm_password', 'toggle-confirm-password');

  const registerForm = document.getElementById('register-form');
  const passwordInput = document.getElementById('password');
  const confirmInput = document.getElementById('confirm_password');
  const emailInput = document.getElementById('email');
  const nombreInput = document.getElementById('nombre');
  const apellidoInput = document.getElementById('apellido');
  const fechaInput = document.getElementById('fecha_nacimiento');
  const btnRegistrar = document.getElementById('btn-registrar');

  if (!registerForm) return;

  const rules = {
    length: val => val.length >= 8,
    upper: val => /[A-Z]/.test(val),
    lower: val => /[a-z]/.test(val),
    number: val => /[0-9]/.test(val),
    special: val => /[!@#$%^&*(),.?":{}|<>]/.test(val)
  };

  function evaluatePasswordRules() {
    const val = passwordInput.value;
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
    const passwordsMatch = passwordInput.value && passwordInput.value === confirmInput.value;
    
    btnRegistrar.disabled = !(passValid && passwordsMatch);
  }

  passwordInput.addEventListener('input', validateForm);
  confirmInput.addEventListener('input', validateForm);

  registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    UIRenderer.clearMessage('alert-message');

    const nombre = nombreInput.value.trim();
    const apellido = apellidoInput.value.trim();
    const fechaNac = fechaInput.value;
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const confirmPassword = confirmInput.value;

    const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    if (!nameRegex.test(nombre) || !nameRegex.test(apellido)) {
      UIRenderer.showMessage('alert-message', 'El nombre y apellido no deben contener números ni caracteres especiales.', 'error');
      return;
    }

    if (!fechaNac) {
      UIRenderer.showMessage('alert-message', 'Por favor, ingresa tu fecha de nacimiento.', 'warning');
      return;
    }
    const birthDate = new Date(fechaNac);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    if (age < CONFIG.MIN_AGE) {
      UIRenderer.showMessage('alert-message', 'Registro rechazado: Debes ser mayor de 14 años para registrarte.', 'error');
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      UIRenderer.showMessage('alert-message', 'Por favor, ingresa un correo electrónico válido (ejemplo: usuario@dominio.com).', 'error');
      return;
    }

    if (StorageManager.emailExists(email)) {
      UIRenderer.showMessage('alert-message', 'El correo electrónico ya se encuentra registrado.', 'error');
      return;
    }

    if (password !== confirmPassword) {
      UIRenderer.showMessage('alert-message', 'Las contraseñas no coinciden.', 'error');
      return;
    }

    const username = email.split('@')[0];
    const newUser = {
      username: username,
      email: email,
      nombre: nombre,
      apellido: apellido,
      fecha_nacimiento: fechaNac,
      password: password
    };

    StorageManager.addUser(newUser);
    UIRenderer.showMessage('alert-message', '¡Registro exitoso! Ya puedes iniciar sesión con tu cuenta.', 'success');
    registerForm.reset();
    evaluatePasswordRules();
  });
});
