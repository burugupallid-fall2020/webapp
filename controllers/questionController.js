const db = require("../models");
const s3 = require('../config/s3.config.js');
const CategoryQuestions = db.CategoryQuestions;
const Question = db.question;
const Answer = db.answer;
const Category = db.category;
const env = require('../config/s3.env');
const File = db.file
const User = db.user;
var AWS = require('aws-sdk');
var sdc = require("../config/statsdclient")
var log4js = require('../config/log4js');
const logger = log4js.getLogger('logs');

// create a question
exports.createQuestion = (req, res) => {
    logger.info('createQuestion handler started');
    sdc.increment('createquestion-counter');
    let timer = new Date();
    let categories_array = []
    if (!req.body.question_text) {
        logger.error('question text is empty');
        res.status(400).send({
            "message": "Question-text cannot be blank"
        })
    }
    let db_timer = new Date();
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
                },
                {
                    model: File,
                }
            ]
        }).then(data => {
            sdc.timing("db.create.question",db_timer)
            setTimeout(async function () {
                sdc.timing("create.question",timer)
                res.status(201).send({
                    "question_id": data.id,
                    "created_timestamp": data.createdAt,
                    "updated_timestamp": data.updatedAt,
                    "user_id": data.userId,
                    "question_text": data.question_text,
                    categories: categories_array
                })
            }, 100)
        })
        logger.info('createQuestion handler Completed');
    }).catch(err => {
        err
    })
};

// create a answer
exports.createAnswer = (req, res,) => {
    logger.info('createAnswer handler Started');
    sdc.increment('createanswer-counter');
    let timer = new Date();
    if (!req.body.answer_text) {
        logger.error('createAnswer handler began');
        return res.status(400).send({
            "message": "Answer Text cannot be empty"
        })
    }
    let db_timer = new Date();
    Answer.create({
        answer_text: req.body.answer_text,
        questionId: req.params.qid,
        userId: req.user.id
    }).then((answer) => {
        Question.findOne({where:{
            id: req.params.qid
        }}).then((question)=>{
            User.findOne({
                where:{
                    id: question.userId
                }
            }).then((user)=>{
                AWS.config.update({
                    region: "us-east-1"
                });
                // Create publish parameters
                var params = {
                    MessageStructure: 'json',
                    Message: JSON.stringify({
                        "default": JSON.stringify({
                            "question_text": question.question_text,
                            "answer_id": answer.id,
                            "question_id": answer.questionId,
                            "user_id": answer.userId,
                            "answer_text": answer.answer_text,
                            "email":user.email, 
                            "type": "created"
                        }),
                    }), /* required */
                  TopicArn: 'arn:aws:sns:us-east-1:336687597493:email_request'
                };     
                // Create promise and SNS service object
                var publishTextPromise = new AWS.SNS({apiVersion: '2010-03-31'}).publish(params).promise();
                // Handle promise's fulfilled/rejected states
                publishTextPromise.then(
                  function(data) {
                    console.log(`Message ${params.Message} sent to the topic ${params.TopicArn}`);
                    console.log("MessageID is " + data.MessageId);
                    return res.send("Success")
                  }).catch(
                    function(err) {
                    console.error(err, err.stack);
                    return res.send("Failed")
              });
            });
        })
        sdc.timing("db.create.answer",db_timer)
        logger.info('createAnswer handler Completed');
        sdc.timing("create.anwer",timer )
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
    logger.info('updateAnswer handler Started');
    sdc.increment('updateanswer-counter');
    let timer = new Date();
    if (!req.body.answer_text) {
        logger.error('update answer handler began');
        return res.status(400).send({
            "message": "Answer Text cannot be empty"
        })
    }
    let db_timer = new Date();
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
            sdc.timing("db.update.answer",db_timer)
            res.send({
                "answer_id": result.id,
                "question_id": result.questionId,
                "created_timestamp": result.createdAt,
                "updated_timestamp": result.updatedAt,
                "user_id": result.userId,
                "answer_text": result.answer_text
            });
            sdc.timing("update.anwer",timer)
            logger.info('updateAnswer handler Completed');
        })
    })
        .catch(err => {
            res.status(500).send({ message: err.message });
        });
};

exports.deleteQuestion = async (req, res) => {
    let timer = new Date();
    logger.info('deleteQuestion handler Started');
    sdc.increment('deletequestion-counter');
    let db_timer = new Date();
    Answer.findOne({
        where: {
            questionId: req.params.qid
        }
    }).then(async answer => {
        console.log(answer + "---------")
        if (!answer) {
            let s3_timer= new Date();
            const s3Client = s3.s3Client;
            const image_file = await File.findAll({
                where: {
                    questionId: req.params.qid
                }
            })
            for (i = 0; i < image_file.length; i++) {
                const file_s3name = await File.findByPk(image_file[i].id)
                const params = {
                    Bucket: env.Bucket,
                    Key: file_s3name.s3_object_name
                }
                s3Client.deleteObject(params, function (err) {
                    if (err) console.log(err, err.stack);
                });
                sdc.timing("s3.deletequestion",s3_timer)
                logger.info('object deleted from s3 bucket');
            }
            Question.destroy({
                where: {
                    id: req.params.qid
                }
            })
            sdc.timing("db.delete.question", db_timer)
            logger.info("deleteQuestion handler Completed")
            res.status(201).send({
                message: "Question Deleted Successfully!!"
            });
            sdc.timing("delete.question", timer)
        }
        else {
            logger.error("question cannot be deletred")
            res.status(404).send({
                msg: "Question cannot be Deleted!!"
            });
        }
    })
        .catch(err => {
            res.status(500).send({ message: err.message });
        });
};

