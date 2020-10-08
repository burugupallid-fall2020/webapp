module.exports = (sequelize, Sequelize) => {
    const Question = sequelize.define("question", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV1,
        primaryKey: true,
        onDelete: "cascade",
        onUpdate: "cascade"
      },
      question_text: {
        type: Sequelize.STRING,
        validate: {
          notEmpty: true
        }
      }
    });
    return Question;
  };