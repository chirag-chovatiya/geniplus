"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import Table from "@/components/app-table/app-table";
import Pagination from "@/components/Pagination";
import { del } from "@/service/api";
import { API } from "@/service/constant/api-constant";
import debounce from "lodash/debounce";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useResultAdminStore } from "@/providers/result-store-provider";
import StudentResult from "./components/form-element";

export default function StudentResults() {
  const {
    result,
    changePage,
    onPageSizeChange,
    onSelectionChange,
    selectedData,
    studentSearch,
    initialize,
  } = useResultAdminStore((state) => state);

  const [studentLevel, setStudentLevel] = useState("");
  const [selectedResultId, setSelectedResultId] = useState(null);

  useEffect(() => {
    onSelectionChange("result");
    if (Object.keys(result.data).length === 0) {
      initialize();
    }
  }, []);

  useEffect(() => {
    if (studentLevel) {
      selectedData(studentLevel);
    }
  }, [studentLevel, selectedData]);

  const columns = useMemo(
    () => [
      { key: "id", title: "ID" },
      { key: "studentName", title: "Student Name" },
      { key: "studentLevel", title: "Student Level" },
      { key: "totalMarks", title: "Total Marks" },
      { key: "obtainedMarks", title: "Obtained Marks" },
      { key: "createdAt", title: "Date" },
    ],
    []
  );

  const transformedData = useMemo(() => {
    const data = (result?.data?.[result.page] || []).map((item) => {
      const transformedItem = {
        ...item,
        studentName: item?.studentName || "N/A",
        studentLevel: item?.studentLevel || "N/A",
        totalMarks: item?.totalMarks || "N/A",
        obtainedMarks: item?.obtainedMarks || "N/A",
        createdAt: item.createdAt
          ? new Date(item.createdAt).toLocaleDateString("en-GB")
          : "N/A",
      };
      return transformedItem;
    });
    return data;
  }, [result.data, result.page]);

  const [studentResultObj, setstudentResultObj] = useState({
    visible: false,
    displayHeader: true,
    title: "Add Student Result",
    displayDefaultBtn: false,
    cancelBtnText: "Later",
    okBtnText: "Save",
  });
  const handleSearch = useCallback(
    debounce((query) => {
      studentSearch(query);
    }, 300),
    [studentSearch]
  );
  const handleAddNewResult = (id = null) => {
    setSelectedResultId(id);
    setstudentResultObj((prevState) => ({
      ...prevState,
      title: id ? "Edit Student Result" : "Add Student Result",
      visible: true,
    }));
  };

  const handleCloseStudentForm = () => {
    setstudentResultObj((prevState) => ({
      ...prevState,
      visible: false,
    }));
  };

  const deleteResult = async (id) => {
    try {
      const response = await del(API.studentResult + `/${id}`);
      initialize("result");
      return response;
    } catch (error) {
      console.error("Error deleting result data:", error);
    }
  };

  return (
    <>
      <ToastContainer />
      {studentResultObj.visible && (
        <StudentResult
          studentResultObj={studentResultObj}
          handleCloseStudentForm={handleCloseStudentForm}
          id={selectedResultId}
        />
      )}
      <div>
        <Breadcrumb pageName="Student Result" totalData={result.totalData} />
        <div className="mb-4">
          <div className="flex flex-col sm:flex-row md:items-center gap-4 py-4 justify-between">
            <div className="flex items-center gap-4">
              <button
                className="px-4 py-2 flex space-x-2 rounded-md bg-custom-blue text-white dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                onClick={() => {
                  setStudentLevel("");
                  document.getElementById("textSearch").value = "";
                  handleSearch("");
                  initialize("result");
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
                value={result.pageSize}
              >
                {[10, 20, 30, 40, 50, 100, 200, 500, 1000].map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>
            <div className="sm:mt-0">
              <select
                id="levelFilter"
                className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white outline-none"
                onChange={(e) => setStudentLevel(e.target.value)}
                value={studentLevel}
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
            <div className="flex-grow">
              <input
                type="text"
                id="textSearch"
                className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white outline-none"
                placeholder="Search Here"
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
            <div
              onClick={() => handleAddNewResult()}
              className="px-4 py-2 flex space-x-2 rounded-md bg-custom-blue text-white dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 cursor-pointer"
            >
              <span>
                <i className="fa-solid fa-plus"></i>
              </span>
              <span>Add New</span>
            </div>
          </div>
        </div>
        <Table
          columns={columns}
          data={transformedData}
          editLinkPrefix={(id) => handleAddNewResult(id)}
          editButtonVisible={true}
          deleteHandler={deleteResult}
          deleteButtonVisible={true}
        />
        <Pagination data={result} changePage={changePage} />
      </div>
    </>
  );
}
