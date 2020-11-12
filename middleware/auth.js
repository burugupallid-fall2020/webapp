const db = require("../models");
var bcrypt = require("bcryptjs");
const User = db.user;
var log4js = require('../config/log4js')
const logger = log4js.getLogger('logs');

BasicAuth = (req, res, next) => {
    // check for basic auth header
    if (!req.headers.authorization || req.headers.authorization.indexOf('Basic ') === -1) {
        logger.error("Missing Authorisation Header")
        return res.status(401).json({ message: 'Missing Authorization Header' });
    }
    // verify auth credentials
    const base64Credentials =  req.headers.authorization.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [username, password] = credentials.split(':');

    User.findOne({
        where: {
            email: username
        }
    })
        .then(user => {
           if (!user) {
                logger.error("Invalid Authentication Credentials")
                return res.status(401).json({ message: 'Invalid Authentication Credentials' });
            }
            var passwordIsValid = bcrypt.compareSync(
                password,
                user.password
            );
            if (!passwordIsValid) {
                logger.error("Invalid Password")
                return res.status(401).send({
                    message: "Invalid Password!"
                });
            }
            req.user = user
            next()

        })
        .catch(err => {
            res.status(500).send({ message: err.message });
        });
};

const auth = {
    BasicAuth:BasicAuth,
};

module.exports = auth;