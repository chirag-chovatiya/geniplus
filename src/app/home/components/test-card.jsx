// components/PracticeCard.js
import React from "react";

const PracticeCard = ({ title, iconSrc, totalCount, onClick, modalIdentifier }) => {
  return (
    <div
      className="relative border-2 border-custom-blue rounded-xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-all duration-300 group overflow-hidden"
      onClick={() => onClick(modalIdentifier)}
    >
      {/* Content */}
      <div className="relative z-10 flex flex-col items-start">
        <div className="flex items-center mb-4">
          <div className="p-3  mr-4 group-hover:rotate-45 transition-transform">
            <img src={iconSrc} alt={title} className="h-10 w-10" />
          </div>
          <h2 className="text-xl font-bold text-[#001133]">{title}</h2>
        </div>

        <div className="w-full bg-white rounded-lg p-4 shadow-inner border border-custom-blue">
          <p className="text-sm text-custom-blue mb-1">Total {title}</p>
          <div className="flex items-end justify-between">
            <span className="text-3xl font-extrabold text-[#001133]">
              {totalCount}
            </span>
            <div className="flex space-x-1">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="w-2 h-6 bg-custom-blue rounded-t-full animate-bounce"
                  style={{ animationDelay: `${i * 0.5}s` }}
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PracticeCard;
