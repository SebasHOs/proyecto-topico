// Authentication functions using Firebase v9

function register(email, password, name) {
    return new Promise((resolve, reject) => {
        const { auth, db, createUserWithEmailAndPassword, doc, setDoc } = window.firebaseAuth;
        
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;

                // Save user data to Firestore
                setDoc(doc(db, "users", user.uid), {
                    uid: user.uid,
                    name: name,
                    email: email,
                    createdAt: new Date()
                })
                .then(() => {
                    resolve({
                        success: true,
                        message: "Usuario creado con exito",
                        user: user
                    });
                })
                .catch((error) => {
                    console.error('Firestore save error:', error);
                    reject({
                        success: false,
                        message: getErrorMessage(error.code) || error.message || "Error al crear usuario"
                    });
                });
            })
            .catch((error) => {
                console.error('Firebase createUserWithEmailAndPassword error:', error);
                reject({
                    success: false,
                    message: getErrorMessage(error.code) || error.message || "Error al crear usuario"
                });
            });
    });
}

function login(email, password) {
    return new Promise((resolve, reject) => {
        const { auth, signInWithEmailAndPassword } = window.firebaseAuth;
        
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                resolve({
                    success: true,
                    message: "Sesión iniciada exitosamente",
                    user: user
                });
            })
            .catch((error) => {
                console.error('Firebase signInWithEmailAndPassword error:', error);
                reject({
                    success: false,
                    message: getErrorMessage(error.code) || error.message || "Correo o contraseña incorrectos"
                });
            });
    });
}

function logout() {
    const { auth } = window.firebaseAuth;
    return auth.signOut();
}

function getCurrentUser() {
    const { auth } = window.firebaseAuth;
    return auth.currentUser;
}

function recoverPassword(email) {
    return new Promise((resolve, reject) => {
        const { auth, sendPasswordResetEmail } = window.firebaseAuth;
        const actionCodeSettings = {
            url: 'http://127.0.0.1:5500/index/login.html',
            handleCodeInApp: false
        };

        sendPasswordResetEmail(auth, email, actionCodeSettings)
            .then(() => {
                resolve({
                    success: true,
                    message: "Correo de recuperación enviado"
                });
            })
            .catch((error) => {
                console.error('Firebase sendPasswordResetEmail error:', error);
                reject({
                    success: false,
                    message: getErrorMessage(error.code) || error.message || "Error al enviar correo de recuperación"
                });
            });
    });
}

function getErrorMessage(code) {
    const messages = {
        'auth/invalid-email': 'El correo electrónico no es válido',
        'auth/user-disabled': 'La cuenta ha sido deshabilitada',
        'auth/user-not-found': 'El usuario no existe',
        'auth/wrong-password': 'Contraseña incorrecta',
        'auth/email-already-in-use': 'El correo ya está registrado',
        'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres',
        'auth/operation-not-allowed': 'Operación no permitida',
        'auth/too-many-requests': 'Demasiados intentos fallidos. Intenta más tarde'
    };

    return messages[code] || 'Error: ' + code;
}

window.recoverPassword = recoverPassword;