const db = require("../models");
const Question = db.question;
var log4js = require('../config/log4js')
const logger = log4js.getLogger('logs');

checkDelete = (req, res, next) => {
    Question.findOne({
        where: {
            id: req.params.qid
        }
    }).then(question => {
        console.log(question.userId)
        console.log(req.user.id)
        if (question.userId !== req.user.id) {
            logger.error("Unauthorised to delete the question")
            res.status(401).send({
                message: "You are not authorised to delete the question"
            });
            return;
        }
        next();
    });

};

const verifyDelete = {
    checkDelete: checkDelete,
};

module.exports = verifyDelete;
