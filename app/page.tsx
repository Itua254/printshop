import { getProducts } from '@/lib/utils/products'
import ProductGrid from '@/components/ProductGrid'
import Hero from '@/components/Hero'
import WhatsAppButton from '@/components/WhatsAppButton'

export default async function Home() {
  const products = await getProducts()

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Hero Section */}
      <Hero />

      {/* Product Catalog */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-sm font-semibold text-amber-600 uppercase tracking-wide">
              Our Collection
            </span>
            <h2 className="mt-2 text-4xl font-bold text-gray-900">
              Curated Printing Services
            </h2>
          </div>

          <ProductGrid products={products} />
        </div>
      </section>

      {/* Floating WhatsApp Button */}
      <WhatsAppButton />
    </div>
  )
}
