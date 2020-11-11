const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const PORT = process.env.PORT || 8080;
const app = express();
const db = require("./models");

var optionOfCors = {
  origin: "http://localhost:8080"
};

// development environment database initialisation and setting. 
db.sequelize.sync({force: true}).then(() => {
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

// Import the routes
require('./routes/user.routes')(app);

// Listen on the application port
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
module.exports = app
