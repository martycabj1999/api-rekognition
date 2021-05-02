const {
    param,
    check
} = require('express-validator');
const {
    requestValidate
} = require('../../../middleware/requestValidate');
const {
    MessageValidator
} = require('../../../../helpers/messageValidator');
const { MessageResponse } = require('../../../../helpers/messageResponse');
const bcryptjs = require('bcryptjs')
const db = require('../../../db').default

export const authActionMiddleware = requestValidate([
    check('email')
        .exists()
        .withMessage(MessageValidator.isRequired('email'))
        .custom(async (email: string, req: any) => {
            const body = req.req.body;
            const userExist = await db.users.findOne({
                where: {
                    email: body.email,
                },
            })
            if (!userExist) {
                return Promise.reject(MessageResponse.notFound('email'));
            }
        }),
    check('password')
        .exists()
        .withMessage(MessageValidator.isRequired('password'))
        .isLength({ min: 6 })
        .withMessage(MessageValidator.minLength('password', 6))
        .bail()
        .custom(async (email: string, req: any) => {
            const body = req.req.body;
            const user = await db.users.findOne({
                where: {
                    email: body.email,
                },
            })
            const validPassword = bcryptjs.compareSync(body.password, user.password);
            if (!validPassword) {
                return Promise.reject('El email o contraseña es incorrecto');
            }
        }),
]);

export const passwordActionMiddleware = requestValidate([
    check('currentPassword')
        .exists()
        .withMessage(MessageValidator.isRequired('currentPassword'))
        .isLength({ min: 6 })
        .withMessage(MessageValidator.minLength('currentPassword', 6))
        .bail()
        .custom(async (email: string, req: any) => {
            const body = req.req.body;
            const user = await db.users.findByPk(req.req.user.id)
            const validPassword = bcryptjs.compareSync(body.currentPassword, user.password);
            if (!validPassword) {
                return Promise.reject('La contraseña actual no coincide con la del sistema');
            }
        }),
    check('newPassword')
        .exists()
        .withMessage(MessageValidator.isRequired('newPassword'))
        .isLength({ min: 6 })
        .withMessage(MessageValidator.minLength('newPassword', 6))
]);

export const registerActionMiddleware = requestValidate([

    check('identification_number')
        .exists()
        .withMessage(MessageValidator.isRequired('identification_number'))
        .isNumeric(),

    check('name')
        .exists()
        .withMessage(MessageValidator.isRequired('name'))
        .isLength({ min: 2, max: 30 })
        .withMessage(MessageValidator.betweenLength('name', 2, 30)),

    check('lastname')
        .exists()
        .withMessage(MessageValidator.isRequired('lastname'))
        .isLength({ min: 2, max: 30 })
        .withMessage(MessageValidator.betweenLength('lastname', 2, 30)),
]);

export const addUserActionMiddleware = requestValidate([
    check('name')
        .exists()
        .not()
        .isEmpty()
        .withMessage(MessageValidator.isRequired('name'))
        .isLength({ min: 3, max: 50 })
        .withMessage(MessageValidator.betweenLength('name', 3, 50)),

    check('email')
        .exists()
        .not()
        .isEmpty()
        .withMessage(MessageValidator.isRequired('email'))
        .isLength({ min: 5, max: 50 })
        .withMessage(MessageValidator.betweenLength('email', 5, 50))
        .isEmail()
        .withMessage(MessageValidator.mustBeOfType('email', 'email'))
        .bail()
        .custom(async (i: any, req: any) => {
            const body = req.req.body;
            const userExist = await db.users.findOne({
                where: {
                    email: body.email,
                },
            });
            if (userExist) {
                return Promise.reject(MessageValidator.inUse('email'));
            }
        }),

    check('password')
        .exists()
        .not()
        .isEmpty()
        .withMessage(MessageValidator.isRequired('password'))
        .isLength({ min: 6, max: 30 })
        .withMessage(MessageValidator.betweenLength('password', 6, 30)),

]);

/*export const updateUserActionMiddleware = requestValidate([

    check('nickname')
        .optional()
        .isLength({ min: 3, max: 50 })
        .withMessage(MessageValidator.betweenLength('nickname', 3, 50))
        .bail()
        .custom(async (nickname: string, req: any) => {
            const nicknameExist = await User.count({
                where: {
                    nickname: nickname,
                    id: {
                        [Op.ne]: req.req.params.id,
                    },
                },
            });
            const nicknameRepeat = await User.findOne({
                where: {
                    nickname: req.req.body.nickname
                },
            });
            if (nicknameExist > 0) {
                return Promise.reject(MessageValidator.inUse('nickname'));
            }
            if (nicknameRepeat) {
                return Promise.reject(MessageValidator.inUse('nickname'));
            }
        }),
]);*/