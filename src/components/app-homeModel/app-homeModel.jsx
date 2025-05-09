import React from "react";

export default function HomeModel({ isOpen, onClose,title, message}) {
  if (!isOpen) return null;

  return (
    <div className="fixed z-9999 inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-strokedark p-4 rounded shadow-lg max-w-lg w-full relative">
        <button
          className="absolute top-2 right-2 rounded-full "
          onClick={onClose}
        >
          <i className="las la-times"></i>
        </button>
        <div className="w-full">
          <div
            className="block mb-2 text-xl font-bold text-gray-900 dark:text-white"
            htmlFor="message"
          >
            {title}
          </div>
          <div className="p-2 border border-gray-300 dark:border-gray-600 dark:text-white rounded w-full">
            {message}
          </div>
        </div>
      </div>
    </div>
  );
}
