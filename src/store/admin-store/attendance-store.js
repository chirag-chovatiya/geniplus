import { getAllAttendanceData } from "@/service/attendance-api";
import { createStore } from "zustand/vanilla";

export const defaultInitState = {
  attendance: {
    data: {},
    status: null,
    level:null,
    createdAt:null,
    studentName:null,
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
  const { page, pageSize } = get().attendance;
  const status = get().attendance.status;
  const level = get().attendance.level;
  const createdAt = get().attendance.createdAt;
  const studentName = get().attendance.studentName;
  const teacherName = get().attendance.teacherName;
  try {
    let url = `?page=${page}&pageSize=${pageSize}`;
    if (status && status != "") {
      url += `&status=${encodeURIComponent(status)}`;
    }
    if (level && level != "") {
      url += `&level=${encodeURIComponent(level)}`;
    }
    if (createdAt && createdAt != "") {
      url += `&createdAt=${encodeURIComponent(createdAt)}`;
    }
    if (studentName && studentName != "") {
      url += `&studentName=${encodeURIComponent(studentName)}`;
    }
    if (teacherName && teacherName != "") {
      url += `&teacherName=${encodeURIComponent(teacherName)}`;
    }

    const { data, code } = await getAllAttendanceData(url + "&");

    if (code === 200 || code === 201) {
      const hasMoreData = data.data.length > 0 && data.data.length >= 10;
      set((state) => ({
        attendance: {
          ...state.attendance,
          data: { ...state.attendance.data, [page]: data.data },
          loading: false,
          totalPages: data.totalPages,
          totalData: data.totalData,
          hasMoreData,
        },
      }));
    } else {
      set((state) => ({
        attendance: { ...state.attendance, error: data.message },
      }));
    }
  } catch (error) {
    set((state) => ({
      attendance: { ...state.attendance, error: error.message || error },
    }));
  }
}

export const createAttendanceStore = (initState = defaultInitState) =>
  createStore((set, get) => ({
    ...initState,
    initialize: async (selected = "attendance") => {
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
      if (!state.attendance.data[page]) {
        set({
          attendance: { ...state.attendance, page, hasMoreData: true, loading: true },
        });
        await fetchDataAndSetState(set, get);
      } else {
        set({ attendance: { ...state.attendance, page } });
      }
    },
    onSelectionChange: async (selected) => set({ selected }),
    onPageSizeChange: async (pageSize) => {
      set({
        attendance: {
          ...defaultInitState.attendance,
          pageSize,
          loading: true,
        },
      });
      await fetchDataAndSetState(set, get);
    },
    selectedData: async (status, level, createdAt) => {
      set((state) => ({
        ...state.attendance,
        attendance: {
          ...state.attendance,
          status: status || null,
          level: level || null,
          createdAt: createdAt || null,
          
        },
      }));
      await fetchDataAndSetState(set, get);
    },
    studentSearch: async (studentName) => {
      set((state) => ({
        attendance: {
          ...state.attendance,
          studentName: studentName ? studentName : null,
          page: 1,
          hasMoreData: true,
          loading: true,
        },
      }));
      await fetchDataAndSetState(set, get);
    },
    teacherSearch: async (teacherName) => {
      set((state) => ({
        attendance: {
          ...state.attendance,
          teacherName: teacherName ? teacherName : null,
          page: 1,
          hasMoreData: true,
          loading: true,
        },
      }));
      await fetchDataAndSetState(set, get);
    },
    onError: (error) => set({ attendance: { ...get().attendance, error } }),
    noMoreData: () => set({ attendance: { ...get().attendance, hasMoreData: false } }),
  }));
