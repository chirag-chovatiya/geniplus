import { getAllStudentNoticeData } from "@/service/notice-api";
import { createStore } from "zustand/vanilla";

export const defaultInitState = {
  notice: {
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
  const { page, pageSize } = get().notice;
  const teacherName = get().notice.teacherName;
  try {
    let url = `?page=${page}&pageSize=${pageSize}`;
    if (teacherName && teacherName != "") {
      url += `&teacherName=${encodeURIComponent(teacherName)}`;
    }

    const { data, code } = await getAllStudentNoticeData(url + "&");

    if (code === 200 || code === 201) {
      const hasMoreData = data.data.length > 0 && data.data.length >= 10;
      set((state) => ({
        notice: {
          ...state.notice,
          data: { ...state.notice.data, [page]: data.data },
          loading: false,
          totalPages: data.totalPages,
          totalData: data.totalData,
          hasMoreData,
        },
      }));
    } else {
      set((state) => ({
        notice: { ...state.notice, error: data.message },
      }));
    }
  } catch (error) {
    set((state) => ({
      notice: { ...state.notice, error: error.message || error },
    }));
  }
}

export const createNoticeStore = (initState = defaultInitState) =>
  createStore((set, get) => ({
    ...initState,
    initialize: async (selected = "notice") => {
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
      if (!state.notice.data[page]) {
        set({
          notice: {
            ...state.notice,
            page,
            hasMoreData: true,
            loading: true,
          },
        });
        await fetchDataAndSetState(set, get);
      } else {
        set({ notice: { ...state.notice, page } });
      }
    },
    onSelectionChange: async (selected) => set({ selected }),
    onPageSizeChange: async (pageSize) => {
      set({
        notice: {
          ...defaultInitState.notice,
          pageSize,
          loading: true,
        },
      });
      await fetchDataAndSetState(set, get);
    },
    teacherSearch: async (teacherName) => {
      set((state) => ({
        notice: {
          ...state.notice,
          teacherName: teacherName ? teacherName : null,
          page: 1,
          hasMoreData: true,
          loading: true,
        },
      }));
      await fetchDataAndSetState(set, get);
    },
    onError: (error) => set({ notice: { ...get().notice, error } }),
    noMoreData: () => set({ notice: { ...get().notice, hasMoreData: false } }),
  }));
