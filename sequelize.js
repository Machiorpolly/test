const Sequelize = require("sequelize");

const database = process.env.DATABASE;
const user = process.env.USER;
const password = process.env.PASSWORD;
const host = process.env.HOST;

const sequelize = new Sequelize(database, user, password, {
  host: host,
  dialect: "mysql",
});

module.exports = sequelize;
