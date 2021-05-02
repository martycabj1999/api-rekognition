const {
    logError
} = require('../../logger/logger')
const {
    MessageResponse
} = require('../../../helpers/messageResponse')
const db = require("../../db").default;

/**
 * get Gender
 *
 * @export
 * @returns {Object}
 */
export async function getGenderService() {
    try {
        const gender = await db.genders.findAll()
            .then((response: any) => {
                return response
            })

        return gender
    } catch (error: any) {
        logError('getGenderService', error);
        throw (MessageResponse.serviceCatch(error))
    }
}
