"use client";
import { useState } from "react";
import NavMenu from "./app-menu";
import ProfileAvtara from "./app-profile";

export default function AppNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);


  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  
  return (
    <nav
      id="navbar"
      className={`sticky top-0 w-full left-0 right-0 z-50 bg-custom-blue`}
    >
      <div className="flex flex-wrap items-center justify-between mx-auto px-8 py-3 gap-4">
      <div className="flex items-center space-x-4">
          <img
            src="/assets/logo/finallogo.png"
            className="h-10 w-10 rounded-lg"
            alt="Hospital Logo"
          />
        </div>
        <div className="flex md:order-2 space-x-4 md:space-x-0 ltr:space-x-reverse">
          <div className="md:flex space-x-5">
            <ProfileAvtara/>
          </div>
        </div>
        <div
          className={`items-center justify-center w-full md:flex md:w-auto md:order-1 ${
            isMenuOpen ? "block" : "hidden"
          }`}
          id="navbar-sticky"
        >
          <NavMenu />
        </div>
      </div>
    </nav>
  );
}
