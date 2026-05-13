window.onload = init;

function init() {
    const btnRegister = document.getElementById('btn-register');
    const btnLogin = document.getElementById('btn-login');
    
    if (btnRegister) {
        btnRegister.addEventListener('click', handleRegister);
    }
    
    if (btnLogin) {
        btnLogin.addEventListener('click', () => {
            window.location.href = 'login.html';
        });
    }
}

function handleRegister() {
    const email = document.getElementById('input-mail').value.trim();
    const name = document.getElementById('input-name').value.trim();
    const password = document.getElementById('input-password').value.trim();
    
    // Validations
    if (!email || !name || !password) {
        alert('Por favor completa todos los campos');
        return;
    }
    
    if (password.length < 6) {
        alert('La contraseña debe tener al menos 6 caracteres');
        return;
    }
    
    // Show loading state
    const btnRegister = document.getElementById('btn-register');
    const originalText = btnRegister.textContent;
    btnRegister.disabled = true;
    btnRegister.textContent = 'Registrando...';
    
    // Call register function
    register(email, password, name)
        .then((result) => {
            alert('Usuario creado con exito');
            window.location.href = 'login.html';
        })
        .catch((error) => {
            alert(error.message);
            btnRegister.disabled = false;
            btnRegister.textContent = originalText;
        });
}
