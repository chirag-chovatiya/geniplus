import { getAllStudentAdvData } from "@/service/teacheradv-api";
import { createStore } from "zustand/vanilla";

export const defaultInitState = {
  advertisement: {
    data: {},
    teacherName:null,
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
  const { page, pageSize } = get().advertisement;
  const teacherName = get().advertisement.teacherName;
  try {
    let url = `?page=${page}&pageSize=${pageSize}`;
    if (teacherName && teacherName != "") {
      url += `&teacherName=${encodeURIComponent(teacherName)}`;
    }

    const { data, code } = await getAllStudentAdvData(url + "&");

    if (code === 200 || code === 201) {
      const hasMoreData = data.data.length > 0 && data.data.length >= 10;
      set((state) => ({
        advertisement: {
          ...state.advertisement,
          data: { ...state.advertisement.data, [page]: data.data },
          loading: false,
          totalPages: data.totalPages,
          totalData: data.totalData,
          hasMoreData,
        },
      }));
    } else {
      set((state) => ({
        advertisement: { ...state.advertisement, error: data.message },
      }));
    }
  } catch (error) {
    set((state) => ({
      advertisement: { ...state.advertisement, error: error.message || error },
    }));
  }
}

export const createAdvertisementStore = (initState = defaultInitState) =>
  createStore((set, get) => ({
    ...initState,
    initialize: async (selected = "advertisement") => {
      set((state) => ({
        [selected]: {
          ...state[selected],
          data: {},
          page: 1,
          hasMoreData: true,
          loading: true,
        },
      }));
      await fetchDataAndSetState(set, get);
    },
    changePage: async (page) => {
      const state = get();
      if (!state.advertisement.data[page]) {
        set({
          advertisement: {
            ...state.advertisement,
            page,
            hasMoreData: true,
            loading: true,
          },
        });
        await fetchDataAndSetState(set, get);
      } else {
        set({ advertisement: { ...state.advertisement, page } });
      }
    },
    onSelectionChange: async (selected) => set({ selected }),
    onPageSizeChange: async (pageSize) => {
      set({
        advertisement: {
          ...defaultInitState.advertisement,
          pageSize,
          loading: true,
        },
      });
      await fetchDataAndSetState(set, get);
    },
    teacherSearch: async (teacherName) => {
      set((state) => ({
        advertisement: {
          ...state.advertisement,
          teacherName: teacherName ? teacherName : null,
          page: 1,
          hasMoreData: true,
          loading: true,
        },
      }));
      await fetchDataAndSetState(set, get);
    },
    onError: (error) =>
      set({ advertisement: { ...get().advertisement, error } }),
    noMoreData: () =>
      set({ advertisement: { ...get().advertisement, hasMoreData: false } }),
  }));
