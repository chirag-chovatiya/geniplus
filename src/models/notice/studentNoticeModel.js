import { Op } from "sequelize";
import { StudentNote } from "./studentNoticeSchema";
import { User } from "../users/userSchema";

export const createStudentNote = async (data) => {
  try {
    const createData = await StudentNote.create(data);
    return createData;
  } catch (error) {
    throw error;
  }
};
export const findNoticeByStudentLevel = async (studentLevel) => {
  try {
    const notice = await StudentNote.findOne({
      where: {
        studentLevel,
        status: true,
      },
    });
    return notice;
  } catch (error) {
    throw error;
  }
};
export const getAllStudentNote = async (
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
      if (teacherId) {
        whereClause.teacherId = teacherId;
      }
    }

    if (!page && !pageSize) {
      const getStudentNote = await StudentNote.findAll({
        where: whereClause,
        include: includeClause,
      });
      return getStudentNote;
    }

    const getNote = await StudentNote.findAndCountAll({
      where: whereClause,
      offset,
      limit: parsedPageSize,
      include: includeClause,
    });

    const totalPages = Math.ceil(getNote.count / parsedPageSize);

    return {
      data: getNote.rows,
      currentPage: parsedPage,
      totalPages,
      totalData: getNote.count,
    };
  } catch (error) {
    throw error;
  }
};

export const getStudentNoteById = async (noteId) => {
  try {
    const getData = await StudentNote.findOne({ where: { id: noteId } });
    return getData;
  } catch (error) {
    throw error;
  }
};

export const updateNoticeById = async (
  noteId,
  teacherId,
  userType,
  newData
) => {
  try {
    const findNote = await StudentNote.findOne({ where: { id: noteId } });
    if (!findNote) return null;

    if (userType === "Teacher" && findNote.teacherId !== teacherId) {
      return;
    }

    if (newData.status === true) {
      const conflictingNotice = await StudentNote.findOne({
        where: {
          teacherId,
          studentLevel: findNote.studentLevel,
          status: true,
          id: { [Op.ne]: noteId },
        },
      });

      if (conflictingNotice) {
        return {
          error: `Another Notice at level ${findNote.studentLevel} already has status set to true. Please update it first.`,
        };
      }
    }

    const lessonUpdated = await findNote.update(newData);
    return lessonUpdated;
  } catch (error) {
    throw error;
  }
};

export const deleteNoticeById = async function (noteId, teacherId, userType) {
  try {
    const deleteNotice = await StudentNote.findOne({ where: { id: noteId } });
    if (!deleteNotice) {
      return {
        success: false,
        message: "No Notice found with the provided ID",
      };
    }

    if (userType === "Teacher" && deleteNotice.teacherId !== teacherId) {
      return {
        success: false,
        message: "Unauthorized: You cannot delete this notice",
      };
    }
    await deleteNotice.destroy();
    return { success: true, message: "Notice Deleted successfully" };
  } catch (error) {
    throw error;
  }
};
