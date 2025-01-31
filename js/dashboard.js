import { supabase } from './supabaseConfig.js';

const userInfo = document.getElementById('user-info');
const mealForm = document.getElementById('meal-form');
const exerciseForm = document.getElementById('exercise-form');

document.addEventListener('DOMContentLoaded', async () => {
    const { data: user } = await supabase.auth.getUser();

    if (!user) {
        // Redirect to login if not logged in
        window.location.href = './index.html';
    } else {
        userInfo.innerText = `Welcome, ${user.email}`;
    }
});

// Add Meal
mealForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const mealName = document.getElementById('meal-name').value;
    const mealCalories = document.getElementById('meal-calories').value;

    const { error } = await supabase.from('meals').insert([{ name: mealName, calories: mealCalories }]);

    if (error) {
        alert('Error adding meal');
    } else {
        alert('Meal added successfully');
    }
});

// Add Exercise
exerciseForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const exerciseType = document.getElementById('exercise-type').value;
    const exerciseDuration = document.getElementById('exercise-duration').value;

    const { error } = await supabase.from('exercises').insert([{ type: exerciseType, duration: exerciseDuration }]);

    if (error) {
        alert('Error adding exercise');
    } else {
        alert('Exercise added successfully');
    }
});
