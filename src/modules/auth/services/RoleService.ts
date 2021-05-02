const {
    logError
} = require('../../logger/logger')
const {
    MessageResponse
} = require('../../../helpers/messageResponse')
const db = require("../../db").default;

/**
 * get Roles
 *
 * @export
 * @returns {Object}
 */
export async function readRolesService() {
    try {
        const roles = await db.roles.findAll()
            .then((response: any) => {
                return response
            })

        return roles
    } catch (error: any) {
        logError('readRolesService', error);
        throw (MessageResponse.serviceCatch(error))
    }
}
