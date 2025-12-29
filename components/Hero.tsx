'use client'

import Link from 'next/link'
import Image from 'next/image'

export default function Hero() {
    return (
        <section className="relative h-[700px] flex items-center justify-center overflow-hidden">
            {/* Background Image from your Supabase Storage */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="https://ozwthlyjffjhzjjyreli.supabase.co/storage/v1/object/public/product-images/cards.jpg"
                    alt="Arshrozy Background"
                    fill
                    className="object-cover scale-105 blur-[2px]"
                    priority
                />
                <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px]" />
            </div>

            {/* Premium Content Box */}
            <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-12 rounded-[2.5rem] shadow-2xl">
                    <span className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-[0.2em] text-amber-400 uppercase border border-amber-400/30 rounded-full">
                        Turkana's Finest Printing
                    </span>
                    <h1 className="text-5xl sm:text-6xl md:text-8xl font-black text-white mb-6 leading-[1.1] tracking-tight">
                        Premium <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600">Print</span>
                        <br />
                        Redefined.
                    </h1>

                    <p className="text-lg sm:text-xl text-zinc-300 mb-10 max-w-xl mx-auto leading-relaxed">
                        From luxury business cards to massive event banners. We bring agency-standard precision to every project in Kenya.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-5 justify-center">
                        <Link
                            href="#catalog"
                            className="btn-gold px-10 py-4 text-lg"
                        >
                            Explore Catalog
                        </Link>

                        <a
                            href={`https://wa.me/254769752124`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center px-10 py-4 text-lg font-bold text-white border-2 border-white/20 rounded-full hover:bg-white/10 transition-all duration-300"
                        >
                            WhatsApp Us
                        </a>
                    </div>
                </div>
            </div>
        </section>
    )
}
