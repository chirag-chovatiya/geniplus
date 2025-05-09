import { StudentReport } from "./studentReportSchema";
import { User } from "../users/userSchema";
import { Op } from "sequelize";
export const createReport = async (data) => {
  try {
    const parseMarks = (marks) => {
      const [obtained, total] = (marks || "0/0")
        .split("/")
        .map((val) => parseFloat(val) || 0);
      return { obtained, total };
    };

    const student = await User.findOne({
      where: { id: data.studentId },
      attributes: ["teacherId"],
    });

    const teacherId = student.teacherId;

    const existingReport = await StudentReport.findOne({
      where: { testId: data.testId, studentId: data.studentId },
    });

    let reportData = { ...data, teacherId };
    if (existingReport) {
      reportData = { ...existingReport.dataValues, ...data };
    }

    const subjectMarks = {
      additionMark: parseMarks(reportData.additionMark),
      subtractionMark: parseMarks(reportData.subtractionMark),
      multiplicationMark: parseMarks(reportData.multiplicationMark),
      divisionMark: parseMarks(reportData.divisionMark),
    };

    const totalMarks = Object.values(subjectMarks).reduce(
      (sum, subject) => sum + subject.total,
      0
    );
    const obtainedMarks = Object.values(subjectMarks).reduce(
      (sum, subject) => sum + subject.obtained,
      0
    );

    let percentage = 0;
    if (totalMarks > 0) {
      percentage = ((obtainedMarks / totalMarks) * 100).toFixed(2);
    }

    reportData.result = `${percentage}%`;

    if (existingReport) {
      const updatedReport = await existingReport.update(reportData);
      return updatedReport;
    } else {
      const createdReport = await StudentReport.create(reportData);
      return createdReport;
    }
  } catch (error) {
    console.error("Error in createReport:", error);
    throw error;
  }
};
export const getAllReport = async (
  userType,
  teacherId = null,
  page = 1,
  pageSize = 10,
  hwStatus = null,
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
      const getStudentReport = await StudentReport.findAll({
        where: whereClause,
        include: includeClause,
      });
      return getStudentReport;
    }

    if (hwStatus === "complete") {
      whereClause.hwStatus = true;
    } else if (hwStatus === "incomplete") {
      whereClause.hwStatus = false;
    }

    // if (createdAt) {
    //   const filterDate = new Date(createdAt);
    //   if (!isNaN(filterDate.getDate()) && filterDate.getDate() !== 1) {
    //     const startOfDay = new Date(createdAt).setHours(0, 0, 0, 0);
    //     const endOfDay = new Date(createdAt).setHours(23, 59, 59, 999);
    //     whereClause.createdAt = { [Op.between]: [startOfDay, endOfDay] };
    //   } else {
    //     const monthStart = new Date(
    //       filterDate.getFullYear(),
    //       filterDate.getMonth(),
    //       1
    //     ).setHours(0, 0, 0, 0);
    //     const monthEnd = new Date(
    //       filterDate.getFullYear(),
    //       filterDate.getMonth() + 1,
    //       0
    //     ).setHours(23, 59, 59, 999);
    //     whereClause.createdAt = { [Op.between]: [monthStart, monthEnd] };
    //   }
    // }

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

    const getReport = await StudentReport.findAndCountAll({
      where: whereClause,
      offset,
      limit: parsedPageSize,
      include: includeClause,
    });

    const totalPages = Math.ceil(getReport.count / parsedPageSize);
    return {
      data: getReport.rows,
      currentPage: parsedPage,
      totalPages: totalPages,
      totalData: getReport.count,
    };
  } catch (error) {
    throw error;
  }
};
export const getReportById = async (reportId) => {
  try {
    const getData = await StudentReport.findOne({ where: { id: reportId } });
    return getData;
  } catch (error) {
    throw error;
  }
};
export const updateReportById = async (reportId, updatedData) => {
  try {
    const report = await StudentReport.findOne({ where: { id: reportId } });
    if (!report) {
      return null;
    }
    const updatedReport = await report.update(updatedData);
    return updatedReport;
  } catch (error) {
    throw error;
  }
};
export const deleteReportById = async function (reportId, teacherId, userType) {
  try {
    const idsToDelete = Array.isArray(reportId) ? reportId : [reportId];
    const deleteReport = await StudentReport.findOne({
      where: { id: idsToDelete },
    });
    if (!deleteReport) {
      return {
        success: false,
        message: "No Report found with the provided ID",
      };
    }
    if (userType === "Teacher" && deleteReport.teacherId !== teacherId) {
      return {
        success: false,
        message: "Unauthorized: You cannot delete this Report",
      };
    }
    await StudentReport.destroy({
      where: { id: idsToDelete },
    });
    return { success: true, message: "Report Deleted successfully" };
  } catch (error) {
    throw error;
  }
};
