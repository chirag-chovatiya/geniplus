"use client"
import React, { useEffect, useState } from "react";

export default function DeleteButton (props){
    const [isDeleted, setIsDeleted] = useState(props.isDeleted2)
  const handleClick = () => {
    if (!isDeleted) {
      if (window.confirm("Are you sure you want to delete this?")) {
        props.deleteAction?.(isDeleted);
        setIsDeleted(!isDeleted)
      }
    } else {
      if (window.confirm("Are you sure you want to restore this?")) {
        props.deleteAction?.(isDeleted);
        setIsDeleted(!isDeleted)

      }
    }
  };
  return (
    <button
      title="Delete"
      onClick={handleClick}
    >
      <i className="fa-solid fa-trash"></i>
    </button>
  );
};


