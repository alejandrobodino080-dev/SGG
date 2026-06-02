// 1. Usuarios predeterminados de prueba
const MOCK_USERS = [
    { email: "admin@sgg.com", password: "Password123" },
    { email: "user@sgg.com", password: "UserSecure456" }
];

// 2. Selectores del DOM
const loginForm = document.getElementById('login-form');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const errorMessage = document.getElementById('error-message');
const themeToggle = document.getElementById('theme-toggle');

// 3. Lógica del Switch de Temas (Persistente con localStorage)
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'theme-light';
    document.body.className = savedTheme;
}

themeToggle.addEventListener('click', () => {
    const isLight = document.body.classList.contains('theme-light');
    const newTheme = isLight ? 'theme-dark' : 'theme-light';
    
    document.body.className = newTheme;
    localStorage.setItem('theme', newTheme);
});

// 4. Lógica de Validación (Aplicando DRY y ETC)
function showError(message) {
    errorMessage.textContent = message;
}

function clearError() {
    errorMessage.textContent = "";
}

function validateEmailFormat(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Handler del Submit
loginForm.addEventListener('submit', (event) => {
    event.preventDefault(); // Evita que la página se recargue (Ortogonalidad)
    clearError();

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    // Validaciones básicas de negocio
    if (!email || !password) {
        showError("Por favor, complete todos los campos.");
        return;
    }

    if (!validateEmailFormat(email)) {
        showError("El formato del correo electrónico no es válido.");
        return;
    }

    // Validación contra el "servidor simulado"
    const userExists = MOCK_USERS.find(user => user.email === email && user.password === password);

    if (userExists) {
        localStorage.setItem('userSession', JSON.stringify({ email: userExists.email, loggedIn: true }));
        alert("¡Inicio de sesión exitoso!");
        // Aquí se procedería con la redirección: window.location.href = 'dashboard.html';
    } else {
        showError("Correo electrónico o contraseña incorrectos.");
    }
});

// Inicializar el tema al cargar
initTheme();