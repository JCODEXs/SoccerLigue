"use client"; // Enable client-side interactivity

import { useState } from "react";
import { useRouter } from "next/navigation";


export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false); // Close menu when clicking a link
  const router = useRouter();
  
  const handleClick = (href: string) => {
    closeMenu();
    router.push(href); // Navigate programmatically
  };

  return (
    <div className="fixed top-0 left-0 w-full z-50">
      <header className="h-10 group">
        {/* Toggle Button */}
        <p className="flex justify-center text-white p-1 cursor-pointer" onClick={toggleMenu}>
          OPTIONS
        </p>

        {/* Menu Content (Shows on hover OR click) */}
        <div
          className={`transition-all duration-300 ease-in-out transform ${
            isMenuOpen ? "translate-y-0" : "-translate-y-full"
          } group-hover:translate-y-0`}
          style={{
            backgroundImage: "url('/backgroundheader.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <ul className="flex flex-col sm:grid sm:grid-cols-2 sm:gap-1 sm:text-white lg:grid-cols-3 gap-2 p-6 text-xl items-center">
            {[
              { href: "/program-match", text: "Program new match" },
              { href: "/teams", text: "Teams" },
              { href: "/view-results", text: "View results" },
              { href: "/matches", text: "View Programming" },
              { href: "/login", text: "Login" },
              { href: "/createReferee", text: "Add Referee" },
              { href: "/createLocation", text: "Add Location" },
            ].map(({ href, text }) => (
              <li
                key={href}
                className="hover:bg-teal-700 px-4 py-2 rounded-md transition-colors duration-200"
              >
                 <button onClick={() => handleClick(href)} className="w-full text-left">
    {text}
  </button>
              </li>
            ))}
          </ul>
           <p className="flex justify-center text-white p-1 cursor-pointer" onClick={toggleMenu}>
          OPTIONS
        </p>
        </div>
      </header>
    </div>
  );
}
