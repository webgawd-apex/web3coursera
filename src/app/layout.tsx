import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "react-hot-toast";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-outfit",
});


export const metadata: Metadata = {
  title: "WEB3 COURSERA | Luxury Web3 Education",
  description: "Master the decentralized future with premium courses. Pay with Solana.",
  keywords: ["Web3", "Blockchain", "Solana", "Crypto", "Education", "Smart Contracts"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={outfit.variable}>
      <body className={`${outfit.className} antialiased`}>
        <Toaster 
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#0F172A',
              color: '#F8FAFC',
              border: '1px solid rgba(255,255,255,0.1)',
            },
          }}
        />
        <div className="flex flex-col min-h-screen hero-bg">
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
