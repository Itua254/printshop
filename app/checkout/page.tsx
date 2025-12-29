'use client'

import { useState, useEffect } from 'react'
import { getCart, getCartTotal, clearCart } from '@/lib/utils/cart'
import { formatPrice, getProductImageUrl } from '@/lib/utils/products'
import { CartItem } from '@/lib/types/database'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { initiateMpesaStkPush, initiatePayPalPayment, initiateCardPayment } from '@/lib/utils/payments'

type PaymentMethod = 'mpesa' | 'card' | 'paypal'

export default function CheckoutPage() {
    const router = useRouter()
    const supabase = createClient()
    
    const [cart, setCart] = useState<CartItem[]>([])
    const [total, setTotal] = useState(0)
    const [isLoaded, setIsLoaded] = useState(false)
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('mpesa')
    const [isProcessing, setIsProcessing] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [orderNumber, setOrderNumber] = useState('')

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
        if (items.length === 0 && isLoaded && !isSuccess) {
            router.push('/')
        }
        setCart(items)
        setTotal(getCartTotal())
        setIsLoaded(true)
    }, [isLoaded, router, isSuccess])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsProcessing(true)

        try {
            // 1. Create or Update Customer
            const { data: customer, error: customerError } = await supabase
                .from('customers')
                .upsert({
                    phone: formData.phone,
                    name: formData.fullName,
                    email: formData.email,
                    address: formData.address,
                    notes: formData.notes
                }, { onConflict: 'phone' })
                .select()
                .single()

            if (customerError) throw customerError

            // 2. Generate Order Number
            const newOrderNumber = `TPH-${Date.now().toString().slice(-6)}`
            setOrderNumber(newOrderNumber)

            // 3. Create Order
            const { data: order, error: orderError } = await supabase
                .from('orders')
                .insert({
                    order_number: newOrderNumber,
                    customer_id: customer.id,
                    customer_name: formData.fullName,
                    customer_phone: formData.phone,
                    customer_email: formData.email,
                    subtotal: total,
                    total_amount: total,
                    payment_method: paymentMethod,
                    items: cart as any,
                    status: 'pending',
                    payment_status: 'unpaid',
                    notes: formData.notes
                })
                .select()
                .single()

            if (orderError) throw orderError

            // 4. Create Order Items
            const orderItems = cart.map(item => ({
                order_id: order.id,
                product_id: item.product.id,
                product_name: item.product.name,
                product_category: item.product.category,
                quantity: item.quantity,
                unit_price: item.variant?.price || item.product.base_price,
                total_price: item.total,
                specifications: item.specifications
            }))

            const { error: itemsError } = await supabase
                .from('order_items')
                .insert(orderItems)

            if (itemsError) throw itemsError

            // 5. Payment Processing
            if (paymentMethod === 'mpesa') {
                await initiateMpesaStkPush(formData.phone, total, order.id)
                await supabase.from('orders').update({ payment_status: 'paid', status: 'processing' }).eq('id', order.id)
            } 
            else if (paymentMethod === 'paypal') {
                await initiatePayPalPayment(total)
                await supabase.from('orders').update({ payment_status: 'paid', status: 'processing' }).eq('id', order.id)
            }
            else {
                await initiateCardPayment(total, order.id)
                await supabase.from('orders').update({ payment_status: 'paid', status: 'processing' }).eq('id', order.id)
            }

            setIsProcessing(false)
            setIsSuccess(true)
            clearCart()

        } catch (error) {
            console.error('Checkout error:', error)
            alert('There was an error processing your order. Please try again.')
            setIsProcessing(false)
        }
    }

    const handleWhatsAppConfirm = () => {
        const businessNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '254769752124'
        const message = `Halo Turkana Printing House! I just placed an order (Order #${orderNumber}). My name is ${formData.fullName}. Please confirm receipt.`
        window.open(`https://wa.me/${businessNumber}?text=${encodeURIComponent(message)}`, '_blank')
    }

    if (!isLoaded) return <div className="min-h-screen bg-[#fafafa] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-600"></div>
    </div>

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-[#fafafa] flex items-center justify-center p-4">
                <div className="max-w-xl w-full bg-white rounded-[48px] p-12 text-center shadow-2xl shadow-gray-200/50 border border-gray-100 relative overflow-hidden animate-in fade-in zoom-in duration-700">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-400 via-emerald-600 to-green-400"></div>

                    <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
                        <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>

                    <h1 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">Order Confirmed!</h1>
                    <p className="text-gray-500 mb-8 text-lg">
                        Thank you for choosing <span className="text-amber-600 font-bold">Turkana Printing House</span>.
                        Your order <strong>#{orderNumber}</strong> has been received and is being processed.
                    </p>

                    <div className="bg-gray-50 rounded-3xl p-8 mb-8 text-left border border-gray-100">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Summary of Details</p>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-500 text-sm font-medium">Customer</span>
                                <span className="text-gray-900 text-sm font-black">{formData.fullName}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500 text-sm font-medium">Payment Status</span>
                                <span className={`px-3 py-1 ${paymentMethod === 'mpesa' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'} text-[10px] font-black rounded-full uppercase`}>
                                    {paymentMethod === 'mpesa' ? 'PENDING' : 'PAID'}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500 text-sm font-medium">Amount Paid</span>
                                <span className="text-gray-900 text-sm font-black">{formatPrice(total)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <button
                            onClick={handleWhatsAppConfirm}
                            className="bg-[#25D366] text-white font-black py-5 rounded-2xl hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-xl hover:shadow-[#25D366]/20 transform hover:-translate-y-1"
                        >
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.94 3.659 1.437 5.708 1.438h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                            </svg>
                            Confirm receipt
                        </button>
                        <Link
                            href="/"
                            className="bg-gray-100 text-gray-900 font-black py-5 rounded-2xl hover:bg-gray-200 transition-all flex items-center justify-center gap-2 shadow-sm"
                        >
                            Back Home
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#fafafa] pt-24 pb-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row gap-6 md:items-center mb-12">
                    <Link href="/cart" className="w-12 h-12 flex items-center justify-center bg-white rounded-2xl shadow-sm border border-gray-100 text-gray-400 hover:text-amber-600 hover:shadow-md transition-all group">
                        <svg className="w-6 h-6 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </Link>
                    <h1 className="text-5xl font-black text-gray-900 tracking-tight">
                        Secure <span className="text-amber-600">Checkout</span>
                    </h1>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Checkout Details */}
                    <div className="lg:col-span-7 space-y-8">
                        {/* Contact Information */}
                        <section className="bg-white rounded-[32px] p-10 shadow-sm border border-gray-100 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-5">
                                <svg className="w-24 h-24 text-gray-900" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                                </svg>
                            </div>
                            <div className="flex items-center gap-4 mb-8">
                                <span className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center font-black text-xl shadow-sm border border-amber-100">1</span>
                                <h2 className="text-2xl font-black text-gray-900">Personal Information</h2>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 mb-2 uppercase tracking-widest">Full Name</label>
                                    <input
                                        required
                                        type="text"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleInputChange}
                                        placeholder="Enter your name"
                                        className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all outline-none font-medium placeholder:text-gray-300"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 mb-2 uppercase tracking-widest">M-Pesa Number</label>
                                    <input
                                        required
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        placeholder="e.g. 0722 000 000"
                                        className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all outline-none font-medium placeholder:text-gray-300"
                                    />
                                </div>
                                <div className="sm:col-span-2">
                                    <label className="block text-[10px] font-black text-gray-400 mb-2 uppercase tracking-widest">Email Address</label>
                                    <input
                                        required
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        placeholder="e.g. hello@example.com"
                                        className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all outline-none font-medium placeholder:text-gray-300"
                                    />
                                </div>
                            </div>
                        </section>

                        {/* Delivery Details */}
                        <section className="bg-white rounded-[32px] p-10 shadow-sm border border-gray-100">
                            <div className="flex items-center gap-4 mb-8">
                                <span className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center font-black text-xl shadow-sm border border-amber-100">2</span>
                                <h2 className="text-2xl font-black text-gray-900">Delivery Details</h2>
                            </div>
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 mb-2 uppercase tracking-widest">Street Address / Office Name</label>
                                    <input
                                        required
                                        type="text"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        placeholder="e.g. KCB Building, 2nd Floor"
                                        className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all outline-none font-medium placeholder:text-gray-300"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-400 mb-2 uppercase tracking-widest">Town/City</label>
                                        <input
                                            required
                                            type="text"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleInputChange}
                                            className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all outline-none font-medium placeholder:text-gray-300"
                                        />
                                    </div>
                                    <div className="flex items-center">
                                        <div className="bg-green-50 text-green-700 text-[10px] font-black px-5 py-4 rounded-2xl border border-green-100 uppercase tracking-widest flex items-center gap-2">
                                            <span className="w-2 h-2 bg-green-500 rounded-full animate-ping"></span>
                                            Delivery in Lodwar is FREE
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Payment Method */}
                        <section className="bg-white rounded-[32px] p-10 shadow-sm border border-gray-100">
                            <div className="flex items-center gap-4 mb-8">
                                <span className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center font-black text-xl shadow-sm border border-amber-100">3</span>
                                <h2 className="text-2xl font-black text-gray-900">Payment Gateway</h2>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                <button
                                    type="button"
                                    onClick={() => setPaymentMethod('mpesa')}
                                    className={`relative p-8 rounded-[32px] border-2 transition-all text-left group ${paymentMethod === 'mpesa'
                                        ? 'border-amber-500 bg-amber-50/30 ring-4 ring-amber-500/5'
                                        : 'border-gray-100 hover:border-gray-200 bg-gray-50/50'
                                        }`}
                                >
                                    <div className="flex justify-between items-start mb-6">
                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-all ${paymentMethod === 'mpesa' ? 'bg-[#25D366] scale-110' : 'bg-gray-200 translate-y-0 opacity-50'}`}>
                                            <span className="text-white font-black text-2xl italic">M</span>
                                        </div>
                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${paymentMethod === 'mpesa' ? 'bg-amber-500 scale-100' : 'bg-gray-200 scale-0'}`}>
                                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    </div>
                                    <p className="font-black text-gray-900 text-lg tracking-tight">M-Pesa</p>
                                    <p className="text-[10px] text-gray-400 font-medium mt-1 uppercase tracking-tighter">Automatic STK</p>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setPaymentMethod('paypal')}
                                    className={`relative p-8 rounded-[32px] border-2 transition-all text-left group ${paymentMethod === 'paypal'
                                        ? 'border-amber-500 bg-amber-50/30 ring-4 ring-amber-500/5'
                                        : 'border-gray-100 hover:border-gray-200 bg-gray-50/50'
                                        }`}
                                >
                                    <div className="flex justify-between items-start mb-6">
                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-all ${paymentMethod === 'paypal' ? 'bg-[#003087] scale-110' : 'bg-gray-200 opacity-50'}`}>
                                            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M7.076 21.337l2.12-13.434h6.052c3.483 0 5.228 1.433 5.228 4.3 0 3.012-2.12 5.378-5.232 5.378H12.3l-1.076 6.756H7.076zm1.182-1h3.056l1.012-6.386H15.24c2.518 0 4.232-1.895 4.232-4.378 0-2.317-1.396-3.3-4.228-3.3h-4.97L8.258 20.337h.001z" />
                                            </svg>
                                        </div>
                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${paymentMethod === 'paypal' ? 'bg-amber-500 scale-100' : 'bg-gray-200 scale-0'}`}>
                                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    </div>
                                    <p className="font-black text-gray-900 text-lg tracking-tight">PayPal</p>
                                    <p className="text-[10px] text-gray-400 font-medium mt-1 uppercase tracking-tighter">Global Pay</p>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setPaymentMethod('card')}
                                    className={`relative p-8 rounded-[32px] border-2 transition-all text-left group ${paymentMethod === 'card'
                                        ? 'border-amber-500 bg-amber-50/30 ring-4 ring-amber-500/5'
                                        : 'border-gray-100 hover:border-gray-200 bg-gray-50/50'
                                        }`}
                                >
                                    <div className="flex justify-between items-start mb-6">
                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-all ${paymentMethod === 'card' ? 'bg-indigo-600 scale-110' : 'bg-gray-200 opacity-50'}`}>
                                            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z" />
                                            </svg>
                                        </div>
                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${paymentMethod === 'card' ? 'bg-amber-500 scale-100' : 'bg-gray-200 scale-0'}`}>
                                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    </div>
                                    <p className="font-black text-gray-900 text-lg tracking-tight">Card</p>
                                    <p className="text-[10px] text-gray-400 font-medium mt-1 uppercase tracking-tighter">Visa/Master</p>
                                </button>
                            </div>
                        </section>
                    </div>

                    {/* Summary Sidebar */}
                    <div className="lg:col-span-5">
                        <div className="bg-white rounded-[40px] p-10 shadow-2xl shadow-gray-200/50 border border-gray-100 sticky top-32 overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-amber-500/10"></div>
                            <h2 className="text-3xl font-black text-gray-900 mb-10 tracking-tight">Your <span className="text-amber-600">Order</span></h2>

                            <div className="space-y-6 mb-10 max-h-[400px] overflow-y-auto pr-4 custom-scrollbar">
                                {cart.map(item => (
                                    <div key={item.id} className="flex gap-6 items-center group">
                                        <div className="relative w-20 h-20 bg-gray-50 rounded-2xl overflow-hidden flex-shrink-0 border border-gray-100 shadow-sm group-hover:scale-105 transition-transform">
                                            <Image
                                                src={getProductImageUrl(item.product.image_url)}
                                                alt={item.product.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-black text-gray-900 text-base mb-1 truncate">{item.product.name}</p>
                                            <div className="flex items-center gap-2">
                                                <span className="px-2 py-0.5 bg-gray-100 rounded-md text-[9px] font-black text-gray-400 uppercase tracking-tighter">{item.quantity}x</span>
                                                <span className="text-[10px] text-amber-600 font-bold uppercase tracking-widest">{item.variant?.label || 'Standard'}</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-black text-gray-900 text-base">{formatPrice(item.total)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-4 pt-10 border-t border-gray-100">
                                <div className="flex justify-between items-center px-2">
                                    <span className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Subtotal</span>
                                    <span className="font-bold text-gray-900">{formatPrice(total)}</span>
                                </div>
                                <div className="flex justify-between items-center px-2">
                                    <span className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Estimated Service Fee</span>
                                    <span className="font-bold text-gray-900">{formatPrice(total * 0.05)}</span>
                                </div>
                                <div className="pt-8 flex justify-between items-center px-2">
                                    <span className="text-2xl font-black text-gray-900">Total Due</span>
                                    <div className="text-right">
                                        <span className="text-4xl font-black text-amber-600 block leading-none">{formatPrice(total + (total * 0.05))}</span>
                                        <span className="text-[9px] text-gray-400 font-black uppercase tracking-widest mt-2 block italic">Transaction IDs are secure</span>
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isProcessing}
                                className={`w-full mt-10 font-black py-6 rounded-[24px] flex items-center justify-center gap-4 transition-all shadow-2xl ${isProcessing
                                    ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                                    : 'bg-gray-900 text-white hover:bg-amber-600 transform hover:-translate-y-1 hover:shadow-amber-600/30'
                                    }`}
                            >
                                {isProcessing ? (
                                    <>
                                        <div className="w-6 h-6 border-4 border-gray-400 border-t-white rounded-full animate-spin"></div>
                                        Verifying...
                                    </>
                                ) : (
                                    <>
                                        Pay & Complete Order
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </>
                                )}
                            </button>

                            <div className="mt-8 flex items-center justify-center gap-4 opacity-40">
                                <Image src="/images/mpesa-logo.png" alt="M-Pesa" width={40} height={20} className="grayscale brightness-0 opacity-20" />
                                <div className="h-4 w-[1px] bg-gray-300"></div>
                                <div className="flex items-center gap-1">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                    </svg>
                                    <span className="text-[10px] font-black uppercase tracking-widest">SSL Encrypted</span>
                                </div>
                            </div>
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

