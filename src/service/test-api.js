import { get, post } from "./api";
import { API } from "./constant/api-constant";

export const getAllTestData = async (pagination) => {
  return await get(API.getAllTest + pagination);
};
