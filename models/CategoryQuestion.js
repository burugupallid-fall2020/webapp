module.exports = (sequelize, Sequelize) => {
    const CategoryQuestions = sequelize.define("CategoryQuestions", {
        questionId: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV1,
            onDelete: "cascade",
            onUpdate: "cascade"
          },
          categoryId: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV1,
            onDelete: "cascade",
            onUpdate: "cascade"
          },
    });
    return CategoryQuestions;
};