// FullScreenModal.js
import React from "react";

const FullScreenModal = ({ isOpen, onClose, children, headerTitle, showCloseButton = true }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center">
      <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm" /> 
      <div className="relative bg-white w-full h-full max-w-screen-lg md:h-auto md:max-h-[90%] md:mx-4 rounded-lg shadow-lg z-50 overflow-auto">
        <div className="flex justify-between items-center p-5 border-b border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-800">{headerTitle}</h2>
          {showCloseButton && (
            <button
              className="text-3xl font-semibold text-gray-700 hover:text-gray-900"
              onClick={onClose}
            >
              &times; 
            </button>
          )}
        </div>
        
        <div className="p-5 overflow-y-auto h-full md:h-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default FullScreenModal;
