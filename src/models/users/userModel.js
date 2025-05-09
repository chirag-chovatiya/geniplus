import { Op } from "sequelize";
import { User } from "./userSchema";
import { StudentReport } from "../studentReport/studentReportSchema";

export const createUser = async (data) => {
  try {
    const createData = await User.create(data);
    return createData;
  } catch (error) {
    throw error;
  }
};
export const getUserByEmail = async (email) => {
  try {
    const getData = await User.findOne({ where: { email: email } });
    return getData;
  } catch (error) {
    throw error;
  }
};
export const getAllUser = async (
  page = 1,
  pageSize = 10,
  searchQuery = null,
  level = null,
  userType,
  teacherId = null
) => {
  try {
    const parsedPage = parseInt(page);
    const parsedPageSize = parseInt(pageSize);
    const offset = (parsedPage - 1) * parsedPageSize;

    const includeClause = [
      {
        model: User,
        as: "studentTeacher",
        attributes: ["name"],
      },
    ];

    const whereClause = {};

    if (userType === "Teacher" && teacherId) {
      whereClause.teacherId = teacherId;
    }

    if (searchQuery) {
      whereClause[Op.or] = [
        { name: { [Op.like]: `%${searchQuery}%` } },
        { email: { [Op.like]: `%${searchQuery}%` } },
        { "$studentTeacher.name$": { [Op.like]: `%${searchQuery}%` } },
      ];
    }
    if (level) {
      whereClause.level = level;
    }

    if (!page && !pageSize) {
      const getUsers = await User.findAll({ include: includeClause });
      return getUsers;
    }

    const getAllData = await User.findAndCountAll({
      where: whereClause,
      include: includeClause,
      offset,
      limit: parsedPageSize,
    });

    const totalPages = Math.ceil(getAllData.count / parsedPageSize);

    return {
      data: getAllData.rows,
      currentPage: parsedPage,
      totalPages: totalPages,
      totalData: getAllData.count,
    };
  } catch (error) {
    throw error;
  }
};
export const getUserById = async (userId) => {
  try {
    const getData = await User.findOne({ where: { id: userId } });
    return getData;
  } catch (error) {
    throw error;
  }
};
export const getUserByIdWithReports = async (
  userId,
  teacherId,
  userType,
  page = 1,
  pageSize = 10,
  createdAt = null,
  hwStatus = null
) => {
  try {
    const parsedPage = parseInt(page);
    const parsedPageSize = parseInt(pageSize);
    const offset = (parsedPage - 1) * parsedPageSize;
    const userData = await User.findOne({
      where: { id: userId },
      attributes: { exclude: ["password"] },
    });

    if (!userData) {
      throw new Error("User not found");
    }

    if (userType === "Teacher" && userData.teacherId !== teacherId) {
      return;
    }

    let whereClause = {};

    if (createdAt) {
      const dateParts = createdAt.split("-");
      const filterDate = new Date(
        createdAt + (dateParts.length === 2 ? "-01" : "")
      );

      const startOfRange = new Date(
        filterDate.getFullYear(),
        filterDate.getMonth(),
        dateParts.length === 3 ? filterDate.getDate() : 1
      ).setHours(0, 0, 0, 0);
      const endOfRange = new Date(
        filterDate.getFullYear(),
        filterDate.getMonth() + (dateParts.length === 2 ? 1 : 0),
        dateParts.length === 2 ? 0 : filterDate.getDate()
      ).setHours(23, 59, 59, 999);

      whereClause.createdAt = { [Op.between]: [startOfRange, endOfRange] };
    }

    if (hwStatus === "complete") {
      whereClause.hwStatus = true;
    } else if (hwStatus === "incomplete") {
      whereClause.hwStatus = false;
    }

    const { count: totalData, rows: reports } =
      await StudentReport.findAndCountAll({
        where: {
          ...whereClause,
          studentId: userId,
        },
        attributes: [
          "id",
          "testId",
          "additionMark",
          "subtractionMark",
          "multiplicationMark",
          "divisionMark",
          "result",
          "hwStatus",
          "timeTaken",
          "createdAt",
        ],
        offset,
        limit: parsedPageSize,
      });

    const totalPages = Math.ceil(totalData / parsedPageSize);

    return {
      ...userData.toJSON(),
      reports,
      currentPage: parsedPage,
      totalPages: totalPages,
      totalData,
    };
  } catch (error) {
    console.error("Error fetching user and reports:", error);
    throw error;
  }
};
export const getTeacherNameById = async (teacherId) => {
  try {
    const teacher = await User.findOne({
      where: { id: teacherId },
    });
    if (teacher) {
      return teacher.name;
    }
    return null;
  } catch (error) {
    console.error("Error fetching teacher name:", error);
    return null;
  }
};

