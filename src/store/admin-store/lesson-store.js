import { getAllLessonData } from "@/service/lesson-api";
import { createStore } from "zustand/vanilla";

export const defaultInitState = {
  lesson: {
    data: {},
    level:null,
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
  const { page, pageSize } = get().lesson;
  
  const teacherName = get().lesson.teacherName;
  try {
    let url = `?page=${page}&pageSize=${pageSize}`;
    if (teacherName && teacherName != "") {
      url += `&teacherName=${encodeURIComponent(teacherName)}`;
    }

    const { data, code } = await getAllLessonData(url + "&");

    if (code === 200 || code === 201) {
      const hasMoreData = data.data.length > 0 && data.data.length >= 10;
      set((state) => ({
        lesson: {
          ...state.lesson,
          data: { ...state.lesson.data, [page]: data.data },
          loading: false,
          totalPages: data.totalPages,
          totalData: data.totalData,
          hasMoreData,
        },
      }));
    } else {
      set((state) => ({
        lesson: { ...state.lesson, error: data.message },
      }));
    }
  } catch (error) {
    set((state) => ({
      lesson: { ...state.lesson, error: error.message || error },
    }));
  }
}

export const createLessonStore = (initState = defaultInitState) =>
  createStore((set, get) => ({
    ...initState,
    initialize: async (selected = "lesson") => {
      set((state) => ({
        [selected]: {
          ...state[selected],
          data: [],
          page: 1,
          hasMoreData: true,
          loading: true,
          status: null,
          level: null,
          createdAt: null,
          studentName: null,
          teacherName: null,
        },
      }));
      await fetchDataAndSetState(set, get);
    },
    changePage: async (page) => {
      const state = get();
      if (!state.lesson.data[page]) {
        set({
          lesson: { ...state.lesson, page, hasMoreData: true, loading: true },
        });
        await fetchDataAndSetState(set, get);
      } else {
        set({ lesson: { ...state.lesson, page } });
      }
    },
    onSelectionChange: async (selected) => set({ selected }),
    onPageSizeChange: async (pageSize) => {
      set({
        lesson: {
          ...defaultInitState.lesson,
          pageSize,
          loading: true,
        },
      });
      await fetchDataAndSetState(set, get);
    },
    selectedData: async (status, level, createdAt) => {
      set((state) => ({
        ...state.lesson,
        lesson: {
          ...state.lesson,
          status: status || null,
          level: level || null,
          createdAt: createdAt || null,
          
        },
      }));
      await fetchDataAndSetState(set, get);
    },
    teacherSearch: async (teacherName) => {
      set((state) => ({
        lesson: {
          ...state.lesson,
          teacherName: teacherName ? teacherName : null,
          page: 1,
          hasMoreData: true,
          loading: true,
        },
      }));
      await fetchDataAndSetState(set, get);
    },
    onError: (error) => set({ lesson: { ...get().lesson, error } }),
    noMoreData: () => set({ lesson: { ...get().lesson, hasMoreData: false } }),
  }));
