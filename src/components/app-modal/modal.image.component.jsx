// FullScreenModal.js
import React from "react";

const ImageUploadModal = ({ isOpen, onClose, children, headerTitle, showCloseButton = true }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed z-9999 inset-0 flex justify-center items-center">
      <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40" /> 
      <div className="bg-white max-w-screen-md h-[70%] md:h-[90%] relative w-full p-5 rounded-lg z-50 overflow-auto">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-semibold text-gray-800 ">{headerTitle}</h2>
          {showCloseButton && (
            <button
              className="text-3xl font-semibold text-gray-700"
              onClick={onClose}
            >
              &times; 
            </button>
          )}
        </div>
        
        <div className="flex justify-center items-center mt-5">
          {children}
        </div>
      </div>
    </div>
  );
};

export default ImageUploadModal;
