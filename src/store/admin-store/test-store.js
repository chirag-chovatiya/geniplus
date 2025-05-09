import { getAllTestData } from "@/service/test-api";
import { createStore } from "zustand/vanilla";

export const defaultInitState = {
  test: {
    data: {},
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
  const { page, pageSize } = get().test;
  const teacherName = get().test.teacherName;

  try {
    let url = `?page=${page}&pageSize=${pageSize}`;
    if (teacherName && teacherName != "") {
      url += `&teacherName=${encodeURIComponent(teacherName)}`;
    }
    const { data, code } = await getAllTestData(url + '&');

    if (code === 200 || code === 201) {
      const hasMoreData = data.data.length > 0 && data.data.length >= 10;
      set((state) => ({
        test: {
          ...state.test,
          data: { ...state.test.data, [page]: data.data },
          loading: false,
          totalPages: data.totalPages,
          totalData: data.totalData,
          hasMoreData,
        },
      }));
    } else {
      set((state) => ({
        test: { ...state.test, error: data.message },
      }));
    }
  } catch (error) {
    set((state) => ({
      test: { ...state.test, error: error.message || error },
    }));
  }
}

export const createTestStore = (initState = defaultInitState) =>
  createStore((set, get) => ({
    ...initState,
    initialize: async (selected = "test") => {
      set((state) => ({
        [selected]: {
          ...state[selected],
          data: [],
          page: 1,
          hasMoreData: true,
          loading: true,
        },
      }));
      await fetchDataAndSetState(set, get);
    },
    changePage: async (page) => {
      const state = get();
      if (!state.test.data[page]) {
        set({
          test: { ...state.test, page, hasMoreData: true, loading: true },
        });
        await fetchDataAndSetState(set, get);
      } else {
        set({ test: { ...state.test, page } });
      }
    },
    search: async (teacherName) => {
      set((state) => ({
        test: {
          ...state.test,
          teacherName: teacherName ? teacherName : null,
          page: 1,
          hasMoreData: true,
          loading: true,
        },
      }));
      await fetchDataAndSetState(set, get);
    },
    onSelectionChange: async (selected) => set({ selected }),
    onPageSizeChange: async (pageSize) => {
      set({
        test: {
          ...defaultInitState.test,
          pageSize,
          loading: true,
        },
      });
      await fetchDataAndSetState(set, get);
    },
    onError: (error) => set({ test: { ...get().test, error } }),
    noMoreData: () => set({ test: { ...get().test, hasMoreData: false } }),
  }));
