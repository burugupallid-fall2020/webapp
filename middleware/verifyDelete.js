const db = require("../models");
const Question = db.question;

checkDelete = (req, res, next) => {
    Question.findOne({
        where: {
            id: req.params.qid
        }
    }).then(question => {
        console.log(question.userId)
        console.log(req.user.id)
        if (question.userId !== req.user.id) {
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
