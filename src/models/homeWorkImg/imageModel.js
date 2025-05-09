import { Op } from "sequelize";
import { User } from "../users/userSchema";
import { UserWorkImage } from "./imageSchema";

export const createImage = async (data) => {
  try {
    const createData = await UserWorkImage.create(data);
    return createData;
  } catch (error) {
    throw error;
  }
};
export const getAllImage = async (
  userType,
  teacherId = null,
  page = 1,
  pageSize = 10,
  level = null,
  createdAt = null,
  studentName = null
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
    ];
    const whereClause = {};

    if (userType === "Teacher" && teacherId) {
      whereClause.teacherId = teacherId;
    }

    if (!page && !pageSize) {
      const getStudentImage = await UserWorkImage.findAll({
        include: includeClause,
      });
      return getStudentImage;
    }

    if (createdAt) {
      const filterDate = new Date(createdAt);
      if (!isNaN(filterDate.getDate()) && filterDate.getDate() !== 1) {
        const startOfDay = new Date(createdAt).setHours(0, 0, 0, 0);
        const endOfDay = new Date(createdAt).setHours(23, 59, 59, 999);
        whereClause.createdAt = { [Op.between]: [startOfDay, endOfDay] };
      } else {
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

    const { rows: images, count: totalCount } =
      await UserWorkImage.findAndCountAll({
        where: whereClause,
        offset,
        limit: parsedPageSize,
        include: includeClause,
      });

    const totalPages = Math.ceil(totalCount / parsedPageSize);

    return {
      data: images,
      currentPage: parsedPage,
      totalPages,
      totalData: totalCount,
    };
  } catch (error) {
    throw error;
  }
};
export const getImageById = async (imageId) => {
  try {
    const getData = await UserWorkImage.findOne({ where: { id: imageId } });
    return getData;
  } catch (error) {
    throw error;
  }
};

export const deleteImageById = async function (imageId, teacherId, userType) {
  try {
    const idsToDelete = Array.isArray(imageId) ? imageId : [imageId];
    const deleteImage = await UserWorkImage.findOne({
      where: { id: idsToDelete },
    });
    if (!deleteImage) {
      return {
        success: false,
        message: "No Image found with the provided ID",
      };
    }
    if (userType === "Teacher" && deleteImage.teacherId !== teacherId) {
      return {
        success: false,
        message: "Unauthorized: You cannot delete this Image",
      };
    }
    await UserWorkImage.destroy({
      where: { id: idsToDelete },
    });
    return { success: true, message: "Image Deleted successfully" };
  } catch (error) {
    throw error;
  }
};
