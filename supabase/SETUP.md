# Supabase Setup Instructions

## Step 1: Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign in or create an account
3. Click "New Project"
4. Fill in the details:
   - **Name**: Arshrozy Printshop
   - **Database Password**: (choose a strong password and save it)
   - **Region**: Choose closest to Kenya (e.g., Singapore or Frankfurt)
   - **Pricing Plan**: Free tier is fine to start
5. Click "Create new project"
6. Wait for the project to be provisioned (~2 minutes)

## Step 2: Get Your Credentials

Once your project is ready:

1. Go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)
   - **service_role key** (starts with `eyJ...`) - ⚠️ Keep this secret!

## Step 3: Run Database Schema

1. In Supabase Dashboard, go to **SQL Editor**
2. Click "New Query"
3. Copy the entire contents of `supabase/schema.sql`
4. Paste into the SQL editor
5. Click "Run" or press `Ctrl/Cmd + Enter`
6. You should see: "Success. No rows returned"

## Step 4: Set Up Storage

1. Still in SQL Editor, create a new query
2. Copy the contents of `supabase/storage.sql`
3. Paste and run
4. Go to **Storage** in the sidebar
5. You should see a bucket named `product-images`

## Step 5: Configure Environment Variables

Create a `.env.local` file in your Next.js project:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_KEY=your-service-role-key-here

# Business Configuration
NEXT_PUBLIC_WHATSAPP_NUMBER=254769752124
NEXT_PUBLIC_BUSINESS_EMAIL=info@arshrozy.com
```

## Step 6: Upload Images to Supabase Storage

### Option A: Using the Upload Script (Recommended)

```bash
# Install dependencies
npm install @supabase/supabase-js dotenv

# Run the upload script
node supabase/upload-images.js
```

### Option B: Manual Upload via Dashboard

1. Go to **Storage** → **product-images**
2. Click "Upload Files"
3. Select all images from the `/images` folder
4. Upload them

## Step 7: Verify Setup

### Check Database Tables

```sql
-- Run this in SQL Editor to verify tables were created
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;
```

You should see:
- `products`
- `product_variants`
- `customers`
- `orders`
- `order_items`
- `cart_items`
- `settings`

### Check Seed Data

```sql
-- Verify products were inserted
SELECT category, name, base_price 
FROM products 
ORDER BY sort_order;
```

You should see 8 products (cards, flyers, banners, etc.)

### Check Storage

```sql
-- List uploaded images
SELECT name, metadata->>'size' as size_bytes
FROM storage.objects
WHERE bucket_id = 'product-images'
ORDER BY name;
```

## Step 8: Test the Connection

In your Next.js project, create a test file:

```typescript
// test-supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

async function testConnection() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .limit(5)
  
  if (error) {
    console.error('Error:', error)
  } else {
    console.log('Products:', data)
  }
}

testConnection()
```

Run: `npx tsx test-supabase.ts`

## Troubleshooting

### Issue: "relation does not exist"
- Make sure you ran the entire `schema.sql` file
- Check for any SQL errors in the output

### Issue: "JWT expired" or "Invalid API key"
- Double-check your environment variables
- Make sure you copied the correct keys from Supabase dashboard

### Issue: Images not uploading
- Check file size limits (max 5MB per image)
- Verify bucket exists and is public
- Check storage policies are applied

### Issue: RLS policies blocking queries
- For development, you can temporarily disable RLS:
  ```sql
  ALTER TABLE products DISABLE ROW LEVEL SECURITY;
  ```
- Remember to re-enable it for production!

## Next Steps

Once Supabase is set up:
1. ✅ Database schema created
2. ✅ Images uploaded to storage
3. ✅ Environment variables configured
4. 🔄 Move to Next.js frontend development
5. 🔄 Deploy to Vercel

## Useful Supabase Commands

```sql
-- View all products
SELECT * FROM products;

-- View all orders
SELECT * FROM orders ORDER BY created_at DESC;

-- Get product with variants
SELECT 
  p.*,
  p.variants
FROM products p
WHERE p.category = 'cards';

-- Update a product price
UPDATE products 
SET base_price = 15.00 
WHERE category = 'cards';

-- Delete all test orders
DELETE FROM orders WHERE status = 'pending';
```

## Security Notes

⚠️ **IMPORTANT**:
- Never commit `.env.local` to git
- Never expose `SUPABASE_SERVICE_KEY` in client-side code
- Always use RLS policies in production
- Use the `anon` key for client-side operations
- Use the `service_role` key only for server-side operations

---

Need help? Check the [Supabase Documentation](https://supabase.com/docs)
