const {
    logError
} = require('../../logger/logger')
const {
    MessageResponse
} = require('../../../helpers/messageResponse')
const db = require("../../db").default;

/**
 * post image
 *
 * @export
 * @returns {Object}
 */
export async function imageService() {
    try {

    } catch (error: any) {
        logError('imageService', error);
        throw (MessageResponse.serviceCatch(error))
    }
}
