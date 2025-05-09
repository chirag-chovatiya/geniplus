import { get, post } from "./api";
import { API } from "./constant/api-constant";

export const getAllStudentResultData = async (pagination) => {
  return await get(API.studentResult + pagination);
};

export async function getStudentResultById(id) {
  return await get(`${API.studentResult}/${id}`);
}

export async function updateStudentResultById(id, data) {
  return await post(API.studentResult + "/" + id, data);
}
