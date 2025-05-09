import { sequelize } from "@/config/database";
import { DataTypes } from "sequelize";

const Result = sequelize.define(
  "StudentResult",
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
    studentName: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    studentLevel: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    totalMarks: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    obtainedMarks: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    timestamps: true,
    underscored: false,
  }
);



export { Result };

