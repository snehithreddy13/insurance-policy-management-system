<<<<<<< HEAD
// API Base URL
const API_URL = 'http://localhost:3000/api';

// ==================== SIGNUP FUNCTIONALITY ====================
document.addEventListener('DOMContentLoaded', function() {
    // Signup form submission
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }
});

async function handleSignup(e) {
    e.preventDefault();

    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // Validate passwords match
    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }

    // Validate password strength
    if (password.length < 6) {
        alert('Password must be at least 6 characters long!');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/users/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, password })
        });

        const data = await response.json();

        if (response.ok) {
            alert('Registration successful! You can now log in.');
            // Redirect to login page
            window.location.href = 'index.html';
        } else {
            alert('Registration failed: ' + (data.message || 'Please try again'));
        }
    } catch (error) {
        console.error('Signup error:', error);
        alert('Error during registration. Please check your connection.');
    }
=======
// API Base URL
const API_URL = 'http://localhost:3000/api';

// ==================== SIGNUP FUNCTIONALITY ====================
document.addEventListener('DOMContentLoaded', function() {
    // Signup form submission
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }
});

async function handleSignup(e) {
    e.preventDefault();

    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // Validate passwords match
    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }

    // Validate password strength
    if (password.length < 6) {
        alert('Password must be at least 6 characters long!');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/users/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, password })
        });

        const data = await response.json();

        if (response.ok) {
            alert('Registration successful! You can now log in.');
            // Redirect to login page
            window.location.href = 'index.html';
        } else {
            alert('Registration failed: ' + (data.message || 'Please try again'));
        }
    } catch (error) {
        console.error('Signup error:', error);
        alert('Error during registration. Please check your connection.');
    }
>>>>>>> d9c3d0f (Updated new details in project)
}