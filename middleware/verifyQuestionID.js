const db = require("../models");
const Question = db.question;

checkValidQuestionID = (req, res, next) => {
  if(!req.params.qid){
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
