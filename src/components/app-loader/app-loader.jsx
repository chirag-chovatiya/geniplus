"use client";

import React from 'react'
import { BallTriangle } from 'react-loader-spinner'

const MainLoader = () => {
  return (
    <div className="fixed top-0 bottom-0 right-0 left-0 bg-white dark:bg-black z-500 backdrop-blur-sm">
    <div className="absolute -translate-x-1/2 -translate-y-1/2 top-[50%] left-[50%] flex justify-center items-center container">
      <BallTriangle
        height="100"
        width="100"
        radius="5"
        color="#001133"
       ariaLabel="circles-loading"
        wrapperStyle
        wrapperClass
      />
    </div>
    </div>
  )
}

export default MainLoader
