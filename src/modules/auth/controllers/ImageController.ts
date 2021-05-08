import {
    logRequest,
    logError
} from '../../logger/logger'
const {
    imageService
} = require('../services/ImageService');

/**
 *
 *
 * @param {Object} req
 * @param {Object} res
 * @returns {Object}
 */
module.exports.imageAction = async function (req: any, res: any) {

    let response = logRequest(req)

    try {
        const image = await imageService()

        response.data = image
        return res.status(200).json(response);
    } catch (error: any) {
        logError(req, error)
        response.errors.push(error)
        return res.status(500).json(response);
    }


}
