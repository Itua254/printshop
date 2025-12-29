# Deployment Guide - Arshrozy Printshop

Complete guide to deploy your Arshrozy Printshop to production.

## 📋 Pre-Deployment Checklist

- [ ] Supabase project created and configured
- [ ] Database schema applied (`supabase/schema.sql`)
- [ ] Storage buckets created (`supabase/storage.sql`)
- [ ] Product images uploaded to Supabase Storage
- [ ] Environment variables documented
- [ ] Code pushed to GitHub repository
- [ ] Local build tested successfully

## 🚀 Deployment Steps

### Step 1: Prepare Your Repository

1. **Create a GitHub repository** (if not already done):
   ```bash
   cd /path/to/Arshrozy-Printshop.com
   git init
   git add .
   git commit -m "Initial commit - Arshrozy Printshop migration"
   git branch -M main
   git remote add origin https://github.com/yourusername/arshrozy-printshop.git
   git push -u origin main
   ```

2. **Ensure `.gitignore` is properly configured**:
   ```
   # Already included in Next.js .gitignore
   .env*.local
   .next/
   node_modules/
   ```

### Step 2: Deploy to Vercel

#### Option A: Via Vercel Dashboard (Recommended)

1. **Go to [vercel.com](https://vercel.com)** and sign in with GitHub

2. **Click "Add New Project"**

3. **Import your repository**:
   - Select your GitHub account
   - Find "arshrozy-printshop" repository
   - Click "Import"

4. **Configure Project**:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `arshrozy-next`
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)

5. **Add Environment Variables**:
   Click "Environment Variables" and add:

   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
   SUPABASE_SERVICE_KEY=eyJhbGc...
   NEXT_PUBLIC_WHATSAPP_NUMBER=254769752124
   NEXT_PUBLIC_BUSINESS_EMAIL=info@arshrozy.com
   NEXT_PUBLIC_BUSINESS_NAME=Arshrozy Printshop
   NEXT_PUBLIC_CURRENCY=KES
   NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
   ```

   ⚠️ **Important**: Add these to all environments (Production, Preview, Development)

6. **Click "Deploy"**

7. **Wait for deployment** (~2-3 minutes)

8. **Visit your site**: `https://your-project.vercel.app`

#### Option B: Via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Navigate to Next.js directory
cd arshrozy-next

# Login to Vercel
vercel login

# Deploy to preview
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name? arshrozy-printshop
# - Directory? ./
# - Override settings? No

# Add environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_KEY
vercel env add NEXT_PUBLIC_WHATSAPP_NUMBER
vercel env add NEXT_PUBLIC_BUSINESS_EMAIL
vercel env add NEXT_PUBLIC_SITE_URL

# Deploy to production
vercel --prod
```

### Step 3: Configure Custom Domain (Optional)

1. **In Vercel Dashboard**:
   - Go to your project
   - Click "Settings" → "Domains"
   - Click "Add Domain"
   - Enter your domain (e.g., `arshrozy.com`)

2. **Update DNS Settings**:
   - Go to your domain registrar
   - Add DNS records as shown by Vercel:
     ```
     Type: A
     Name: @
     Value: 76.76.21.21

     Type: CNAME
     Name: www
     Value: cname.vercel-dns.com
     ```

3. **Wait for DNS propagation** (5 minutes - 48 hours)

4. **Update environment variable**:
   ```
   NEXT_PUBLIC_SITE_URL=https://arshrozy.com
   ```

### Step 4: Verify Deployment

1. **Check Homepage**: Visit your deployed URL
2. **Test Product Pages**: Click on products
3. **Test Cart**: Add items to cart
4. **Test WhatsApp**: Click WhatsApp buttons
5. **Check Images**: Verify all images load
6. **Mobile Test**: Check on mobile device

### Step 5: Set Up Continuous Deployment

Vercel automatically deploys when you push to GitHub:

```bash
# Make changes locally
git add .
git commit -m "Update products"
git push

