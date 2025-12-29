import { createClient } from '@/lib/supabase/server'
import { Product } from '@/lib/types/database'

/**
 * Get all active products
 */
export async function getProducts(): Promise<Product[]> {
    const supabase = createClient()

    const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true })

    if (error) {
        console.error('Error fetching products:', error)
        return []
    }

    return data || []
}

/**
 * Get a single product by ID
 */
export async function getProduct(id: string): Promise<Product | null> {
    const supabase = createClient()

    const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .eq('is_active', true)
        .single()

    if (error) {
        console.error('Error fetching product:', error)
        return null
    }

    return data
}

/**
 * Get products by category
 */
export async function getProductsByCategory(category: string): Promise<Product[]> {
    const supabase = createClient()

    const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('category', category)
        .eq('is_active', true)
        .order('sort_order', { ascending: true })

    if (error) {
        console.error('Error fetching products by category:', error)
        return []
    }

    return data || []
}

/**
 * Get all product categories
 */
export async function getCategories(): Promise<string[]> {
    const supabase = createClient()

    const { data, error } = await supabase
        .from('products')
        .select('category')
        .eq('is_active', true)

    if (error) {
        console.error('Error fetching categories:', error)
        return []
    }

    // Get unique categories
    const categories = [...new Set(data.map(p => p.category))]
    return categories
}

/**
 * Search products
 */
export async function searchProducts(query: string): Promise<Product[]> {
    const supabase = createClient()

    const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .or(`name.ilike.%${query}%,description.ilike.%${query}%,category.ilike.%${query}%`)
        .order('sort_order', { ascending: true })

    if (error) {
        console.error('Error searching products:', error)
        return []
    }

    return data || []
}

/**
 * Get product image URL from Supabase Storage
 */
export function getProductImageUrl(imagePath: string | null): string {
    if (!imagePath) return '/placeholder-product.jpg'

    // If it's already a full URL, return it
    if (imagePath.startsWith('http')) return imagePath

    // If it's a local path, convert to Supabase Storage URL
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
    const filename = imagePath.replace('/images/', '')


    return `${supabaseUrl}/storage/v1/object/public/product-images/${filename}`
}

/**
 * Format price in KES
 */
export function formatPrice(amount: number): string {
    return new Intl.NumberFormat('en-KE', {
        style: 'currency',
        currency: 'KES',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount)
}

/**
 * Calculate product price with variant
 */
export function calculatePrice(
    product: Product,
    variantType?: string,
    quantity: number = 1
): number {
    let price = product.base_price

    // Add variant price if specified
    if (variantType && product.variants) {
        const variants = product.variants as any[]
        const variant = variants.find(v => v.type === variantType)
        if (variant) {
            price = variant.price
        }
    }

    return price * quantity
}
