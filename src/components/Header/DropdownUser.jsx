"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import jwt from "jsonwebtoken";


const DropdownUser = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userName, setUserName] = useState("");

  const trigger = useRef(null);
  const dropdown = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("t");
    if (token) {
      try {
        const decoded = jwt.decode(token);
        setUserName(decoded.name || "User");
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  useEffect(() => {
    const clickHandler = (event) => {
      if (
        !dropdown.current ||
        dropdown.current.contains(event.target) ||
        trigger.current.contains(event.target)
      ) {
        return;
      }
      setDropdownOpen(false);
    };

    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  }, [dropdownOpen]);

  const handleSignOut = async () => {
    if (confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("t");
      document.cookie = "t=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;";
      window.location.href = "/login";

    }
  };

  return (
    <div className="relative">
      <button
        ref={trigger}
        onClick={() => setDropdownOpen((prev) => !prev)}
        className="flex items-center gap-4"
      >
        <span className="hidden text-right lg:block">
          <span className="block text-base font-medium text-black dark:text-white">
            {userName}
          </span>
        </span>
        <span className="h-8 w-8 rounded-full overflow-hidden">
          <img
            src="https://ui-avatars.com/api/?name=ME&bold=true&format=png"
            alt="User"
            width={112}
            height={112}
            style={{ width: "auto", height: "auto" }}
          />
        </span>
        <i className="fa-solid fa-chevron-down"></i>
      </button>

      {dropdownOpen && (
        <div
          ref={dropdown}
          className="absolute right-0 mt-2 flex w-44 flex-col rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark"
        >
          {/* <ul className="flex flex-col gap-5 border-b border-stroke px-6 py-4 dark:border-strokedark">
            <li>
              <Link
                href="/profile"
                className="flex items-center gap-2 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
              >
                <i className="fa-regular fa-user"></i>
                My Profile
              </Link>
            </li>
          </ul> */}
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3.5 px-6 py-4 text-sm font-medium duration-300 ease-in-out hover:text-custom-blue lg:text-base"
          >
            <i className="fa-solid fa-right-from-bracket"></i>
            Log Out
          </button>
        </div>
      )}
    </div>
  );
};

export default DropdownUser;
