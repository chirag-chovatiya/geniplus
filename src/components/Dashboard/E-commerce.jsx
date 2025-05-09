import React from "react";
import CardDataStats from "../CardDataStats";


const ECommerce = () => {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
      <CardDataStats title="Student" lableTitle="Total Student" total="10">
        <i className="fa-solid fa-user-doctor text-blue-500"></i>
      </CardDataStats>
      <CardDataStats title="Exam" lableTitle="Total Exam" total="20">
        <i className="fa-solid fa-user-doctor text-blue-500"></i>
      </CardDataStats>
      <CardDataStats title="Question" lableTitle="Total Question" total="30">
        <i className="fa-solid fa-list text-blue-500"></i>
      </CardDataStats>
      <CardDataStats title="Subject" lableTitle="Total Subject" total="40">
        <i className="fa-solid fa-blog text-blue-500"></i>
      </CardDataStats>
    </div>
  );
};

export default ECommerce;
