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

// const randomString = require('../utils/randomString')
const {
    URL_BACKEND
} = require('../../../../config')
const {
    AWS_S3_BUCKET_AVATAR_FOLDER,
    AWS_S3_BUCKET_FOLDER,
    AWS_S3_BUCKET_IDENTIFICATION_FOLDER,
    AWS_S3_ACCESS_KEY,
    AWS_S3_SECRET_KEY
} = require('../../../../config')
const {
    MessageResponse
} = require('../../../helpers/messageResponse')
const {
    uploadS3,
    uploadMultipleFilesS3
} = require('../../../../config/aws')
const AWS = require('aws-sdk');

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

const randomString = () => {
    const possible: string = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let randomNumber: string = '0';
    for (let i = 0; i < 6; i++) {
        randomNumber += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return randomNumber;
};

module.exports.imagesIdentificationAction = async function (req: any, res: any) {
    let response = logRequest(req)
    try {

        let { user } = req

        const { files } = req
        if(!files) return res.status(400).send()
        
        //Inicializamos la instancia de AWS Rekognition 
        const rekognition = new AWS.Rekognition({
            accessKeyId: AWS_S3_ACCESS_KEY,
            secretAccessKey: AWS_S3_SECRET_KEY,
            region: 'us-east-2',
            apiVersion: '2016-06-27'
        });


        const dniUrl = randomString()
        const photoUrl = randomString()


        await uploadS3(files[0], AWS_S3_BUCKET_IDENTIFICATION_FOLDER, async (err: any, data: any) => {
            //an error occurred while uploading the file

            console.log(data)
            if (err) {
                return console.error(res)
            }

            await uploadS3(files[1], AWS_S3_BUCKET_IDENTIFICATION_FOLDER, async (err: any, data: any) => {
                //an error occurred while uploading the file
                if (err) {
                    return console.error(res)
                }
    
                // Usando un FileStream para enviar a AWS
                const params = {
                    SimilarityThreshold: 0, 
                    SourceImage: {
                        S3Object: {
                            Bucket: "dev-ia-2021", 
                            Name: AWS_S3_BUCKET_IDENTIFICATION_FOLDER+'/'+dniUrl
                        }
                    }, 
                    TargetImage: {
                        S3Object: {
                            Bucket: "dev-ia-2021", 
                            Name: AWS_S3_BUCKET_IDENTIFICATION_FOLDER+'/'+photoUrl
                        }
                    }
                }

                const paramsText = {
                    Image: {
                        S3Object: {
                            Bucket: "dev-ia-2021", 
                            Name: AWS_S3_BUCKET_IDENTIFICATION_FOLDER+'/'+dniUrl
                        }
                    }
                }
    
                // Solicitamos el reconocimiento a AWS
                await rekognition.compareFaces(params, async function(err: any, data: any) {
                    if (err) console.log(err, err.stack); // an error occurred
                    else     console.log(data);

                    const texts = await rekognition.detectText(paramsText).promise();
                    const detections = texts.TextDetections.map((detects: any)=> detects.DetectedText)
    
                    let resp = {
                        face: data,
                        text: detections
                    }

                    response.data = resp
                    
                    res.status(200).send(response)
                });
    
            }, photoUrl)

        }, dniUrl)

        

    } catch (error: any) {

        console.log(error)
        logError(req, error)
        response.errors.push(error)
        res.status(500).send(response)
    }
}