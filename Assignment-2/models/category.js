module.exports = (sequelize, Sequelize) => {
    const Category = sequelize.define("category", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV1,
        primaryKey: true,
        onDelete: "cascade",
        onUpdate: "cascade"
      },
    category: {
        type: Sequelize.STRING
      }
    });
    return Category;
};