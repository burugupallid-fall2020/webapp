module.exports = (sequelize, Sequelize) => {
    const File = sequelize.define("files", {
      id: {
        type: Sequelize.UUID,
        primaryKey: true
      },
      file_name: {
        type: Sequelize.STRING,
        allowNull:false,
        validate: {
          notEmpty: true,
          
        }
      },
      s3_object_name: {
        type: Sequelize.STRING,
        // allowNull:false,
        validate: {
          notEmpty: true
        }
      },
   
    });
    return File;
  };
