const jsonwebtoken = require("jsonwebtoken");
import {
    logRequest,
    logError
} from '../../logger/logger'
const {
    authService,
    authByIdentificationNumberService,
    authMethodService
} = require('../services/AuthService')
const axios = require('axios')

module.exports.authAction = async function (req: any, res: any) {

    let response: any = logRequest(req)

    try {
        const authResult = await authService(req.body.email, req.body.password)

        if (authResult.status === false) {
            response.message = authResult.msg
            return res.status(422).json(response);
        }

        response.data = authResult
        return res.status(200).json(response);
    } catch (error) {
        logError(req, error)
        response.errors.push(error)
        return res.status(500).json(response);
    }

}

module.exports.authByIdentificationNumberAction = async function (req: any, res: any) {

    let response = logRequest(req)

    try {
        const authResult = await authByIdentificationNumberService(req.body.identification_number)

        if (authResult === false) {
            response.message = 'There is already a user with that ID'
            response.data = false
            return res.status(200).json(response);
        }

        if (authResult.status === false) {
            response.message = authResult.msg
            return res.status(422).json(response);
        }

        response.data = authResult
        return res.status(200).json(response);
    } catch (error) {
        logError(req, error)
        response.errors.push(error)
        return res.status(500).json(response);
    }

}