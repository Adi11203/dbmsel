import { supabase } from './supabaseConfig.js';

const loginForm = document.getElementById('login-form');
const loginError = document.getElementById('login-error');

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
        loginError.style.display = 'block';
    } else {
        // Redirect to dashboard
        window.location.href = './dashboard.html';
    }
});
