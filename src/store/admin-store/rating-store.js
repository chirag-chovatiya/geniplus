import { getAllStudentRatingData } from "@/service/rating-api";
import { createStore } from "zustand/vanilla";

export const defaultInitState = {
  rating: {
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
  const { page, pageSize } = get().rating;
  const teacherName = get().rating.teacherName;
  const studentName = get().rating.studentName;
  const studentLevel = get().rating.studentLevel;
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

    const { data, code } = await getAllStudentRatingData(url + "&");

    if (code === 200 || code === 201) {
      const hasMoreData = data.data.length > 0 && data.data.length >= 10;
      set((state) => ({
        rating: {
          ...state.rating,
          data: { ...state.rating.data, [page]: data.data },
          loading: false,
          totalPages: data.totalPages,
          totalData: data.totalData,
          hasMoreData,
        },
      }));
    } else {
      set((state) => ({
        rating: { ...state.rating, error: data.message },
      }));
    }
  } catch (error) {
    set((state) => ({
      rating: { ...state.rating, error: error.message || error },
    }));
  }
}

export const createRatingStore = (initState = defaultInitState) =>
  createStore((set, get) => ({
    ...initState,
    initialize: async (mode = "initialize", selected = "rating") => {
      set((state) => ({
        [selected]: {
          ...state[selected],
          data: [],
          page: 1,
          hasMoreData: true,
          loading: true,
          studentLevel: mode === "refresh" ? null : state[selected].studentLevel,
          studentName: mode === "refresh" ? null : state[selected].studentName,
        },
      }));
      await fetchDataAndSetState(set, get);
    },
    changePage: async (page) => {
      const state = get();
      if (!state.rating.data[page]) {
        set({
          rating: {
            ...state.rating,
            page,
            hasMoreData: true,
            loading: true,
          },
        });
        await fetchDataAndSetState(set, get);
      } else {
        set({ rating: { ...state.rating, page } });
      }
    },
    onSelectionChange: async (selected) => set({ selected }),
    onPageSizeChange: async (pageSize) => {
      set({
        rating: {
          ...defaultInitState.rating,
          pageSize,
          loading: true,
        },
      });
      await fetchDataAndSetState(set, get);
    },
    teacherSearch: async (teacherName) => {
      set((state) => ({
        rating: {
          ...state.rating,
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
        rating: {
          ...state.rating,
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
        ...state.rating,
        rating: {
          ...state.rating,
          studentLevel: studentLevel || null,
        },
      }));
      await fetchDataAndSetState(set, get);
    },
    onError: (error) => set({ rating: { ...get().rating, error } }),
    noMoreData: () => set({ rating: { ...get().rating, hasMoreData: false } }),
  }));
