"use client";
import { createContext, useRef, useContext } from "react";
import { useStore } from "zustand";
import { createImageStore, defaultInitState } from "@/store/admin-store/image-store";

export const ImageStoreContext = createContext(null);

export const ImageStoreProvider = ({ children }) => {
  const storeRef = useRef(null);
  if (!storeRef.current) {
    storeRef.current = createImageStore(defaultInitState);
  }

  return <ImageStoreContext.Provider value={storeRef.current}>{children}</ImageStoreContext.Provider>;
};

export const useImageAdminStore = (selector) => {
  const counterStoreContext = useContext(ImageStoreContext);

  if (!counterStoreContext) {
    throw new Error(`use ImageStore must be use within ImageStoreProvider`);
  }

  return useStore(counterStoreContext, selector);
};

