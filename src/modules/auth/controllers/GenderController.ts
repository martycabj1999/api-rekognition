import {
    logRequest,
    logError
} from '../../logger/logger'
const {
    getGenderService
} = require('../services/RoleService');

/**
 *
 *
 * @param {Object} req
 * @param {Object} res
 * @returns {Object}
 */
module.exports.getGenderAction = async function (req: any, res: any) {

    let response = logRequest(req)

    try {
        const gender = await getGenderService()

        response.data = gender
        return res.status(200).json(response);
    } catch (error: any) {
        logError(req, error)
        response.errors.push(error)
        return res.status(500).json(response);
    }


}
