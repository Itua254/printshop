const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ozwthlyjffjhzjjyreli.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im96d3RobHlqZmZqaHpqanlyZWxpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Njk3NDQ0MywiZXhwIjoyMDgyNTUwNDQzfQ.-Yxd4YDrWM4p1zXYodYXTiiZDiJlWoilyZm0HVNpmA0';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkProducts() {
    console.log('Checking products table...');
    const { data, error } = await supabase.from('products').select('count', { count: 'exact' });

    if (error) {
        console.error('Error:', error);
    } else {
        console.log('Product count:', data);

        const { data: products } = await supabase.from('products').select('name, is_active').limit(5);
        console.log('Sample products:', products);
    }
}

checkProducts();
