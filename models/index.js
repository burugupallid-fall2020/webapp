const config = require("../config/database.configuration.js");
var seqUpdateNotFields = require('sequelize-noupdate-attributes');
const db = {};
const Sequelize = require("sequelize");
const sequelize = new Sequelize(
  config.DB,
  config.USER,
  config.PASSWORD,
  {
    host: config.HOST,
    dialect: config.dialect,
    operatorsAliases: false,

    pool: {
      max: config.pool.max,
      min: config.pool.min,
      acquire: config.pool.acquire,
      idle: config.pool.idle
    }
  }
);

seqUpdateNotFields(sequelize);
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.user = require("./user.js")(sequelize, Sequelize);

module.exports = db;