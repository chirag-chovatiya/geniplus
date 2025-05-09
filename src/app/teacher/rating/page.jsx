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
import { useRatingAdminStore } from "@/providers/rating-store-provider";
import StudentRating from "./components/form-element";

export default function StudentResults() {
  const {
    rating,
    changePage,
    onPageSizeChange,
    onSelectionChange,
    selectedData,
    studentSearch,
    initialize,
  } = useRatingAdminStore((state) => state);

  const [studentLevel, setStudentLevel] = useState("");
  const [selectedRatingId, setSelectedRatingId] = useState(null);
    const [selectedRows, setSelectedRows] = useState([]);
  

  useEffect(() => {
    onSelectionChange("rating");
    if (Object.keys(rating.data).length === 0) {
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
      { key: "rating", title: "Student Rating" },
      { key: "createdAt", title: "Date" },
    ],
    []
  );

  const transformedData = useMemo(() => {
    const data = (rating?.data?.[rating.page] || []).map((item) => {
      const transformedItem = {
        ...item,
        studentName: item?.studentName || "N/A",
        studentLevel: item?.studentLevel || "N/A",
        rating: item?.rating || "N/A",
        createdAt: item.createdAt
          ? new Date(item.createdAt).toLocaleDateString("en-GB")
          : "N/A",
      };
      return transformedItem;
    });
    return data;
  }, [rating.data, rating.page]);

  const [studentRatingObj, setstudentRatingObj] = useState({
    visible: false,
    displayHeader: true,
    title: "Add Student Rating",
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
  const handleAddNewRating = (id = null) => {
    setSelectedRatingId(id);
    setstudentRatingObj((prevState) => ({
      ...prevState,
      title: id ? "Edit Student Rating" : "Add Student Rating",
      visible: true,
    }));
  };

  const handleCloseStudentForm = () => {
    setstudentRatingObj((prevState) => ({
      ...prevState,
      visible: false,
    }));
  };

  const deleteRating = async (id) => {
    try {
      const response = await del(API.studentRating + `/${id}`);
      initialize("rating");
      return response;
    } catch (error) {
      console.error("Error deleting rating data:", error);
    }
  };

    const deleteAllSelected = async () => {
      if (selectedRows.length === 0) return alert("No items selected!");
  
      if (!confirm("Are you sure you want to delete selected items?")) return;
  
      try {
        await Promise.all(
          selectedRows.map((id) => del(API.studentRating + `/${id}`))
        );
        initialize("rating");
        setSelectedRows([]);
      } catch (error) {
        console.error("Error deleting multiple rating:", error);
      }
    };

  return (
    <>
      <ToastContainer />
      {studentRatingObj.visible && (
        <StudentRating
          studentRatingObj={studentRatingObj}
          handleCloseStudentForm={handleCloseStudentForm}
          id={selectedRatingId}
        />
      )}
      <div>
        <Breadcrumb pageName="Student Rating" totalData={rating.totalData} />
        <div className="mb-4">
          <div className="flex flex-col sm:flex-row md:items-center gap-4 py-4 justify-between">
            <div className="flex items-center gap-4">
              <button
                className="px-4 py-2 flex space-x-2 rounded-md bg-custom-blue text-white dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                onClick={() => {
                  setStudentLevel("");
                  document.getElementById("textSearch").value = "";
                  handleSearch("");
                  initialize("refresh");
                }}
              >
                <span>
                  <i className="fa-solid fa-arrows-rotate"></i>
                </span>
                <span>Refresh</span>
              </button>
              <button
                className="px-4 py-2 flex space-x-2 rounded-md bg-custom-blue text-white dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                onClick={deleteAllSelected}
              >
                <span>
                  <i className="fa-solid fa-trash"></i>
                </span>
                <span>Delete</span>
              </button>
              <select
                id="pagesizeForReport"
                className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white outline-none"
                onChange={(e) => onPageSizeChange(e.target.value)}
                value={rating.pageSize}
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
              onClick={() => handleAddNewRating()}
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
          editLinkPrefix={(id) => handleAddNewRating(id)}
          editButtonVisible={true}
          deleteHandler={deleteRating}
          deleteButtonVisible={true}
          selectedRows={selectedRows}
          setSelectedRows={setSelectedRows}
          showCheckbox={true}
        />
        <Pagination data={rating} changePage={changePage} />
      </div>
    </>
  );
}
