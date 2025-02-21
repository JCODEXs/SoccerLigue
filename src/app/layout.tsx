import "@/styles/globals.css";
import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import Image from "next/image";
import type { ReactNode } from "react";
import Header from "@/components/header"; // Import the new client-side Header

export const metadata: Metadata = {
  title: "Soccer League",
  description: "Interactive schedule and match statistics for the local league of Arcata",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={`${GeistSans.variable} antialiased flex flex-col min-h-screen`}>
        <Header /> {/* The menu logic is now inside this client component */}
        
        {/* Main Content */}
        <div
          className="pt-10 flex-grow"
          style={{
            backgroundImage: "url('/background.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {children}
        </div>

        {/* Footer */}
        <footer className="bg-teal-900 text-white py-6">
          <div className="container mx-auto px-4 flex items-center justify-between">
            {/* Left Logo */}
            <div className="w-32">
              <Image src="/Seal_of_Arcata.png" alt="Left Logo" width={128} height={128} className="w-full h-auto" />
            </div>

            {/* Middle Text */}
            <div className="text-center">
              <p className="text-sm md:text-base">
                This software is designed to record and consult local league soccer scores, statistics and programming.
              </p>
              <p className="text-xs md:text-sm mt-2 text-terracotta-100">
                © 2025 Local League Soccer. All rights reserved.
              </p>
            </div>

            {/* Right Logo */}
            <div className="w-24">
              <Image src="/humboldsoccer.jpg" alt="Right Logo" width={96} height={96} className="w-full h-auto rounded-full" />
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}

