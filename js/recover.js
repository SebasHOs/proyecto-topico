window.onload = function () {
    const form = document.getElementById('recover-form');

    if (form) {
        form.addEventListener('submit', async (event) => {
            event.preventDefault();

            const emailInput = document.getElementById('input-mail');
            const email = emailInput.value.trim();

            if (!email) {
                alert('Por favor ingresa tu correo electrónico.');
                return;
            }

            try {
                const result = await window.recoverPassword(email);
                alert(result.message || 'Correo de recuperación enviado. Revisa tu bandeja de entrada.');
                window.location.href = 'login.html';
            } catch (error) {
                alert(error.message || 'No se pudo enviar el correo de recuperación.');
            }
        });
    }
};