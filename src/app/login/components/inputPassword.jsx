"use client";

import { useState } from "react";
export default function InputPassword({
  lable = "Password",
  name,
  onPassword = (arg) => {},
}) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const handelToggle = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };
  if (!name) {
    name = lable.toLowerCase();
  }

  return (
    <>
      <div className="flex place-content-between">
        <label
          htmlFor={lable}
          className="after:content-['*'] after:ml-0.5 after:text-red-500 text-sm font-semibold leading-6 text-custom-blue"
        >
          {lable}
        </label>
      </div>
      <div className="relative mt-2 mb-3 rounded-md shadow-sm">
        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          <span
            onClick={handelToggle}
            className="text-custom-blue sm:text-sm cursor-pointer"
          >
            <i
              className={
                isPasswordVisible
                  ? "las la-eye text-[20px]"
                  : "las la-eye-slash text-[20px]"
              }
            ></i>
          </span>
        </div>
        <input
          type={isPasswordVisible ? "text" : "password"}
          name={name}
          autoComplete="off"
          className="w-full rounded-md border-0 py-2 px-3 text-custom-blue ring-1 ring-inset ring-custom-blue placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-custom-blue focus:outline-none sm:text-sm sm:leading-6"
          placeholder={lable}
          onChange={(e) => {
            onPassword(e.target.value);
          }}
          required
        />
      </div>
    </>
  );
}
