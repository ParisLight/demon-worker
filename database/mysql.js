import dotenv from "dotenv";
import { Sequelize } from "sequelize";
dotenv.config();

const sequelizeOptions = {
  host: process.env.DB_HOST,
  dialect: 'mysql',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
}

export const sequelize = new Sequelize(
  process.env.DB_DB,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  sequelizeOptions
);

