"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import React, { useCallback, useEffect, useMemo } from "react";
import Table from "@/components/app-table/app-table";
import Pagination from "@/components/Pagination";
import debounce from "lodash/debounce";
import { del } from "@/service/api";
import { API } from "@/service/constant/api-constant";
import "react-toastify/dist/ReactToastify.css";
import { useTeacherAdvStore } from "@/providers/teacheradv-store-provider";

export default function StudentAdvertisement() {
  const {
    advertisement,
    changePage,
    onPageSizeChange,
    onSelectionChange,
    teacherSearch,
    initialize,
  } = useTeacherAdvStore((state) => state);

  useEffect(() => {
    onSelectionChange("advertisement");
    if (Object.keys(advertisement.data).length === 0) {
      initialize();
    }
  }, []);

  const columns = useMemo(
    () => [
      { key: "id", title: "ID" },
      { key: "teacher", title: "Teacher Name" },
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
          teacher: item?.teacher?.name || "N/A",
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

  const handleSearch = useCallback(
    debounce((query) => {
      teacherSearch(query);
    }, 300),
    [teacherSearch]
  );

  const deleteAdvertisement = async (id) => {
    try {
      const response = await del(API.teacherAdv + `/${id}`);
      initialize("advertisement");
      return response;
    } catch (error) {
      console.error("Error deleting advertisement data:", error);
    }
  };

  return (
    <>
      <div>
        <Breadcrumb
          pageName="Student Advertisement"
          totalData={advertisement?.totalData}
        />
        <div className="mb-4">
          <div className="flex flex-col sm:flex-row md:items-center gap-4 py-4 justify-between">
            <div className="flex items-center gap-4">
              <button
                className="px-4 py-2 flex space-x-2 rounded-md bg-custom-blue text-white dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                onClick={() => {
                  document.getElementById("search").value = "";
                  handleSearch("");
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
          deleteHandler={deleteAdvertisement}
          deleteButtonVisible={true}

        />
        <Pagination data={advertisement} changePage={changePage} />
      </div>
    </>
  );
}
