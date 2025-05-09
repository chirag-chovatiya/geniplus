import React from "react";
import Link from "next/link";
import DeleteButton from "@/components/Switchers/DeleteButton";
import { usePathname } from "next/navigation";

const Table = ({
  columns,
  data,
  editLinkPrefix,
  deleteHandler,
  editButtonVisible = false,
  deleteButtonVisible = false,
  isStatusActive = false,
  updateStatusById,
  onImageClick,
  createAttendance,
  selectedRows,
  setSelectedRows,
  showCheckbox = false,
}) => {
  const handleStatusChange = (id, newStatus, field) => {
    updateStatusById(id, newStatus, field);
  };

  let pathname = usePathname();

  return (
    <div className="rounded-xl border border-custom-blue bg-white p-2 shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-custom-blue  text-left dark:bg-meta-4 rounded-xl">
              {showCheckbox && (
                <th className="px-4 py-4 font-medium text-white rounded-l-xl">
                  <input
                    type="checkbox"
                    onChange={(e) =>
                      setSelectedRows(
                        e.target.checked ? data.map((item) => item.id) : []
                      )
                    }
                    checked={
                      selectedRows?.length === data.length && data.length > 0
                    }
                  />
                </th>
              )}
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-4 py-4 font-medium text-white first:rounded-l-xl last:rounded-r-xl "
                >
                  {col.title}
                </th>
              ))}
              <th className="px-4 py-4 font-medium text-white last:rounded-r-xl">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((item, key) => (
                <tr key={key}>
                  {showCheckbox && (
                    <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                      <input
                        type="checkbox"
                        checked={selectedRows?.includes(item.id)}
                        onChange={(e) => {
                          setSelectedRows((prev) =>
                            e.target.checked
                              ? [...prev, item.id]
                              : prev.filter((id) => id !== item.id)
                          );
                        }}
                      />
                    </td>
                  )}
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className="border-b border-[#eee] px-4 py-5 dark:border-strokedark"
                    >
                      {col.key === "status" || col.key === "linkStatus" ? (
                        isStatusActive ? (
                          <label className="relative inline-block w-10 h-6 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={item[col.key]}
                              onChange={() =>
                                handleStatusChange(item.id, !item[col.key], col.key)
                              }
                              className="absolute w-0 h-0 opacity-0"
                            />
                            <span
                              className={`block w-10 h-6 rounded-full bg-gray-400 ${
                                item[col.key] ? "bg-green-500" : "bg-red-500"
                              } transition-all`}
                            />
                            <span
                              className={`absolute left-1 top-1 w-4 h-4  bg-white rounded-full transition-all ${
                                item[col.key] ? "translate-x-4" : ""
                              }`}
                            />
                          </label>
                        ) : (
                          <p
                            className={`font-medium ${
                              item[col.key] === "Present"
                                ? "text-green-600"
                                : item[col.key] === "Absent"
                                ? "text-red"
                                : item[col.key]
                                ? "text-green-600"
                                : "text-red"
                            }`}
                          >
                            {item[col.key] === "Present"
                              ? "Present"
                              : item[col.key] === "Absent"
                              ? "Absent"
                              : item[col.key]
                              ? "Active"
                              : "Inactive"}
                          </p>
                        )
                      ) : col.key === "hwStatus" ? (
                        <p
                          className={`font-medium ${
                            item[col.key] ? "text-green-600" : "text-red"
                          }`}
                        >
                          {item[col.key] ? "Complete" : "Incomplete"}
                        </p>
                      ) : col.key === "attendance" ? (
                        <div className="flex space-x-2">
                          <button
                            className="px-2 py-1 text-white bg-green-500 rounded hover:bg-green-600"
                            onClick={() => createAttendance(item.id, "Present")}
                          >
                            P
                          </button>
                          <button
                            className="px-2 py-1 text-white bg-red rounded hover:bg-red-600"
                            onClick={() => createAttendance(item.id, "Absent")}
                          >
                            A
                          </button>
                        </div>
                      ) : col.key === "name" ? (
                        item.user_type === "Student" ? (
                          <Link
                            href={
                              pathname.match(/\/admin/)
                                ? `/admin/monthlyreport?studentId=${item.id}`
                                : `/teacher/monthlyreport?studentId=${item.id}`
                            }
                            className="text-custom-blue dark:text-amber-300 font-semibold hover:underline"
                          >
                            {item[col.key] || "-----"}
                          </Link>
                        ) : item.user_type === "Teacher" &&
                          pathname.match(/\/admin/) ? (
                          <Link
                            href={`/admin/studentList?teacherId=${item.id}`}
                            className="text-[#2d5097] dark:text-amber-200 font-semibold hover:underline"
                          >
                            {item[col.key] || "-----"}
                          </Link>
                        ) : (
                          <span>{item[col.key] || "-----"}</span>
                        )
                      ) : col.type === "image" ? (
                        <img
                          src={item[col.key] || "/default-image.jpg"}
                          alt={item[col.key] ? "Image" : "No Image"}
                          className="w-16 h-16 object-cover border border-stroke dark:border-strokedark rounded-md cursor-pointer"
                          onClick={() => onImageClick(item[col.key])}
                        />
                      ) : (
                        <p className="text-black dark:text-white line-clamp-3">
                          {item[col.key] || "-----"}
                        </p>
                      )}
                    </td>
                  ))}
                  <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                    <div
                      className={`flex items-center ${
                        editButtonVisible || deleteButtonVisible
                          ? "space-x-3.5"
                          : "justify-center"
                      }`}
                    >
                      {editButtonVisible &&
                        (typeof editLinkPrefix === "string" ? (
                          <Link
                            href={`${editLinkPrefix}/${item.id}`}
                            className="hover:text-primary"
                          >
                            <i className="fa-regular fa-pen-to-square"></i>
                          </Link>
                        ) : (
                          <button
                            onClick={() => editLinkPrefix(item.id)}
                            className="hover:text-primary"
                          >
                            <i className="fa-regular fa-pen-to-square"></i>
                          </button>
                        ))}

                      {deleteButtonVisible && (
                        <DeleteButton
                          key={item.id}
                          deleteAction={() => deleteHandler(item.id)}
                        />
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length + 1}
                  className="text-center py-4 text-gray-500"
                >
                  No Data Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;
