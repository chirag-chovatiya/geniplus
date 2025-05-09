import {
  generateAdditionQuestion,
  generateDivisionQuestion,
  generateMultiplicationQuestion,
  generateSubtractionQuestion,
} from "@/helper/random.service";
import { StudentAddition } from "./studentAdditionSchema";
import { User } from "../users/userSchema";
import { Op } from "sequelize";
import { createReport } from "../studentReport/studentReportModel";

export const createTest = async (data) => {
  try {
    const {
      additionSettings,
      subtractionSettings,
      multiplicationSettings,
      divisionSettings,
      totalQuestion,
      level,
      teacher_id,
    } = data;

    const questionAnswerSet = {};
    const operations = [
      {
        key: "addition",
        settings: additionSettings,
        generator: generateAdditionQuestion,
      },
      {
        key: "subtraction",
        settings: subtractionSettings,
        generator: generateSubtractionQuestion,
      },
      {
        key: "multiplication",
        settings: multiplicationSettings,
        generator: generateMultiplicationQuestion,
      },
      {
        key: "division",
        settings: divisionSettings,
        generator: generateDivisionQuestion,
      },
    ];

    for (const operation of operations) {
      const { key, settings, generator } = operation;
      const operationTotal = settings?.totalQuestion || totalQuestion;
      questionAnswerSet[key] = [];
      for (let i = 0; i < operationTotal; i++) {
        const result = generator(
          settings?.horizontalDigits,
          settings?.verticalDigits || settings?.subDigits,
          settings?.pointFlag || false
        );
        questionAnswerSet[key].push({
          question: result.question,
          answer: result.answer,
        });
      }
    }

    const updatedData = {
      ...data,
      ...questionAnswerSet,
    };

    const createData = await StudentAddition.create(updatedData);

    const students = await User.findAll({
      where: { level, teacherId: teacher_id },
    });

    const reportBulkData = students.map((student) => ({
      teacherId: teacher_id,
      studentId: student.id,
      testId: createData.id,
      additionMark: null,
      subtractionMark: null,
      multiplicationMark: null,
      divisionMark: null,
      result: "0%",
      hwStatus: false,
    }));

    await Promise.all(
      reportBulkData.map((reportData) => createReport(reportData))
    );

    return createData;
  } catch (error) {
    throw error;
  }
};
export const getAllTest = async (
  page = 1,
  pageSize = 10,
  userType,
  userId,
  teacherId = null,
  teacherName,
  level
) => {
  try {
    const parsedPage = parseInt(page);
    const parsedPageSize = parseInt(pageSize);
    const offset = (parsedPage - 1) * parsedPageSize;

    const whereCondition = {
      ...(userType === "Teacher" ? { teacher_id: userId } : {}),
      ...(userType === "Student" && teacherId
        ? { teacher_id: teacherId, status: true, level: level }
        : {}),
      ...(teacherName
        ? { "$teacher.name$": { [Op.like]: `%${teacherName}%` } }
        : {}),
    };

    const includeOptions = [
      {
        model: User,
        as: "teacher",
        attributes: ["id", "name"],
      },
    ];

    const formatTestEntry = (entry) => ({
      id: entry.id,
      teacher_id: entry.teacher_id,
      teacher_name: entry.teacher?.name || null,
      totalQuestion: entry.totalQuestion || null,
      addition: JSON.parse(entry.addition || "[]"),
      subtraction: JSON.parse(entry.subtraction || "[]"),
      multiplication: JSON.parse(entry.multiplication || "[]"),
      division: JSON.parse(entry.division || "[]"),
      level: entry.level,
      status: entry.status,
      createdAt: entry.createdAt,
      updatedAt: entry.updatedAt,
      abacusFlag: JSON.parse(entry.abacusFlag || "[]"),
      repeatFlag: entry.repeatFlag,
    });

    if (!page && !pageSize) {
      const getTest = await StudentAddition.findAll({
        where: whereCondition,
        include: includeOptions,
      });
      return getTest.map(formatTestEntry);
    }

    const { rows, count } = await StudentAddition.findAndCountAll({
      where: whereCondition,
      offset,
      limit: parsedPageSize,
      include: includeOptions,
    });

    const totalPages = Math.ceil(count / parsedPageSize);
    const pageResult = rows.map(formatTestEntry);
    return {
      data: pageResult,
      currentPage: parsedPage,
      totalPages: totalPages,
      totalData: count,
    };
  } catch (error) {
    console.log("Error in getAllTest:", error);
    throw error;
  }
};

