# 🚀 Quick Start Guide - Arshrozy Printshop

Get your printing shop online in 30 minutes!

## ⚡ Fast Track Setup

### 1. Create Supabase Project (5 minutes)

1. Go to [supabase.com](https://supabase.com) → Sign up/Login
2. Click "New Project"
3. Fill in:
   - Name: `Arshrozy Printshop`
   - Database Password: (create a strong password)
   - Region: Singapore or Frankfurt (closest to Kenya)
4. Click "Create new project"
5. **Save these credentials**:
   - Project URL: `https://xxxxx.supabase.co`
   - `anon` key: Copy from Settings → API
   - `service_role` key: Copy from Settings → API

### 2. Set Up Database (5 minutes)

1. In Supabase Dashboard, go to **SQL Editor**
2. Click "New Query"
3. Copy entire contents of `supabase/schema.sql`
4. Paste and click "Run" (Ctrl/Cmd + Enter)
5. Wait for "Success" message

### 3. Upload Images (5 minutes)

**Option A: Automatic (Recommended)**
```bash
cd arshrozy-next
npm install @supabase/supabase-js dotenv

# Create .env file
cat > .env << EOF
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key
EOF

# Run upload script
node ../supabase/upload-images.js
```

**Option B: Manual**
1. Go to Supabase → Storage → Create bucket "product-images" (public)
2. Upload all files from `/images` folder

### 4. Configure Next.js (3 minutes)

```bash
cd arshrozy-next

# Copy environment template
cp .env.example .env.local

# Edit .env.local with your credentials
nano .env.local  # or use any text editor
```

Add your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-role-key
```

### 5. Run Locally (2 minutes)

```bash
# Install dependencies (if not already done)
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

### 6. Deploy to Vercel (10 minutes)

1. Push to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/arshrozy.git
   git push -u origin main
   ```

2. Go to [vercel.com](https://vercel.com) → Sign in with GitHub

3. Click "New Project" → Import your repository

4. Configure:
   - Root Directory: `arshrozy-next`
   - Add all environment variables from `.env.local`

5. Click "Deploy"

6. Done! Your site is live at `https://your-project.vercel.app`

## ✅ Verification Checklist

After deployment, verify:

- [ ] Homepage loads with hero section
- [ ] Products display in grid
- [ ] Product images show correctly
- [ ] Clicking a product opens detail page
- [ ] Price calculator works
- [ ] Add to cart works
- [ ] Cart modal opens and shows items
- [ ] WhatsApp button works
- [ ] Mobile responsive

## 🎯 Next Steps

### Customize Your Site

1. **Update Business Info**:
   - Edit `.env.local` → WhatsApp number, email
   - Update `components/Footer.tsx` → Contact details

2. **Add/Edit Products**:
   - Go to Supabase Dashboard → Table Editor → `products`
   - Edit existing products or add new ones

3. **Change Colors**:
   - Edit `tailwind.config.ts`
   - Update color classes in components

4. **Add Custom Domain**:
   - Vercel Dashboard → Settings → Domains
   - Follow DNS instructions

### Manage Products

All product management is done in Supabase:

```sql
-- Add a new product
INSERT INTO products (category, name, description, base_price, image_url)
VALUES ('custom', 'Custom Product', 'Description here', 100.00, '/images/product.jpg');

-- Update price
UPDATE products SET base_price = 150.00 WHERE category = 'cards';

-- Deactivate product
UPDATE products SET is_active = false WHERE id = 'product-id';
```

## 🆘 Common Issues

### "Module not found" error
```bash
# Solution: Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Images not loading
```bash
# Solution: Check Supabase Storage
# 1. Verify bucket 'product-images' exists
# 2. Ensure bucket is public
# 3. Check images are uploaded
```

### Products not showing
```bash
# Solution: Check database
# 1. Go to Supabase → Table Editor → products
# 2. Verify products exist with is_active = true
# 3. Check console for errors
```

### Build fails on Vercel
```bash
# Solution: Test build locally first
npm run build

# Fix any TypeScript errors shown
# Then push to GitHub again
```

## 📚 Documentation

- **Full Setup**: See `supabase/SETUP.md`
- **Deployment**: See `DEPLOYMENT.md`
- **Development**: See `arshrozy-next/README.md`
- **Migration Plan**: See `MIGRATION_PLAN.md`

## 🎊 You're Done!

Your Arshrozy Printshop is now:
- ✅ Running on modern tech stack
- ✅ Connected to Supabase database
- ✅ Deployed to Vercel
- ✅ Ready for customers!

**Share your site**: `https://your-domain.vercel.app`

---

Need help? Check the full documentation or contact support.
