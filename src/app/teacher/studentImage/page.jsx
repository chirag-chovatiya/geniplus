"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import Table from "@/components/app-table/app-table";
import Pagination from "@/components/Pagination";
import debounce from "lodash/debounce";
import { del } from "@/service/api";
import { API } from "@/service/constant/api-constant";
import { useImageAdminStore } from "@/providers/image-store-provider";
import ImageModal from "@/components/app-modal/modal.component.image";
import * as XLSX from "xlsx";
export default function ImageLists() {
  const {
    userImage,
    changePage,
    onPageSizeChange,
    onSelectionChange,
    selectedData,
    search,
    initialize,
  } = useImageAdminStore((state) => state);

  const [level, setLevel] = useState("");
  const [createdAt, setCreatedAt] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);

  useEffect(() => {
    onSelectionChange("userImage");
    if (Object.keys(userImage.data).length === 0) {
      initialize();
    }
  }, []);

  useEffect(() => {
    if (level || createdAt) {
      selectedData(level, createdAt);
    }
  }, [level, createdAt, selectedData]);

  const columns = useMemo(
    () => [
      { key: "id", title: "ID" },
      { key: "studentname", title: "Student Name" },
      { key: "standerd", title: "Student Level" },
      { key: "imgUrl", title: "HW Image", type: "image" },
      { key: "createdAt", title: "Date" },
    ],
    []
  );

  const transformedData = useMemo(
    () =>
      (userImage?.data?.[userImage.page] || []).map((item) => ({
        ...item,
        studentname: item.student?.name || "N/A",
        standerd: item.student?.level || "N/A",
        imgUrl: item.imgUrl || "",
        createdAt: item.createdAt
          ? new Date(item.createdAt).toLocaleDateString("en-GB")
          : "N/A",
      })),
    [userImage.data, userImage.page]
  );

  const deleteImage = async (id) => {
    try {
      const response = await del(API.imageUpload + `/${id}`);
      initialize("userImage");
      return response;
    } catch (error) {
      console.error("Error deleting image data:", error);
    }
  };

  const deleteAllSelected = async () => {
    if (selectedRows.length === 0) return alert("No items selected!");

    if (!confirm("Are you sure you want to delete selected items?")) return;

    try {
      const ids = selectedRows.join(",");
      await del(`${API.imageUpload}/${ids}`);
      initialize("userImage");
      setSelectedRows([]);
    } catch (error) {
      console.error("Error deleting multiple image:", error);
    }
  };

  const handleSearch = useCallback(
    debounce((query) => {
      search(query);
    }, 300),
    [search]
  );

  const handleImageClick = (imageSrc) => {
    setSelectedImage(imageSrc);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  const exportToExcel = () => {
    if (!userImage?.data?.[userImage.page]?.length) {
      alert("No data available to export!");
      return;
    }

    const formattedData = userImage?.data?.[userImage.page]?.map((item) => ({
      ID: item.id,
      "Student Name": item.student?.name || "N/A",
      "Student Level": item.student?.level || "N/A",
      "HW Image URL": item.imgUrl ? "Yes" : "No",
      Date: item.createdAt
        ? new Date(item.createdAt).toLocaleDateString("en-GB")
        : "N/A",
    }));

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Student Images");

    XLSX.writeFile(workbook, "student_images.xlsx");
  };

  return (
    <>
      <div>
        <Breadcrumb pageName="Student Image" totalData={userImage.totalData} />
        <div className="mb-4">
          <div className="flex flex-col sm:flex-row md:items-center gap-4 py-4">
            <div className="flex items-center gap-4">
              <button
                className="px-4 py-2 flex space-x-2 rounded-md bg-custom-blue text-white dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                onClick={() => {
                  setLevel("");
                  setCreatedAt("");
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
                onClick={exportToExcel}
              >
                <span>
                  <i className="fa-solid fa-download"></i>
                </span>
                <span>Export</span>
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
                value={userImage.pageSize}
              >
                {[20, 30, 40, 50, 100, 200, 500, 1000, 2000, 5000].map(
                  (size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  )
                )}
              </select>
            </div>
            <div className="sm:mt-0">
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
                className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white outline-none"
                onChange={(e) => setCreatedAt(e.target.value)}
              />
            </div>
          </div>
          <div className="flex-grow sm:mt-0">
            <input
              type="text"
              id="textSearch"
              className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white outline-none"
              placeholder="Search Here"
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
        </div>
        <Table
          columns={columns}
          data={transformedData}
          deleteHandler={deleteImage}
          onImageClick={handleImageClick}
          selectedRows={selectedRows}
          setSelectedRows={setSelectedRows}
          showCheckbox={true}
          deleteButtonVisible={true}
        />
        <Pagination data={userImage} changePage={changePage} />
      </div>
      <ImageModal imageSrc={selectedImage} onClose={handleCloseModal} />
    </>
  );
}
