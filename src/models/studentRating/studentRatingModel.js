import { Op } from "sequelize";
import { StudentRating } from "./studentRatingSchema";
import { User } from "../users/userSchema";

export const createStudenRating = async (data) => {
  try {
    const createData = await StudentRating.create(data);
    return createData;
  } catch (error) {
    throw error;
  }
};

export const getAllStudenRating = async (
  userType,
  userId = null,
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
    } else if (userType === "Student") {
      const student = await User.findOne({ where: { id: userId } });
      if (student) {
        whereClause.teacherId = student.teacherId;
        whereClause.studentLevel = student.level;
      }
    }
    if (studentName) {
      whereClause.studentName = { [Op.like]: `%${studentName}%` };
    }
    if (studentLevel) {
      whereClause.studentLevel = studentLevel;
    }

    const orderClause = userType === "Student" ? [["rating", "DESC"]] : [];

    if (!page && !pageSize) {
      const getStudenRating = await StudentRating.findAll({
        where: whereClause,
        include: includeClause,
        order: orderClause,
      });
      return getStudenRating;
    }

    const getRating = await StudentRating.findAndCountAll({
      where: whereClause,
      offset,
      limit: parsedPageSize,
      include: includeClause,
      order: orderClause,
    });

    const totalPages = Math.ceil(getRating.count / parsedPageSize);

    return {
      data: getRating.rows,
      currentPage: parsedPage,
      totalPages,
      totalData: getRating.count,
    };
  } catch (error) {
    throw error;
  }
};

export const getStudenRatingById = async (ratingId) => {
  try {
    const getData = await StudentRating.findOne({ where: { id: ratingId } });
    return getData;
  } catch (error) {
    throw error;
  }
};

export const updateRatingById = async (
  ratingId,
  teacherId,
  userType,
  newData
) => {
  try {
    const findRating = await StudentRating.findOne({ where: { id: ratingId } });
    if (!findRating) return null;

    if (userType === "Teacher" && findRating.teacherId !== teacherId) {
      return;
    }
    const ratingUpdated = await findRating.update(newData);
    return ratingUpdated;
  } catch (error) {
    throw error;
  }
};
export const deleteRatingById = async function (noteId, teacherId, userType) {
  try {
    const deleteRating = await StudentRating.findOne({ where: { id: noteId } });
    if (!deleteRating) {
      return {
        success: false,
        message: "No Rating found with the provided ID",
      };
    }

    if (userType === "Teacher" && deleteRating.teacherId !== teacherId) {
      return {
        success: false,
        message: "Unauthorized: You cannot delete this rating",
      };
    }
    await deleteRating.destroy();
    return { success: true, message: "Rating Deleted successfully" };
  } catch (error) {
    throw error;
  }
};
