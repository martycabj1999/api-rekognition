import {
    logRequest,
    logError
} from '../../logger/logger'
const {
    readRolesService
} = require('../services/RoleService');

/**
 *
 *
 * @param {Object} req
 * @param {Object} res
 * @returns {Object}
 */
module.exports.readRolesAction = async function (req: any, res: any) {

    let response = logRequest(req)

    try {
        const roles = await readRolesService()

        response.data = roles
        return res.status(200).json(response);
    } catch (error: any) {
        logError(req, error)
        response.errors.push(error)
        return res.status(500).json(response);
    }


}
