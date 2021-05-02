const {
    verifyEmail,
    updatePasswordAdmin
} = require('../services/UserService')
import {
    logRequest,
    logError
} from '../../logger/logger'
const {
    emailServiceResetPassword
} = require('../services/EmailService')
const jwt = require('jsonwebtoken');
const {
    JWT_SECRET
} = require('../../../../config');

/**
 * recoverPasswordAction
 *
 * @param {Object} req
 * @param {Object} res
 * @returns {Object}
 */
//I check if the password exists in Recover password
module.exports.recoverPasswordAction = async function (req: any, res: any) {

    let response = logRequest(req)

    try {
        const userMail = await verifyEmail(req.body.email)

        const user = req.body.email;

        const token = jwt.sign({
            user
        }, JWT_SECRET, {
            expiresIn: '3600s'
        });

        const sendEmail = await emailServiceResetPassword(userMail.name, req.body
            .email, token)
        response.data = userMail

        return res.status(200).json(response)
    } catch (error: any) {
        logError(req, error)
        response.errors.push(error)
        return res.status(500).json(response);
    }

}

//I update the password that was forget
module.exports.changeForgibbenPasswordAction = async function (req: any, res: any) {

    let response = logRequest(req)

    const {
        token
    } = req.params

    jwt.verify(token, JWT_SECRET, async (err: any, data: any) => {
        if (err) {
            response.message = 'The token is not valid'
            return res.status(403).json(response)
        } else {
            const userId = await verifyEmail(data.user)
            const user = await updatePasswordAdmin(userId._id, req.body.password);

            if (!user) {
                response.message = 'The user with that ID does not exist'
                return res.status(404).json(response)
            }

            response.message = 'The password was successfully modified'
            res.status(200).json(response)
        }
    });
}



module.exports.getRestorePasswordAction = async function (req: any, res: any) {

    let response = logRequest(req)

    const {
        token
    } = req.params;

    jwt.verify(token, JWT_SECRET, (err: any, data: any) => {
        if (err) {
            response.message = 'The token is not valid'
            return res.status(403).json(response)
        } else {
            // const sc = {tok: token}
            //     res.render('auth/reset-pass',{sc});
            response.message = 'The token is valid'
            return res.status(200).json(response)
        }
    });
}
