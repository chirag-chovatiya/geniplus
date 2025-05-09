import { getAllUserData } from "@/service/auth-api";
import { createStore } from "zustand/vanilla";

export const defaultInitState = {
  users: {
    data: {},
    searchQuery:null,
    level:null,
    page: 1,
    pageSize: 50,
    totalPages: 0,
    totalData: 0,
    loading: true,
    error: null,
    hasMoreData: true,
  },
};

async function fetchDataAndSetState(set, get) {
  const { page, pageSize} = get().users;
  const searchQuery = get().users.searchQuery;
  const level = get().users.level;
  try {
    let url = `?page=${page}&pageSize=${pageSize}`;
    if (searchQuery && searchQuery !== "") {
      url += `&searchQuery=${encodeURIComponent(searchQuery)}`;
    }
    if (level && level != "") {
      url += `&level=${encodeURIComponent(level)}`;
    }
    const { data, code } = await getAllUserData(url+'&');

    if (code === 200 || code === 201) {
      const hasMoreData = data.data.length > 0 && data.data.length >= 10;
      set((state) => ({
        users: {
          ...state.users,
          data: { ...state.users.data, [page]: data.data },
          loading: false,
          totalPages: data.totalPages,
          totalData: data.totalData,
          hasMoreData,
        },
      }));
    } else {
      set((state) => ({
        users: { ...state.users, error: data.message },
      }));
    }
  } catch (error) {
    set((state) => ({
      users: { ...state.users, error: error.message || error },
    }));
  }
}

export const createUsersStore = (initState = defaultInitState) =>
  createStore((set, get) => ({
    ...initState,
    initialize: async (mode = "initialize", selected = "users") => {
      set((state) => ({
        [selected]: {
          ...state[selected],
          data: {},
          page: 1,
          hasMoreData: true,
          loading: true,
          level: mode === "refresh" ? null : state[selected].level,
          searchQuery: mode === "refresh" ? null : state[selected].searchQuery,
        },
      }));
      await fetchDataAndSetState(set, get);
    },

    changePage: async (page) => {
      const state = get();
      if (!state.users.data[page]) {
        set({
          users: { ...state.users, page, hasMoreData: true, loading: true },
        });
        await fetchDataAndSetState(set, get);
      } else {
        set({ users: { ...state.users, page } });
      }
    },
    onSelectionChange: async (selected) => set({ selected }),
    onPageSizeChange: async (pageSize) => {
      set({
        users: {
          ...defaultInitState.users,
          pageSize,
          loading: true,
        },
      });
      await fetchDataAndSetState(set, get);
    },
    search: async (searchQuery) => {
      set((state) => ({
        users: {
          ...state.users,
          searchQuery: searchQuery ? searchQuery : null,
          page: 1,
          hasMoreData: true,
          loading: true,
        },
      }));
      await fetchDataAndSetState(set, get);
    },
    selectedData: async (level) => {
      set((state) => ({
        users: {
          ...state.users,
          level: level || null,
        },
      }));
      await fetchDataAndSetState(set, get);
    },
    getUserCount: () => {
      const state = get();
      return state.users.totalData; 
    },
    onError: (error) => set({ users: { ...get().users, error } }),
    noMoreData: () => set({ users: { ...get().users, hasMoreData: false } }),
  }));
