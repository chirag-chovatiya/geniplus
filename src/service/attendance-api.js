import { get } from "./api";
import { API } from "./constant/api-constant";

export const getAllAttendanceData = async (pagination) => {
  return await get(API.attendance + pagination);
};