exports.deleteAnswer = async (req, res,) => {
    let timer = new Date();
    logger.info('deleteAnswer handler began');
    sdc.increment('deleteanswer-counter');
    let db_timer = new Date();
    let s3_timer = new Date();
    const s3Client = s3.s3Client;
    const image_file = await File.findAll({
        where: {
            answerId: req.params.aid
        }
    })
    for (i = 0; i < image_file.length; i++) {
        const file_s3name = await File.findByPk(image_file[i].id)
        const params = {
            Bucket: env.Bucket,
            Key: file_s3name.s3_object_name
        }
        s3Client.deleteObject(params, function (err) {
            if (err) console.log(err, err.stack);
        });
    }
    logger.info('deleted from s3 bucket');
    sdc.timing("s3.deleteanswer",s3_timer)
    Answer.findOne({
        where:{
            id: req.params.aid
        }
    }).then((answer)=>{
        Question.findOne({where:{
            id: req.params.qid
        }}).then((question)=>{
            User.findOne({
                where:{
                    id: question.userId
                }
            }).then((user)=>{
                AWS.config.update({
                    region: "us-east-1"
                });
                // Create publish parameters
                var params = {
                    MessageStructure: 'json',
                    Message: JSON.stringify({
                        "default": JSON.stringify({
                            "question_text": question.question_text,
                            "answer_id": answer.id,
                            "question_id": answer.questionId,
                            "user_id": answer.userId,
                            "answer_text": answer.answer_text,
                            "email":user.email, 
                            "type": "deleted"
                        }),
                    }), /* required */
                  TopicArn: 'arn:aws:sns:us-east-1:336687597493:email_request'
                };     
                // Create promise and SNS service object
                var publishTextPromise = new AWS.SNS({apiVersion: '2010-03-31'}).publish(params).promise();
                // Handle promise's fulfilled/rejected states
                publishTextPromise.then(
                  function(data) {
                    console.log(`Message ${params.Message} sent to the topic ${params.TopicArn}`);
                    console.log("MessageID is " + data.MessageId);
                    return res.send("Success")
                  }).catch(
                    function(err) {
                    console.error(err, err.stack);
                    return res.send("Failed")
              });
            });
        })

    }).then(()=>{
        Answer.destroy({
            where: { id: req.params.aid }
        })
    })
        .then(data => {
        sdc.timing("db.deleteanswer", timer)
        logger.info("DeleteAnswer Handler Completed")
        sdc.timing("deleteanswer", timer)
            res.send({
                message: "Answer Deleted Successfully"
            })
        });
};


exports.updateQuestion = (req, res,) => {
    logger.info("updateQuestion Handler Started")
    let timer = new Date();
    sdc.increment("updatequestion-counter")
    if (!req.body.question_text) {
        logger.error("question text is empty")
        return res.status(400).send({
            "message": "Question Text cannot be empty"
        })
    }
    let db_timer = new Date();
    CategoryQuestions.destroy({
        where: { questionId: req.params.qid }
    }).then(() => {

    }).catch((err) => {
        err
    })
    Question.update({
        question_text: req.body.question_text
    }, {
        where: { id: req.params.qid }
    }, {

    }).then(() => {
        Question.findByPk(req.params.qid).then((question) => {
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
            setTimeout(async function () {
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
                            attributes: ["answer_text", "id", "createdAt", "updatedAt"],
                        },
                        {
                            model: File,
                        }
                    ]
                }).then((question) => {
                    sdc.timing("db.updatequestion", db_timer)
                    sdc.timing("updatequestion", timer)
                    logger.info("updateQuestion handler Completed")
                    return res.status(201).send(
                        question
                    )
                }).catch(err => {
                    err
                })
            }, 100);
        });
};

// -------  Public Routes ----------

exports.getQuestionsAnswer = (req, res,) => {
    logger.info("getQuestionsAnswer handler Started")
    sdc.increment("getquestionanswer-counter")
    let timer = new Date();
    let db_timer = new Date();
    Answer.findOne({
        where: {
            questionId: req.params.qid,
            id: req.params.aid
        },
        include: [
            {
                model: File
            }
        ]
    }).then((answer) => {
        sdc.timing("db.getquestionanswer", db_timer)
        if (!answer) {
            logger.error("invalid question id or answer id")
            return res.send({
                message: "Invalid Question ID or Answer ID"
            })
        } else {
            logger.info("getQuestionAnswer Handler Completed")
            sdc.timing("getquestionanswer",timer)
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
    logger.info("getAllQuestions handler started")
    sdc.increment("getallquestions-counter")
    let timer = new Date();
    let db_timer = new Date();
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
                include:[
                    {
                        model:File
                    }
                ]
            },
            {
                model: File
            }
        ]

    }).then((question) => {
        sdc.timing("db.getallquestions", db_timer)
        logger.info("getAllQuestions handler Complted")
        sdc.timing("getallquestions",timer)
        return res.status(201).send(
            question
        )
    }).catch(err => {
        err
    })
};

// get question by ID 
exports.getQuestion = (req, res,) => {
    logger.info("getQuestionID handler started")
    sdc.increment("getquestionid-counter")
    let timer = new Date();
    let db_timer = new Date();
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
                attributes: ["answer_text", "id", "createdAt", "updatedAt"],
                include:[
                    {
                        model:File
                    }
                ]
            },
            {
                model: File,
            }
        ]
    }).then((question) => {
        sdc.timing("db.getquestionbid", db_timer)
        sdc.timing("getquestionbyid",timer)
        logger.info("getquestionbyid handler completed")
        return res.status(201).send(
            question
        )
    }).catch(err => {
        err
    })
};