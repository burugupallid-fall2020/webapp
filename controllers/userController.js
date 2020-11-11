const db = require("../models");
const User = db.user;
const Question = db.question;
var bcrypt = require("bcryptjs");
var SDC = require('statsd-client'),
    sdc = new SDC({port: 8125});
var logger = require('../config/winston');


exports.signup = (req, res) => {
    logger.log('signup handler began');
    sdc.increment('SignUp User Triggered');
    let timer = new Date();
    if(!req.body.first_name){
        return res.send(400).return({
            "message":"First name cannot be Empty"
        })
    }
    else if(!req.body.last_name){
        return res.send(400).return({
            "message":"last name cannot be Empty"
        })
    }
    // Save User to Database
    User.create({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8)
    }).then((user) => {
        res.status(200).send({
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            username: user.email,
            account_created: user.createdAt,
            account_updated: user.updatedAt,
        });
    })
        .catch(err => {
            res.status(500).send({ message: err.message });
        });
   sdc.timing('put.user.time', timer);
};

exports.signin = (req, res) => {
    User.findOne({
        where: {
            email: req.user.email
        }
    })
        .then(user => {
            if (!user) {
                return res.status(404).send({ message: "User Not found." });
            }
            res.status(200).send({
                id: user.id,
                first_name: user.first_name,
                last_name: user.last_name,
                username: user.email,
            });
        })
        .catch(err => {
            res.status(500).send({ message: err.message });
        });
};

exports.update = (req, res) => {
    if(!req.body.first_name){
        return res.send(400).return({
            "message":"First name cannot be Empty"
        })
    }

    else if(!req.body.last_name){
        return res.send(400).return({
            "message":"last name cannot be Empty"
        })
    }
    // Save User to Database
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


exports.getUserDetails=(req,res)=>{
    User.findByPk(req.params.id)
        .then(user => {
            if (!user) {
                return res.status(404).send({ message: "User Not found." });
            }
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


