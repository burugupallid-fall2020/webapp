module.exports = (sequelize, Sequelize) => {
    const Answer = sequelize.define("answer", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV1,
        primaryKey: true,
        onDelete: "cascade"
      },
      answer_text: {
        type: Sequelize.STRING,
        validate: {
          notEmpty: true
        }
      }
    });
    return Answer;
  };