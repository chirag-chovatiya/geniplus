"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import SidebarLinkGroup from "./SidebarLinkGroup";

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  let pathname = usePathname();

  const trigger = useRef(null);
  const sidebar = useRef(null);

  let storedSidebarExpanded = "true";

  const [sidebarExpanded, setSidebarExpanded] = useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === "true"
  );

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen ||
        sidebar.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setSidebarOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ key }) => {
      if (!sidebarOpen || key !== "Escape") return;
      setSidebarOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  useEffect(() => {
    localStorage.setItem("sidebar-expanded", sidebarExpanded.toString());
    if (sidebarExpanded) {
      document.querySelector("body")?.classList.add("sidebar-expanded");
    } else {
      document.querySelector("body")?.classList.remove("sidebar-expanded");
    }
  }, [sidebarExpanded]);

  return (
    <aside
      id="sideScroll"
      ref={sidebar}
      className={`absolute left-0 top-0 z-9999 flex h-screen w-72.5 flex-col overflow-y-hidden bg-custom-blue duration-300 ease-linear dark:bg-boxdark lg:static lg:translate-x-0 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* <!-- SIDEBAR HEADER --> */}
      <div className="flex items-center justify-center gap-2 px-6 py-5.5 lg:py-6.5">
        <Link href="/admin/">
          {/* <div className="flex justify-center items-center space-y-2"> */}
          <img
            src="/assets/logo/finallogo.png"
            alt="Logo"
            className="w-30 h-25 rounded-lg"
          />
          {/* <h1 className="uppercase text-[23px] text-center font-semibold text-white">
              Geniplus Kids Abacus
            </h1> */}
          {/* </div> */}
        </Link>

        <button
          ref={trigger}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-controls="sidebar"
          aria-expanded={sidebarOpen}
          className="block lg:hidden"
        >
          <span>Icon</span>
        </button>
      </div>

      {/* <!-- SIDEBAR HEADER --> */}

      <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
        {/* <!-- Sidebar Menu --> */}
        <nav className="mt-2 px-4 py-4 lg:px-6">
          {/* <!-- Menu Group --> */}
          <div>
            <h3 className="mb-4 ml-4 text-sm font-semibold text-bodydark2">
              MENU
            </h3>

            <ul className="mb-6 flex flex-col gap-1.5">
              {/* <!-- Student --> */}
              <li>
                <Link
                  href={pathname.match(/\/admin/) ? "/admin/" : "/teacher/"}
                  className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                    (pathname === "/admin/" || pathname === "/teacher/") &&
                    "bg-graydark dark:bg-meta-4"
                  }`}
                >
                  <span>🎓</span>
                  Student List
                </Link>
              </li>
              {/* <!-- Student End --> */}
              {/* <!-- TeacherList Start --> */}
              {pathname.match(/\/admin/) && (
                <Link
                  href="/admin/teacher"
                  className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                    pathname.includes("teacherList") &&
                    "bg-graydark dark:bg-meta-4"
                  }`}
                >
                  <span>👨‍🏫</span>
                  Teacher List
                </Link>
              )}

              {/* <!-- TeacherList End --> */}
              {/* <!-- Exam List --> */}
              <Link
                href={
                  pathname.match(/\/admin/)
                    ? "/admin/addition"
                    : "/teacher/addition"
                }
                className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                  pathname.includes("addition") && "bg-graydark dark:bg-meta-4"
                }`}
              >
                <span>✍️</span>
                Manage Exam
              </Link>
              {/* <!-- Exam End --> */}

              {/* <!-- Student Report Start --> */}
              <Link
                href={
                  pathname.match(/\/admin/)
                    ? "/admin/report"
                    : "/teacher/report"
                }
                className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                  pathname.includes("report") && "bg-graydark dark:bg-meta-4"
                }`}
              >
                <span>📑</span>
                Student Report
              </Link>
              {/* <!-- Student Report End --> */}

              {/* Student Image Start */}
              <Link
                href={
                  pathname.match(/\/admin/)
                    ? "/admin/studentImage"
                    : "/teacher/studentImage"
                }
                className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                  pathname.includes("studentImage") &&
                  "bg-graydark dark:bg-meta-4"
                }`}
              >
                <span>🖼️</span>
                HomeWork Image
              </Link>

              {/* Student Image End */}
              {/* Attendance Start */}
              <Link
                href={
                  pathname.match(/\/admin/)
                    ? "/admin/attendance"
                    : "/teacher/attendance"
                }
                className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                  pathname.includes("attendance") &&
                  "bg-graydark dark:bg-meta-4"
                }`}
              >
                <span>📆</span>
                Attendance
              </Link>
              {/* Attendance End */}
              {/* Lesson Start */}
              <Link
                href={
                  pathname.match(/\/admin/)
                    ? "/admin/lesson"
                    : "/teacher/lesson"
                }
                className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                  pathname.includes("lesson") && "bg-graydark dark:bg-meta-4"
                }`}
              >
                <span>📔</span>
                Student Lesson
              </Link>
              {/* Lesson End */}
              {/* Notice Start */}
              <Link
                href={
                  pathname.match(/\/admin/)
                    ? "/admin/notice"
                    : "/teacher/notice"
                }
                className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                  pathname.includes("notice") && "bg-graydark dark:bg-meta-4"
                }`}
              >
                <span>📜</span>
                Notice
              </Link>
              {/* Notice End */}
              {/* Result Start */}
              <Link
                href={
                  pathname.match(/\/admin/)
                    ? "/admin/result"
                    : "/teacher/result"
                }
                className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                  pathname.includes("result") && "bg-graydark dark:bg-meta-4"
                }`}
              >
                <span>📝</span>
                Student Result
              </Link>
              {/* Result End */}
              {/* Rating Start */}
              <Link
                href={
                  pathname.match(/\/admin/)
                    ? "/admin/rating"
                    : "/teacher/rating"
                }
                className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                  pathname.includes("rating") && "bg-graydark dark:bg-meta-4"
                }`}
              >
                <span>⭐</span>
                Student Rating
              </Link>
              {/* Rating End */}
              {/* Advertisement Start */}
              <SidebarLinkGroup
                activeCondition={
                  pathname === "/admin/advertisement" ||
                  pathname.includes("advertisement")
                }
              >
                {(handleClick, open) => {
                  return (
                    <React.Fragment>
                      <Link
                        href="#"
                        className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 hover:bg-graydark dark:hover:bg-meta-4 ${
                          pathname.includes("advertisement") &&
                          "bg-graydark dark:bg-meta-4"
                        }`}
                        onClick={(e) => {
                          e.preventDefault();
                          sidebarExpanded
                            ? handleClick()
                            : setSidebarExpanded(true);
                        }}
                      >
                        📢 Advertisement
                        <i
                          className={`absolute right-4 top-1/2 -translate-y-1/2 fa-solid fa-angle-down ${
                            open && "rotate-180"
                          }`}
                        ></i>
                      </Link>

                      <div
                        className={`transform overflow-hidden ${
                          !open && "hidden"
                        }`}
                      >
                        <ul className="mb-5.5 mt-4 flex flex-col gap-2.5 pl-6">
                          <li>
                            <Link
                              href={
                                pathname.includes("/admin")
                                  ? "/admin/advertisement"
                                  : "/teacher/advertisement"
                              }
                              className="group flex items-center gap-2.5 rounded-md px-4 font-medium text-body-dark2 duration-300 hover:text-white text-white"
                            >
                              Student Advertise
                            </Link>
                          </li>
                          {pathname.startsWith("/admin") && (
                            <li>
                              <Link
                                href="/admin/teacherAdvertisement"
                                className={`group flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 hover:text-white ${
                                  pathname === "/admin/teacherAdvertisement" &&
                                  "text-white"
                                }`}
                              >
                                Teacher Advertise
                              </Link>
                            </li>
                          )}
                        </ul>
                      </div>
                    </React.Fragment>
                  );
                }}
              </SidebarLinkGroup>
              {/* Advertisement End */}
            </ul>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
