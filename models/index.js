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
db.question = require("./question.js")(sequelize, Sequelize);
db.answer = require("./answer.js")(sequelize, Sequelize);
db.category = require("./category.js")(sequelize, Sequelize);
db.CategoryQuestions = require("./CategoryQuestion.js")(sequelize, Sequelize);
db.file = require("./file")(sequelize, Sequelize)

db.user.hasMany(db.question, { as: "Questions" });
db.question.hasMany(db.answer,{onDelete: "cascade"});

db.question.belongsTo(db.user, {
  foreignKey: "userId",
  as: "user",
});

db.question.hasMany(db.file, { onDelete: "cascade" });
db.answer.hasMany(db.file, { onDelete: "cascade" });

db.file.belongsTo(db.user, {
  foreignKey: "userId",
})

db.file.belongsTo(db.question, {
  foreignKey: "questionId",
})

db.file.belongsTo(db.answer, {
  foreignKey: "answerId",
})


db.question.belongsToMany(db.category, {through: 'CategoryQuestions',foreignKey: "questionId",onDelete: "cascade", onUpdate: "cascade"});
// db.category.belongsToMany(db.question, {through: 'CategoryQuestions',foreignKey:"categoryId",onDelete: "cascade", onUpdate:"cascade"});


db.answer.belongsTo(db.user, {
  foreignKey: "userId",
});


db.answer.belongsTo(db.question, {
  foreignKey: "questionId",
});


module.exports = db;