"use client";
import React, { useState } from 'react';

const Abacuss = () => {
  // State for tracking bead positions
  const [upperBeads, setUpperBeads] = useState(Array(6).fill(true)); 
  const [lowerBeads, setLowerBeads] = useState(Array(6).fill(4));

  // Toggle upper bead position
  const toggleUpperBead = (index) => {
    setUpperBeads((prev) => {
      const newBeads = [...prev];
      newBeads[index] = !newBeads[index];
      return newBeads;
    });
  };

  // Toggle lower beads
  const toggleLowerBead = (rodIndex, count) => {
    setLowerBeads((prev) => {
      const newBeads = [...prev];
      newBeads[rodIndex] = newBeads[rodIndex] === count ? count - 1 : count;
      return newBeads;
    });
  };

  return (
    <div className="flex justify-center items-center">
      {/* Frame */}
      <div className="relative w-[375px] md:w-100 h-54 rounded-lg shadow-xl border-8 border-custom-blue">
        
        {/* Bar (horizontal divider) - moves dynamically */}
        <div
          className="absolute left-0 w-full h-1 bg-gray-500 transition-transform"
          style={{ top: `calc(29% + ${4 - Math.max(...lowerBeads), 0}rem)` }}
        ></div>
        
        {/* Upper section (1 bead per rod) */}
        <div className="absolute top-0 left-0 w-full h-[25%] flex justify-around items-center">
          {[...Array(6)].map((_, i) => (
            <div key={`upper-${i}`} className="relative h-full flex items-center">
              {/* Rod */}
              <div className="w-1 h-full bg-custom-blue"></div>
              
              {/* Upper bead (clickable) */}
              <div
                className={`absolute left-1/2 transform -translate-x-1/2 w-12 h-6 rounded-md bg-custom-blue border-2 border-red-700 shadow-md transition-transform cursor-pointer ${
                  upperBeads[i] ? 'top-0' : 'top-8'
                }`}
                onClick={() => toggleUpperBead(i)}
              ></div>
            </div>
          ))}
        </div>
        
        {/* Lower section (4 beads per rod) */}
        <div className="absolute bottom-5 left-0 w-full h-2/3 flex justify-around items-center">
          {[...Array(6)].map((_, i) => (
            <div key={`lower-${i}`} className="relative h-full flex items-center">
              {/* Rod */}
              <div className="w-1 h-full bg-custom-blue"></div>
              
              <div className="absolute left-1/2 transform -translate-x-1/2 flex flex-col-reverse gap-y-[2px]">
                {[...Array(4)].map((_, j) => (
                  <div
                    key={`lower-bead-${i}-${j}`}
                    className={`w-12 h-6 bg-custom-blue rounded-md border-2 border-white transition-transform cursor-pointer ${
                      j >= lowerBeads[i] ? 'translate-y-0' : 'translate-y-8'
                    }`}
                    onClick={() => toggleLowerBead(i, j + 1)}
                  ></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Abacuss;

