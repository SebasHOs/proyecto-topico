window.onload = init;

function init() {
    const registerBtn = document.querySelector('.btn-secondary');
    const loginBtn = document.querySelector('.btn-primary');

    if (registerBtn) {
        registerBtn.addEventListener('click', () => {
            window.location.href = 'register.html';
        });
    }

    if (loginBtn) {
        loginBtn.addEventListener('click', handleLogin);
    }
}

async function handleLogin() {
    const mail = document.getElementById('input-mail').value.trim();
    const password = document.getElementById('input-password').value.trim();

    if (!mail || !password) {
        alert('Por favor completa todos los campos');
        return;
    }

    try {
        const result = await window.login(mail, password);
        alert(result.message || 'Login correcto');
        window.location.href = 'mapa.html';
    } catch (error) {
        alert(error.message || 'Error al iniciar sesión');
    }
}