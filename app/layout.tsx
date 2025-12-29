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
  title: "Arshrozy Printshop | Premium Printing Services Kenya",
  description: "Professional printing services in Kenya. Business cards, banners, branding, merchandise, and more. Quality you can trust.",
  keywords: ["printing", "Kenya", "business cards", "banners", "branding", "merchandise", "Lodwar", "Arshrozy"],
  authors: [{ name: "Arshrozy Printshop" }],
  openGraph: {
    title: "Arshrozy Printshop | Premium Printing Services",
    description: "Professional printing services in Kenya. Quality you can trust.",
    type: "website",
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
