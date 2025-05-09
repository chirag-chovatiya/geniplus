import { sequelize } from "@/config/database";
import { DataTypes } from "sequelize";

const StudentNote = sequelize.define(
  "StudentNotice",
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
      defaultValue: "",
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



export { StudentNote };

