import { Op, Sequelize } from "sequelize";
import { Attendance } from "./studentAttendanceSchema";
import { User } from "../users/userSchema";

export const createAttendance = async (data) => {
  try {
    const createData = await Attendance.create(data);
    return createData;
  } catch (error) {
    throw error;
  }
};

export const checkExistingAttendance = async (studentId) => {
  try {
    const startOfDay = new Date();
    startOfDay.setUTCHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setUTCHours(23, 59, 59, 999);

    const existingAttendance = await Attendance.findOne({
      where: {
        studentId,
        createdAt: {
          [Sequelize.Op.gte]: startOfDay,
          [Sequelize.Op.lt]: endOfDay,
        },
      },
    });

    return existingAttendance;
  } catch (error) {
    throw new Error("Error checking attendance: " + error.message);
  }
};

export const updateAttendance = async (attendanceId, status) => {
  try {
    const updatedRecord = await Attendance.update(
      { status },
      { where: { id: attendanceId } }
    );
    return updatedRecord;
  } catch (error) {
    throw new Error("Error updating attendance: " + error.message);
  }
};

// export const getAllAttendance = async (
//   page = 1,
//   pageSize = 10,
//   userType,
//   userId,
//   teacherName,
//   studentName,
//   level
// ) => {
//   try {
//     const parsedPage = parseInt(page);
//     const parsedPageSize = parseInt(pageSize);
//     const offset = (parsedPage - 1) * parsedPageSize;

//     const whereCondition = {
//       ...(userType === "Teacher" ? { teacherId: userId } : {}),
//       ...(teacherName
//         ? {
//             "$teacher.name$": {
//               [Op.like]: `%${teacherName}%`,
//             },
//           }
//         : {}),
//     };
//     const includeClause = [
//       {
//         model: User,
//         as: "teacher",
//         attributes: ["id", "name"],
//       },
//       {
//         model: User,
//         as: "student",
//         attributes: ["id", "name", "level"],
//         where: {
//           ...(level ? { level } : {}),
//           ...(studentName
//             ? { name: { [Op.like]: `%${studentName}%` } }
//             : {}),
//         },
//       },
//     ];

//     if (!page && !pageSize) {
//       const getTest = await Attendance.findAll({
//         where: whereCondition,
//         include: includeClause,
//       });

//       const formattedResult = getTest.map((entry) => ({
//         id: entry.id,
//         teacherId: entry.teacherId,
//         studentId: entry.studentId,
//         teacher_name: entry.teacher ? entry.teacher.name : null,
//         student_name: entry.student ? entry.student.name : null,
//         student_level: entry.student ? entry.student.level : null,
//         status: entry.status || null,
//         createdAt: entry.createdAt,
//       }));
//       return formattedResult;
//     }

//     const { rows, count } = await Attendance.findAndCountAll({
//       where: whereCondition,
//       offset,
//       limit: parsedPageSize,
//       include: includeClause,
//     });

//     const totalPages = Math.ceil(count / parsedPageSize);
//     const pageResult = rows.map((entry) => ({
//       id: entry.id,
//       teacherId: entry.teacherId,
//       studentId: entry.studentId,
//       teacher_name: entry.teacher ? entry.teacher.name : null,
//       student_name: entry.student ? entry.student.name : null,
//       student_level: entry.student ? entry.student.level : null,
//       status: entry.status || null,
//       createdAt: entry.createdAt,
//     }));

//     return {
//       data: pageResult,
//       currentPage: parsedPage,
//       totalPages: totalPages,
//       totalData: count,
//     };
//   } catch (error) {
//     console.log("Error in getAllTest:", error);
//     throw error;
//   }
// };

export const getAllAttendance = async (
  userType,
  teacherId = null,
  page = 1,
  pageSize = 10,
  status = null,
  level = null,
  createdAt = null,
  studentName = null,
  teacherName = null
) => {
  try {
    const parsedPage = parseInt(page);
    const parsedPageSize = parseInt(pageSize);
    const offset = (parsedPage - 1) * parsedPageSize;

    const includeClause = [
      {
        model: User,
        as: "student",
        attributes: ["name", "level"],
        where: {
          ...(level && { level }),
          ...(studentName && { name: { [Op.like]: `%${studentName}%` } }),
        },
      },
      {
        model: User,
        as: "teacher",
        attributes: ["name"],
        where: {
          ...(teacherName && { name: { [Op.like]: `%${teacherName}%` } }),
        },
      },
    ];
    const whereClause = {};

    if (userType === "Teacher" && teacherId) {
      whereClause.teacherId = teacherId;
    }

    if (!page && !pageSize) {
      const getStudentAttendance = await Attendance.findAll({
        include: includeClause,
      });
      return getStudentAttendance;
    }

    if (status) {
      if (["Present", "Absent"].includes(status)) {
        whereClause.status = status;
      } else {
        throw new Error(
          "Invalid status value. Accepted values are 'Present' or 'Absent'."
        );
      }
    }

    if (createdAt) {
      const filterDate = new Date(createdAt);
      if (!isNaN(filterDate)) {
        const monthStart = new Date(
          filterDate.getFullYear(),
          filterDate.getMonth(),
          1
        ).setHours(0, 0, 0, 0);
        const monthEnd = new Date(
          filterDate.getFullYear(),
          filterDate.getMonth() + 1,
          0
        ).setHours(23, 59, 59, 999);

        whereClause.createdAt = { [Op.between]: [monthStart, monthEnd] };
      }
    }

    const getAttendance = await Attendance.findAndCountAll({
      where: whereClause,
      offset,
      limit: parsedPageSize,
      include: includeClause,
    });

    const totalPages = Math.ceil(getAttendance.count / parsedPageSize);
    return {
      data: getAttendance.rows,
      currentPage: parsedPage,
      totalPages: totalPages,
      totalData: getAttendance.count,
    };
  } catch (error) {
    throw error;
  }
};

export const getAttendanceById = async (attendanceId) => {
  try {
    const getData = await Attendance.findOne({ where: { id: attendanceId } });
    return getData;
  } catch (error) {
    throw error;
  }
};

export const deleteAttendanceById = async function (
  attendanceId,
  teacherId,
  userType
) {
  try {
    const deleteAttendance = await Attendance.findOne({
      where: { id: attendanceId },
    });
    if (!deleteAttendance) {
      return {
        success: false,
        message: "No Attendance found with the provided ID",
      };
    }

    if (userType === "Teacher" && deleteAttendance.teacherId !== teacherId) {
      return {
        success: false,
        message: "Unauthorized: You cannot delete this attendance",
      };
    }
    await deleteAttendance.destroy();
    return { success: true, message: "Attendance Deleted successfully" };
  } catch (error) {
    throw error;
  }
};
