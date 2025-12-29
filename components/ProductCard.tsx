'use client'

import { Product } from '@/lib/types/database'
import { getProductImageUrl, formatPrice } from '@/lib/utils/products'
import Link from 'next/link'
import Image from 'next/image'

interface ProductCardProps {
    product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
    const imageUrl = getProductImageUrl(product.image_url)

    return (
        <Link href={`/products/${product.category}`}>
            <article className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer">
                {/* Product Image */}
                <div className="relative h-64 bg-gray-100 overflow-hidden">
                    <Image
                        src={imageUrl}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />

                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* View Pricing badge */}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 translate-y-8 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <span className="inline-block px-6 py-2 bg-amber-500 text-white font-semibold rounded-full text-sm shadow-lg">
                            View Pricing →
                        </span>
                    </div>
                </div>

                {/* Product Info */}
                <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-amber-600 transition-colors">
                        {product.name}
                    </h3>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {product.description}
                    </p>

                    <div className="flex items-center justify-between">
                        <div>
                            <span className="text-xs text-gray-500 uppercase tracking-wide">Starting at</span>
                            <p className="text-2xl font-bold text-amber-600">
                                {formatPrice(product.base_price)}
                            </p>
                        </div>

                        <div className="text-amber-600 group-hover:translate-x-2 transition-transform duration-300">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                    </div>
                </div>
            </article>
        </Link>
    )
}
