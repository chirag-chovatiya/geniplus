"use client";
import { get } from "@/service/api";
import { API } from "@/service/constant/api-constant";
import React, { useEffect, useState } from "react";

export default function StudentRating() {
  const [ratingData, setRatingData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await get(API.studentRating);
        if (response.code === 200) {
          setRatingData(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch rating data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="container mx-auto w-full mb-10 p-5">
      <div className="block w-full h-full p-6 bg-white border border-custom-blue rounded-lg shadow">
        <h5 className="mb-4 text-2xl font-bold text-custom-blue text-center">
          Student Star Rating
        </h5>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 text-center">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 px-4 py-2">SR No.</th>
                <th className="border border-gray-300 px-4 py-2">
                  Name
                </th>
                <th className="border border-gray-300 px-4 py-2">
                  Rating ⭐
                </th>
                <th className="border border-gray-300 px-4 py-2">
                  Level
                </th>
              </tr>
            </thead>
            <tbody>
              {ratingData?.length > 0 ? (
                ratingData.map((student, index) => (
                  <tr
                    key={student.id}
                    className="bg-white text-center text-custom-blue font-semibold"
                  >
                    <td className="border border-gray-300 px-4 py-2">
                      {index + 1}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {student.studentName}
                    </td>
                    <td className="border text- border-gray-300 px-4 py-2">
                      {student.rating} ⭐
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {student.studentLevel}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="border border-gray-300 text-custom-blue px-4 py-2 text-center font-bold"
                  >
                    No Ratings Available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
