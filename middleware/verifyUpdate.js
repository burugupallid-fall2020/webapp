var log4js = require('../config/log4js')
const logger = log4js.getLogger('logs');

checkPasswordEmail = (req, res, next) => {
    if (!/^(?=.*?[A-Z])(?=(.*[a-z]){1,})(?=(.*[\d]){1,})(?=(.*[\W]){1,})(?!.*\s).{8,}$/.test(req.body.password)) {
        logger.error("Failed! Password is Weak!")
        return res.status(400).send({
            message: "Please Check your Password, Password is took weak"
        });
    }
    if (req.body.email != req.user.email) {
        logger.error("Failed! Email cannot be updated")
        return res.status(400).send({
        message: "Email cannot be updated"
        });
    }
    next()
}

const verifyUpdate = {
    checkPasswordEmail: checkPasswordEmail,
};

module.exports = verifyUpdate;