const controller = require("../controllers/userController");
const questioncontroller = require("../controllers/questionController");
const { verifySignUp, auth, verifyAnswerID, verifyDelete,verifyDeleteAnswer} = require("../middleware");
const verifyUpdate = require("../middleware/verifyUpdate");
const verifyQuestion = require("../middleware/verifyQuestionID");


module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept",
    );
    next();
  });
  // secured and authenticated api, user can siginin and update corresponding information
  app.put("/v1/user/self", [auth.BasicAuth, verifyUpdate.checkPasswordEmail],controller.update);
  app.get("/v1/user/self",[auth.BasicAuth], controller.signin);
  //create Question
  app.post("/v1/question",[auth.BasicAuth], questioncontroller.createQuestion);
  // create answer
  app.post("/v1/question/:qid/answer",[auth.BasicAuth,verifyQuestion.checkValidQuestionID], questioncontroller.createAnswer);
  // update answer
  app.put("/v1/question/:qid/answer/:aid",[auth.BasicAuth,verifyQuestion.checkValidQuestionID,verifyAnswerID.checkValidAnswerID,verifyDelete.checkDelete], questioncontroller.updateAnswer);
  // delete Answer
  app.delete("/v1/question/:qid/answer/:aid",[auth.BasicAuth,verifyQuestion.checkValidQuestionID,verifyAnswerID.checkValidAnswerID, verifyDeleteAnswer.checkAnswerDelete], questioncontroller.deleteAnswer);
  // delete Question
  app.delete("/v1/question/:qid",[auth.BasicAuth,verifyQuestion.checkValidQuestionID,verifyDelete.checkDelete], questioncontroller.deleteQuestion);
  // update Question
  app.put("/v1/question/:qid",[auth.BasicAuth,verifyQuestion.checkValidQuestionID,verifyDelete.checkDelete], questioncontroller.updateQuestion);

  // public api 
  app.post( "/v1/user", [verifySignUp.checkDuplicateEmailorUsername],controller.signup);
  app.get( "/v1/user/:id",controller.getUserDetails);
  app.get("/v1/question/:qid/answer/:aid", [verifyQuestion.checkValidQuestionID,verifyAnswerID.checkValidAnswerID],questioncontroller.getQuestionsAnswer)
  app.get("/v1/questions", questioncontroller.getAllQuestions)
  app.get("/v1/question/:qid", [verifyQuestion.checkValidQuestionID],questioncontroller.getQuestion)
};
