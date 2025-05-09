import { get } from "./api";
import { API } from "./constant/api-constant";

export const getAllLessonData = async (pagination) => {
  return await get(API.stdLesson + pagination);
};

