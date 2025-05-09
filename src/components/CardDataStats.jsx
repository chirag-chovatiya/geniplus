import React  from "react";

const CardDataStats = ({ title, total, lableTitle, children }) => {
  return (
    <div className="rounded-sm border border-stroke bg-white px-7.5 py-8 shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
        {children}
      </div>

      <div className="mt-4">
        <h4 className="text-title-sm font-bold text-black dark:text-white">
          {title}
        </h4>
        <div className="flex text-center mt-4 justify-between">
          <span className="text-md font-bold">{lableTitle}</span>
          <h4 className="text-md font-medium text-black dark:text-white">
            {total}
          </h4>
        </div>
      </div>
    </div>
  );
};

export default CardDataStats;
