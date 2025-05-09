"use client";
import { createContext, useRef, useContext } from "react";
import { useStore } from "zustand";
import { createAttendanceStore, defaultInitState } from "@/store/admin-store/attendance-store";

export const AttendanceStoreContext = createContext(null);

export const AttendanceStoreProvider = ({ children }) => {
  const storeRef = useRef(null);
  if (!storeRef.current) {
    storeRef.current = createAttendanceStore(defaultInitState);
  }

  return <AttendanceStoreContext.Provider value={storeRef.current}>{children}</AttendanceStoreContext.Provider>;
};

export const useAttendanceAdminStore = (selector) => {
  const counterStoreContext = useContext(AttendanceStoreContext);

  if (!counterStoreContext) {
    throw new Error(`use AttendanceStore must be use within AttendanceStore Provider`);
  }

  return useStore(counterStoreContext, selector);
};

