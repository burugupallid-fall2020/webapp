const controller = require("../controllers/userController");
const { verifySignUp, auth} = require("../middleware");
const verifyUpdate = require("../middleware/verifyUpdate");

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

  // public api 
  app.post( "/v1/user", [verifySignUp.checkDuplicateEmailorUsername],controller.signup);

};
