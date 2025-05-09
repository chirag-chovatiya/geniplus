// import { Sequelize } from 'sequelize';
// import dotenv from 'dotenv';
// dotenv.config();

// const sequelize = new Sequelize({
//   host: process.env.DB_HOST,
//   username: process.env.DB_USERNAME,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_DATABASE,
//   dialect: process.env.DB_DIALECT,
//   logging: false,
//   dialectModule: require("mysql2"),
//   benchmark: true,
// });
// const connectDb = async () => {
//   try {
//     await sequelize.authenticate();
//     console.log("Connection has been established successfully.");
//   } catch (error) {
//     console.error("Unable to connect to the database:", error);
//   }
// };

// sequelize.sync({ alter: false }).then(() => {
//   console.log('Sequelize synchronized with the database');
// }).catch((err) => {
//   console.error('Sequelize synchronization error:', err);
// });

// export { sequelize, connectDb };

import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

const sequelize = new Sequelize({
  host: process.env.DB_HOST,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  dialect: process.env.DB_DIALECT || "mysql",
  logging: false,
  dialectModule: require("mysql2"),
  benchmark: true,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  retry: {
    max: 5,
  },
});

const connectDb = async () => {
  let attempts = 0;
  const maxAttempts = 5;

  while (attempts < maxAttempts) {
    try {
      await sequelize.authenticate();
      console.log("✅ Database connected successfully.");
      return;
    } catch (error) {
      attempts++;
      console.error(
        `❌ Database connection failed (Attempt ${attempts}/${maxAttempts}):`,
        error.message
      );
      if (attempts >= maxAttempts) {
        console.error("❌ Maximum connection attempts reached. Exiting...");
        process.exit(1);
      }
      await new Promise((res) => setTimeout(res, 5000));
    }
  }
};

sequelize
  .sync({ alter: true })
  .then(() => console.log("✅ Sequelize synchronized with the database"))
  .catch((err) => console.error("❌ Sequelize synchronization error:", err));

export { sequelize, connectDb };
