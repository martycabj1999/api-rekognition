import {
    logRequest,
    logError
} from '../../logger/logger'
const {
    getUsers,
    getUserByIdentificationNumber,
    updatePasswordUser,
    getUser,
    updateUser,
    imagesIdentificationService,
} = require('../services/UserService')
const {
    changeAvatar
} = require('../services/CreateAvatarService')

const randomString = require('../utils/randomString')
const {
    URL_BACKEND
} = require('../../../../config')
const {
    AWS_S3_BUCKET_AVATAR_FOLDER,
    AWS_S3_BUCKET_IDENTIFICATION_FOLDER
} = require('../../../../config')
const {
    MessageResponse
} = require('../../../helpers/messageResponse')
const {
    uploadS3,
    uploadMultipleFilesS3
} = require('../../../../config/aws')

module.exports.readUsersAction = async function (req: any, res: any) {

    let response = logRequest(req)

    try {
        const users = await getUsers()

        if (users) {
            response.data = users
            return res.status(200).json(response)
        } else {
            response.message = MessageResponse.notFound()
            return res.status(400).send(response)
        }
    } catch (error: any) {
        logError(req, error)
        response.errors.push(error)
        return res.status(500).send(response)
    }

}

module.exports.getUserByIdentificationNumberAction = async function (req: any, res: any) {

    let response = logRequest(req)

    try {
        const user = await getUserByIdentificationNumber(req.params.dni)

        if (user) {
            response.data = user
            return res.status(200).json(response)
        } else {
            response.message = MessageResponse.notFound()
            return res.status(400).send(response)
        }
    } catch (error: any) {
        logError(req, error)
        response.errors.push(error)
        return res.status(500).send(response)
    }

}

module.exports.readAvatarAction = async function (req: any, res: any) {

    var urlBackend = URL_BACKEND.concat('/')

    let response = logRequest(req)

    const user = await getUser(req.user.id)
    const avatar = urlBackend.concat(user.avatar)

    try {
        if (avatar) {
            response.data = avatar
            return res.status(200).json(avatar)
        } else {
            response.message = MessageResponse.notFound()
            return res.status(400).send(response)
        }
    } catch (error: any) {
        logError(req, error)
        response.errors.push(error)
        return res.status(500).send(response)
    }

}

module.exports.createAvatarAction = async function (req: any, res: any) {

    let response = logRequest(req)

    let {
        user,
        file
    } = req

    if (!req.file) {
        response.message = MessageResponse.missingParam()
        res.status(400).send(response)
    }
    const imgUrl = randomString()
    try {
        await uploadS3(file, AWS_S3_BUCKET_AVATAR_FOLDER, async (err: any, data: any) => {
            //an error occurred while uploading the file
            if (err) {
                return response(res, 500)
            }
            const avatarResult = await changeAvatar(user.id, data.Location, file.originalname, file
                .size)

            if (!avatarResult) {
                response.message = MessageResponse.dbError()
                return res.status(400).send(response)
            }

            response.data = data.Location
            response.message = MessageResponse.isUploaded()
            return res.status(200).send(response)

        }, imgUrl)

    } catch (error: any) {
        logError(req, error)
        response.errors.push(error)
        return res.status(500).send(response)
    }
}

module.exports.updatePasswordUserAction = async function (req: any, res: any) {

    let response = logRequest(req)

    let {
        //currentPassword,
        newPassword
    } = req.body

    //I check if the user exists in the database

    try {
        let user = await updatePasswordUser(req.user.id, newPassword)

        response.data = user
        res.status(200).json(response)
    } catch (error: any) {
        logError(req, error)
        response.errors.push(error)
        return res.status(422).json(response)
    }

}

module.exports.getUserAction = async function (req: any, res: any) {
    
    let response = logRequest(req)

    try {
        let id = req.user.id
        const user = await getUser(id)
        response.data = user
        res.status(200).send(response)
    } catch (error: any) {
        logError(req, error)
        response.errors.push(error)
        return res.status(500).send(response)
    }
}

module.exports.updateUserAction = async function (req: any, res: any) {
    let response = logRequest(req)
    try {
        let {
            name,
            lastname,
            area_code,
            phone,
            email,
            occupation,
            study_level
        } = req.body

        const userUpdate = await updateUser(req.user.id, name, lastname, area_code, phone, email, occupation, study_level)
        response.data = userUpdate
        res.status(200).send(response)
    } catch (error: any) {
        logError(req, error)
        response.errors.push(error)
        res.status(500).send(response)
    }
}

module.exports.imagesIdentificationAction = async function (req: any, res: any) {
    let response = logRequest(req)
    try {

        let { user } = req

        console.log(req.files)

        await uploadMultipleFilesS3(req.files, AWS_S3_BUCKET_IDENTIFICATION_FOLDER, async (err: any, data: any) => {
            //an error occurred while uploading the file
            if (err) {
                console.log('err: =>', err)
                return err
            }

            const userUpdate = await imagesIdentificationService(user.id, data)

            response.data = data
            response.message = MessageResponse.isUploaded()

            return res.status(200).send(response)
        });
        
    } catch (error: any) {
        logError(req, error)
        response.errors.push(error)
        res.status(500).send(response)
    }
}