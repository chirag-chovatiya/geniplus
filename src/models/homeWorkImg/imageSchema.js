import { sequelize } from "@/config/database";
import { DataTypes } from "sequelize";

const UserWorkImage = sequelize.define(
  "homeWorkImg",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    studentId: {
      type: DataTypes.INTEGER,
      defaultValue: null,
    },
    teacherId: {
      type: DataTypes.INTEGER,
      defaultValue: null,
    },
    studentLevel: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    imgUrl: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: false,
    },
  },
  {
    timestamps: true,
    underscored: false,
  }
);

export { UserWorkImage };
