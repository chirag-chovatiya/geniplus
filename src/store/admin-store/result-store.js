import { getAllStudentResultData } from "@/service/result-api";
import { createStore } from "zustand/vanilla";

export const defaultInitState = {
  result: {
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
  const { page, pageSize } = get().result;
  const teacherName = get().result.teacherName;
  const studentName = get().result.studentName;
  const studentLevel = get().result.studentLevel;
  try {
    let url = `?page=${page}&pageSize=${pageSize}`;
    if (teacherName && teacherName != "") {
      url += `&teacherName=${encodeURIComponent(teacherName)}`;
    }
    if (studentName && studentName != "") {
      url += `&studentName=${encodeURIComponent(studentName)}`;
    }
    if (studentLevel && studentLevel != "") {
      url += `&studentLevel=${encodeURIComponent(studentLevel)}`;
    }

    const { data, code } = await getAllStudentResultData(url + "&");

    if (code === 200 || code === 201) {
      const hasMoreData = data.data.length > 0 && data.data.length >= 10;
      set((state) => ({
        result: {
          ...state.result,
          data: { ...state.result.data, [page]: data.data },
          loading: false,
          totalPages: data.totalPages,
          totalData: data.totalData,
          hasMoreData,
        },
      }));
    } else {
      set((state) => ({
        result: { ...state.result, error: data.message },
      }));
    }
  } catch (error) {
    set((state) => ({
      result: { ...state.result, error: error.message || error },
    }));
  }
}

export const createResultStore = (initState = defaultInitState) =>
  createStore((set, get) => ({
    ...initState,
    initialize: async (selected = "result") => {
      set((state) => ({
        [selected]: {
          ...state[selected],
          data: [],
          page: 1,
          hasMoreData: true,
          loading: true,
          studentName: null,
          studentLevel: null,
        },
      }));
      await fetchDataAndSetState(set, get);
    },
    changePage: async (page) => {
      const state = get();
      if (!state.result.data[page]) {
        set({
          result: {
            ...state.result,
            page,
            hasMoreData: true,
            loading: true,
          },
        });
        await fetchDataAndSetState(set, get);
      } else {
        set({ result: { ...state.result, page } });
      }
    },
    onSelectionChange: async (selected) => set({ selected }),
    onPageSizeChange: async (pageSize) => {
      set({
        result: {
          ...defaultInitState.result,
          pageSize,
          loading: true,
        },
      });
      await fetchDataAndSetState(set, get);
    },
    teacherSearch: async (teacherName) => {
      set((state) => ({
        result: {
          ...state.result,
          teacherName: teacherName ? teacherName : null,
          page: 1,
          hasMoreData: true,
          loading: true,
        },
      }));
      await fetchDataAndSetState(set, get);
    },
    studentSearch: async (studentName) => {
      set((state) => ({
        result: {
          ...state.result,
          studentName: studentName ? studentName : null,
          page: 1,
          hasMoreData: true,
          loading: true,
        },
      }));
      await fetchDataAndSetState(set, get);
    },
    selectedData: async (studentLevel) => {
      set((state) => ({
        ...state.result,
        result: {
          ...state.result,
          studentLevel: studentLevel || null,
        },
      }));
      await fetchDataAndSetState(set, get);
    },
    onError: (error) => set({ result: { ...get().result, error } }),
    noMoreData: () => set({ result: { ...get().result, hasMoreData: false } }),
  }));
