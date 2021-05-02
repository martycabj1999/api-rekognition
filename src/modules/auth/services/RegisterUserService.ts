const bcryptjs = require("bcryptjs")
const {
    logError
} = require('../../logger/logger')
const {
    MessageResponse
} = require('../../../helpers/messageResponse')
const db = require("../../db").default;

/**
 * register user
 *
 * @export
 * @param {number} identification_type,
 * @param {number} identification_number
 * @param {string} name
 * @param {string} lastname
 * @returns {Object}
 */
export const registerUserService = async function (identification_type: number, identification_number: number, name: string, lastname: string) {
    try {

        let userExist = await db.users.findOne({
            where: {
                identification_number: identification_number
            }
        })

        if(!userExist) {
            userExist = await db.users.create({
                identification_type_id: identification_type,
                identification_number: identification_number,
                name,
                lastname,
                role_id: 2,
                active: 1
            })
                .catch((error: any) => {
                    return error
                });
        }

        return userExist
    } catch (error: any) {
        logError('registerUserService', error);
        throw (MessageResponse.serviceCatch(error))
    }

}