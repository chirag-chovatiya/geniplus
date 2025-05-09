"use client";

import { useEffect, useState } from "react";

const StatusButton = ({ defaultChecked = false, value, onValueChange }) => {
  const [enabled, setEnabled] = useState(defaultChecked);
  useEffect(() => {
    setEnabled(value);
  }, [value]);
  const toggleSwitch = () => {
    setEnabled((prevEnabled) => {
      const newEnabled = !prevEnabled;
      setTimeout(() => {
        onValueChange(newEnabled);
      }, 100);
      return newEnabled;
    });
  };

  return (
    <div>
      <label
        htmlFor="toggle1"
        className="flex cursor-pointer select-none items-center"
      >
        <div className="relative">
          <input
            type="checkbox"
            id="toggle1"
            className="sr-only"
            checked={enabled}
            onChange={toggleSwitch}
          />
          <div
            className={
              "block h-8 w-14 rounded-full " +
              (enabled ? "bg-custom-blue" : "dark:bg-[#5A616B] bg-gray-400")
            }
          ></div>
          <div
            className={`absolute left-1 top-1 h-6 w-6 rounded-full transition ${
              enabled ? "right-1 translate-x-full bg-white" : "bg-white"
            }`}
          ></div>
        </div>
      </label>
    </div>
  );
};

export default StatusButton;
