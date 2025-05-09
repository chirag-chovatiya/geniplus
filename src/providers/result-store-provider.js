"use client";
import { createContext, useRef, useContext } from "react";
import { useStore } from "zustand";
import { createResultStore, defaultInitState } from "@/store/admin-store/result-store";

export const ResultStoreContext = createContext(null);

export const ResultStoreProvider = ({ children }) => {
  const storeRef = useRef(null);
  if (!storeRef.current) {
    storeRef.current = createResultStore(defaultInitState);
  }

  return <ResultStoreContext.Provider value={storeRef.current}>{children}</ResultStoreContext.Provider>;
};

export const useResultAdminStore = (selector) => {
  const counterStoreContext = useContext(ResultStoreContext);

  if (!counterStoreContext) {
    throw new Error(`use ResultStoreProvider must be use within ResultStoreProvider Provider`);
  }

  return useStore(counterStoreContext, selector);
};

