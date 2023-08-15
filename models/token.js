import { sequelize } from "../database/mysql.js";
import { DataTypes } from "sequelize";

const Token = sequelize.define('Token', {
  tokenName: DataTypes.STRING,
  serviceName: DataTypes.STRING
},{
  timestamps: false
})

export { Token }