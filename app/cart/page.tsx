'use client'

import { useState, useEffect } from 'react'
import { getCart, removeFromCart, updateCartItemQuantity, getCartTotal, clearCart } from '@/lib/utils/cart'
import { formatPrice, getProductImageUrl } from '@/lib/utils/products'
import { CartItem } from '@/lib/types/database'
import Image from 'next/image'
import Link from 'next/link'

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
        const updatedCart = getCart()
        setCart(updatedCart)
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

    const handleClearCart = () => {
        if (confirm('Are you sure you want to clear your cart?')) {
            clearCart()
            refreshCart()
        }
    }

    if (!isLoaded) {
        return (
            <div className="min-h-screen bg-[#fafafa] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-600"></div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#fafafa] pt-24 pb-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                    <div>
                        <Link
                            href="/"
                            className="text-amber-600 text-sm font-bold uppercase tracking-widest flex items-center gap-2 mb-2 hover:gap-3 transition-all"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Continue Shopping
                        </Link>
                        <h1 className="text-5xl font-black text-gray-900 tracking-tight">
                            My <span className="text-amber-600">Cart</span>
                            <span className="text-gray-300 ml-4">[{cart.length}]</span>
                        </h1>
                    </div>
                    {cart.length > 0 && (
                        <button
                            onClick={handleClearCart}
                            className="text-gray-400 hover:text-red-500 text-sm font-bold uppercase tracking-wider flex items-center gap-2 transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Clear Cart
                        </button>
                    )}
                </div>

                {cart.length === 0 ? (
                    <div className="bg-white rounded-[40px] p-20 text-center shadow-2xl shadow-gray-200/50 border border-gray-100/50 relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-amber-400 via-amber-600 to-amber-400"></div>
                        <div className="w-32 h-32 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-500">
                            <svg className="w-16 h-16 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                        </div>
                        <h2 className="text-3xl font-black text-gray-900 mb-4">Your cart is empty</h2>
                        <p className="text-gray-500 mb-10 text-lg max-w-md mx-auto">Looks like you haven't added any premium prints to your cart yet. Let's change that!</p>
                        <Link
                            href="/"
                            className="inline-flex items-center justify-center px-10 py-5 bg-gray-900 text-white font-bold rounded-2xl hover:bg-amber-600 transition-all transform hover:-translate-y-1 shadow-xl hover:shadow-2xl hover:shadow-amber-600/20"
                        >
                            Browse Products
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                        {/* Items List */}
                        <div className="lg:col-span-8 space-y-6">
                            {cart.map((item) => (
                                <div key={item.id} className="group bg-white rounded-[32px] p-6 shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-8 hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-500 relative">
                                    <div className="relative w-full sm:w-44 h-44 bg-gray-50 rounded-[24px] overflow-hidden flex-shrink-0">
                                        <Image
                                            src={getProductImageUrl(item.product.image_url)}
                                            alt={item.product.name}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                    </div>

                                    <div className="flex-1 flex flex-col justify-between py-2">
                                        <div>
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <p className="text-xs font-black text-amber-600 uppercase tracking-widest mb-1">{item.product.category}</p>
                                                    <h3 className="text-2xl font-black text-gray-900">{item.product.name}</h3>
                                                </div>
                                                <button
                                                    onClick={() => handleRemove(item.id)}
                                                    className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            </div>

                                            {item.variant && (
                                                <div className="inline-block px-4 py-1.5 bg-amber-50 rounded-full mb-4">
                                                    <p className="text-amber-800 font-bold text-xs uppercase tracking-wider">{item.variant.label}</p>
                                                </div>
                                            )}

                                            {Object.keys(item.specifications).length > 0 && (
                                                <div className="flex flex-wrap gap-2">
                                                    {Object.entries(item.specifications).map(([key, value]) => (
                                                        <span key={key} className="px-3 py-1 bg-gray-50 border border-gray-100 rounded-lg text-[10px] font-bold text-gray-400 uppercase tracking-tight">
                                                            {key}: <span className="text-gray-700">{value}</span>
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex items-center justify-between mt-8">
                                            <div className="flex items-center bg-gray-50 rounded-2xl p-1.5 border border-gray-100">
                                                <button
                                                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                                    className="w-10 h-10 flex items-center justify-center rounded-xl text-gray-400 hover:bg-white hover:text-amber-600 hover:shadow-sm transition-all"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M20 12H4" />
                                                    </svg>
                                                </button>
                                                <span className="w-12 text-center font-black text-gray-900 text-lg">{item.quantity}</span>
                                                <button
                                                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                                    className="w-10 h-10 flex items-center justify-center rounded-xl text-gray-400 hover:bg-white hover:text-amber-600 hover:shadow-sm transition-all"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                                                    </svg>
                                                </button>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1">Item Total</p>
                                                <p className="text-2xl font-black text-gray-900">
                                                    {formatPrice(item.total)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-4">
                            <div className="bg-white rounded-[40px] p-10 shadow-2xl shadow-gray-200/50 border border-gray-100/50 sticky top-32">
                                <h2 className="text-3xl font-black text-gray-900 mb-8 tracking-tight">Order <span className="text-amber-600">Summary</span></h2>

                                <div className="space-y-6 mb-10">
                                    <div className="flex justify-between items-center bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
                                        <span className="text-gray-500 font-bold uppercase text-xs tracking-widest">Subtotal</span>
                                        <span className="text-xl font-bold text-gray-900">{formatPrice(total)}</span>
                                    </div>
                                    <div className="flex justify-between items-center px-4">
                                        <span className="text-gray-500 font-bold uppercase text-xs tracking-widest">Delivery</span>
                                        <span className="text-green-600 font-black text-xs uppercase tracking-widest">Calculated at checkout</span>
                                    </div>
                                    <div className="pt-6 border-t border-gray-100 flex justify-between items-center px-2">
                                        <span className="text-2xl font-black text-gray-900">Total</span>
                                        <div className="text-right">
                                            <span className="text-4xl font-black text-amber-600 block leading-none">{formatPrice(total)}</span>
                                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-2 block">Inclusive of local taxes</span>
                                        </div>
                                    </div>
                                </div>

                                <Link
                                    href="/checkout"
                                    className="w-full bg-gray-900 text-white font-black py-6 rounded-[24px] hover:bg-amber-600 transition-all flex items-center justify-center gap-3 shadow-2xl hover:shadow-amber-600/30 transform hover:-translate-y-1 mb-6 group"
                                >
                                    Proceed to Checkout
                                    <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </Link>

                                <div className="flex items-center justify-center gap-4 py-2 opacity-50">
                                    <div className="h-[1px] flex-1 bg-gray-200"></div>
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Secure Checkout</span>
                                    <div className="h-[1px] flex-1 bg-gray-200"></div>
                                </div>
                                <p className="text-center text-[10px] text-gray-400 font-medium mt-4 uppercase tracking-tighter italic">
                                    "Turkana's #1 Choice for Premium Printing"
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

