import { sequelize } from "@/config/database";
import { DataTypes } from "sequelize";

const StudentRating = sequelize.define(
  "StudentRating",
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
    studentName: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    studentLevel: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    rating: {
      type: DataTypes.INTEGER,
      defaultValue: null,
    },
  },
  {
    timestamps: true,
    underscored: false,
  }
);

export { StudentRating };
