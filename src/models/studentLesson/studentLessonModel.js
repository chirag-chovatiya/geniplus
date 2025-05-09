import { Lesson } from "./studentLessonSchema";
import { User } from "../users/userSchema";
import { Op } from "sequelize";

export const createLesson = async (data) => {
  try {
    const createData = await Lesson.create(data);
    return createData;
  } catch (error) {
    throw error;
  }
};
export const findLessonByStudentLevel = async (studentLevel) => {
  try {
    const lesson = await Lesson.findOne({
      where: {
        studentLevel,
        [Op.or]: [{ status: true }, { linkStatus: true }],
      },
    });
    return lesson;
  } catch (error) {
    throw error;
  }
};

export const getLessonById = async (lessonId) => {
  try {
    const getData = await Lesson.findOne({ where: { id: lessonId } });
    return getData;
  } catch (error) {
    throw error;
  }
};

export const getAllLesson = async (
  userType,
  teacherId = null,
  level = null,
  page = 1,
  pageSize = 10,
  teacherName = null
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
      whereClause.studentLevel = level;
      whereClause[Op.or] = [
        { status: true },
        { linkStatus: true }
      ];
      if (teacherId) {
        whereClause.teacherId = teacherId;
      }
    }

    if (!page && !pageSize) {
      const getStudentLesson = await Lesson.findAll({
        where: whereClause,
        include: includeClause,
      });
      return getStudentLesson;
    }

    const getLesson = await Lesson.findAndCountAll({
      where: whereClause,
      offset,
      limit: parsedPageSize,
      include: includeClause,
    });

    const totalPages = Math.ceil(getLesson.count / parsedPageSize);
    return {
      data: getLesson.rows,
      currentPage: parsedPage,
      totalPages: totalPages,
      totalData: getLesson.count,
    };
  } catch (error) {
    throw error;
  }
};

export const updateLessonById = async (
  lessonId,
  teacherId,
  userType,
  newData
) => {
  try {
    const findLesson = await Lesson.findOne({ where: { id: lessonId } });
    if (!findLesson) return null;

    if (userType === "Teacher" && findLesson.teacherId !== teacherId) {
      return;
    }
    const isActivating = newData.status === true || newData.linkStatus === true;

    if (isActivating) {
      const conflictingLesson = await Lesson.findOne({
        where: {
          teacherId,
          studentLevel: findLesson.studentLevel,
          id: { [Op.ne]: lessonId },
          [Op.or]: [{ status: true }, { linkStatus: true }],
        },
      });

      if (conflictingLesson) {
        return {
          error: `Another lesson at level ${findLesson.studentLevel} already has status set to true. Please update it first.`,
        };
      }
    }

    const lessonUpdated = await findLesson.update(newData);
    return lessonUpdated;
  } catch (error) {
    throw error;
  }
};

export const deleteLessonById = async function (lessonId, teacherId, userType) {
  try {
    const deleteLesson = await Lesson.findOne({ where: { id: lessonId } });
    if (!deleteLesson) {
      return {
        success: false,
        message: "No Lesson found with the provided ID",
      };
    }

    if (userType === "Teacher" && deleteLesson.teacherId !== teacherId) {
      return {
        success: false,
        message: "Unauthorized: You cannot delete this lesson",
      };
    }
    await deleteLesson.destroy();
    return { success: true, message: "Lesson Deleted successfully" };
  } catch (error) {
    throw error;
  }
};
