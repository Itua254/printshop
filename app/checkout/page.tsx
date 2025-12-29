'use client'

import { useState, useEffect } from 'react'
import { getCart, getCartTotal, clearCart } from '@/lib/utils/cart'
import { formatPrice } from '@/lib/utils/products'
import { CartItem } from '@/lib/types/database'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

type PaymentMethod = 'mpesa' | 'card'

export default function CheckoutPage() {
    const router = useRouter()
    const [cart, setCart] = useState<CartItem[]>([])
    const [total, setTotal] = useState(0)
    const [isLoaded, setIsLoaded] = useState(false)
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('mpesa')
    const [isProcessing, setIsProcessing] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)

    // Form states
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        city: 'Lodwar',
        notes: ''
    })

    useEffect(() => {
        const items = getCart()
        if (items.length === 0 && isLoaded) {
            router.push('/')
        }
        setCart(items)
        setTotal(getCartTotal())
        setIsLoaded(true)
    }, [isLoaded, router])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsProcessing(true)

        // Mock payment processing delay
        await new Promise(resolve => setTimeout(resolve, 3000))

        setIsProcessing(false)
        setIsSuccess(true)
        clearCart()

        // Wait a bit before redirecting
        setTimeout(() => {
            router.push('/')
        }, 5000)
    }

    if (!isLoaded) return <div className="min-h-screen bg-zinc-50 flex items-center justify-center">Loading...</div>

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-white rounded-3xl p-12 text-center shadow-xl border border-gray-100 animate-in fade-in zoom-in duration-500">
                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
                        <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">Order Placed!</h1>
                    <p className="text-gray-600 mb-8">
                        Thank you for choosing **Turkana Printing House**. We've received your order and will contact you via WhatsApp/Phone shortly.
                    </p>
                    <div className="bg-gray-50 rounded-2xl p-6 mb-8 text-left">
                        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Order Details</p>
                        <p className="text-gray-900 font-medium">Name: {formData.fullName}</p>
                        <p className="text-gray-900 font-medium">Mpesa/Card Total: {formatPrice(total)}</p>
                    </div>
                    <Link
                        href="/"
                        className="inline-block w-full bg-amber-600 text-white font-bold py-4 rounded-2xl hover:bg-amber-700 transition-all shadow-lg hover:shadow-xl"
                    >
                        Back to Home
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-zinc-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row gap-4 items-center mb-12">
                    <Link href="/cart" className="p-2 hover:bg-white rounded-full transition-colors group">
                        <svg className="w-6 h-6 text-gray-400 group-hover:text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </Link>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight">
                        Secure <span className="text-amber-600">Checkout</span>
                    </h1>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-5 gap-12">
                    {/* Checkout Details */}
                    <div className="lg:col-span-3 space-y-8">
                        {/* Contact Information */}
                        <section className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                            <div className="flex items-center gap-4 mb-6">
                                <span className="w-10 h-10 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center font-bold">1</span>
                                <h2 className="text-2xl font-bold text-gray-900">Contact Information</h2>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Full Name</label>
                                    <input
                                        required
                                        type="text"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleInputChange}
                                        placeholder="John Doe"
                                        className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Phone Number (M-Pesa)</label>
                                    <input
                                        required
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        placeholder="07XX XXX XXX"
                                        className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all outline-none"
                                    />
                                </div>
                                <div className="sm:col-span-2">
                                    <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Email Address</label>
                                    <input
                                        required
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        placeholder="john@example.com"
                                        className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all outline-none"
                                    />
                                </div>
                            </div>
                        </section>

                        {/* Delivery Details */}
                        <section className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                            <div className="flex items-center gap-4 mb-6">
                                <span className="w-10 h-10 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center font-bold">2</span>
                                <h2 className="text-2xl font-bold text-gray-900">Delivery Details</h2>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Delivery Address / Office</label>
                                    <input
                                        required
                                        type="text"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        placeholder="Bomas of Lodwar, Next to..."
                                        className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all outline-none"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">City</label>
                                        <input
                                            required
                                            type="text"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleInputChange}
                                            className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all outline-none"
                                        />
                                    </div>
                                    <div className="flex items-center">
                                        <div className="bg-amber-50 text-amber-700 text-xs font-bold px-4 py-3 rounded-xl border border-amber-100">
                                            🚚 Pickup in Lodwar is FREE
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Payment Method */}
                        <section className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                            <div className="flex items-center gap-4 mb-6">
                                <span className="w-10 h-10 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center font-bold">3</span>
                                <h2 className="text-2xl font-bold text-gray-900">Payment Method</h2>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    onClick={() => setPaymentMethod('mpesa')}
                                    className={`relative p-6 rounded-3xl border-2 transition-all text-left ${paymentMethod === 'mpesa'
                                            ? 'border-amber-500 bg-amber-50/50'
                                            : 'border-gray-100 hover:border-gray-200'
                                        }`}
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center shadow-lg shadow-green-200">
                                            <span className="text-white font-black text-xl italic">M</span>
                                        </div>
                                        {paymentMethod === 'mpesa' && (
                                            <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center">
                                                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>
                                    <p className="font-bold text-gray-900 text-lg">M-Pesa Express</p>
                                    <p className="text-xs text-gray-500 mt-1">Instant STK Push to your phone</p>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setPaymentMethod('card')}
                                    className={`relative p-6 rounded-3xl border-2 transition-all text-left ${paymentMethod === 'card'
                                            ? 'border-amber-500 bg-amber-50/50'
                                            : 'border-gray-100 hover:border-gray-200'
                                        }`}
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
                                            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z" />
                                            </svg>
                                        </div>
                                        {paymentMethod === 'card' && (
                                            <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center">
                                                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>
                                    <p className="font-bold text-gray-900 text-lg">Credit / Debit Card</p>
                                    <p className="text-xs text-gray-500 mt-1">Visa, Mastercard, American Express</p>
                                </button>
                            </div>
                        </section>
                    </div>

                    {/* Summary Sidebar */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 sticky top-24">
                            <h2 className="text-2xl font-bold text-gray-900 mb-8 tracking-tight">Summary</h2>

                            <div className="space-y-4 mb-8 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                {cart.map(item => (
                                    <div key={item.id} className="flex gap-4 items-center">
                                        <div className="relative w-16 h-16 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100">
                                            <Image
                                                src={getProductImageUrl(item.product.image_url)}
                                                alt={item.product.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-gray-900 truncate text-sm">{item.product.name}</p>
                                            <p className="text-xs text-gray-500">{item.quantity}x • {item.variant?.label || 'Standard'}</p>
                                        </div>
                                        <p className="font-black text-gray-900 text-sm whitespace-nowrap">{formatPrice(item.total)}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-4 pt-6 border-t border-gray-100">
                                <div className="flex justify-between text-gray-500 font-medium">
                                    <span>Subtotal</span>
                                    <span>{formatPrice(total)}</span>
                                </div>
                                <div className="flex justify-between text-gray-500 font-medium">
                                    <span>Estimated Tax</span>
                                    <span>{formatPrice(total * 0.16)}</span>
                                </div>
                                <div className="flex justify-between pt-4">
                                    <span className="text-xl font-bold text-gray-900">Total Due</span>
                                    <span className="text-3xl font-black text-amber-600">{formatPrice(total + (total * 0.16))}</span>
                                </div>
                            </div>

                            <button
                                disabled={isProcessing}
                                className={`w-full mt-10 font-black py-5 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-lg ${isProcessing
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        : 'bg-amber-600 text-white hover:bg-amber-700 transform hover:-translate-y-1 hover:shadow-xl'
                                    }`}
                            >
                                {isProcessing ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Processing Order...
                                    </>
                                ) : (
                                    <>
                                        Complete Payment
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </>
                                )}
                            </button>

                            <p className="mt-6 text-center text-xs text-gray-400 flex items-center justify-center gap-2">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                </svg>
                                Secured with 256-bit SSL encryption
                            </p>
                        </div>
                    </div>
                </form>
            </div>

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #f3f4f6;
                    border-radius: 10px;
                }
            `}</style>
        </div>
    )
}
