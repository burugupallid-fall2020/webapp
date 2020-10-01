checkPasswordEmail = (req, res, next) => {
    if (!/^(?=.*?[A-Z])(?=(.*[a-z]){1,})(?=(.*[\d]){1,})(?=(.*[\W]){1,})(?!.*\s).{8,}$/.test(req.body.password)) {
        return res.status(400).send({
            message: "Please Check your Password, Password is took weak"
        });
    }
    if (req.body.email != req.user.email) {
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