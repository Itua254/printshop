'use client'

import { CartItem, Product, ProductVariant } from '@/lib/types/database'

const CART_STORAGE_KEY = 'arshrozy_cart'

/**
 * Get cart items from localStorage
 */
export function getCart(): CartItem[] {
    if (typeof window === 'undefined') return []

    try {
        const cart = localStorage.getItem(CART_STORAGE_KEY)
        return cart ? JSON.parse(cart) : []
    } catch (error) {
        console.error('Error reading cart:', error)
        return []
    }
}

/**
 * Save cart to localStorage
 */
export function saveCart(cart: CartItem[]): void {
    if (typeof window === 'undefined') return

    try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart))
        // Dispatch custom event for cart updates
        window.dispatchEvent(new CustomEvent('cartUpdated', { detail: cart }))
    } catch (error) {
        console.error('Error saving cart:', error)
    }
}

/**
 * Add item to cart
 */
export function addToCart(
    product: Product,
    variant: ProductVariant | undefined,
    quantity: number,
    specifications: Record<string, any> = {}
): CartItem {
    const cart = getCart()

    const price = variant ? variant.price : product.base_price
    const total = price * quantity

    const newItem: CartItem = {
        id: `${product.id}-${variant?.type || 'default'}-${Date.now()}`,
        product,
        variant,
        quantity,
        specifications,
        total,
    }

    cart.push(newItem)
    saveCart(cart)

    return newItem
}

/**
 * Remove item from cart
 */
export function removeFromCart(itemId: string): void {
    const cart = getCart()
    const updatedCart = cart.filter(item => item.id !== itemId)
    saveCart(updatedCart)
}

/**
 * Update item quantity
 */
export function updateCartItemQuantity(itemId: string, quantity: number): void {
    const cart = getCart()
    const item = cart.find(item => item.id === itemId)

    if (item) {
        item.quantity = quantity
        const price = item.variant ? item.variant.price : item.product.base_price
        item.total = price * quantity
        saveCart(cart)
    }
}

/**
 * Clear entire cart
 */
export function clearCart(): void {
    saveCart([])
}

/**
 * Get cart total
 */
export function getCartTotal(): number {
    const cart = getCart()
    return cart.reduce((sum, item) => sum + item.total, 0)
}

/**
 * Get cart item count
 */
export function getCartItemCount(): number {
    const cart = getCart()
    return cart.length
}

/**
 * Generate WhatsApp checkout message
 */
export function generateWhatsAppMessage(cart: CartItem[]): string {
    if (cart.length === 0) return ''

    let message = '*New Order Request*\n'
    message += '------------------\n\n'

    cart.forEach((item, index) => {
        message += `*${index + 1}. ${item.product.name}*\n`

        if (item.variant) {
            message += `   - Type: ${item.variant.label}\n`
        }

        message += `   - Quantity: ${item.quantity}\n`

        // Add specifications
        for (const [key, value] of Object.entries(item.specifications)) {
            message += `   - ${key}: ${value}\n`
        }

        message += `   - Price: KES ${item.total.toLocaleString('en-KE', { minimumFractionDigits: 2 })}\n\n`
    })

    const total = getCartTotal()
    message += '------------------\n'
    message += `*Grand Total: KES ${total.toLocaleString('en-KE', { minimumFractionDigits: 2 })}*`

    return message
}

/**
 * Open WhatsApp with cart details
 */
export function checkoutViaWhatsApp(): void {
    const cart = getCart()
    if (cart.length === 0) {
        alert('Your cart is empty!')
        return
    }

    const message = generateWhatsAppMessage(cart)
    const phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '254769752124'
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`

    window.open(url, '_blank')
}
