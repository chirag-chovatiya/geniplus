import React from "react";

export default function Pagination({ data, changePage = () => {} }) {
  const maxVisiblePages = 5;
  const startPage = Math.max(
    1,
    Math.min(
      data.page - Math.floor(maxVisiblePages / 2),
      data.totalPages - maxVisiblePages + 1
    )
  );
  const endPage = Math.min(startPage + maxVisiblePages - 1, data.totalPages);
  const visiblePages = Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i
  );
  return (
    <div className="flex items-center flex-col md:flex-row md:justify-between border-t border-gray-200 bg-gray-2 dark:bg-meta-4 px-4 py-3 sm:px-6">
      <div className="flex flex-col md:flex-row sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700 dark:text-gray-200 text-center py-2 md:py-0">
            Showing <span className="font-medium">1</span> to{" "}
            <span className="font-medium">{data.pageSize}</span> of{" "}
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-200 text-center py-2 md:py-0">
            <span className="font-medium">{data.totalData}</span> results{" "}
            <span className="font-medium">{data.totalPages}</span> pages
          </p>
        </div>
        <div>
          <nav
            className="isolate inline-flex -space-x-px rounded-md shadow-sm"
            aria-label="Pagination"
          >
            <a
              onClick={() => (data.page !== 1 ? changePage(1) : {})}
              className={`relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 dark:ring-gray-500 dark:text-gray-300 focus:z-20 focus:outline-offset-0 cursor-pointer ${
                data.page === 1
                  ? "dark:bg-gray-700 bg-gray-200"
                  : "dark:bg-gray-800 bg-gray-100"
              }`}
            >
              <i className="fa-solid fa-angles-left text-lg px-1"></i>
            </a>
            <a
              onClick={() => (data.page !== 1 ? changePage(data.page - 1) : {})}
              className={`relative inline-flex items-center px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 dark:ring-gray-500 dark:text-gray-300 focus:z-20 focus:outline-offset-0 cursor-pointer ${
                data.page === 1
                  ? "dark:bg-gray-700 bg-gray-200"
                  : "dark:bg-gray-800 bg-gray-100"
              }`}
            >
              <span className="sr-only">Previous</span>
              <i className="fa-solid fa-caret-left text-lg px-1"></i>
            </a>

            {visiblePages.map((page) => (
              <a
                key={page}
                onClick={() => changePage(page)}
                className={`cursor-pointer relative z-10 inline-flex items-center px-4 py-2 text-sm font-semibold focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
                  page === data.page
                    ? "z-10 bg-custom-blue text-white"
                    : "text-gray-900 ring-1 ring-inset ring-gray-300 dark:ring-gray-500 dark:text-gray-300 dark:bg-gray-800"
                }`}
              >
                {page}
              </a>
            ))}

            <a
              onClick={() =>
                data.page !== data.totalPages ? changePage(data.page + 1) : {}
              }
              className={`relative inline-flex items-center px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 dark:ring-gray-500 dark:text-gray-300 focus:z-20 focus:outline-offset-0 cursor-pointer ${
                data.page === data.totalPages
                  ? "dark:bg-gray-700 bg-gray-200"
                  : "dark:bg-gray-800 bg-gray-100"
              }`}
            >
              <span className="sr-only">Next</span>
              <i className="fa-solid fa-caret-right text-lg px-1"></i>
            </a>
            <a
              onClick={() =>
                data.page !== data.totalPages ? changePage(data.totalPages) : {}
              }
              className={`relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 dark:ring-gray-500 dark:text-gray-300 focus:z-20 focus:outline-offset-0 cursor-pointer ${
                data.page === data.totalPages
                  ? "dark:bg-gray-700 bg-gray-200"
                  : "dark:bg-gray-800 bg-gray-100"
              }`}
            >
              <i className="fa-solid fa-angles-right text-lg px-1"></i>
            </a>
          </nav>
        </div>
      </div>
    </div>
  );
}
