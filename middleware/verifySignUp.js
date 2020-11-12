const db = require("../models");
const User = db.user;
var log4js = require('../config/log4js')
const logger = log4js.getLogger('logs');

checkDuplicateEmailorUsername = (req, res, next) => {
  
  if (!/^(?=.*?[A-Z])(?=(.*[a-z]){1,})(?=(.*[\d]){1,})(?=(.*[\W]){1,})(?!.*\s).{8,}$/.test(req.body.password)) {
    logger.error("Failed! Password is too weak")
    return res.status(400).send({
      message: "Failed! Password is too weak"
    });
  }

  if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(req.body.email)){
    logger.error("Failed! Email is Not Valid")
    return res.status(400).send({
      message: "Failed! Email is Not valid"
    });
  }

  User.findOne({
    where: {
      email: req.body.email
    }
  }).then(user => {
    if (user) {
      logger.error("Failed! Email is already in use!")
      res.status(400).send({
        message: "Failed! Email is already in use!"
      });
      return;
    }
    next();
  });
};

const verifySignUp = {
  checkDuplicateEmailorUsername: checkDuplicateEmailorUsername,
};


module.exports = verifySignUp;
