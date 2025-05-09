import { get, post } from "./api";
import { API } from "./constant/api-constant";

export const getAllStudentRatingData = async (pagination) => {
  return await get(API.studentRating + pagination);
};

export async function getStudentRatingById(id) {
  return await get(`${API.studentRating}/${id}`);
}

export async function updateStudentRatingById(id, data) {
  return await post(API.studentRating + "/" + id, data);
}
