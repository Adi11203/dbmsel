import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

// Initialize Supabase
const supabaseUrl = 'https://ccyvfdwemvlicolflcqm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNjeXZmZHdlbXZsaWNvbGZsY3FtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc1Nzg0ODgsImV4cCI6MjA1MzE1NDQ4OH0.eM5ZyOdHr6pWVrj3QwfPzkSepoeEevJS5OF8JuwFK2o';

// Ensure this line comes first before using the `supabase` variable
export const supabase = createClient(supabaseUrl, supabaseKey);

const loginForm = document.getElementById("login-form");
const loginError = document.getElementById("login-error");

loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    // Query the USER table for the given email
    const { data, error } = await supabase
        .from("USER")
        .select("Email, Password") // Select only the necessary columns
        .eq("Email", email)
        .single(); // Ensure only one record is fetched

    if (error || !data) {
        loginError.style.display = "block";
        loginError.innerText = "Invalid email or password.";
        return;
    }

    // Verify the password (assuming passwords are stored in plaintext)
    if (data.Password !== password) {
        loginError.style.display = "block";
        loginError.innerText = "Invalid email or password.";
        return;
    }

    // Store user session (optional)
    sessionStorage.setItem("user", JSON.stringify(data));

    // Redirect to dashboard
    window.location.href = "./dashboard.html";
});
