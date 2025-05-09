import { get, post } from "./api";
import { API } from "./constant/api-constant";

export const getAllStudentAdvData = async (pagination) => {
  return await get(API.teacherAdv + pagination);
};

export async function getStudentAdvById(id) {
  return await get(`${API.teacherAdv}/${id}`);
}

export async function updateStudentAdvById(id, data) {
  return await post(API.teacherAdv + "/" + id, data);
}
