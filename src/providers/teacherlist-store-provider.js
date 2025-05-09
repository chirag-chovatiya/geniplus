"use client";
import { createContext, useRef, useContext } from "react";
import { useStore } from "zustand";
import { createTeacherListStore, defaultInitState } from "@/store/admin-store/teacherlist-store";

export const TeacherListStoreContext = createContext(null);

export const TeacherListStoreProvider = ({ children }) => {
  const storeRef = useRef(null);
  if (!storeRef.current) {
    storeRef.current = createTeacherListStore(defaultInitState);
  }

  return <TeacherListStoreContext.Provider value={storeRef.current}>{children}</TeacherListStoreContext.Provider>;
};

export const useTeacherListAdminStore = (selector) => {
  const counterStoreContext = useContext(TeacherListStoreContext);

  if (!counterStoreContext) {
    throw new Error(`Use TeacherListStore must be use within TeacherListStoreProvider`);
  }

  return useStore(counterStoreContext, selector);
};

