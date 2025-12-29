'use client'

import { useState } from 'react'
import { Product, ProductVariant } from '@/lib/types/database'
import { getProductImageUrl, formatPrice, calculatePrice } from '@/lib/utils/products'
import { addToCart } from '@/lib/utils/cart'
import Image from 'next/image'
import Link from 'next/link'

interface ProductDetailClientProps {
    product: Product
}

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
    const variants = (product.variants as unknown as ProductVariant[]) || []
    console.log('Product variants:', variants)

    const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(
        variants.length > 0 ? variants[0] : undefined
    )
    const [quantity, setQuantity] = useState(100) // Default quantity
    const [specifications, setSpecifications] = useState<Record<string, any>>({})

    const currentPrice = calculatePrice(product, selectedVariant?.type, quantity)

    const handleAddToCart = () => {
        addToCart(product, selectedVariant, quantity, {
            ...specifications,
            quantity: quantity.toString(),
        })
        alert('Added to cart!')
    }

    const imageUrl = selectedVariant?.image
        ? getProductImageUrl(selectedVariant.image)
        : getProductImageUrl(product.image_url)

    return (
        <div>
            {/* Breadcrumb */}
            <nav className="mb-8 text-sm">
                <Link href="/" className="text-amber-600 hover:text-amber-700">
                    Home
                </Link>
                <span className="mx-2 text-gray-400">/</span>
                <span className="text-gray-600">{product.name}</span>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Product Image */}
                <div className="relative h-96 lg:h-[600px] bg-white rounded-2xl overflow-hidden shadow-lg">
                    <Image
                        src={imageUrl}
                        alt={product.name}
                        fill
                        className="object-cover"
                        priority
                    />
                </div>

                {/* Product Details & Calculator */}
                <div className="bg-white rounded-2xl p-8 shadow-lg">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        {product.name}
                    </h1>

                    <p className="text-gray-600 text-lg mb-8">
                        {product.description}
                    </p>

                    {/* Pricing Calculator */}
                    <div className="space-y-6">
                        {/* Variant Selection */}
                        {variants.length > 0 && (
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Type / Finish
                                </label>
                                <select
                                    value={selectedVariant?.type || ''}
                                    onChange={(e) => {
                                        const variant = variants.find(v => v.type === e.target.value)
                                        setSelectedVariant(variant)
                                    }}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                >
                                    {variants.map((variant) => (
                                        <option key={variant.type} value={variant.type}>
                                            {variant.label} - {formatPrice(variant.price)}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {/* Quantity */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Quantity
                            </label>
                            <input
                                type="number"
                                value={quantity}
                                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                min="1"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                            />
                        </div>

                        {/* Additional Specifications (if needed) */}
                        {product.category === 'cards' && (
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Sides
                                </label>
                                <select
                                    onChange={(e) => setSpecifications({ ...specifications, sides: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                >
                                    <option value="single">Single Sided</option>
                                    <option value="double">Double Sided (+KES 5 per card)</option>
                                </select>
                            </div>
                        )}

                        {product.category === 'apparel' && (
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Size
                                </label>
                                <select
                                    onChange={(e) => setSpecifications({ ...specifications, size: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                >
                                    <option value="S">Small</option>
                                    <option value="M">Medium</option>
                                    <option value="L">Large</option>
                                    <option value="XL">Extra Large</option>
                                    <option value="XXL">2XL</option>
                                </select>
                            </div>
                        )}

                        {/* Total Price Display */}
                        <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-6">
                            <div className="flex items-center justify-between">
                                <span className="text-lg font-semibold text-gray-700">Total Price</span>
                                <span className="text-3xl font-bold text-amber-600">
                                    {formatPrice(currentPrice)}
                                </span>
                            </div>
                            {quantity > 1 && (
                                <p className="text-sm text-gray-600 mt-2">
                                    {formatPrice(currentPrice / quantity)} per unit
                                </p>
                            )}
                        </div>

                        {/* Add to Cart Button */}
                        <button
                            onClick={handleAddToCart}
                            className="w-full bg-amber-600 text-white font-bold py-4 rounded-lg hover:bg-amber-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
                        >
                            Add to Cart
                        </button>

                        {/* WhatsApp Direct Order */}
                        <a
                            href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '254769752124'}?text=${encodeURIComponent(`I'm interested in ordering ${quantity}x ${product.name} (${selectedVariant?.label || 'Standard'})`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full bg-green-600 text-white font-bold py-4 rounded-lg hover:bg-green-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                        >
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                            </svg>
                            Order via WhatsApp
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}
