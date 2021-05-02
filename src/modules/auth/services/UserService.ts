const moment = require('moment');
const bcryptjs = require("bcryptjs");
const {
    MessageResponse
} = require("../../../helpers/messageResponse");
const {
    logError
} = require('../../logger/logger')
const db = require("../../db").default;

/**
 * get Users
 *
 * @export
 * @returns {Object}
 */
export async function getUsers() {
    try {
        let users = await db.users.findAll();
        if (!users) {
            throw MessageResponse.notFound();
        }
        return users;
    } catch (error: any) {
        logError('getUsers', error);
        throw (MessageResponse.serviceCatch(error))
    }
}

/**
 * Update password
 *
 * @export
 * @param {number} id
 * @param {string} currentPassword
 * @param {string} newPassword
 * @returns {Object}
 */
export async function updatePasswordUser(id: number, newPassword: string) {
    try {

        let user = await db.users.findByPk(id)
            .then(({
                dataValues
            }: any) => dataValues);

        if (!user) {
            throw MessageResponse.notFound();
        }

        //I encrypt the password and update it in the DB
        let salt = bcryptjs.genSaltSync(10);
        let hashPassword = bcryptjs.hashSync(newPassword, salt);

        await db.users.update({
            password: hashPassword,
        }, {
            where: {
                id: user.id,
            },
        });

        let userUpdate = await db.users.findByPk(id)
            .then(({
                dataValues
            }: any) => dataValues);

        return userUpdate;
    } catch (error: any) {
        logError('updatePasswordUser', error);
        throw (MessageResponse.serviceCatch(error))
    }
}

/**
 * verify Email
 *
 * @export
 * @param {string} email
 * @returns {Object}
 */
export async function verifyEmail(email: string) {
    try {
        let userMail = await db.users.findOne({
            email: email,
        })
            .then(({
                dataValues
            }: any) => dataValues);

        return userMail;

    } catch (error: any) {
        logError('verifyEmail', error);
        throw (MessageResponse.serviceCatch(error))
    }
}

/**
 * get User by ID
 *
 * @export
 * @param {number} id
 * @returns {Object}
 */
export async function getUser(id: number) {
    try {
        const user = await db.users.findByPk(id, {
            include: { all:true }
        });

        if (!user) {
            throw MessageResponse.notFound();
        }

        return user;
    } catch (error: any) {
        logError('getUser', error);
        throw (MessageResponse.serviceCatch(error))
    }
}

/**
 * get User by Dni
 *
 * @export
 * @param {number} identification_number
 * @returns {Object}
 */
export async function getUserByIdentificationNumber(identification_number: number) {
    try {
        const user = await db.users.findOne({
            where: {
                identification_number: identification_number
            }
        });

        if (!user) {
            throw MessageResponse.notFound();
        }

        return user;
    } catch (error: any) {
        logError('getUserByIdentificationNumber', error);
        throw (MessageResponse.serviceCatch(error))
    }
}

/**
 * update User
 *
 * @export
 * @param {number} id
 * @param {string} name
 * @param {string} lastname
 * @param {number} area_code
 * @param {number} phone
 * @param {string} email
 * @param {integer} occupation
 * @param {integer} study_level
 * @returns {Object}
 */
export async function updateUser(id: number, name: string, lastname: string, area_code: number, phone: number, email: string, occupation: number, study_level: number) {
    try {
        let user =  await getUser(id);

        if (!user) {
            throw MessageResponse.notFound();
        }

        await db.users.update({
            name: name ? name : user.name,
            lastname: lastname ? lastname : user.lastname,
            area_code: area_code ? area_code : user.area_code,
            phone: phone ? phone : user.phone,
            email: email ? email : user.email,
            occupation_id: occupation ? occupation : user.occupation_id,
            study_level_id: study_level ? study_level : user.study_level_id
        }, {
            where: {
                id: id,
            },
        });

        let userUpdate = await getUser(user.id);

        if (!userUpdate) {
            throw MessageResponse.notFound();
        }

        return userUpdate;
    } catch (error: any) {
        logError('updateUser', error);
        throw (MessageResponse.serviceCatch(error))
    }
}

/**
 * imagesIdentificationService
 *
 * @export
 * @param {number} id
 * @param {array} urls
 * @returns {Object}
 */
export async function imagesIdentificationService(id: number, urls: string[]) {
    try {
        let user = await getUser(id);

        if (!user) {
            throw MessageResponse.notFound();
        }

        await db.users.update({
            front_identification_image_url: urls[0],
            back_identification_image_url: urls[1],
        }, {
            where: {
                id: id,
            },
        });

        let userUpdate = await getUser(id);

        if (!userUpdate) {
            throw MessageResponse.notFound();
        }

        return userUpdate;
    } catch (error: any) {
        logError('imagesIdentificationService', error);
        throw (MessageResponse.serviceCatch(error))
    }
}

/**
 * getAgeService
 *
 * @export
 * @param {number} id
 * @returns {Object}
 */
export async function getAgeService(id: number) {
    try {
        let user = await getUser(id);

        if (!user.birth_date) {
            throw MessageResponse.notFound();
        }

        
        let now = moment().format('YYYY-MM-DD');
        let birth_date = moment(user.birth_date).format('YYYY-MM-DD');
        let diffTime = moment(now).diff(birth_date);
        let duration = moment.duration(diffTime);
        let age = duration.years()

        return age;
    } catch (error: any) {
        logError('getAgeService', error);
        throw (MessageResponse.serviceCatch(error))
    }
}