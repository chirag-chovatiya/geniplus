import { get, post } from "./api";
import { API } from "./constant/api-constant";

export const getAllStudentNoticeData = async (pagination) => {
  return await get(API.studentNote + pagination);
};

export async function getStudentNoticeById(id) {
  return await get(`${API.studentNote}/${id}`);
}

export async function updateStudentNoticeById(id, data) {
  return await post(API.studentNote + "/" + id, data);
}
