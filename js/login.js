window.onload = init;

function init() {

    document.querySelector('.btn-secondary')
    .addEventListener('click', function () {

        window.location.href = 'register.html';

    });

    document.querySelector('.btn-primary')
    .addEventListener('click', login);
}

async function login() {

    var mail = document.getElementById('input-mail').value;

    var password = document.getElementById('input-password').value;

    try {

        await auth.signInWithEmailAndPassword(mail, password);

        alert('Login correcto');

        window.location.href = 'mapa.html';

    } catch (error) {

        alert(error.message);

    }
}