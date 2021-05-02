const fs = require('fs-extra')
const path = require('path')
const randomString = require('../utils/randomString')
const sizeOf = require('image-size')
const {
    logError
} = require('../../logger/logger')
const {
    MessageResponse
} = require('../../../helpers/messageResponse')
const db = require("../../db").default;

export const changeAvatar = async function (userId: number, url_avatar: string, originalname: string, size: number) {
    try {
        const ext = path.extname(originalname).toLowerCase();
        // Validate Extension
        if ((ext === '.png' || ext === '.jpg' || ext === '.jpeg') || size < 5000000) {
            const user = await db.users.update({
                avatar: url_avatar
            }, {
                where: {
                    id: userId
                }
            })
            if (!user) {
                return {
                    state: false,
                    msg: 'Database error'
                }
            }
            return {
                state: true,
                msg: 'Modified Avatar',
                avatar: url_avatar
            }

        } else {
            return {
                state: false,
                msg: 'The image does not meet the requirements (size less than 5Mb, extension .png, jpeg or jpg) and / or is greater than 800 * 800'
            }
        }
    } catch (error: any) {
        logError('changeAvatar', error);
        throw (MessageResponse.serviceCatch(error))
    }
};