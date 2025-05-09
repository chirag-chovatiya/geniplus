"use client";
import { createContext, useRef, useContext } from "react";
import { useStore } from "zustand";
import { createRatingStore, defaultInitState } from "@/store/admin-store/rating-store";

export const RatingStoreContext = createContext(null);

export const RatingStoreProvider = ({ children }) => {
  const storeRef = useRef(null);
  if (!storeRef.current) {
    storeRef.current = createRatingStore(defaultInitState);
  }

  return <RatingStoreContext.Provider value={storeRef.current}>{children}</RatingStoreContext.Provider>;
};

export const useRatingAdminStore = (selector) => {
  const counterStoreContext = useContext(RatingStoreContext);

  if (!counterStoreContext) {
    throw new Error(`use RatingStoreProvider must be use within RatingStoreProvider Provider`);
  }

  return useStore(counterStoreContext, selector);
};

