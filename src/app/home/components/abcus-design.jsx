"use client";
import React, { useState } from "react";

const Abacus = () => {
  const [upperBeads, setUpperBeads] = useState(Array(6).fill(true));
  const [lowerBeads, setLowerBeads] = useState(Array(6).fill(4));

  const toggleUpperBead = (index) => {
    setUpperBeads((prev) => {
      const newBeads = [...prev];
      newBeads[index] = !newBeads[index];
      return newBeads;
    });
  };

  const toggleLowerBead = (rodIndex, count) => {
    setLowerBeads((prev) => {
      const newBeads = [...prev];
      newBeads[rodIndex] = newBeads[rodIndex] === count ? count - 1 : count;
      return newBeads;
    });
  };

  return (
    <div className="flex justify-center items-center">
      <div className="relative w-[375px] md:w-100 h-54 rounded-lg shadow-xl border-8 border-[#3C0900]">
        <div
          className="absolute left-0 w-full h-2 bg-gray-400 transition-transform"
          style={{ top: `calc(28% + ${(4 - Math.max(...lowerBeads), 0)}rem)` }}
        >
          <div className="absolute w-full flex justify-around">
            {[...Array(6)].map((_, i) => (
              <div
                key={`dot-container-${i}`}
                className="flex justify-center w-1/6"
              >
                {(i === 2 || i === 5) && (
                  <div className="w-[11px] h-[11px] border-[3px] border-[#3C0900] bg-gray-200 z-50 rounded-full"></div>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="absolute top-0 left-0 w-full h-[25%] flex justify-around items-center">
          {[...Array(6)].map((_, i) => (
            <div
              key={`upper-${i}`}
              className="relative h-full flex items-center"
            >
              <div className="w-1 h-full bg-[#3C0900] absolute top-0 bottom-0 left-1/2 transform -translate-x-1/2"></div>
              <div
                className={`absolute left-1/2 transform -translate-x-1/2 w-12 h-6 rounded-md bg-[#3C0900] border-2 border-red-700 shadow-md transition-transform cursor-pointer ${
                  upperBeads[i] ? "top-0" : "top-8"
                }`}
                onClick={() => toggleUpperBead(i)}
              ></div>
            </div>
          ))}
        </div>

        <div className="absolute bottom-4.5 left-0 w-full h-2/3 flex justify-around items-center">
          {[...Array(6)].map((_, i) => (
            <div
              key={`lower-${i}`}
              className="relative h-[124%] flex items-center"
            >
              <div className="w-1 h-full bg-[#3C0900] absolute top-0 bottom-0 left-1/2 transform -translate-x-1/2"></div>

              <div className="absolute left-1/2 transform -translate-x-1/2 flex flex-col-reverse gap-y-[2px]">
                {[...Array(4)].map((_, j) => (
                  <div
                    key={`lower-bead-${i}-${j}`}
                    className={`w-12 h-6 bg-[#3C0900] rounded-md border-2 border-white transition-transform cursor-pointer ${
                      j >= lowerBeads[i] ? "translate-y-0" : "translate-y-8"
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

export default Abacus;
