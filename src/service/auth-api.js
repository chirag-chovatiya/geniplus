import { get, post } from "./api";
import { API } from "./constant/api-constant";

export async function login(email, password) {
  return await post(API.authusers, { email, password });
}
export async function register(details) {
  return await post(API.authusers, details);
}

export async function getUserDetails(token) {
  return await get(API.authusers, token);
}

export const getAllUserData = async (pagination) => {
  return await get(API.getAllUser + pagination);
};
export const getAllTeacherData = async (pagination) => {
  return await get(API.allTeacher + pagination);
};
