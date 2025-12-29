# Arshrozy Printshop - Next.js Application

Modern, full-stack e-commerce printing shop built with Next.js 14, Supabase, and Tailwind CSS.

## 🚀 Features

- ✅ **Server-Side Rendering** - Fast page loads with Next.js App Router
- ✅ **Supabase Backend** - PostgreSQL database with real-time capabilities
- ✅ **Product Catalog** - Dynamic product management from database
- ✅ **Shopping Cart** - Client-side cart with localStorage persistence
- ✅ **WhatsApp Integration** - Direct checkout via WhatsApp Business
- ✅ **Responsive Design** - Mobile-first, works on all devices
- ✅ **Image Optimization** - Next.js Image component with Supabase Storage
- ✅ **TypeScript** - Type-safe development
- ✅ **SEO Optimized** - Meta tags, Open Graph, structured data

## 📋 Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Supabase account (free tier works)
- Git

## 🛠️ Installation

### 1. Clone the repository

```bash
cd arshrozy-next
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Copy the example environment file:

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-role-key

NEXT_PUBLIC_WHATSAPP_NUMBER=254769752124
NEXT_PUBLIC_BUSINESS_EMAIL=info@arshrozy.com
NEXT_PUBLIC_BUSINESS_NAME=Arshrozy Printshop
NEXT_PUBLIC_CURRENCY=KES
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 4. Set up Supabase

Follow the instructions in `../supabase/SETUP.md` to:
1. Create your Supabase project
2. Run the database schema
3. Set up storage buckets
4. Upload product images

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
arshrozy-next/
├── app/                      # Next.js App Router
│   ├── layout.tsx           # Root layout with Header/Footer
│   ├── page.tsx             # Homepage
│   ├── products/
│   │   └── [category]/      # Dynamic product pages
│   │       └── page.tsx
│   └── globals.css          # Global styles
├── components/              # React components
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── Hero.tsx
│   ├── ProductGrid.tsx
│   ├── ProductCard.tsx
│   ├── ProductDetailClient.tsx
│   ├── CartButton.tsx
│   ├── CartModal.tsx
│   └── WhatsAppButton.tsx
├── lib/                     # Utilities and helpers
│   ├── supabase/
│   │   ├── client.ts       # Browser Supabase client
│   │   └── server.ts       # Server Supabase client
│   ├── types/
│   │   └── database.ts     # TypeScript types
│   └── utils/
│       ├── products.ts     # Product utilities
│       └── cart.ts         # Cart management
├── public/                  # Static assets
├── .env.example            # Environment variables template
├── .env.local              # Your environment variables (gitignored)
├── next.config.ts          # Next.js configuration
├── tailwind.config.ts      # Tailwind CSS configuration
└── package.json            # Dependencies

```

## 🎨 Customization

### Update Business Information

Edit `.env.local`:
- `NEXT_PUBLIC_WHATSAPP_NUMBER` - Your WhatsApp Business number
- `NEXT_PUBLIC_BUSINESS_EMAIL` - Contact email
- `NEXT_PUBLIC_BUSINESS_NAME` - Business name

### Add/Edit Products

Products are managed in Supabase:
1. Go to Supabase Dashboard → Table Editor → `products`
2. Add, edit, or delete products
3. Changes reflect immediately on the website

### Modify Styling

- **Colors**: Edit `tailwind.config.ts`
- **Fonts**: Update in `app/layout.tsx`
- **Components**: Modify files in `components/`

## 🧪 Testing

```bash
# Run type checking
npm run build

# Lint code
npm run lint
```

## 📦 Building for Production

```bash
npm run build
npm start
```

## 🚀 Deployment to Vercel

### Option 1: Deploy via Vercel Dashboard

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Add environment variables from `.env.local`
6. Click "Deploy"

### Option 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

### Environment Variables on Vercel

Add these in Vercel Dashboard → Settings → Environment Variables:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_KEY`
- `NEXT_PUBLIC_WHATSAPP_NUMBER`
- `NEXT_PUBLIC_BUSINESS_EMAIL`
- `NEXT_PUBLIC_SITE_URL` (your Vercel domain)

## 🔧 Troubleshooting

### Images not loading
- Check Supabase Storage bucket is public
- Verify image URLs in database
- Check `NEXT_PUBLIC_SUPABASE_URL` is correct

### Products not showing
- Verify Supabase connection
- Check database has products with `is_active = true`
- Look for errors in browser console

### Cart not working
- Check localStorage is enabled in browser
- Clear browser cache and try again

### Build errors
- Run `npm run build` locally first
- Check all environment variables are set
- Verify TypeScript types are correct

## 📚 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage
- **Deployment**: Vercel
- **State Management**: React Hooks + localStorage

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is proprietary and confidential.

## 📞 Support

For support, email info@arshrozy.com or message on WhatsApp: +254 769 752 124

---

Built with ❤️ by Arshrozy Printshop
