const db = require("../models");
const Answer = db.answer;
var log4js = require('../config/log4js')
const logger = log4js.getLogger('logs');

checkAnswerDelete = (req, res, next) => {
    Answer.findOne({
        where: {
            id: req.params.aid
        }
    }).then(answer => {
        console.log(answer.userId)
        if (answer.userId !== req.user.id) {
            logger.error("Unauthorised to delete the answer")
            res.status(401).send({
                message: "You are not authorised to delete the answer"
            });
            return;
        }
        next();
    });
};

const verifyDeleteAnswer = {
    checkAnswerDelete: checkAnswerDelete,
};


module.exports = verifyDeleteAnswer;
