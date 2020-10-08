module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("user", {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV1,
      primaryKey: true
    },
    first_name: {
      type: Sequelize.STRING,
      validate: {
        notEmpty: true
      }
    },
    last_name: {
      type: Sequelize.STRING,
      validate: {
        notEmpty: true
      }
    },
    email: {
      type: Sequelize.STRING,
      noUpdate: true,
      validate: {
        notEmpty: true,
        isEmail: true
      }
    },
    password: {
      type: Sequelize.STRING,
      validate: {
        notEmpty: true
      }
    }
  });
  return User;
};