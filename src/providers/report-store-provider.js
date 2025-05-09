"use client";
import { createContext, useRef, useContext } from "react";
import { useStore } from "zustand";
import { createReportStore, defaultInitState } from "@/store/admin-store/report-store";

export const ReportStoreContext = createContext(null);

export const ReportStoreProvider = ({ children }) => {
  const storeRef = useRef(null);
  if (!storeRef.current) {
    storeRef.current = createReportStore(defaultInitState);
  }

  return <ReportStoreContext.Provider value={storeRef.current}>{children}</ReportStoreContext.Provider>;
};

export const useReportAdminStore = (selector) => {
  const counterStoreContext = useContext(ReportStoreContext);

  if (!counterStoreContext) {
    throw new Error(`use ReportStore must be use within ReportStoreProvider`);
  }

  return useStore(counterStoreContext, selector);
};

