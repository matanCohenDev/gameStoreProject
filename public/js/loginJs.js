// make the flip container flip when the toggle button is clicked
document.getElementById('toggleFormBtn').addEventListener('click', function () {
    const flipContainer = document.querySelector('.flip-container');
    const toggleBtn = document.getElementById('toggleFormBtn');
    const loginMessage = document.getElementById('loginMessage');
    const registerMessage = document.getElementById('registerMessage');

    loginMessage.textContent = '';
    loginMessage.className = 'message';
    registerMessage.textContent = '';
    registerMessage.className = 'message';

    if (flipContainer.classList.contains('flipped')) {
        flipContainer.classList.remove('flipped');
        toggleBtn.textContent = "Create Account";
    } else {
        flipContainer.classList.add('flipped');
        toggleBtn.textContent = "Already have an account? Sign in";
    }
});

//login form
document.getElementById('loginForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const username = document.getElementById('usernameLogin').value;
    const password = document.getElementById('passwordLogin').value;
    const loginMessage = document.getElementById('loginMessage');

    try {
        const response = await fetch('/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();
        if (response.ok) {
            loginMessage.className = 'message success';
            loginMessage.textContent = 'Login successful!';
            setTimeout(() => {
                if(username === 'admin'){
                window.location.href = '/admin';
                } 
                else {
                window.location.href = '/user';    
                }
            }, 2000);
        } else {
            loginMessage.className = 'message error';
            loginMessage.textContent = data.msg || 'An error occurred during login.';
        }
    } catch (err) {
        console.error('Error:', err);
        loginMessage.className = 'message error';
        loginMessage.textContent = 'An error occurred. Please try again later.';
    }
});
//register form
document.getElementById('registerForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const username = document.getElementById('usernameRegister').value;
    const email = document.getElementById('emailRegister').value;
    const password = document.getElementById('passwordRegister').value;
    const registerMessage = document.getElementById('registerMessage');

    try {
        const response = await fetch('/api/users/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, email, password })
        });

        const data = await response.json();
        if (response.ok) {
            registerMessage.className = 'message success';
            registerMessage.textContent = 'Registration successful!';
            setTimeout(() => {
                document.getElementById('toggleFormBtn').click();
            }, 2000);
        } else {
            registerMessage.className = 'message error';
            registerMessage.textContent = data.msg || 'An error occurred during registration.';
        }
    } catch (err) {
        console.error('Error:', err);
        registerMessage.className = 'message error';
        registerMessage.textContent = 'An error occurred. Please try again later.';
    }
});
