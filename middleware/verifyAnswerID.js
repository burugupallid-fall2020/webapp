const db = require("../models");
const Answer = db.answer;
var log4js = require('../config/log4js')
const logger = log4js.getLogger('logs');

checkValidAnswerID = (req, res, next) => {
  if(!req.params.aid){
    logger.error("Invalid Answer ID")
    res.status(400).send({
      message: "Answer ID is blank"
    });
    return;
  }
  Answer.findOne({
    where: {
      id: req.params.aid
    }
  }).then(question => {
    if (!question) {
      logger.error("Invalid Question ID")
      res.status(400).send({
        message: "Failed! Invalid Answer ID"
      });
      return;
    }
    next();
  });
};

const verifyAnswerID = {
  checkValidAnswerID: checkValidAnswerID,
};


module.exports = verifyAnswerID;
