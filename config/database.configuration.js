module.exports = {
    HOST: process.env.DBhost,
    USER: process.env.DBusername,
    PASSWORD: process.env.DBpassword,
    DB:  process.env.DBname,
    dialect: "mysql",
    dialectOptions: {
      ssl: 'Amazon RDS',
      rejectUnauthorized: true,
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  };