export const updateUserById = async (userId, teacherId, userType, newData) => {
  try {
    const findUser = await User.findOne({ where: { id: userId } });
    if (userType === "Teacher" && findUser.teacherId !== teacherId) {
      return;
    }
    if (findUser) {
      const userUpdated = await findUser.update(newData);
      return userUpdated;
    } else {
      return null;
    }
  } catch (error) {
    throw error;
  }
};
export const deleteUserById = async function (userId, teacherId, userType) {
  try {
    const deleteUser = await User.findOne({ where: { id: userId } });
    if (userType === "Teacher" && deleteUser.teacherId !== teacherId) {
      return;
    }
    if (deleteUser) {
      await deleteUser.destroy();
      return true;
    } else {
      return null;
    }
  } catch (error) {
    throw error;
  }
};

// TEACHER LIST
export const getAllTeacherUser = async (
  page = 1,
  pageSize = 10,
  searchQuery = null
) => {
  try {
    const parsedPage = parseInt(page);
    const parsedPageSize = parseInt(pageSize);
    const offset = (parsedPage - 1) * parsedPageSize;

    const whereClause = {
      user_type: "Teacher",
    };

    if (!page && !pageSize) {
      const getUsers = await User.findAll({ where: whereClause });
      return getUsers;
    }

    if (searchQuery) {
      whereClause[Op.or] = [
        { name: { [Op.like]: `%${searchQuery}%` } },
        { email: { [Op.like]: `%${searchQuery}%` } },
      ];
    }

    const getAllData = await User.findAndCountAll({
      where: whereClause,
      offset,
      limit: parsedPageSize,
    });

    const teacherData = await Promise.all(
      getAllData.rows.map(async (teacher) => ({
        ...teacher.get(),
        studentCount: await User.count({ where: { teacherId: teacher.id } }),
      }))
    );
    const totalPages = Math.ceil(getAllData.count / parsedPageSize);

    return {
      data: teacherData,
      currentPage: parsedPage,
      totalPages: totalPages,
      totalData: getAllData.count,
    };
  } catch (error) {
    throw error;
  }
};

export const getStudentsByTeacherId = async (
  teacherId,
  page = 1,
  pageSize = 10,
  searchQuery = null,
  level = null
) => {
  try {
    const parsedPage = parseInt(page);
    const parsedPageSize = parseInt(pageSize);
    const offset = (parsedPage - 1) * parsedPageSize;

    if (!teacherId) {
      throw new Error("Teacher ID is required");
    }
    const whereClause = { teacherId, user_type: "Student" };
    if (level) {
      whereClause.level = level;
    }
    if (searchQuery) {
      whereClause[Op.or] = [
        { name: { [Op.like]: `%${searchQuery}%` } },
        { email: { [Op.like]: `%${searchQuery}%` } },
      ];
    }

    const { count: totalData, rows: students } = await User.findAndCountAll({
      where: whereClause,
      attributes: [
        "id",
        "name",
        "email",
        "user_type",
        "status",
        "level",
        "createdAt",
      ],
      offset,
      limit: parsedPageSize,
    });

    const totalPages = Math.ceil(totalData / parsedPageSize);

    return {
      students,
      currentPage: parsedPage,
      totalPages,
      totalData,
    };
  } catch (error) {
    console.error("Error fetching students by teacherId:", error);
    throw error;
  }
};
