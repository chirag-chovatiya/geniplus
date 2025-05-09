"use client";
import { createContext, useRef, useContext } from "react";
import { useStore } from "zustand";
import { createLessonStore, defaultInitState  } from "@/store/admin-store/lesson-store";

export const LessonStoreContext = createContext(null);

export const LessonStoreProvider = ({ children }) => {
  const storeRef = useRef(null);
  if (!storeRef.current) {
    storeRef.current = createLessonStore(defaultInitState);
  }

  return <LessonStoreContext.Provider value={storeRef.current}>{children}</LessonStoreContext.Provider>;
};

export const useLessonAdminStore = (selector) => {
  const counterStoreContext = useContext(LessonStoreContext);

  if (!counterStoreContext) {
    throw new Error(`use LessonStore must be use within LessonStore Provider`);
  }

  return useStore(counterStoreContext, selector);
};

