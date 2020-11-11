const db = require("../models");
const User = db.user;
const Question = db.question;
var bcrypt = require("bcryptjs");
var sdc = require("../config/statsdclient")
var log4js = require('../config/log4js')
const logger = log4js.getLogger('logs');

exports.signup = (req, res) => {
    logger.info('signup handler began');
    sdc.increment('signup.counter');
    let timer = new Date();
    let db_timer = new Date();
    if (!req.body.first_name) {
        logger.error('Invalid FirstName');
        return res.send(400).return({
            "message": "First name cannot be Empty"
        })
    }
    else if (!req.body.last_name) {
        logger.error('Invalid Last');
        return res.send(400).return({
            "message": "last name cannot be Empty"
        })
    }
    // Save User to Database
    User.create({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8)
    }).then((user) => {
        sdc.timing('db.put.user.time', db_timer);
        res.status(200).send({
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            username: user.email,
            account_created: user.createdAt,
            account_updated: user.updatedAt,
        });
        sdc.timing('put.user.time', timer);
    })
        .catch(err => {
            res.status(500).send({ message: err.message });
        });
    logger.info('signup handler completed');
};

exports.signin = (req, res) => {
    logger.info('signin handler began');
    sdc.increment('signin.counter');
    let timer = new Date();
    let db_timer = new Date();
    User.findOne({
        where: {
            email: req.user.email
        }
    })
        .then(user => {
            sdc.timing('db.get.user.time', db_timer);
            if (!user) {
                return res.status(404).send({ message: "User Not found." });
            }
            res.status(200).send({
                id: user.id,
                first_name: user.first_name,
                last_name: user.last_name,
                username: user.email,
            });
            sdc.timing('get.user.time', timer);
        })
        .catch(err => {
            res.status(500).send({ message: err.message });
        });
    logger.info("signup handler completed")
};

exports.update = (req, res) => {
    logger.info('updateuser handler began');
    sdc.increment('update.user.counter');
    let timer = new Date();
    if (!req.body.first_name) {
        logger.error('Invalid FirstName');
        return res.send(400).return({
            "message": "First name cannot be Empty"
        })
    }

    else if (!req.body.last_name) {
        logger.error('Invalid LastName');
        return res.send(400).return({
            "message": "last name cannot be Empty"
        })
    }
    // Save User to Database
    let db_timer = new Date();
    User.update({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        password: bcrypt.hashSync(req.body.password, 8)
    }, {
        where: {
            email: req.user.email
        },
    }).then(() => {
        User.findOne({
            where: {
                email: req.user.email
            }
        }).then(user => {
            sdc.timing('db.update.user.time', db_timer);
            ssdc.timing('update.user.time', timer);
            res.send({
                firstname: user.first_name,
                last_name: user.last_name,
                email: user.email,
            });
        })
    })
        .catch(err => {
            res.status(500).send({ message: err.message });
        });
};


exports.getUserDetails = (req, res) => {
    logger.info('updateuser handler began');
    sdc.increment('update.user.counter');
    let timer = new Date();
    let dbtimer = new Date();
    User.findByPk(req.params.id)
        .then(user => {
            if (!user) {
                logger.error("Invalid User")
                return res.status(404).send({ message: "User Not found." });
            }
            sdc.timing('db.get.userid.time', db_timer);
            sdc.timing('get.userid.time', timer);
            res.status(200).send({
                id: user.id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
            });
        })
        .catch(err => {
            res.status(500).send({ message: err.message });
        });
};


