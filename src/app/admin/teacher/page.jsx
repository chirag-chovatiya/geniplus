"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import React, { useCallback, useEffect, useState } from "react";
import Pagination from "@/components/Pagination";
import Table from "@/components/app-table/app-table";
import debounce from "lodash/debounce";
import { del } from "@/service/api";
import * as XLSX from "xlsx";
import { API } from "@/service/constant/api-constant";
import FormElementStudent from "./components/form-element";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTeacherListAdminStore } from "@/providers/teacherlist-store-provider";

export default function TeacherLists() {
  const {
    teacher,
    changePage,
    onPageSizeChange,
    search,
    selectedData,
    onSelectionChange,
    initialize,
  } = useTeacherListAdminStore((state) => state);

  const [level, setLevel] = useState("");
    const [selectedStudentId, setSelectedStudentId] = useState(null);
  

  useEffect(() => {
    onSelectionChange("teacher");
    if (Object.keys(teacher.data).length === 0) {
      initialize();
    }
  }, []);

  useEffect(() => {
    if (level) {
      selectedData(level);
    }
  }, [level, selectedData]);

  const columns = [
    { key: "id", title: "ID" },
    { key: "name", title: "TeacherName" },
    { key: "user_type", title: "UserType" },
    { key: "email", title: "Email" },
    { key: "teacher_permission", title: "Permissions" },
    { key: "studentCount", title: "Total Students" },
    { key: "status", title: "Status" },
  ];

  const transformedData = teacher.data[teacher.page]?.map((teacher) => {
    let parsedPermissions;
    
    try {
      parsedPermissions = JSON.parse(teacher.teacher_permission || "[]");

    } catch (error) {
      parsedPermissions = [];
    }
  
    return {
      ...teacher,
      teacher_permission: parsedPermissions.length > 0 ? parsedPermissions.join(", ") : "N/A", 
    };
  });
  

  const handleSearch = useCallback(
    debounce((query) => {
      search(query);
    }, 300),
    [search]
  );

  const handleDelete = async (id) => {
    try {
      const response = await del(API.getAllUser + `/${id}`);
      if (response.success) {
        initialize();
      }
    } catch (error) {
      console.error("Error deleting student:", error);
    }
  };

  const handleExportToExcel = () => {
    const exportData = teacher.data[teacher.page]?.map((user) => ({
      ID: user.id,
      TeacherName: user.name,
      Email: user.email,
      UserType: user.user_type,
      Status: user.status ? "Active" : "Inactive",
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Students");
    XLSX.writeFile(wb, "teacher.xlsx");
  };

  const [studentRegisterObj, setStudentRegisterObj] = useState({
    visible: false,
    displayHeader: true,
    title: "Register New Teacher",
    displayDefaultBtn: false,
    cancelBtnText: "Later",
    okBtnText: "Save",
  });

  const handleAddNewStudent = (id = null) => {
    setSelectedStudentId(id);
    setStudentRegisterObj((prevState) => ({
      ...prevState,
      title: id ? "Edit Teacher" : "Register New Teacher",
      visible: true,
    }));
  };

  const handleCloseStudentForm = () => {
    setStudentRegisterObj((prevState) => ({
      ...prevState,
      visible: false,
    }));
  };

  return (
    <>
      <ToastContainer />
      {studentRegisterObj.visible && (
        <FormElementStudent
          studentRegisterObj={studentRegisterObj}
          handleCloseStudentForm={handleCloseStudentForm}
          id={selectedStudentId}
        />
      )}
      <div>
        <Breadcrumb pageName="Teacher" totalData={teacher.totalData} />
        <div className="mb-4">
          <div className="flex flex-col sm:flex-row md:items-center gap-4 py-4">
            <div className="flex items-center gap-4">
              <button
                className="px-4 py-2 flex space-x-2 rounded-md bg-custom-blue text-white dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                onClick={() => {
                  setLevel("");
                  document.getElementById("search").value = "";
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
                onClick={handleExportToExcel}
              >
                <span>
                  <i className="fa-solid fa-download"></i>
                </span>
                <span>Export</span>
              </button>
              <select
                id="pagesizeForBlog"
                className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white outline-none"
                onChange={(e) => onPageSizeChange(e.target.value)}
                value={teacher.pageSize}
              >
                {[5, 10, 20, 30, 40, 50, 100, 200, 500, 1000, 2000, 5000].map(
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
            <div className="flex-grow mt-4 sm:mt-0">
              <input
                type="text"
                onChange={(e) => handleSearch(e.target.value)}
                id="search"
                className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white outline-none"
                placeholder="Search Here"
              />
            </div>
            <div
              onClick={() => handleAddNewStudent()}
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
          data={transformedData || []}
          editLinkPrefix={(id) => handleAddNewStudent(id)}
          deleteHandler={handleDelete}
          editButtonVisible={true}
          deleteButtonVisible={true}
        />

        <Pagination data={teacher} changePage={changePage} />
      </div>
    </>
  );
}