export const findTeacherTestByUserId = async (teacher_id, level, status) => {
  try {
    const adv = await StudentAddition.findOne({
      where: {
        teacher_id,
        level,
        status,
      },
    });
    return adv;
  } catch (error) {
    throw error;
  }
};

export const getTestById = async (testId) => {
  try {
    const getData = await StudentAddition.findOne({ where: { id: testId } });

    if (!getData) return null;

    const test = getData.toJSON();

    test.addition = JSON.parse(test.addition || "[]");
    test.subtraction = JSON.parse(test.subtraction || "[]");
    test.multiplication = JSON.parse(test.multiplication || "[]");
    test.division = JSON.parse(test.division || "[]");
    test.abacusFlag = JSON.parse(test.abacusFlag || "[]");

    return test;
  } catch (error) {
    throw error;
  }
};

export const updateTestById = async (testId, newData) => {
  try {
    const findTest = await StudentAddition.findOne({ where: { id: testId } });
    if (!findTest) return null;

    const existingData = findTest.toJSON();
    const questionAnswerSet = {};

    const {
      additionSettings,
      subtractionSettings,
      multiplicationSettings,
      divisionSettings,
      totalQuestion,
    } = newData;

    const operations = [
      {
        key: "addition",
        settings: additionSettings,
        generator: generateAdditionQuestion,
      },
      {
        key: "subtraction",
        settings: subtractionSettings,
        generator: generateSubtractionQuestion,
      },
      {
        key: "multiplication",
        settings: multiplicationSettings,
        generator: generateMultiplicationQuestion,
      },
      {
        key: "division",
        settings: divisionSettings,
        generator: generateDivisionQuestion,
      },
    ];

    for (const { key, settings, generator } of operations) {
      // if no settings, skip
      if (!settings) continue;

      const operationTotal = settings.totalQuestion ?? totalQuestion ?? 0;

      // If total is 0, retain existing questions
      if (operationTotal === 0 && existingData[key]) {
        questionAnswerSet[key] = existingData[key];
        continue;
      }

      // Generate new questions
      questionAnswerSet[key] = [];
      for (let i = 0; i < operationTotal; i++) {
        const result = generator(
          settings?.horizontalDigits,
          settings?.verticalDigits || settings?.subDigits,
          settings?.pointFlag || false
        );
        questionAnswerSet[key].push({
          question: result.question,
          answer: result.answer,
        });
      }
    }

    const updatedData = { ...newData, ...questionAnswerSet };
    const testUpdated = await findTest.update(updatedData);
    return testUpdated;
  } catch (error) {
    throw error;
  }
};


// export const deleteTestById = async function (testIds) {
//   try {
//     const ids = Array.isArray(testIds) ? testIds : [testIds];

//     const deleteTests = await StudentAddition.findAll({ where: { id: ids } });

//     if (deleteTests.length > 0) {
//       await Promise.all(deleteTests.map((test) => test.destroy()));
//       return { message: `${deleteTests.length} Test(s) deleted successfully` };
//     } else {
//       return null;
//     }
//   } catch (error) {
//     throw error;
//   }
// };

export const deleteTestById = async function (testIds, teacher_id, userType) {
  try {
    const ids = Array.isArray(testIds) ? testIds : [testIds];
    const deleteTests = await StudentAddition.findOne({
      where: { id: ids },
    });
    if (!deleteTests) {
      return {
        success: false,
        message: "No Test found with the provided ID",
      };
    }
    if (userType === "Teacher" && deleteTests.teacher_id !== teacher_id) {
      return {
        success: false,
        message: "Unauthorized: You cannot delete this test",
      };
    }
    await StudentAddition.destroy({
      where: { id: ids },
    });
    return { success: true, message: "test Deleted successfully" };
  } catch (error) {
    throw error;
  }
};
