import { sequelize } from "@/config/database";
import { DataTypes } from "sequelize";
import { StudentReport } from "../studentReport/studentReportSchema";
import { UserWorkImage } from "../homeWorkImg/imageSchema";
import { StudentAddition } from "../addition/studentAdditionSchema";
import { Attendance } from "../studentAttendance/studentAttendanceSchema";
import { Lesson } from "../studentLesson/studentLessonSchema";
import { StudentNote } from "../notice/studentNoticeSchema";
import { TeacherAdvertisement } from "../teacherAdv/studentAdvSchema";
import { Result } from "../studentResult/studentResultSchema";
import { StudentRating } from "../studentRating/studentRatingSchema";

const User = sequelize.define(
  "students",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    teacherId: {
      type: DataTypes.INTEGER,
      defaultValue: null,
      references: {
        model: "students", 
        key: "id",
      },
      onDelete: "CASCADE", 
      onUpdate: "CASCADE", 
    },
    name: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: false,
    },
    password: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    phone_number: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    level: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    user_type: {
      type: DataTypes.ENUM("Student", "Admin", "Teacher"),
      defaultValue: null,
    },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    images: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    teacher_permission: {
      type: DataTypes.JSON,
      defaultValue: null,
    },
  },
  {
    timestamps: true,
    underscored: false,
  }
);

User.hasMany(StudentReport, {
  foreignKey: "studentId",
  as: "reports",
});
User.hasMany(StudentAddition, {
  foreignKey: "teacher_id",
  as: "teacher",
});
User.belongsTo(User, { foreignKey: "teacherId", as: "studentTeacher" });

StudentReport.belongsTo(User, {
  foreignKey: "studentId",
  as: "student",
});
StudentAddition.belongsTo(User, {
  foreignKey: "teacher_id",
  as: "teacher",
});
Attendance.belongsTo(User, {
  foreignKey: "teacherId",
  as: "teacher",
});
Attendance.belongsTo(User, {
  foreignKey: "studentId",
  as: "student",
});
Lesson.belongsTo(User, {
  foreignKey: "teacherId",
  as: "teacher",
});
UserWorkImage.belongsTo(User, {
  foreignKey: "studentId",
  as: "student",
});
StudentNote.belongsTo(User, {
  foreignKey: "teacherId",
  as: "teacher",
});
TeacherAdvertisement.belongsTo(User, {
  foreignKey: "userId",
  as: "teacher",
});
Result.belongsTo(User, {
  foreignKey: "teacherId",
  as: "teacher",
});
StudentRating.belongsTo(User, {
  foreignKey: "teacherId",
  as: "teacher",
});

export { User };
