import { get, post } from "./api";
import { API } from "./constant/api-constant";

export const getAllReportData = async (pagination) => {
  return await get(API.getReport + pagination);
};
export const getReportData = async () => {
  return await get(API.getReport);
};

export const createReportData = async (token) => {
  return await post(API.getReport + pagination);
};