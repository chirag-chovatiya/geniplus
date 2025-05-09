"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import React, { useState, useEffect } from "react";
import Table from "@/components/app-table/app-table";
import { useSearchParams } from "next/navigation";
import { del, get } from "@/service/api";
import { API } from "@/service/constant/api-constant";
import * as XLSX from "xlsx";
import Pagination from "@/components/Pagination";

export default function StudentLists() {
  const searchParams = useSearchParams();
  const teacherId = searchParams.get("teacherId");
  const [studentData, setStudentData] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 50,
    totalPages: 0,
    totalData: 0,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [level, setLevel] = useState("");

  const fetchStudentData = async (
    id,
    page = 1,
    pageSize = 50,
    searchQuery = "",
    level = ""
  ) => {
    try {
      let url = `${API.allTeacher}/${id}?page=${page}&pageSize=${pageSize}`;
      if (searchQuery) {
        url += `&searchQuery=${searchQuery}`;
      }
      if (level) {
        url += `&level=${level}`;
      }
      const response = await get(url + "&");

      if (response.code == 200 && response.data && response.data.students) {
        const formattedData = response.data.students.map((student) => {
          return {
            ...student,
          };
        });
        setStudentData(formattedData);
        setPagination({
          page: response.data.currentPage,
          pageSize: pageSize,
          totalPages: response.data.totalPages,
          totalData: response.data.totalData,
        });
      } else {
        console.error("Failed to fetch student data:", response.message);
      }
    } catch (error) {
      console.error("Error fetching student data:", error);
    }
  };

  useEffect(() => {
    if (teacherId) {
      fetchStudentData(
        teacherId,
        pagination.page,
        pagination.pageSize,
        searchQuery,
        level
      );
    } else {
      console.error("No student ID provided in the URL.");
    }
  }, [teacherId, pagination.page, pagination.pageSize, searchQuery, level]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleLevelChange = (selectedLevel) => {
    setLevel(selectedLevel);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const columns = [
    { key: "id", title: "ID" },
    { key: "name", title: "FullName" },
    { key: "level", title: "Level" },
    { key: "user_type", title: "UserType" },
    { key: "email", title: "Email" },
    { key: "status", title: "Status" },
  ];

  const handleDelete = async (id) => {
    try {
      const response = await del(API.getAllUser + `/${id}`);
      if (response.success) {
        console.log("Report deleted successfully.");
      }
    } catch (error) {
      console.error("Error deleting student:", error);
    }
  };

  const exportToExcel = () => {
    const transformedData = studentData.map((report) => {
      return columns.reduce((acc, column) => {
        acc[column.title] = report[column.key];
        return acc;
      }, {});
    });

    const worksheet = XLSX.utils.json_to_sheet(transformedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Student Data");
    XLSX.writeFile(workbook, "student_data.xlsx");
  };

  const changePage = (pageNumber) => {
    if (pageNumber !== pagination.page) {
      setPagination((prev) => ({ ...prev, page: pageNumber }));
    }
  };

  const changePageSize = (size) => {
    setPagination({ ...pagination, pageSize: size, page: 1 });
  };

  const handleRefresh = () => {
    setSearchQuery("");
    setLevel("");
    setPagination((prevState) => ({
      ...prevState,
      page: 1,
      pageSize:pagination.pageSize

    }));
    if (teacherId) {
      fetchStudentData(teacherId, 1, pagination.pageSize, "", );
    }
  };

  return (
    <>
      <div>
        <Breadcrumb
          pageName="Teacher Student List"
          totalData={pagination.totalData}
        />
        <div className="mb-4">
          <div className="flex flex-col sm:flex-row md:items-center gap-4">
            <div className="flex items-center gap-4">
              <button
                className="px-4 py-2 flex space-x-2 rounded-md bg-custom-blue text-white dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                onClick={handleRefresh}
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
                id="pagesizeForBlog"
                className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white outline-none"
                onChange={(e) => changePageSize(Number(e.target.value))}
                value={pagination.pageSize}
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
                id="levelFilter"
                className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white outline-none"
                onChange={(e) => handleLevelChange(e.target.value)}
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
            <div className="flex-grow mt-4 sm:mt-0">
              <input
                type="text"
                onChange={(e) => handleSearch(e.target.value)}
                value={searchQuery}
                id="search"
                className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white outline-none"
                placeholder="Search Here"
              />
            </div>
          </div>
        </div>
        <Table
          columns={columns}
          data={studentData}
          deleteHandler={handleDelete}
          deleteButtonVisible={true}
        />
        <Pagination data={pagination} changePage={changePage} />
      </div>
    </>
  );
}
