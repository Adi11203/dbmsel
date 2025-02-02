import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

// Initialize Supabase with the same credentials as login.js
const supabaseUrl = 'https://ccyvfdwemvlicolflcqm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNjeXZmZHdlbXZsaWNvbGZsY3FtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc1Nzg0ODgsImV4cCI6MjA1MzE1NDQ4OH0.eM5ZyOdHr6pWVrj3QwfPzkSepoeEevJS5OF8JuwFK2o';

const supabase = createClient(supabaseUrl, supabaseKey);

document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signup-form');
    const errorMessage = document.getElementById('signup-error');

    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = document.getElementById('signup-name').value;
        const age = parseInt(document.getElementById('signup-age').value);
        const gender = document.getElementById('signup-gender').value;
        const weight = parseFloat(document.getElementById('signup-weight').value);
        const height = parseFloat(document.getElementById('signup-height').value);
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        const confirmPassword = document.getElementById('signup-confirm-password').value;

        // Basic validation
        if (password !== confirmPassword) {
            errorMessage.textContent = 'Passwords do not match';
            errorMessage.style.display = 'block';
            return;
        }

        try {
            // First check if email already exists
            const { data: existingUser, error: checkError } = await supabase
                .from('USER')
                .select('Email')
                .eq('Email', email)
                .single();

            if (checkError && checkError.code !== 'PGRST116') {  // PGRST116 means no rows returned
                console.error('Error checking existing user:', checkError);
                errorMessage.textContent = 'An error occurred. Please try again.';
                errorMessage.style.display = 'block';
                return;
            }

            if (existingUser) {
                errorMessage.textContent = 'Email already exists. Please use a different email.';
                errorMessage.style.display = 'block';
                return;
            }

            // Insert new user into USER table with all fields
            const { data, error } = await supabase
                .from('USER')
                .insert({
                    Name: name,
                    Age: age,
                    Gender: gender,
                    weight: weight,
                    Height: height,
                    Email: email,
                    Password: password
                })
                .select();

            if (error) {
                console.error('Signup error:', error);
                errorMessage.textContent = error.message;
                errorMessage.style.display = 'block';
            } else {
                console.log('Signup successful:', data);
                alert('Account created successfully! Please login.');
                window.location.href = 'index.html';
            }

        } catch (error) {
            console.error('Signup error:', error);
            errorMessage.textContent = 'An error occurred. Please try again later.';
            errorMessage.style.display = 'block';
        }
    });
});
