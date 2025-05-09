import { sequelize } from "@/config/database";
import { DataTypes } from "sequelize";

const StudentReport = sequelize.define(
  "StudentReport",
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
    },
    studentId: {
      type: DataTypes.INTEGER,
      defaultValue: null,
    },
    testId: {
      type: DataTypes.INTEGER,
      defaultValue: null,
    },
    additionMark: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    subtractionMark: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    multiplicationMark: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    divisionMark: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    result: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    timeTaken: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    hwStatus: {
      type: DataTypes.BOOLEAN,
      defaultValue: 0,
    },
  },
  {
    timestamps: true,
    underscored: false,
  }
);



export { StudentReport };

