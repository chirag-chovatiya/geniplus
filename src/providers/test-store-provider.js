"use client";
import { createContext, useRef, useContext } from "react";
import { useStore } from "zustand";
import { createTestStore, defaultInitState } from "@/store/admin-store/test-store";

export const TestStoreContext = createContext(null);

export const TestStoreProvider = ({ children }) => {
  const storeRef = useRef(null);
  if (!storeRef.current) {
    storeRef.current = createTestStore(defaultInitState);
  }

  return <TestStoreContext.Provider value={storeRef.current}>{children}</TestStoreContext.Provider>;
};

export const useTestAdminStore = (selector) => {
  const counterStoreContext = useContext(TestStoreContext);

  if (!counterStoreContext) {
    throw new Error(`use TestStore must be use within TestStoreProvider`);
  }

  return useStore(counterStoreContext, selector);
};

