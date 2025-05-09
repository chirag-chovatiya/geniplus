"use client";

import Link from "next/link";
import { useState } from "react";

const Breadcrumb = ({ pageName, title = false,  totalData = 0 }) => {
  const [pagePath, setpagePath] = useState(pageName.split("/"));
  
  const linkMaker = (endElement) => {
    const endIndex = pagePath.indexOf(endElement);
    return pagePath.slice(0, endIndex+1).join("/").toLowerCase();
  }

  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <h2 className="text-title-md2 font-semibold text-black dark:text-white capitalize">
      {title ? title : ((pagePath.length>1 ? pagePath[pagePath.length-2] : "") + " " + pagePath[pagePath.length-1])}
      {totalData > 0 && (
          <span className="ml-2 font-semibold text-black dark:text-white">
            = {totalData}
          </span>
        )}
      </h2>

      <nav>
        <ol className="flex items-center gap-2">
          <li>
            <Link className="font-medium" href="/admin">
            <i className="fa-solid fa-house"></i> /
            </Link>
          </li>
          {
            pagePath.map((path, index) => {
              return (
                <Link key={index} href={"/admin/"+ linkMaker(path)}>
                <li  className="font-medium">
                  <span className="text-custom-blue dark:text-white capitalize">{path}</span> {(index < pagePath.length - 1) ? "/" : ""}
                </li>
                </Link>
              );
            })
          }
        </ol>
      </nav>
    </div>
  );
};

export default Breadcrumb;
