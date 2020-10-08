const auth = require("./auth");
const verifySignUp = require("./verifySignUp");
const verifyUpdate = require("./verifyUpdate");
const verifyAnswerID = require("./verifyAnswerID");
const verifyQuestion = require("./verifyQuestionID");
const verifyDelete = require("./verifyDelete");
const verifyDeleteAnswer = require("./verifyDeleteAnswer") 

module.exports = {
  auth,
  verifySignUp,
  verifyUpdate,
  verifyQuestion,
  verifyAnswerID,
  verifyDelete,
  verifyDeleteAnswer 
};