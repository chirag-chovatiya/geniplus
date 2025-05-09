"use client";
import { get } from "@/service/api";
import { API } from "@/service/constant/api-constant";
import React, { useEffect, useState } from "react";

export default function StudentLesson() {
  const [lessonData, setLessonData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await get(API.stdLesson);
        if (
          response.code === 200 &&
          response.data &&
          response.data.length > 0 &&
          response.data[0].status
        ) {
          setLessonData(response.data[0]);
        }
      } catch (error) {
        console.error("Failed to fetch lesson data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      {lessonData && (
        <div className="flex flex-col md:flex-row gap-4">
        <div
            className={`w-full ${lessonData?.linkStatus === false ? "md:w-full" : "md:w-1/2"}  p-4 bg-white border border-custom-blue rounded-lg shadow`}
          >
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">
            Student Weekly Home Work
          </h5>
          <p className="font-normal text-gray-700">
            {lessonData?.description}
          </p>
        </div>
      
        {lessonData?.linkStatus === true && lessonData?.excelLink && (
            <a
              href={lessonData?.excelLink}
              target="_blank"
              className="flex justify-center w-full md:w-1/2 p-4 bg-white items-center border border-custom-blue rounded-lg shadow text-center"
            >
              <h5 className="mb-2 text-[22px] font-bold tracking-tight text-gray-900">
                Speed Practice – Daily Challenge for Students
              </h5>
            </a>
          )}
      </div>
      
      )}
    </>
  );
}
