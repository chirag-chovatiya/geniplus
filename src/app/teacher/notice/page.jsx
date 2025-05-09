"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import React, { useEffect, useMemo, useState } from "react";
import Table from "@/components/app-table/app-table";
import Pagination from "@/components/Pagination";
import { del, post } from "@/service/api";
import { API } from "@/service/constant/api-constant";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNoticeAdminStore } from "@/providers/notice-store-provider";
import StudentNotice from "./components/form-element";

export default function StudentNotices() {
  const {
    notice,
    changePage,
    onPageSizeChange,
    onSelectionChange,
    selectedData,
    initialize,
  } = useNoticeAdminStore((state) => state);

  const [status, setStatus] = useState("");
  const [level, setLevel] = useState("");
  const [createdAt, setCreatedAt] = useState("");
  const [selectedNoticeId, setselectedNoticeId] = useState(null);

  useEffect(() => {
    onSelectionChange("notice");
    if (Object.keys(notice.data).length === 0) {
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
      { key: "createdAt", title: "Date" },
    ],
    []
  );

  const transformedData = useMemo(() => {
    const data = (notice?.data?.[notice.page] || []).map((item) => {
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
  }, [notice.data, notice.page]);

  const [studentNoticeObj, setstudentNoticeObj] = useState({
    visible: false,
    displayHeader: true,
    title: "Add Student Notice",
    displayDefaultBtn: false,
    cancelBtnText: "Later",
    okBtnText: "Save",
  });

  const handleAddNewNotice = (id = null) => {
    setselectedNoticeId(id);
    setstudentNoticeObj((prevState) => ({
      ...prevState,
      title: id ? "Edit Student Notice" : "Add Student Notice",
      visible: true,
    }));
  };

  const handleCloseStudentForm = () => {
    setstudentNoticeObj((prevState) => ({
      ...prevState,
      visible: false,
    }));
  };

  const deleteNotice = async (id) => {
    try {
      const response = await del(API.studentNote + `/${id}`);
      initialize("notice");
      return response;
    } catch (error) {
      console.error("Error deleting notice data:", error);
    }
  };

  const updateStatusById = async (id, newStatus) => {
    try {
      const response = await post(API.studentNote + `/${id}`, {
        status: newStatus,
      });
      if (response.code === 200) {
        toast.success("Status updated successfully!");
        initialize("notice");
      } else if (response.code === 400) {
        toast.error("Another active notice exists at this level. Update it first.");
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
      {studentNoticeObj.visible && (
        <StudentNotice
          studentNoticeObj={studentNoticeObj}
          handleCloseStudentForm={handleCloseStudentForm}
          id={selectedNoticeId}
        />
      )}
      <div>
        <Breadcrumb pageName="Student Notice" totalData={notice.totalData} />
        <div className="mb-4">
          <div className="flex flex-col sm:flex-row md:items-center gap-4 py-4 justify-between">
            <div className="flex items-center gap-4">
              <button
                className="px-4 py-2 flex space-x-2 rounded-md bg-custom-blue text-white dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                onClick={() => {
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
            <div
              onClick={() => handleAddNewNotice()}
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
          editLinkPrefix={(id) => handleAddNewNotice(id)}
          editButtonVisible={true}
          deleteHandler={deleteNotice}
          isStatusActive={true}
          updateStatusById={updateStatusById}
          deleteButtonVisible={true}
        />
        <Pagination data={notice} changePage={changePage} />
      </div>
    </>
  );
}
