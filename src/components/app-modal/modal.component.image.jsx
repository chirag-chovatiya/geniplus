import React from "react";

const ImageModal = ({ imageSrc, onClose,children, showCloseButton = true }) => {
  if (!imageSrc) return null;

  return (
    <div className="fixed z-9999 inset-0 flex justify-center items-center">
      <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40" /> 
      <div className="bg-white max-w-screen-md h-[70%] md:h-[90%] relative w-full p-5 rounded-lg z-50 overflow-auto">
        <div className="flex justify-end items-center">
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
        <img src={imageSrc} alt="Larger View" className="w-full h-full object-cover" />
        </div>
      </div>
    </div>
  );
};

export default ImageModal;
