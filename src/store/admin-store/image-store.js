import { getAllImage } from "@/service/image-api";
import { createStore } from "zustand/vanilla";

export const defaultInitState = {
  userImage: {
    data: {},
    level: null,
    createdAt: null,
    studentName: null,
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
  const { page, pageSize } = get().userImage;
  const level = get().userImage.level;
  const createdAt = get().userImage.createdAt;
  const studentName = get().userImage.studentName;
  try {
    let url = `?page=${page}&pageSize=${pageSize}`;
    if (level && level != "") {
      url += `&level=${encodeURIComponent(level)}`;
    }
    if (createdAt && createdAt != "") {
      url += `&createdAt=${encodeURIComponent(createdAt)}`;
    }
    if (studentName && studentName != "") {
      url += `&studentName=${encodeURIComponent(studentName)}`;
    }
    const { data, code } = await getAllImage(url + "&");

    if (code === 200 || code === 201) {
      const hasMoreData = data.data.length > 0 && data.data.length >= 10;
      set((state) => ({
        userImage: {
          ...state.userImage,
          data: { ...state.userImage.data, [page]: data.data },
          loading: false,
          totalPages: data.totalPages,
          totalData: data.totalData,
          hasMoreData,
        },
      }));
    } else {
      set((state) => ({
        userImage: { ...state.userImage, error: data.message },
      }));
    }
  } catch (error) {
    set((state) => ({
      userImage: { ...state.userImage, error: error.message || error },
    }));
  }
}

export const createImageStore = (initState = defaultInitState) =>
  createStore((set, get) => ({
    ...initState,
    initialize: async (mode = "initialize", selected = "userImage") => {
      set((state) => ({
        [selected]: {
          ...state[selected],
          data: [],
          page: 1,
          hasMoreData: true,
          loading: true,
          level: mode === "refresh" ? null : state[selected].level,
          studentName: mode === "refresh" ? null : state[selected].studentName,
          createdAt: mode === "refresh" ? null : state[selected].createdAt,
        },
      }));
      await fetchDataAndSetState(set, get);
    },
    changePage: async (page) => {
      const state = get();
      if (!state.userImage.data[page]) {
        set({
          userImage: {
            ...state.userImage,
            page,
            hasMoreData: true,
            loading: true,
          },
        });
        await fetchDataAndSetState(set, get);
      } else {
        set({ userImage: { ...state.userImage, page } });
      }
    },
    onSelectionChange: async (selected) => set({ selected }),
    onPageSizeChange: async (pageSize) => {
      set({
        userImage: {
          ...defaultInitState.userImage,
          pageSize,
          loading: true,
        },
      });
      await fetchDataAndSetState(set, get);
    },
    selectedData: async (level, createdAt) => {
      set((state) => ({
        ...state.userImage,
        userImage: {
          ...state.userImage,
          level: level || null,
          createdAt: createdAt || null,
        },
      }));
      await fetchDataAndSetState(set, get);
    },
    search: async (studentName) => {
      set((state) => ({
        userImage: {
          ...state.userImage,
          studentName: studentName ? studentName : null,
          page: 1,
          hasMoreData: true,
          loading: true,
        },
      }));
      await fetchDataAndSetState(set, get);
    },
    onError: (error) => set({ userImage: { ...get().userImage, error } }),
    noMoreData: () =>
      set({ userImage: { ...get().userImage, hasMoreData: false } }),
  }));
