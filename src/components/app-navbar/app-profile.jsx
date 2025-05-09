"use client";
import { useEffect, useState } from "react";
import jwt from "jsonwebtoken";

export default function ProfileAvtara() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("t");
    if (token) {
      const decoded = jwt.decode(token);
      setUser(decoded?.name || null);
    } else {
      setUser(null);
    }
  }, []);

  const handleSignOut = async () => {
    if (confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("t");
      document.cookie = "t=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;";
      setUser(null);
      window.location.href = "/login";
    }
  };

  return (
    <div>
      <div className="relative group inline-block">
        <button
          className="inline-flex gap-2 m-0 md:border md:border-gray-300 md:bg-gray-100 items-center px-3 py-2 rounded-lg cursor-pointer bg-gray-50 md:text-black focus:outline-none focus-visible:ring"
        >
          <div className="hidden md:block text-black">
            <p className="">{user || "Guest"}</p>
          </div>
          <i className="md:text-black las la-angle-down text-[15px]"></i>
        </button>
        <div className="opacity-0 m-0  w-full invisible transition-opacity duration-300 transform scale-95 group-hover:opacity-100 group-hover:visible group-hover:transform group-hover:scale-100 absolute z-[20] right-0 space-y-2 origin-top-left bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none min-w-[100px]">
          <div className="px-1 py-1">
            <button
              onClick={handleSignOut}
              className="flex text-left w-full bg-white hover:bg-gray-200 hover:text-black p-3 rounded-lg"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
