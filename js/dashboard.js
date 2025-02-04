import { supabase } from './supabaseConfig.js';

const exerciseForm = document.getElementById('exercise-form');
const exerciseList = document.getElementById('exercise-list');

// Calculate calories based on exercise type and duration
function calculateCaloriesBurned(type, duration) {
    switch (type.toLowerCase()) {
        case 'running':
            return 200 * (duration / 60);
        case 'cycling':
            return 300 * (duration / 60);
        default:
            return 0;
    }
}

// Function to display exercises
async function displayExercises(userId) {
    const { data: exercises, error } = await supabase
        .from('NEW_EXE')
        .select('*')
        .eq('UserID', userId)
       

    if (error) {
        console.error('Error fetching exercises:', error);
        return;
    }

    exerciseList.innerHTML = `
        <table class="w-full mt-4">
            <thead>
                <tr>
                    <th class="text-left">Exercise</th>
                    <th class="text-left">Duration (min)</th>
                    <th class="text-left">Calories Burned</th>
                </tr>
            </thead>
            <tbody>
                ${exercises.map(exercise => `
                    <tr>
                        <td>${exercise.Type}</td>
                        <td>${exercise.Duration}</td>
                        <td>${exercise.CaloriesBurned.toFixed(1)}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

// Exercise form submission handler
exerciseForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const exerciseType = document.getElementById('exercise-type').value;
    let exerciseDuration = document.getElementById('exercise-duration').value;
    exerciseDuration = parseInt(exerciseDuration, 10);

    if (isNaN(exerciseDuration)) {
        alert('Please enter a valid duration.');
        return;
    }

    // Calculate calories burned based on exercise type
    const caloriesBurned = calculateCaloriesBurned(exerciseType, exerciseDuration);

    // Insert into NEW_EXE table
    const { data: insertData, error: exerciseInsertError } = await supabase
        .from('NEW_EXE')
        .insert([{
            Type: exerciseType,
            Duration: exerciseDuration,
            CaloriesBurned: caloriesBurned,
            
        }]);

    if (exerciseInsertError) {
        alert('Error adding exercise: ' + exerciseInsertError.message);
    } else {
        alert('Exercise added successfully');
        exerciseForm.reset();
        // Refresh the display
        displayExercises();
    }
});


// Initial display when page loads
document.addEventListener('DOMContentLoaded', async () => {
    const { data: authData } = await supabase.auth.getUser();
    if (authData) {
        displayExercises(authData.user.id);
    }
});
async function updateDashboard() {
    // Fetch exercises from NEW_EXE table
    const { data: exercises, error } = await supabase
        .from('NEW_EXE')
        .select('CaloriesBurned');

    if (error) {
        console.error('Error fetching exercises:', error);
        return;
    }

    // Calculate the total calories burned from exercises
    const totalCaloriesBurned = exercises.reduce((total, exercise) => total + exercise.CaloriesBurned, 0);

    // Update the total calories burned on the dashboard
    const totalCaloriesBurnedElement = document.getElementById('total-calories-burned');
    totalCaloriesBurnedElement.textContent = totalCaloriesBurned.toFixed(1);

    // Fetch the total consumed calories from the user's nutrition data
    const { data: nutritionData, error: nutritionError } = await supabase
        .from('USER_NUTRITION') // Adjust this table name according to your setup
        .select('Calories')
        .single();  // Assuming the user has a single entry for nutrition data

    if (nutritionError) {
        console.error('Error fetching nutrition data:', nutritionError);
        return;
    }

    // Update the calories row in the table
    const totalCaloriesConsumedElement = document.getElementById('calories-total');
    totalCaloriesConsumedElement.textContent = nutritionData ? nutritionData.Calories : '0';
}

// Call the updateDashboard function when the page loads
document.addEventListener('DOMContentLoaded', updateDashboard);
