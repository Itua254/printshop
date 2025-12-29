'use client'

import { useState, useEffect } from 'react'
import { getCart, removeFromCart, updateCartItemQuantity, getCartTotal, checkoutViaWhatsApp, clearCart } from '@/lib/utils/cart'
import { formatPrice } from '@/lib/utils/products'
import { CartItem } from '@/lib/types/database'
import Image from 'next/image'
import { getProductImageUrl } from '@/lib/utils/products'

interface CartModalProps {
    isOpen: boolean
    onClose: () => void
}

export default function CartModal({ isOpen, onClose }: CartModalProps) {
    const [cart, setCart] = useState<CartItem[]>([])
    const [total, setTotal] = useState(0)

    useEffect(() => {
        if (isOpen) {
            refreshCart()
        }
    }, [isOpen])

    useEffect(() => {
        const handleCartUpdate = () => {
            refreshCart()
        }

        window.addEventListener('cartUpdated', handleCartUpdate)
        return () => window.removeEventListener('cartUpdated', handleCartUpdate)
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

    const handleCheckout = () => {
        checkoutViaWhatsApp()
        // Optionally clear cart after checkout
        // clearCart()
        // onClose()
    }

    const handleClearCart = () => {
        if (confirm('Are you sure you want to clear your cart?')) {
            clearCart()
            refreshCart()
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 overflow-hidden">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-900">Your Cart</h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto p-6">
                    {cart.length === 0 ? (
                        <div className="text-center py-12">
                            <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                            <p className="text-gray-500 text-lg">Your cart is empty</p>
                            <button
                                onClick={onClose}
                                className="mt-4 text-amber-600 hover:text-amber-700 font-medium"
                            >
                                Continue Shopping
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {cart.map((item) => (
                                <div key={item.id} className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                                    {/* Product Image */}
                                    <div className="relative w-20 h-20 flex-shrink-0 bg-white rounded-lg overflow-hidden">
                                        <Image
                                            src={getProductImageUrl(item.product.image_url)}
                                            alt={item.product.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>

                                    {/* Product Info */}
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-gray-900 truncate">
                                            {item.product.name}
                                        </h3>
                                        {item.variant && (
                                            <p className="text-sm text-gray-600">{item.variant.label}</p>
                                        )}

                                        {/* Specifications */}
                                        {Object.keys(item.specifications).length > 0 && (
                                            <div className="text-xs text-gray-500 mt-1">
                                                {Object.entries(item.specifications).map(([key, value]) => (
                                                    <div key={key}>{key}: {value}</div>
                                                ))}
                                            </div>
                                        )}

                                        {/* Quantity Controls */}
                                        <div className="flex items-center gap-2 mt-2">
                                            <button
                                                onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                                className="w-6 h-6 flex items-center justify-center bg-white border border-gray-300 rounded text-gray-600 hover:bg-gray-100"
                                            >
                                                -
                                            </button>
                                            <span className="w-8 text-center font-medium">{item.quantity}</span>
                                            <button
                                                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                                className="w-6 h-6 flex items-center justify-center bg-white border border-gray-300 rounded text-gray-600 hover:bg-gray-100"
                                            >
                                                +
                                            </button>
                                        </div>

                                        <p className="text-amber-600 font-bold mt-2">
                                            {formatPrice(item.total)}
                                        </p>
                                    </div>

                                    {/* Remove Button */}
                                    <button
                                        onClick={() => handleRemove(item.id)}
                                        className="text-red-500 hover:text-red-700 p-2"
                                        aria-label="Remove item"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            ))}

                            {/* Clear Cart Button */}
                            {cart.length > 0 && (
                                <button
                                    onClick={handleClearCart}
                                    className="w-full text-sm text-red-600 hover:text-red-700 font-medium py-2"
                                >
                                    Clear Cart
                                </button>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                {cart.length > 0 && (
                    <div className="border-t border-gray-200 p-6 bg-gray-50">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-lg font-semibold text-gray-900">Total</span>
                            <span className="text-2xl font-bold text-amber-600">
                                {formatPrice(total)}
                            </span>
                        </div>

                        <button
                            onClick={handleCheckout}
                            className="w-full bg-green-600 text-white font-semibold py-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                        >
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                            </svg>
                            Checkout via WhatsApp
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}
