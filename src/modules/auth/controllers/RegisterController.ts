const {
    logRequest
} = require('../../logger/logger')
const { registerUserService } = require('../services/RegisterUserService')
/*const {
    emailService
} = require('../services/EmailService')*/
const {
    MessageResponse
} = require('../../../helpers/messageResponse')

/**
 *
 *
 * @param {Object} req
 * @param {Object} res
 * @returns {Object}
 */
export const registerAction = async function (req: any, res: any) {

    let response = logRequest(req)

    let {
        identification_type,
        identification_number,
        name,
        lastname
    } = req.body;

    const result = await registerUserService(identification_type, identification_number, name, lastname)

    /* const sendEmail = await emailService(req.body.name,
        req.body.email) */

    response.data = result
    response.message = MessageResponse.registerSuccess()
    return res.status(201).json(response)


}
