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

// Function to update nutrition summary based on meals table
function updateNutritionSummary() {
    const mealsBody = document.getElementById('meals-body');
    const rows = mealsBody.getElementsByTagName('tr');
    
    let totals = {
        calories: 0,
        carbs: 0,
        protein: 0,
        fat: 0
    };

    // Sum up all values from the meals table
    Array.from(rows).forEach(row => {
        const cells = row.getElementsByTagName('td');
        totals.calories += parseFloat(cells[3].textContent) || 0;  // Calories column
        totals.carbs += parseFloat(cells[4].textContent) || 0;     // Carbs column
        totals.protein += parseFloat(cells[5].textContent) || 0;   // Protein column
        totals.fat += parseFloat(cells[6].textContent) || 0;       // Fat column
    });

    // Update the summary table with calculated totals
    document.getElementById('calories-total').textContent = totals.calories.toFixed(1);
    document.getElementById('carbs-total').textContent = totals.carbs.toFixed(1);
    document.getElementById('protein-total').textContent = totals.protein.toFixed(1);
    document.getElementById('fat-total').textContent = totals.fat.toFixed(1);
}

// Call this function whenever a meal is added or removed
async function addMeal(mealData) {
    try {
        // Add meal to the table
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${new Date().toLocaleTimeString()}</td>
            <td>${mealData.name}</td>
            <td>${mealData.quantity}</td>
            <td>${mealData.calories.toFixed(1)}</td>
            <td>${mealData.carbs.toFixed(1)}</td>
            <td>${mealData.protein.toFixed(1)}</td>
            <td>${mealData.fat.toFixed(1)}</td>
            <td><button onclick="deleteMeal(this)">Delete</button></td>
        `;
        document.getElementById('meals-body').appendChild(row);

        // Update the nutrition summary
        updateNutritionSummary();

    } catch (error) {
        console.error('Error adding meal:', error);
        alert('Error adding meal. Please try again.');
    }
}

// Function to delete a meal
function deleteMeal(button) {
    const row = button.parentElement.parentElement;
    row.remove();
    updateNutritionSummary(); // Update totals after deletion
}
