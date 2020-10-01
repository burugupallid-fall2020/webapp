
const db = require("../models");
const User = db.user;

checkDuplicateEmailorUsername = (req, res, next) => {
  if (!/^(?=.*?[A-Z])(?=(.*[a-z]){1,})(?=(.*[\d]){1,})(?=(.*[\W]){1,})(?!.*\s).{8,}$/.test(req.body.password)) {
    return res.status(400).send({
      message: "Failed! Password is too weak"
    });
  }
  User.findOne({
    where: {
      email: req.body.email
    }
  }).then(user => {
    if (user) {
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
