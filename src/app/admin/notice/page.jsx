"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import Table from "@/components/app-table/app-table";
import Pagination from "@/components/Pagination";
import debounce from "lodash/debounce";
import { del, post } from "@/service/api";
import { API } from "@/service/constant/api-constant";
import { useNoticeAdminStore } from "@/providers/notice-store-provider";

export default function StudentNotice() {
  const {
    notice,
    changePage,
    onPageSizeChange,
    onSelectionChange,
    teacherSearch,
    initialize,
  } = useNoticeAdminStore((state) => state);

  useEffect(() => {
    onSelectionChange("notice");
    if (Object.keys(notice.data).length === 0) {
      initialize();
    }
  }, []);

  const columns = useMemo(
    () => [
      { key: "id", title: "ID" },
      { key: "teacher", title: "Teacher Name" },
      { key: "studentLevel", title: "Student Level" },
      { key: "description", title: "Description" },
      { key: "status", title: "Status" },
      { key: "createdAt", title: "Date" },
    ],
    []
  );

  const transformedData = useMemo(() => {
    const data = (notice?.data?.[notice.page] || []).map((item) => {
      const transformedItem = {
        ...item,
        teacher: item?.teacher?.name || "N/A",
        studentLevel: item?.studentLevel || "N/A",
        status: item.status,
        createdAt: item.createdAt
          ? new Date(item.createdAt).toLocaleDateString("en-GB")
          : "N/A",
      };
      return transformedItem;
    });
    return data;
  }, [notice.data, notice.page]);

  const handleSearch = useCallback(
    debounce((query) => {
      teacherSearch(query);
    }, 300),
    [teacherSearch]
  );

  const deleteLesson = async (id) => {
    try {
      const response = await del(API.studentNote + `/${id}`);
      if (response.success) {
        initialize();
      }
    } catch (error) {
      console.error("Error deleting notice data:", error);
    }
  };

  return (
    <>
      <div>
        <Breadcrumb pageName="Student Notice" totalData={notice.totalData} />
        <div className="mb-4">
          <div className="flex flex-col sm:flex-row md:items-center gap-4 py-4 justify-between">
            <div className="flex items-center gap-4">
              <button
                className="px-4 py-2 flex space-x-2 rounded-md bg-custom-blue text-white dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                onClick={() => {
                  document.getElementById("search").value = "";
                  handleSearch("");
                  initialize("notice");
                }}
              >
                <span>
                  <i className="fa-solid fa-arrows-rotate"></i>
                </span>
                <span>Refresh</span>
              </button>
              <select
                id="pagesizeForReport"
                className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white outline-none"
                onChange={(e) => onPageSizeChange(e.target.value)}
                value={notice.pageSize}
              >
                {[10, 20, 30, 40, 50, 100, 200, 500, 1000].map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-grow mt-4 sm:mt-0">
              <input
                type="text"
                onChange={(e) => handleSearch(e.target.value)}
                id="search"
                className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white outline-none"
                placeholder="Search Here"
              />
            </div>
          </div>
        </div>
        <Table
          columns={columns}
          data={transformedData}
          deleteHandler={deleteLesson}
          deleteButtonVisible={true}
        />
        <Pagination data={notice} changePage={changePage} />
      </div>
    </>
  );
}
