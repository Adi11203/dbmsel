import { supabase } from './supabaseConfig.js';

const userInfo = document.getElementById('user-info');
const exerciseForm = document.getElementById('exercise-form');
const mealForm = document.getElementById('meal-form');

document.addEventListener('DOMContentLoaded', async () => {
    const { data: authData, error: authError } = await supabase.auth.getUser();
    if (authData) {
        const { data: userInfoData, error: userError } = await supabase
            .from('USER')
            .select(`
                Name,
                Age,
                Gender,
                weight,
                Height,
                Email
            `)
            .eq('UserID', authData.user.id)
            .single();

        if (userInfoData) {
            userInfo.innerText = `Welcome, ${userInfoData.Name}`;
            updateExerciseCalories(authData.user.id);
            updateMealNutrition(authData.user.id);
        } else {
            console.error('Error fetching user data:', userError);
        }
    }
});

// Exercise tracking
exerciseForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const exerciseType = document.getElementById('exercise-type').value;
    let exerciseDuration = document.getElementById('exercise-duration').value;
    exerciseDuration = parseInt(exerciseDuration, 10);
    
    if (isNaN(exerciseDuration)) {
        alert('Please enter a valid duration.');
        return;
    }

    const { data: authData } = await supabase.auth.getUser();
    if (authData) {
        const userId = authData.user.id;
        
        const { error: exerciseInsertError } = await supabase
            .from('EXERCISE')
            .insert([{
                Type: exerciseType,
                Duration: exerciseDuration,
                Date: new Date().toISOString(),
                CaloriBurned: calculateCaloriesBurned(exerciseType, exerciseDuration),
                UserID: userId
            }]);

        if (exerciseInsertError) {
            alert('Error adding exercise: ' + exerciseInsertError.message);
        } else {
            alert('Exercise added successfully');
            exerciseForm.reset();
            updateExerciseCalories(userId);
        }
    }
});

// Meal tracking
mealForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const { data: authData } = await supabase.auth.getUser();
    if (!authData) return;

    const userId = authData.user.id;
    const mealData = {
        Time: new Date().toISOString(),
        UserID: userId,
        TotalCarbs: 0,
        TotalFat: 0,
        TotalProtein: 0,
        TotalCalorie: 0
    };

    // First insert the meal
    const { data: mealInsert, error: mealError } = await supabase
        .from('MEAL')
        .insert([mealData])
        .select();

    if (mealError) {
        alert('Error creating meal');
        return;
    }

    // Then insert the food items
    const foodItems = getFoodItemsFromForm(); // You'll need to implement this based on your UI
    for (const item of foodItems) {
        const { error: foodError } = await supabase
            .from('FOODITEM')
            .insert([{
                ...item,
                MealID: mealInsert[0].MealID
            }]);
        
        if (foodError) {
            console.error('Error adding food item:', foodError);
        }
    }

    updateMealNutrition(userId);
});

// Utility functions
function calculateCaloriesBurned(type, duration) {
    const caloriesPerHour = {
        'running': 600,
        'walking': 300,
        'cycling': 400,
        'swimming': 500
    };
    return (caloriesPerHour[type] || 300) * (duration / 60);
}

async function updateExerciseCalories(userId) {
    const { data: exercises, error } = await supabase
        .from('EXERCISE')
        .select('CaloriBurned')
        .eq('UserID', userId)
        .gte('Date', new Date().toISOString().split('T')[0]);

    if (!error) {
        const totalCalories = exercises.reduce((sum, ex) => sum + ex.CaloriBurned, 0);
        document.getElementById('total-calories-burned').textContent = totalCalories.toFixed(1);
    }
}

async function updateMealNutrition(userId) {
    const { data: meals, error } = await supabase
        .from('MEAL')
        .select(`
            MealID,
            TotalCarbs,
            TotalFat,
            TotalProtein,
            TotalCalorie
        `)
        .eq('UserID', userId)
        .gte('Time', new Date().toISOString().split('T')[0]);

    if (!error) {
        const totals = meals.reduce((acc, meal) => ({
            calories: acc.calories + meal.TotalCalorie,
            carbs: acc.carbs + meal.TotalCarbs,
            protein: acc.protein + meal.TotalProtein,
            fat: acc.fat + meal.TotalFat
        }), { calories: 0, carbs: 0, protein: 0, fat: 0 });

        document.getElementById('total-calories-consumed').textContent = totals.calories.toFixed(1);
        document.getElementById('total-carbs').textContent = totals.carbs.toFixed(1);
        document.getElementById('total-protein').textContent = totals.protein.toFixed(1);
        document.getElementById('total-fat').textContent = totals.fat.toFixed(1);
    }
}

async function getFoodItemDetails(foodId) {
    const { data, error } = await supabase
        .from('FOODITEM')
        .select(`
            Name,
            Category,
            Quantity,
            Calorie,
            Protein,
            Fat,
            Carbs
        `)
        .eq('FoodID', foodId)
        .single();

    return error ? null : data;
}