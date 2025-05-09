"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import Table from "@/components/app-table/app-table";
import * as XLSX from "xlsx";
import Pagination from "@/components/Pagination";
import debounce from "lodash/debounce";
import { del } from "@/service/api";
import { API } from "@/service/constant/api-constant";
import { useAttendanceAdminStore } from "@/providers/attendance-store-provider";

export default function StudentLists() {
  const {
    attendance,
    changePage,
    onPageSizeChange,
    onSelectionChange,
    selectedData,
    studentSearch,
    initialize,
  } = useAttendanceAdminStore((state) => state);

  const [status, setStatus] = useState("");
  const [level, setLevel] = useState("");
  const [createdAt, setCreatedAt] = useState("");

  useEffect(() => {
    onSelectionChange("attendance");
    if (!attendance?.data?.[attendance.page]?.length) {
      initialize();
    }
  }, []);

  useEffect(() => {
    if (status || level || createdAt) {
      selectedData(status, level, createdAt);
    }
  }, [status, level, createdAt, selectedData]);

  const columns = useMemo(
    () => [
      { key: "id", title: "ID" },
      { key: "teacherName", title: "Teacher Name" },
      { key: "studentName", title: "Student Name" },
      { key: "studentLevel", title: "Student Level" },
      { key: "status", title: "Status" },
      { key: "createdAt", title: "Date" },
    ],
    []
  );

  const transformedData = useMemo(() => {
    const data = (attendance?.data?.[attendance.page] || []).map((item) => {
      const transformedItem = {
        ...item,
        teacherName: item?.teacher?.name || "N/A",
        studentName: item?.student?.name || "N/A",
        studentLevel: item?.student?.level || "N/A",
        status: item.status,
        createdAt: item.createdAt
          ? new Date(item.createdAt).toLocaleDateString("en-GB")
          : "N/A",
      };
      return transformedItem;
    });
    return data;
  }, [attendance.data, attendance.page]);

  const deleteTest = async (id) => {
    try {
      const response = await del(API.attendance + `/${id}`);
      initialize("attendance");
      return response;
    } catch (error) {
      console.error("Error deleting attendance data:", error);
    }
  };

  const handleSearch = useCallback(
    debounce((query) => {
      studentSearch(query);
    }, 300),
    [studentSearch]
  );

  const exportToExcel = () => {
    const filteredData = transformedData.map((item) => {
      const row = {};
      columns.forEach((column) => {
        row[column.key] = item[column.key];
      });
      return row;
    });
    const currentDate = new Date().toLocaleDateString("en-GB");
    const filename = `student_Attendance_${currentDate}.xlsx`;
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Student Attendance");
    XLSX.writeFile(workbook, filename);
  };

  return (
    <>
      <div>
        <Breadcrumb
          pageName="Student Attendance"
          totalData={attendance.totalData}
        />
        <div className="mb-4">
          <div className="flex flex-col sm:flex-row md:items-center gap-4 py-4">
            <div className="flex items-center gap-4">
              <button
                className="px-4 py-2 flex space-x-2 rounded-md bg-custom-blue text-white dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                onClick={() => {
                  setStatus("");
                  setLevel("");
                  setCreatedAt("");
                  document.getElementById("textSearch").value = "";
                  handleSearch("");
                  initialize("attendance");
                }}
              >
                <span>
                  <i className="fa-solid fa-arrows-rotate"></i>
                </span>
                <span>Refresh</span>
              </button>
              <button
                className="px-4 py-2 flex space-x-2 rounded-md bg-custom-blue text-white dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                onClick={exportToExcel}
              >
                <span>
                  <i className="fa-solid fa-download"></i>
                </span>
                <span>Export</span>
              </button>
              <select
                id="pagesizeForReport"
                className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white outline-none"
                onChange={(e) => onPageSizeChange(e.target.value)}
                value={attendance.pageSize}
              >
                {[10, 20, 30, 40, 50, 100, 200, 500, 1000, 2000, 5000].map(
                  (size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  )
                )}
              </select>
            </div>
            <div className="mt-4 sm:mt-0">
              <select
                id="hwStatusFilter"
                className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white outline-none"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="">Attendance Status</option>
                <option value="Absent">Absent</option>
                <option value="Present">Present</option>
              </select>
            </div>
            <div className="mt-4 sm:mt-0">
              <select
                id="levelFilter"
                className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white outline-none"
                onChange={(e) => setLevel(e.target.value)}
                value={level}
              >
                <option value="">Choose a level</option>
                {[...Array(12)].flatMap((_, i) => [
                  <option key={`${i + 1}`} value={`${i + 1}`}>
                    Level {i + 1}
                  </option>,
                  <option key={`${i + 1}A`} value={`${i + 1}A`}>
                    Level {i + 1}A
                  </option>,
                ])}
              </select>
            </div>
            <div className="sm:mt-0">
              <input
                type="month"
                id="monthSearch"
                value={createdAt}
                className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white outline-none"
                onChange={(e) => setCreatedAt(e.target.value)}
              />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row md:items-center gap-4">
            <div className="flex-grow">
              <input
                type="text"
                id="textSearch"
                className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white outline-none"
                placeholder="Search Here"
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
          </div>
        </div>
        <Table
          columns={columns}
          data={transformedData}
          deleteHandler={deleteTest}
          deleteButtonVisible={true}
        />
        <Pagination data={attendance} changePage={changePage} />
      </div>
    </>
  );
}
