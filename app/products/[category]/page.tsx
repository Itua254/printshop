import { getProductsByCategory } from '@/lib/utils/products'
import { notFound } from 'next/navigation'
import ProductDetailClient from '@/components/ProductDetailClient'

interface PageProps {
    params: Promise<{
        category: string
    }>
}

export default async function ProductPage({ params }: PageProps) {
    const { category } = await params
    const products = await getProductsByCategory(category)

    if (products.length === 0) {
        notFound()
    }

    // For now, we'll show the first product in the category
    // In a real app, you might want individual product pages
    const product = products[0]

    return (
        <div className="min-h-screen bg-zinc-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <ProductDetailClient product={product} />
            </div>
        </div>
    )
}

// Generate static params for all categories
export async function generateStaticParams() {
    const categories = ['cards', 'flyers', 'banners', 'apparel', 'mugs', 'stickers', 'stamps', 'branding', 'stationery']

    return categories.map((category) => ({
        category,
    }))
}
