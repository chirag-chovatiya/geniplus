import { sequelize } from "@/config/database";
import { DataTypes } from "sequelize";

const Attendance = sequelize.define(
  "StudentAttendance",
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
    studentId: {
      type: DataTypes.INTEGER,
      references: {
        model: "students",
        key: "id",
      },
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("Present", "Absent"),
      allowNull: false,
      defaultValue: "Absent",
    },
  },
  {
    timestamps: true,
    underscored: false,
  }
);



export { Attendance };

