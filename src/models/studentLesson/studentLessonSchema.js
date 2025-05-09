import { sequelize } from "@/config/database";
import { DataTypes } from "sequelize";

const Lesson = sequelize.define(
  "StudentLesson",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    teacherId: {
      type: DataTypes.INTEGER,
      references: {
        model: "students",
        key: "id",
      },
      allowNull: false,
    },
    studentLevel: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    description: {
      type: DataTypes.TEXT,
      defaultValue: null,
    },
    excelLink: {
      type: DataTypes.TEXT,
      defaultValue: null,
    },
    linkStatus: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    timestamps: true,
    underscored: false,
  }
);



export { Lesson };

