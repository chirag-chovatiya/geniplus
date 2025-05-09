"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import React, { useEffect, useMemo, useState } from "react";
import Table from "@/components/app-table/app-table";
import Pagination from "@/components/Pagination";
import { del, post } from "@/service/api";
import { API } from "@/service/constant/api-constant";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import StudentNotice from "./components/form-element";
import { useTeacherAdvStore } from "@/providers/teacheradv-store-provider";

export default function StudentAdvertisement() {
  const {
    advertisement,
    changePage,
    onPageSizeChange,
    onSelectionChange,
    initialize,
  } = useTeacherAdvStore((state) => state);

  const [teacherAdvId, setTeacherAdvId] = useState(null);

  useEffect(() => {
    onSelectionChange("advertisement");
    if (Object.keys(advertisement.data).length === 0) {
      initialize();
    }
  }, []);

  const columns = useMemo(
    () => [
      { key: "id", title: "ID" },
      { key: "imgUrl", title: "Adv Image", type: "image" },
      { key: "description", title: "Description", maxLength: 30 },
      { key: "status", title: "Status" },
      { key: "createdAt", title: "Date" },
    ],
    []
  );

  const transformedData = useMemo(() => {
    const data = (advertisement?.data?.[advertisement.page] || []).map(
      (item) => {
        const transformedItem = {
          ...item,
          status: item.status,
          imgUrl: item.imgUrl || "N/A",
          createdAt: item.createdAt
            ? new Date(item.createdAt).toLocaleDateString("en-GB")
            : "N/A",
          description:
            item.description?.length > 30
              ? item.description.substring(0, 30) + "..."
              : item.description,
        };
        return transformedItem;
      }
    );
    return data;
  }, [advertisement.data, advertisement.page]);

  const [studentAdvObj, setstudentAdvObj] = useState({
    visible: false,
    displayHeader: true,
    title: "Add Student Advertisement",
    displayDefaultBtn: false,
    cancelBtnText: "Later",
    okBtnText: "Save",
  });

  const handleAddNewAdv = (id = null) => {
    setTeacherAdvId(id);
    setstudentAdvObj((prevState) => ({
      ...prevState,
      title: id ? "Edit Student Advertisement" : "Add Student Advertisement",
      visible: true,
    }));
  };

  const handleCloseStudentForm = () => {
    setstudentAdvObj((prevState) => ({
      ...prevState,
      visible: false,
    }));
  };

  const deleteAdvertisement = async (id) => {
    try {
      const response = await del(API.teacherAdv + `/${id}`);
      initialize("advertisement");
      return response;
    } catch (error) {
      console.error("Error deleting advertisement data:", error);
    }
  };

  const updateStatusById = async (id, newStatus) => {
    try {
      const formData = new FormData();
      formData.append("status", newStatus);

      const response = await post(API.teacherAdv + `/${id}`, formData, true);

      if (response.code === 200) {
        toast.success("Status updated successfully!");
        initialize("advertisement");
      } else if (response.code === 400) {
        toast.error(
          "Another active advertisement exists at this level. Update it first."
        );
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
      {studentAdvObj.visible && (
        <StudentNotice
          studentAdvObj={studentAdvObj}
          handleCloseStudentForm={handleCloseStudentForm}
          id={teacherAdvId}
        />
      )}
      <div>
        <Breadcrumb
          pageName="Student Advertisement"
          totalData={advertisement.totalData}
        />
        <div className="mb-4">
          <div className="flex flex-col sm:flex-row md:items-center gap-4 py-4 justify-between">
            <div className="flex items-center gap-4">
              <button
                className="px-4 py-2 flex space-x-2 rounded-md bg-custom-blue text-white dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                onClick={() => {
                  initialize("advertisement");
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
                value={advertisement.pageSize}
              >
                {[5, 10, 20, 30, 40, 50, 100, 200, 500].map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>
            <div
              onClick={() => handleAddNewAdv()}
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
          editLinkPrefix={(id) => handleAddNewAdv(id)}
          editButtonVisible={true}
          deleteHandler={deleteAdvertisement}
          isStatusActive={true}
          updateStatusById={updateStatusById}
          deleteButtonVisible={true}

        />
        <Pagination data={advertisement} changePage={changePage} />
      </div>
    </>
  );
}
