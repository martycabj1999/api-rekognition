const jsonwebtoken = require("jsonwebtoken");
const {
    JWT_SECRET,
    URL_BACKEND,
} = require('../../../../config');
const {
    logError
} = require('../../logger/logger')
const {
    MessageResponse
} = require('../../../helpers/messageResponse')
const db = require("../../db").default;

function generateToken(user: any, roleName: string) {
    let token = jsonwebtoken.sign({
        id: user.id,
        name: user.name,
        lastname: user.lastname,
        phone: user.phone,
        email: user.email,
        role: {
            name: roleName
        },
        avatar: user.avatar
    },
        JWT_SECRET, {
        expiresIn: '9999 years'
    }
    )
    return token
}

/**
 * auth by dni
 *
 * @export
 * @param {number} identification_number
 * @returns {Object}
 */
export const authByIdentificationNumberService = async function (identification_number: number) {
    try {
        const user = await db.users.findOne({
            where: {
                identification_number: identification_number
            }
        })

        if (user.active === 0) {
            return {
                status: false,
                msg: 'Usuario deshabilitado'
            };
        }

        const role = await db.roles.findByPk(user.role_id).then(({
            dataValues
        }: any) => (dataValues))

        const token = generateToken(user, role.name)

        return token

    } catch (error) {
        logError('authByIdentificationNumberService', error);
        return false
    }
}

/**
 * auth user
 *
 * @export
 * @param {string} email
 * @param {string} password
 * @returns {Object}
 */
export const authService = async function (email: string, password: string) {
    try {
        const user = await db.users.findOne({
            where: {
                email: email
            }
        })

        if (user.active === 0) {
            return {
                status: false,
                msg: 'Usuario deshabilitado'
            };
        }

        const role = await db.roles.findByPk(user.role_id).then(({
            dataValues
        }: any) => (dataValues))

        const token = generateToken(user, role.name)

        return token
    } catch (error) {
        logError('authService', error);
        throw (MessageResponse.serviceCatch(error))
    }
}