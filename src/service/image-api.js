import { get, post } from "./api";
import { API } from "./constant/api-constant";

export const getAllImage = async (pagination) => {
  return await get(API.imageUpload + pagination);
};
