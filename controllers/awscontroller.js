const db = require("../models");
const File = db.file
const s3 = require('../config/s3.config.js');
const { v4: uuidv4 } = require('uuid');
const env = require('../config/s3.env');
var sdc = require("../config/statsdclient")
var log4js = require('../config/log4js')
const logger = log4js.getLogger('logs');

exports.attachFileWithQuestion = async (req, res) => {
    logger.info("attachFileWithQuestion handler started")
    sdc.increment("attachFilewithQuestion-counter")
    let timer = new Date();

    if (!req.file.originalname.match(/\.(jpg|jpeg|png)$/i)) {
        logger.error("Incorrect Image Format")
        return res.status(400).send("Please upload Image Files !");
    }

    if (!req.file.originalname) {
        logger.error("Error in original Name")
        return res.status(400).send({
            message: "Please attach file"
        })
    }

    if (!req.file.buffer) {
        logger.error("Error in FileBuffer")
        return res.status(400).send({
            message: "Please attach file"
        })
    }
    const s3Client = s3.s3Client;
    const params = s3.uploadParams;
    params.Body = req.file.buffer;
    var UUID = uuidv4();
    let db_timer = new Date();
    await File.create({
        id: UUID,
        file_name: req.file.originalname,
        s3_object_name: UUID + req.params.qid + req.file.originalname,
        questionId: req.params.qid,
        userId: req.user.id
    }).then((file) => {
        //console.log("FILE DATA POSTED SUCESSFULLY!", file)
        params.Key = file.s3_object_name;
    })
    let s3_timer = new Date()
    await s3Client.upload(params, (err, file) => {
        if (err) {
            res.status(500).json({ error: "Error -> " + err });
        }
        sdc.timing("s3.questionfileuploda", s3_timer)
        logger.error("File uploaded to s3 successfully")
        File.findOne({
            where: {
                id: UUID,
            }
        }).then(file => {
            sdc.timing("db.questionfileuploda", db_timer)
            sdc.timing("questionfileuploda", timer)
            return res.status(201).send({
                file_id: file.id,
                s3_object_name: file.s3_object_name,
                file_name: file.file_name,
                created_date: file.createdAt
            });
        })
    });
}

//Attach a File to Answer
exports.attachFileWithAnswer = async (req, res) => {
    logger.info("attachFileWithAnswer Handler Started")
    sdc.increment("attachFileWithAnswer-counter")
    let timer = new Date();
    if (!req.file.originalname.match(/\.(jpg|jpeg|png)$/i)) {
        logger.error("Incorrect Image Format")
        return res.status(400).send("Please upload Image Files !");
    }

    if (!req.file.originalname) {
        logger.error("Error in File.originalName")
        return res.status(400).send({
            message: "Please attach file"
        })
    }

    if (!req.file.buffer) {
        logger.info("Error in File.Buffer")
        return res.status(400).send({
            message: "Please attach file"
        })
    }
    const s3Client = s3.s3Client;
    const params = s3.uploadParams;
    params.Body = req.file.buffer;
    var UUID = uuidv4();
    let db_timer = new Date();
    await File.create({
        id: UUID,
        file_name: req.file.originalname,
        s3_object_name: UUID + req.params.aid + req.file.originalname,
        questionId: req.params.qid,
        userId: req.user.id,
        answerId: req.params.aid
    }).then((file) => {
        sdc.timing("db.attachFileWithAnswer", db_timer)
        console.log("FILE DATA POSTED SUCESSFULLY!", file)
        params.Key = file.s3_object_name;
    })
    let s3_timer = new Date();
    await s3Client.upload(params, (err, data) => {
        if (err) {
            logger.error("attachFileWithAnswer S3 Bucket Error")
            res.status(500).json({ error: "Error -> " + err });
        }
    });
    sdc.timing("s3.attachFileWithAnswer", s3_timer)
    const file_obj = await File.findOne({
        where: {
            id: UUID,
        }
    })
    sdc.timing("attachFileWithAnswer", timer)
    res.status(201).send({
        file_id: file_obj.id,
        s3_object_name: file_obj.s3_object_name,
        file_name: file_obj.file_name,
        created_date: file_obj.createdAt
    });
    logger.info("attachFileWithAnswer Handler Completed")
}

//Delete a file from Question
exports.deleteFileFromQuestion = (req, res) => {
    logger.info("deleteFileFromQuestion Handler Started")
    sdc.increment("deleteFileFromQuestion-counter")
    let timer = new Date();
    const s3Client = s3.s3Client;
    let db_timer = new Date();
    File.findByPk(req.params.fid).then((file) => {
        const params = {
            Bucket: env.Bucket,
            Key: file.s3_object_name
        };
        console.log("PARAMS:", params)
        let s3_timer = new Date();
        s3Client.deleteObject(params, function (err, file) {
            if (err) {
                logger.error("deleteFileFromQuestion S3 Bucket Error")
                console.log(err, err.stack)
            } // an error occurred
            else
                res.json({ message: 'File deleted successfully!!!' }) // successful response
        });
        sdc.timing("s3.deletefilewithanswer", s3_timer)
        File.destroy({
            where: {
                id: req.params.fid,
            }
        })
        sdc.timing("db.deletefilewithanswer", db_timer)
        sdc.timing("deletefilewithanswer", timer)
        logger.info("deleteFileFromQuestion Handler Completed")
    })
}


//Delete a file from Answer
exports.deleteFileFromAnswer = (req, res) => {
    logger.info("deleteFileFromAnswer handler Started")
    sdc.increment("deleteFileFromAnswer-counter")
    let timer = new Date();
    const s3Client = s3.s3Client;
    let db_timer = new Date();
    File.findByPk(req.params.fid).then((file) => {
        const params = {
            Bucket: env.Bucket,
            Key: file.s3_object_name
        };
        console.log("PARAMS:", params)
        let s3_timer = new Date();
        s3Client.deleteObject(params, function (err, data) {
            if (err) {
                console.log(err, err.stack)
                logger.error("deleteFileFromAnswer S3 Bucket Error")
            }
            else
                res.json({ message: 'File deleted successfully!!!' })
        });
        sdc.timing("s3.deltefilewithanswer", s3_timer)
        File.destroy({
            where: {
                id: req.params.fid,
            }
        })
        sdc.timing("db.deltefilewithanswer", db_timer)
    })
    sdc.timing("deltefilewithanswer", timer)
    logger.info("deleteFileFromAnswer handler Ended")
}

