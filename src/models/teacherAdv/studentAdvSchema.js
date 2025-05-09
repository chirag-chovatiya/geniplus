import { sequelize } from "@/config/database";
import { DataTypes } from "sequelize";

const TeacherAdvertisement = sequelize.define(
  "StudentAdvertise",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: "students",
        key: "id",
      },
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      defaultValue: "",
    },
    imgUrl: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: false,
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



export { TeacherAdvertisement };

