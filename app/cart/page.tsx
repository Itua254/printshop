'use client'

import { useState, useEffect } from 'react'
import { getCart, removeFromCart, updateCartItemQuantity, getCartTotal, clearCart } from '@/lib/utils/cart'
import { formatPrice } from '@/lib/utils/products'
import { CartItem } from '@/lib/types/database'
import Image from 'next/image'
import Link from 'next/link'
import { getProductImageUrl } from '@/lib/utils/products'

export default function CartPage() {
    const [cart, setCart] = useState<CartItem[]>([])
    const [total, setTotal] = useState(0)
    const [isLoaded, setIsLoaded] = useState(false)

    useEffect(() => {
        setCart(getCart())
        setTotal(getCartTotal())
        setIsLoaded(true)
    }, [])

    const refreshCart = () => {
        setCart(getCart())
        setTotal(getCartTotal())
    }

    const handleRemove = (itemId: string) => {
        removeFromCart(itemId)
        refreshCart()
    }

    const handleQuantityChange = (itemId: string, newQuantity: number) => {
        if (newQuantity < 1) return
        updateCartItemQuantity(itemId, newQuantity)
        refreshCart()
    }

    if (!isLoaded) return <div className="min-h-screen bg-zinc-50 flex items-center justify-center">Loading...</div>

    return (
        <div className="min-h-screen bg-zinc-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-4xl font-black text-gray-900 mb-8 tracking-tight">
                    Shopping <span className="text-amber-600">Cart</span>
                </h1>

                {cart.length === 0 ? (
                    <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-gray-100">
                        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                        </div>
                        <p className="text-xl text-gray-600 mb-8">Your cart feels a bit light...</p>
                        <Link
                            href="/"
                            className="inline-flex items-center justify-center px-8 py-4 bg-amber-600 text-white font-bold rounded-2xl hover:bg-amber-700 transition-all transform hover:-translate-y-1 shadow-lg hover:shadow-xl"
                        >
                            Explore Our Products
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Items List */}
                        <div className="lg:col-span-2 space-y-4">
                            {cart.map((item) => (
                                <div key={item.id} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-6 hover:shadow-md transition-shadow">
                                    <div className="relative w-full sm:w-32 h-32 bg-gray-50 rounded-2xl overflow-hidden flex-shrink-0">
                                        <Image
                                            src={getProductImageUrl(item.product.image_url)}
                                            alt={item.product.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>

                                    <div className="flex-1 flex flex-col justify-between">
                                        <div>
                                            <div className="flex justify-between items-start">
                                                <h3 className="text-xl font-bold text-gray-900">{item.product.name}</h3>
                                                <button
                                                    onClick={() => handleRemove(item.id)}
                                                    className="text-gray-400 hover:text-red-500 transition-colors"
                                                >
                                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                            {item.variant && (
                                                <p className="text-amber-600 font-semibold text-sm mt-1">{item.variant.label}</p>
                                            )}

                                            {Object.keys(item.specifications).length > 0 && (
                                                <div className="inline-flex flex-wrap gap-2 mt-3">
                                                    {Object.entries(item.specifications).map(([key, value]) => (
                                                        <span key={key} className="px-3 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-600">
                                                            {key}: {value}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex items-center justify-between mt-6">
                                            <div className="flex items-center bg-gray-50 rounded-xl p-1 border border-gray-100">
                                                <button
                                                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                                    className="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-amber-600 font-bold"
                                                >
                                                    -
                                                </button>
                                                <span className="w-12 text-center font-bold text-gray-900">{item.quantity}</span>
                                                <button
                                                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                                    className="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-amber-600 font-bold"
                                                >
                                                    +
                                                </button>
                                            </div>
                                            <p className="text-xl font-black text-gray-900">
                                                {formatPrice(item.total)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 sticky top-24">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Summary</h2>

                                <div className="space-y-4 mb-8">
                                    <div className="flex justify-between text-gray-600">
                                        <span>Subtotal</span>
                                        <span>{formatPrice(total)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>Delivery</span>
                                        <span className="text-green-600 font-medium">calculated at checkout</span>
                                    </div>
                                    <div className="border-t border-gray-100 pt-4 flex justify-between">
                                        <span className="text-xl font-bold text-gray-900">Total</span>
                                        <span className="text-2xl font-black text-amber-600">{formatPrice(total)}</span>
                                    </div>
                                </div>

                                <Link
                                    href="/checkout"
                                    className="w-full bg-amber-600 text-white font-bold py-5 rounded-2xl hover:bg-amber-700 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1 mb-4"
                                >
                                    Proceed to Checkout
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </Link>

                                <p className="text-center text-xs text-gray-400">
                                    Trusted by businesses in Turkana & across Kenya.
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