# Vercel automatically deploys!
```

## 🔧 Post-Deployment Configuration

### Update Supabase URL Allowlist

1. Go to Supabase Dashboard
2. Settings → API → URL Configuration
3. Add your Vercel domain to allowed origins:
   ```
   https://your-project.vercel.app
   https://arshrozy.com
   ```

### Enable Analytics (Optional)

Vercel provides built-in analytics:
1. Go to your project in Vercel
2. Click "Analytics" tab
3. Enable Web Analytics

### Set Up Monitoring

1. **Vercel Monitoring**: Automatically enabled
2. **Supabase Monitoring**: Check Database → Logs

## 🐛 Troubleshooting

### Build Fails

**Error**: `Module not found`
```bash
# Solution: Check all imports are correct
npm run build  # Test locally first
```

**Error**: `Type error`
```bash
# Solution: Fix TypeScript errors
npm run build  # Shows all type errors
```

### Images Not Loading

**Problem**: Images show broken
**Solution**:
1. Check `next.config.ts` has Supabase domain
2. Verify Supabase Storage bucket is public
3. Check image URLs in database

### Environment Variables Not Working

**Problem**: Features not working in production
**Solution**:
1. Verify all env vars are set in Vercel
2. Check variable names match exactly
3. Redeploy after adding variables

### WhatsApp Links Not Working

**Problem**: WhatsApp doesn't open
**Solution**:
1. Check `NEXT_PUBLIC_WHATSAPP_NUMBER` format (no + or spaces)
2. Verify number is correct: `254769752124`

### Database Connection Issues

**Problem**: Products not loading
**Solution**:
1. Check Supabase credentials
2. Verify RLS policies allow public read
3. Check Supabase project is active

## 📊 Performance Optimization

### Enable Image Optimization

Already configured in Next.js! Images are automatically optimized.

### Enable Caching

Vercel automatically caches:
- Static pages
- Images
- API routes

### Monitor Performance

1. **Vercel Analytics**: Check page load times
2. **Lighthouse**: Run in Chrome DevTools
3. **Web Vitals**: Monitor Core Web Vitals

## 🔐 Security Best Practices

1. **Never commit `.env.local`** - Already in `.gitignore`
2. **Use service key only server-side** - Already configured
3. **Enable RLS in Supabase** - Already set up
4. **Keep dependencies updated**:
   ```bash
   npm update
   npm audit fix
   ```

## 🔄 Update Workflow

### Update Content (Products, Prices)
1. Go to Supabase Dashboard
2. Edit products table
3. Changes reflect immediately (no redeploy needed!)

### Update Code
```bash
# Make changes
git add .
git commit -m "Description of changes"
git push

# Vercel auto-deploys in ~2 minutes
```

### Rollback Deployment
1. Go to Vercel Dashboard
2. Click "Deployments"
3. Find previous deployment
4. Click "..." → "Promote to Production"

## 📈 Scaling

### Free Tier Limits (Vercel)
- ✅ 100GB bandwidth/month
- ✅ Unlimited deployments
- ✅ Automatic SSL
- ✅ Edge Network

### Free Tier Limits (Supabase)
- ✅ 500MB database
- ✅ 1GB file storage
- ✅ 50,000 monthly active users
- ✅ 2GB bandwidth

### When to Upgrade
- Database > 400MB → Upgrade Supabase
- Traffic > 80GB/month → Upgrade Vercel
- Need custom domain → Free on both!

## 🎉 Success Checklist

- [ ] Site loads at production URL
- [ ] All products display correctly
- [ ] Images load properly
- [ ] Cart functionality works
- [ ] WhatsApp checkout works
- [ ] Mobile responsive
- [ ] Custom domain configured (if applicable)
- [ ] Analytics enabled
- [ ] Monitoring set up

## 📞 Support

**Deployment Issues**: 
- Vercel: https://vercel.com/support
- Supabase: https://supabase.com/support

**Code Issues**:
- Check README.md
- Review error logs in Vercel Dashboard

---

🎊 **Congratulations!** Your Arshrozy Printshop is now live!

Share your site: `https://your-domain.vercel.app`
