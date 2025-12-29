'use client'

import { useState, useEffect } from 'react'
import { getCartItemCount } from '@/lib/utils/cart'
import CartModal from './CartModal'

export default function CartButton() {
    const [cartCount, setCartCount] = useState(0)
    const [isModalOpen, setIsModalOpen] = useState(false)

    useEffect(() => {
        // Initial count
        setCartCount(getCartItemCount())

        // Listen for cart updates
        const handleCartUpdate = () => {
            setCartCount(getCartItemCount())
        }

        window.addEventListener('cartUpdated', handleCartUpdate)
        return () => window.removeEventListener('cartUpdated', handleCartUpdate)
    }, [])

    return (
        <>
            <button
                onClick={() => setIsModalOpen(true)}
                className="relative p-2 text-gray-700 hover:text-amber-600 transition-colors"
                aria-label="Shopping cart"
            >
                <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                </svg>

                {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-amber-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                        {cartCount}
                    </span>
                )}
            </button>

            <CartModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </>
    )
}
