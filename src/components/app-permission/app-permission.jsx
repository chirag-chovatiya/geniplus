import jwt from "jsonwebtoken";


export const hasTeacherPermission = (permission) => {
  try {
    const token = localStorage.getItem("t");
    if (!token) return false;

    const decoded = jwt.decode(token);
    const permissions = decoded?.teacher_permission || [];

    if (permissions.includes("AllPermission")) {
      return true;
    }

    return permissions.includes(permission);
  } catch (error) {
    console.error("Error decoding token:", error);
    return false;
  }
};
