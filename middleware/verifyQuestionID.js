const db = require("../models");
const Question = db.question;
var log4js = require('../config/log4js')
const logger = log4js.getLogger('logs');

checkValidQuestionID = (req, res, next) => {
  if(!req.params.qid){
    logger.error("Question ID is blank")
    res.status(400).send({
      message: "Question ID is blank"
    });
    return;
  }
  Question.findOne({
    where: {
      id: req.params.qid
    }
  }).then(question => {
    if (!question) {
      logger.error("Failed Invalid Question ID")
      res.status(400).send({
        message: "Failed! Invalid Question ID"
      });
      return;
    }
    next();
  });
};

const verifyQuestion = {
    checkValidQuestionID: checkValidQuestionID,
};

module.exports = verifyQuestion;
