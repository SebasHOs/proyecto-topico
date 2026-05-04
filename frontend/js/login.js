window.onload = init;

function init() {
    document.querySelector('.btn-secondary').addEventListener('click', function() {
        window.location.href = 'register.html';
    });

    document.querySelector('.btn-primary').addEventListener('click', login);
}

function login() {
    var mail = document.getElementById('input-mail').value;
    var password = document.getElementById('input-password').value;

    axios.post('http://localhost:3000/user/login', {
        user_mail: mail,
        user_password: password
    }).then(function(res) {
        if(res.data.success) {
            // Redirect to dashboard or home page after successful login
            window.location.href = 'dashboard.html';
        } else {
            alert('Login failed: ' + (res.data.message || 'Unknown error'));
        }
    }).catch(function(error) {
        console.error('Login error:', error);
        alert('Error during login. Please try again.');
    });
}