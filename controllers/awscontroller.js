var stream = require('stream');
const db = require("../models");
const File = db.file
const s3 = require('../config/s3.config.js');
const { v4: uuidv4 } = require('uuid');
const env = require('../config/s3.env');

exports.attachFileWithQuestion = async (req, res) => {
    if(!req.file.originalname.match(/\.(jpg|jpeg|png)$/i)) {
        return res.status(400).send("Please upload Image Files !");
    }
    
    if (!req.file.originalname) {
        return res.status(400).send({
            message: "Please attach file"
        })
    }

    if (!req.file.buffer) {
        return res.status(400).send({
            message: "Please attach file"
        })
    }

    const s3Client = s3.s3Client;
    const params = s3.uploadParams;
    params.Body = req.file.buffer;
    var UUID = uuidv4();
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
    await s3Client.upload(params, (err, file) => {
        if (err) {
            res.status(500).json({ error: "Error -> " + err });
        }
        File.findOne({
            where: {
                id: UUID,
            }
        }).then(file => {
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
    if(!req.file.originalname.match(/\.(jpg|jpeg|png)$/i)) {
        return res.status(400).send("Please upload Image Files !");
        }

    if (!req.file.originalname) {
        return res.status(400).send({
            message: "Please attach file"
        })
    }

    if (!req.file.buffer) {
        return res.status(400).send({
            message: "Please attach file"
        })
    }

    const s3Client = s3.s3Client;
    const params = s3.uploadParams;
    params.Body = req.file.buffer;
    var UUID = uuidv4();
    await File.create({
        id: UUID,
        file_name: req.file.originalname,
        s3_object_name: UUID + req.params.aid + req.file.originalname,
        questionId: req.params.qid,
        userId: req.user.id,
        answerId: req.params.aid
    }).then((file) => {
        console.log("FILE DATA POSTED SUCESSFULLY!", file)
        params.Key = file.s3_object_name;
    })
    await s3Client.upload(params, (err, data) => {
        if (err) {
            res.status(500).json({ error: "Error -> " + err });
        }
    });
    //res.json({ message: 'File uploaded successfully!!!' + JSON.stringify(data) + data.Key });
    const file_obj = await File.findOne({
        where: {
            id: UUID,
        }
    })
    res.status(201).send({
        file_id: file_obj.id,
        s3_object_name: file_obj.s3_object_name,
        file_name: file_obj.file_name,
        created_date: file_obj.createdAt
    });
}

//Delete a file from Question
exports.deleteFileFromQuestion = (req, res) => {
    const s3Client = s3.s3Client;
    File.findByPk(req.params.fid).then((file) => {
        const params = {
            Bucket: env.Bucket,
            Key: file.s3_object_name
        };
        console.log("PARAMS:", params)
        s3Client.deleteObject(params, function (err, file) {
            if (err) console.log(err, err.stack); // an error occurred
            else
                res.json({ message: 'File deleted successfully!!!' }) // successful response
        });
        File.destroy({
            where: {
                id: req.params.fid,
            }
        })
    })
}


//Delete a file from Answer
exports.deleteFileFromAnswer = (req, res) => {

    const s3Client = s3.s3Client;
    File.findByPk(req.params.fid).then((file) => {
        const params = {
            Bucket: env.Bucket,
            Key: file.s3_object_name 
        };
        console.log("PARAMS:", params)
        s3Client.deleteObject(params, function (err, data) {
            if (err) console.log(err, err.stack); 
            else
                res.json({ message: 'File deleted successfully!!!' })
        });
        File.destroy({
            where: {
                id: req.params.fid,
            }
        })
    })
}

