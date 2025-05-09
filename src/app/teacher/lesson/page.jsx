"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import React, { useEffect, useMemo, useState } from "react";
import Table from "@/components/app-table/app-table";
import Pagination from "@/components/Pagination";
import { del, post } from "@/service/api";
import { API } from "@/service/constant/api-constant";
import { useLessonAdminStore } from "@/providers/lesson-store-provider";
import StudentLesson from "./components/form-element";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function StudentLists() {
  const {
    lesson,
    changePage,
    onPageSizeChange,
    onSelectionChange,
    selectedData,
    initialize,
  } = useLessonAdminStore((state) => state);

  const [status, setStatus] = useState("");
  const [level, setLevel] = useState("");
  const [createdAt, setCreatedAt] = useState("");
  const [selectedLessonId, setSelectedLessonId] = useState(null);


  useEffect(() => {
    onSelectionChange("lesson");
    if (Object.keys(lesson.data).length === 0) {
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
      { key: "studentLevel", title: "Student Level" },
      { key: "description", title: "Description" },
      { key: "status", title: "Status" },
      { key: "linkStatus", title: "Link Status" },
      { key: "createdAt", title: "Date" },
    ],
    []
  );

  const transformedData = useMemo(() => {
    const data = (lesson?.data?.[lesson.page] || []).map((item) => {
      const transformedItem = {
        ...item,
        studentName: item?.student?.name || "N/A",
        studentLevel: item?.studentLevel || "N/A",
        status: item.status,
        createdAt: item.createdAt
        ? new Date(item.createdAt).toLocaleDateString("en-GB")
        : "N/A",
      };
      return transformedItem;
    });
    return data;
  }, [lesson.data, lesson.page]);

  const [studentLessonObj, setStudentLessonObj] = useState({
    visible: false,
    displayHeader: true,
    title: "Add Student Lesson",
    displayDefaultBtn: false,
    cancelBtnText: "Later",
    okBtnText: "Save",
  });

  const handleAddNewLesson = (id = null) => {
    setSelectedLessonId(id);
    setStudentLessonObj((prevState) => ({
      ...prevState,
      title: id ? "Edit Student Lesson" : "Add Student Lesson",
      visible: true,
    }));
  };

  const handleCloseStudentForm = () => {
    setStudentLessonObj((prevState) => ({
      ...prevState,
      visible: false,
    }));
  };

  const deleteLesson = async (id) => {
    try {
      const response = await del(API.stdLesson + `/${id}`);
      initialize("lesson");
      return response;
    } catch (error) {
      console.error("Error deleting lesson data:", error);
    }
  };

  const updateStatusById = async (id, newStatus, field) => {
    try {
      const payload = {
        [field]: newStatus,
      };
      const response = await post(API.stdLesson + `/${id}`, payload);
      if (response.code === 200) {
        toast.success("Status updated successfully!");
        initialize("lesson");
      } else if (response.code === 400) {
        toast.error("Another active lesson exists at this level. Update it first.");
      } else {
        toast.error(response.message || "Failed to submit form.");
      }
    } catch (error) {
      toast.error("Error updating status. Please try again.");
    }
  };

  return (
    <>
      <ToastContainer />
      {studentLessonObj.visible && (
        <StudentLesson
          studentLessonObj={studentLessonObj}
          handleCloseStudentForm={handleCloseStudentForm}
          id={selectedLessonId}
        />
      )}
      <div>
        <Breadcrumb pageName="Student Lesson" totalData={lesson.totalData} />
        <div className="mb-4">
          <div className="flex flex-col sm:flex-row md:items-center gap-4 py-4 justify-between">
            <div className="flex items-center gap-4">
              <button
                className="px-4 py-2 flex space-x-2 rounded-md bg-custom-blue text-white dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                onClick={() => {
                  initialize("lesson");
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
                value={lesson.pageSize}
              >
                {[5, 10, 20, 30, 40, 50, 100, 200, 500].map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>
            <div
              onClick={() => handleAddNewLesson()}
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
          editLinkPrefix={(id) => handleAddNewLesson(id)}
          editButtonVisible={true}
          deleteHandler={deleteLesson}
          isStatusActive={true}
          updateStatusById={updateStatusById}
          deleteButtonVisible={true}
        />
        <Pagination data={lesson} changePage={changePage} />
      </div>
    </>
  );
}
