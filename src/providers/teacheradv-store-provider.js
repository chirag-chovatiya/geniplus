"use client";
import { createContext, useRef, useContext } from "react";
import { useStore } from "zustand";
import { createAdvertisementStore, defaultInitState } from "@/store/admin-store/teacheradv-store";

export const AdvertisementStoreContext = createContext(null);

export const TeacherAdvStoreProvider = ({ children }) => {
  const storeRef = useRef(null);
  if (!storeRef.current) {
    storeRef.current = createAdvertisementStore(defaultInitState);
  }

  return <AdvertisementStoreContext.Provider value={storeRef.current}>{children}</AdvertisementStoreContext.Provider>;
};

export const useTeacherAdvStore = (selector) => {
  const counterStoreContext = useContext(AdvertisementStoreContext);

  if (!counterStoreContext) {
    throw new Error(`use TeacherAdvStoreProvider must be use within TeacherAdvStoreProvider Provider`);
  }

  return useStore(counterStoreContext, selector);
};

