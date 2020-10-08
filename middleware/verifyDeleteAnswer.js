const db = require("../models");
const Answer = db.answer;

checkAnswerDelete = (req, res, next) => {
    Answer.findOne({
        where: {
            id: req.params.aid
        }
    }).then(answer => {
        console.log(answer.userId)
        if (answer.userId !== req.user.id) {
            res.status(401).send({
                message: "You are not authorised to delete the question"
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
