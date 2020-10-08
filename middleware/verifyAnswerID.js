const db = require("../models");
const Answer = db.answer;

checkValidAnswerID = (req, res, next) => {
  if(!req.params.aid){
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
