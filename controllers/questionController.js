const db = require("../models");
const Question = db.question;
const Answer = db.answer;
const Category = db.category;

// create a question
exports.createQuestion = (req, res) => {
    let categories_array = []
    if (!req.body.question_text) {
        res.status(400).send({
            "message": "Question-text cannot be blank"
        })
    }
    Question.create({
        question_text: req.body.question_text,
        userId: req.user.id,
    }).then((question) => {
        for (let i = 0; i < req.body.categories.length; i++) {
            Category.findOne({
                where: {
                    category: req.body.categories[i].category.toLowerCase()
                }
            }).then((cat) => {
                if (!cat) {
                    Category.create({
                        category: req.body.categories[i].category.toLowerCase()
                    }).then(category => {
                        categories_array.push(category)
                        question.addCategories(category)
                    })
                } else {
                    categories_array.push(cat)
                    question.addCategories(cat)
                }
            })
        }
    }).then(() => {
        Question.findOne({
            where: {
                question_text: req.body.question_text
            }
        }, {
            include: [
                {
                    model: Category,
                    required: false,
                    attributes: ["category", "id"],
                    through: { attributes: [] }
                },
                {
                    model: Answer,
                    attributes: ["answer_text"],
                }
            ]
        }).then(data => {
            setTimeout(async function () {
                res.status(201).send({
                        "question_id": data.id,
                        "created_timestamp": data.createdAt,
                        "updated_timestamp": data.updatedAt,
                        "user_id": data.userId,
                        "question_text": data.question_text,
                    categories: categories_array
                })
            },100)
        })
    }).catch(err => {
        err
    })
};


// create a answer
exports.createAnswer = (req, res,) => {
    if (!req.body.answer_text) {
        return res.status(400).send({
            "message": "Answer Text cannot be empty"
        })
    }
    Answer.create({
        answer_text: req.body.answer_text,
        questionId: req.params.qid,
        userId: req.user.id
    }).then((answer) => {
        return res.send({
            "answer_id": answer.id,
                "question_id": answer.questionId,
                "created_timestamp": answer.createdAt,
                "updated_timestamp": answer.updatedAt,
                "user_id": answer.userId,
                "answer_text": answer.answer_text
        })
    }).catch((err) => {
        err
    })
};

// update a questions answer
exports.updateAnswer = (req, res,) => {
    if (!req.body.answer_text) {
        return res.status(400).send({
            "message": "Answer Text cannot be empty"
        })
    }
  
    Answer.update({
        answer_text: req.body.answer_text
    }, {
        where: {
            id: req.params.aid,
            userId: req.user.id,
            questionId: req.params.qid
        }
    }).then((answer) => {
        if (!answer) {
            return res.send({
                message: "Update Answer"
            })
        }
        Answer.findOne({
            where: {
                id: req.params.aid,
            }
        }).then(result => {
            res.send({
                "answer_id": result.id,
                "question_id": result.questionId,
                "created_timestamp": result.createdAt,
                "updated_timestamp": result.updatedAt,
                "user_id": result.userId,
                "answer_text": result.answer_text
            });
        })
    })
        .catch(err => {
            res.status(500).send({ message: err.message });
        });
};

exports.deleteQuestion = (req, res) => {
    Answer.findOne({
        where: {
            questionId: req.params.qid
        }
    }).then(answer => {
        console.log(answer+"---------")
        if (!answer) {
            Question.destroy({
                where: {
                    id: req.params.qid
                }
            })
            res.status(201).send({
                message: "Question Deleted Successfully!!"
            });
        }
        else {
            res.status(404).send({
                msg: "Question cannot be Deleted!!"
            });
        }
    })
        .catch(err => {
            res.status(500).send({ message: err.message });
        });
};

exports.deleteAnswer = (req, res,) => {
    Answer.destroy({
        where: { id: req.params.aid }
    })
        .then(data => {
            res.send({
                message: "Answer Deleted Successfully"
            })
        });
};


exports.updateQuestion = (req, res,) => {
    if (!req.body.question_text) {
        return res.status(400).send({
            "message": "Question Text cannot be empty"
        })
    }
    Question.update({
        question_text: req.body.question_text
    }, {
        where: { id: req.params.qid }
    }, {

    }).then(() => {
        Question.findByPk(req.params.qid).then((question)=>{
            for (let i = 0; i < req.body.categories.length; i++) {
                Category.findOne({
                    where: {
                        category: req.body.categories[i].category.toLowerCase()
                    }
                }).then((cat) => {
                    if (!cat) {
                        Category.create({
                            category: req.body.categories[i].category.toLowerCase()
                        }).then(category => {
                            question.addCategories(category)
                        })
                    } else {
                        question.addCategories(cat)
                    }
                })
            }
        })
    })
        .then(data => {
                Question.findByPk(req.params.qid, {
                    include: [
                        {
                            model: Category,
                            required: false,
                            attributes: ["category", "id"],
                            through: { attributes: [] }
                        },
                        {
                            model: Answer,
                            attributes: ["answer_text","id", "createdAt","updatedAt"],
                        }
                    ]
                }).then((question) => {
                    return res.status(201).send(
                        question
                    )
                }).catch(err => {
                    err
                })
        });
};

// -------  Public Routes ----------

exports.getQuestionsAnswer = (req, res,) => {
    Answer.findOne({
        where: {
            questionId: req.params.qid,
            id: req.params.aid
        }
    }).then((answer) => {

        if (!answer) {
            return res.send({
                message: "Invalid Question ID or Answer ID"
            })
        } else {
            return res.send({
                "answer_id": answer.id,
                "question_id": answer.questionId,
                "created_timestamp": answer.createdAt,
                "updated_timestamp": answer.updatedAt,
                "user_id": answer.userId,
                "answer_text": answer.answer_text
            })
        }
    }).catch(err => {
        err
    })
};

// get all questions 
exports.getAllQuestions = (req, res,) => {
    Question.findAll({
        include: [
            {
                model: Category,
                required: false,
                attributes: ["category", "id"],
                through: { attributes: [] }
            },
            {
                model: Answer,
                attributes: ["answer_text", "id", "createdAt", "updatedAt"],
            }
        ]

    }).then((question) => {
        return res.status(201).send(
           question
        )

    }).catch(err => {
        err
    })
};

// get question by ID 
exports.getQuestion = (req, res,) => {
    Question.findByPk(req.params.qid, {
        include: [
            {
                model: Category,
                required: false,
                attributes: ["category", "id"],
                through: { attributes: [] }
            },
            {
                model: Answer,
                attributes: ["answer_text","id", "createdAt","updatedAt"],
            }
        ]
    }).then((question) => {
        return res.status(201).send(
            question
        )
    }).catch(err => {
        err
    })
};