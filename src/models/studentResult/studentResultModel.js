import { Result } from "./studentResultSchema";
import { User } from "../users/userSchema";
import { Op } from "sequelize";

export const createResult = async (data) => {
  try {
    const createData = await Result.create(data);
    return createData;
  } catch (error) {
    throw error;
  }
};
export const getResultById = async (resultId) => {
  try {
    const getData = await Result.findOne({ where: { id: resultId } });
    return getData;
  } catch (error) {
    throw error;
  }
};
export const getAllResult = async (
  userType,
  teacherId = null,
  page = 1,
  pageSize = 10,
  teacherName = null,
  studentName = null,
  studentLevel = null
) => {
  try {
    const parsedPage = parseInt(page);
    const parsedPageSize = parseInt(pageSize);
    const offset = (parsedPage - 1) * parsedPageSize;

    const includeClause = [
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
    if (studentName) {
      whereClause.studentName = { [Op.like]: `%${studentName}%` };
    }
    if (studentLevel) {
      whereClause.studentLevel = studentLevel;
    }

    if (!page && !pageSize) {
      const getStudentResult = await Result.findAll({
        where: whereClause,
        include: includeClause,
      });
      return getStudentResult;
    }
    
    const getResult = await Result.findAndCountAll({
      where: whereClause,
      offset,
      limit: parsedPageSize,
      include: includeClause,
    });

    const totalPages = Math.ceil(getResult.count / parsedPageSize);
    return {
      data: getResult.rows,
      currentPage: parsedPage,
      totalPages: totalPages,
      totalData: getResult.count,
    };
  } catch (error) {
    throw error;
  }
};
export const updateResultById = async (resultId, teacherId, userType, newData) => {
  try {
    const findResult = await Result.findOne({ where: { id: resultId } });
    if (!findResult) return null;

    if (userType === "Teacher" && findResult.teacherId !== teacherId) {
      return;
    }

    const resultUpdated = await findResult.update(newData);
    return resultUpdated;
  } catch (error) {
    throw error;
  }
};
export const deleteResultById = async function (resultId, teacherId, userType) {
  try {
    const deleteResult = await Result.findOne({ where: { id: resultId } });
    if (!deleteResult) {
      return { success: false, message: "No Result found with the provided ID" };
    }

    if (userType === "Teacher" && deleteResult.teacherId !== teacherId) {
      return { success: false, message: "Unauthorized: You cannot delete this result" };
    }
    await deleteResult.destroy();
    return { success: true, message: "Result Deleted successfully" };

  } catch (error) {
    throw error;
  }
};

