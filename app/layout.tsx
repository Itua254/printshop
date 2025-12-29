import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Turkana Printing House | Premium Printing Lodwar",
  description: "Turkana Printing House offers agency-standard printing services in Lodwar, Kenya. Luxury business cards, banners, and more.",
  keywords: ["printing", "Kenya", "business cards", "banners", "branding", "merchandise", "Lodwar", "Arshrozy"],
  authors: [{ name: "Arshrozy Printshop" }],
  openGraph: {
    title: "Arshrozy Printshop | Premium Printing Services",
    description: "Professional printing services in Kenya. Quality you can trust.",
    locale: "en_KE",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
