"use client";
import { createContext, useRef, useContext } from "react";
import { useStore } from "zustand";
import { createNoticeStore, defaultInitState } from "@/store/admin-store/notice-store";

export const NoticeStoreContext = createContext(null);

export const NoticeStoreProvider = ({ children }) => {
  const storeRef = useRef(null);
  if (!storeRef.current) {
    storeRef.current = createNoticeStore(defaultInitState);
  }

  return <NoticeStoreContext.Provider value={storeRef.current}>{children}</NoticeStoreContext.Provider>;
};

export const useNoticeAdminStore = (selector) => {
  const counterStoreContext = useContext(NoticeStoreContext);

  if (!counterStoreContext) {
    throw new Error(`use NoticeStoreProvider must be use within NoticeStoreProvider Provider`);
  }

  return useStore(counterStoreContext, selector);
};

