"use client";
import { createContext, useRef, useContext } from "react";
import { useStore } from "zustand";
import { createUsersStore, defaultInitState } from "@/store/admin-store/user-store";

export const UserStoreContext = createContext(null);

export const UserStoreProvider = ({ children }) => {
  const storeRef = useRef(null);
  if (!storeRef.current) {
    storeRef.current = createUsersStore(defaultInitState);
  }

  return <UserStoreContext.Provider value={storeRef.current}>{children}</UserStoreContext.Provider>;
};

export const useUserAdminStore = (selector) => {
  const counterStoreContext = useContext(UserStoreContext);

  if (!counterStoreContext) {
    throw new Error(`useUserStore must be use within UserStoreProvider`);
  }

  return useStore(counterStoreContext, selector);
};

