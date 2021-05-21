const express = require('express')
const {
    authAction,
    authByIdentificationNumberAction,
    authMethodAction
} = require('./controllers/AuthController')
const {
    readRolesAction
} = require('./controllers/RoleController')
const {
    readAvatarAction,
    readUsersAction,
    getUserByIdentificationNumberAction,
    createAvatarAction,
    updatePasswordUserAction,
    getUserAction,
    imagesIdentificationAction,
} = require('./controllers/UserController')
// const {
//     recoverPasswordAction,
//     changeForgibbenPasswordAction,
//     getRestorePasswordAction
// } = require('./controllers/ResetPasswordController')
const {
    registerAction
} = require('./controllers/RegisterController')
const {
    multerI,
    multerImages
} = require('./middleware/multer')
const {
    authToken
} = require('../middleware/auth')
const {
    authActionMiddleware,
    passwordActionMiddleware,
    registerActionMiddleware,
} = require('./middleware/requests/userMiddleware')

const {
    imageAction,
} = require('./controllers/ImageController')
const router = express.Router()

//AUTH
router.post('/api/auth', authActionMiddleware, authAction)
router.post('/api/auth_identification_number', authByIdentificationNumberAction)
router.get('/api/user/roles', readRolesAction)

//USER
router.get('/api/users/admin', authToken, readUsersAction)
router.post('/api/users/create', registerActionMiddleware, registerAction)
router.put('/api/users/password', [authToken, passwordActionMiddleware], updatePasswordUserAction)
router.get('/api/users/user', authToken, getUserAction)

router.post('/api/users/image_identification', [multerImages], imagesIdentificationAction)
router.post('/api/user/image', [multerImages], imageAction)

router.get('/api/users/identification/:identification_number', [authToken], getUserByIdentificationNumberAction)
router.get('/api/users/avatar', authToken, readAvatarAction)
router.post('/api/user/avatar', [authToken, multerI], createAvatarAction)

//MAIL
// router.post('/api/recover_password', recoverPasswordAction)
// router.put('/api/restore_password/:token', changeForgibbenPasswordAction)
// router.get('/api/restore_password/:token', getRestorePasswordAction)

module.exports = router;