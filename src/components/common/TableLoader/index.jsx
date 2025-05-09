import React from "react";

export default function TableLoader(size = 10) {
  return ([...Array(size)].map((_, i) => (
        <tr key={i}>
          <td colSpan={16} className="text-center  w-full">
            <div className="animate-pulse my-[1px] h-[100px] rounded-md bg-slate-300 dark:bg-slate-400/50"></div>
          </td>
        </tr>
      )))
}
