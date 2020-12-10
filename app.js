const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const PORT = process.env.PORT || 8080;
const app = express();
const db = require("./models");
var log4js = require('./config/log4js')
const logger = log4js.getLogger('logs');

var optionOfCors = {
  origin: "http://localhost:8080"
};

// production environment database initialisation and setting. 
db.sequelize.sync().then(() => {
  logger.info("Database Sync Succesfull")
  console.log('Making the Database Resync and Drop the database');
  initial();
}).catch(err=>{err});

// app.use cross origin resource sharing 
app.use(cors(optionOfCors));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Adding the healht check on the '/' route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to CSYE6225" });
});

logger.info("Application Started Successfully")

// Import the routes
require('./routes/user.routes')(app);

// Listen on the application port
var server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
  logger.trace('App started');
  logger.info("application listening to http://%s")
});
module.exports = app
