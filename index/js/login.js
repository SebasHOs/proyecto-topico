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

    axios.post('/api/login', {
        method: 'post',
        url: 'http://localhost:3000/user/login',
        data: {
            user_mail: mail,
            user_password: pass
        }
        }).then(function(res) {
            if(res.data.success) {
    
            }
        });
    } 