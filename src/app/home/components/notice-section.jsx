"use client";
import { get } from "@/service/api";
import { API } from "@/service/constant/api-constant";
import React, { useEffect, useState } from "react";

export default function StudentNotice() {
  const [noticeData, setNoticeData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await get(API.studentNote);
        if (
          response.code === 200 &&
          response.data &&
          response.data.length > 0 &&
          response.data[0].status
        ) {
          setNoticeData(response.data[0]);
        }
      } catch (error) {
        console.error("Failed to fetch Notice data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      {noticeData && (
        <div className="block w-full h-full p-3  bg-white border border-custom-blue shadow overflow-hidden">
          <h5 className="text-xl font-bold tracking-tight text-gray-900 whitespace-nowrap animate-marquee">
            {noticeData?.description}
          </h5>
        </div>
      )}
    </>
  );
}
