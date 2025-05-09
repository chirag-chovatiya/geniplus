import jwt from "jsonwebtoken";
export const hasPermission = (permission) => {
  const token = localStorage.getItem("t");
  if (!token) return false;

  const decoded = jwt.decode(token);
  const userType = decoded?.user_type;
  const teacherPermission = decoded?.teacher_permission;

  if (userType === "Admin" || (userType === "Teacher" && teacherPermission?.includes(permission))) {
    return true;
  }

  return false;
};
