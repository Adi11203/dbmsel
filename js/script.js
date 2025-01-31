const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseKey = 'YOUR_SUPABASE_KEY';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

async function testSupabaseConnection() {
    try {
        const { data, error } = await supabase
            .from('USER') // Replace 'USER' with any table name from your database
            .select('*')
            .limit(1);

        if (error) {
            console.error('Error fetching data:', error);
            document.body.innerHTML += `<p style="color: red;">Error: ${error.message}</p>`;
        } else {
            console.log('Supabase is connected:', data);
            document.body.innerHTML += `<p style="color: green;">Supabase is connected successfully! Fetched data: ${JSON.stringify(data)}</p>`;
        }
    } catch (err) {
        console.error('Unexpected error:', err);
        document.body.innerHTML += `<p style="color: red;">Unexpected error: ${err.message}</p>`;
    }
}

testSupabaseConnection();
