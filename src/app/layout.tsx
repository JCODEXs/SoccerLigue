import "@/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Soccer League",
  description: "interactive schedule and match statistics for the local league of arcata",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${GeistSans.variable}  antialiased  flex flex-col min-h-screen`}
      >
        {/* Header Container */}
        <div className="fixed top-0 left-0 w-full z-50">
          {/* Header */}
          <header className="h-10 group">
          <p className="flex justify-center text-white p-1"> OPTIONS</p>
    
            <div
              className="transition-all duration-300 ease-in-out transform -translate-y-full group-hover:translate-y-0"
              style={{
                backgroundImage: "url('/backgroundheader.png')", // Add your header background image
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
        <ul className="flex flex-col sm:grid sm:grid-cols-2 sm:gap-1 sm:text-white lg:grid-cols-3 gap-2 p-6 text-xl items-center">
  <li key="program-match" className="hover:bg-teal-700 px-4 py-2 rounded-md transition-colors duration-200 group-hover:text-terracotta-100">
    <Link href="/program-match">Program new match</Link>
  </li>
  <li key="fill-results" className="hover:bg-teal-800 px-4 py-2 rounded-md transition-colors duration-200 group-hover:text-terracotta-100">
    <Link href="/teams">Teams</Link>
  </li>
  <li key="view-results" className="hover:bg-teal-900 px-4 py-2 rounded-md transition-colors duration-200 group-hover:text-terracotta-100">
    <Link href="/view-results">View results</Link>
  </li>
  <li key="view-program" className="hover:bg-teal-900 px-4 py-2 rounded-md transition-colors duration-200 group-hover:text-terracotta-100">
    <Link href="/matches">View Programing</Link>
  </li>
  <li key="login" className="hover:bg-teal-900 px-4 py-2 rounded-md transition-colors duration-200 group-hover:text-terracotta-100">
    <Link href="/login">Login</Link>
  </li>
</ul>
<p className="flex justify-center text-white z-1 pt-2  group-hover:sr-only group-hover:h-2"> OPTIONS </p>
            </div>
            
          </header>
        </div>

        {/* Main Content */}
        <div
          className="pt-10 flex-grow " // Add padding to avoid content overlap with the header
          style={{
            backgroundImage: "url('/background.jpg')", // Add your page background image
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
  <Image
    src="/Seal_of_Arcata.png"
    alt="Left Logo"
    width={128}
    height={128}
    className="w-full h-auto"
  />
</div>

            {/* Middle Text */}
            <div className="text-center">
              <p className="text-sm md:text-base">
                This software is designed to record and consult local league
                soccer scores, statistics and programation.
              </p>
              <p className="text-xs md:text-sm mt-2 text-terracotta-100">
                © 2025 Local League Soccer. All rights
                reserved.
              </p>
            </div>

            {/* Right Logo */}
         <div className="w-24">
  <Image
    src="/humboldsoccer.jpg"
    alt="Right Logo"
    width={96}
    height={96}
    className="w-full h-auto rounded-full"
  />
</div>
          </div>
        </footer>
      </body>
    </html>
  );
}

