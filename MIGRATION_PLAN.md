# Arshrozy Printshop - Supabase + Vercel Migration Plan

## Current State Analysis
- **Technology**: Static HTML/CSS/JavaScript website
- **Features**: 
  - Product catalog (hardcoded in HTML)
  - Pricing calculator (hardcoded in `script.js`)
  - Shopping cart (localStorage)
  - WhatsApp checkout integration
  - Search functionality

## Migration Goals

### Backend (Supabase)
1. **Database Tables**:
   - `products` - Store all product categories and pricing
   - `orders` - Track customer orders
   - `cart_items` - Persistent cart storage
   - `customers` - Customer information

2. **Storage**:
   - Migrate all images from `/images` to Supabase Storage
   - Update all image references

3. **Authentication** (Optional):
   - Allow customers to create accounts
   - Track order history

### Frontend (Vercel)
1. Convert to modern framework (Next.js recommended)
2. Implement server-side rendering for better SEO
3. Connect to Supabase backend
4. Maintain WhatsApp integration
5. Add admin panel for product management

## Implementation Steps

### Phase 1: Supabase Setup
- [ ] Create Supabase project
- [ ] Design and create database schema
- [ ] Set up Row Level Security (RLS) policies
- [ ] Create Supabase Storage buckets for images
- [ ] Upload existing images to Supabase Storage

### Phase 2: Frontend Modernization
- [ ] Initialize Next.js project
- [ ] Install Supabase client library
- [ ] Migrate HTML pages to React components
- [ ] Migrate CSS to modern styling solution
- [ ] Connect to Supabase database
- [ ] Implement dynamic product loading
- [ ] Update cart to use Supabase (optional) or keep localStorage

### Phase 3: Feature Enhancement
- [ ] Create admin dashboard for product management
- [ ] Add order management system
- [ ] Implement email notifications (optional)
- [ ] Add analytics tracking

### Phase 4: Deployment
- [ ] Configure Vercel project
- [ ] Set up environment variables
- [ ] Deploy to Vercel
- [ ] Test all functionality
- [ ] Update DNS/domain settings

## Database Schema

### Products Table
```sql
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  base_price DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  variants JSONB, -- For storing size/type options
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Orders Table
```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_name TEXT,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  items JSONB NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending',
  whatsapp_sent BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Customers Table (Optional)
```sql
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  phone TEXT UNIQUE NOT NULL,
  name TEXT,
  email TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## Technology Stack

### Current
- HTML5
- Vanilla CSS
- Vanilla JavaScript
- GitHub Pages

### New
- **Frontend**: Next.js 14 (App Router)
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Styling**: Tailwind CSS or CSS Modules
- **Hosting**: Vercel
- **Language**: TypeScript (recommended)

## Migration Timeline
- **Phase 1**: 2-3 hours
- **Phase 2**: 4-6 hours
- **Phase 3**: 3-4 hours
- **Phase 4**: 1-2 hours

**Total Estimated Time**: 10-15 hours

## Next Steps
1. Confirm migration approach
2. Create Supabase project
3. Begin Phase 1 implementation
