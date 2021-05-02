
//const jwt = require('jsonwebtoken');
const jwt =  require('express-jwt');
require('dotenv').config()
const {
    JWT_SECRET
} = require('../../../../config')

// auth middleware
module.exports.jwtAuth = jwt({
    secret: JWT_SECRET,
    credentialsRequired: false,
    algorithms: ['sha1', 'RS256', 'HS256'],
})

module.exports.handleAuthError = function (err: any, req: any, res: any, next: any) {
    if (err.name === 'UnauthorizedError') {
        console.log(err)
        res.status(err.status).send({
            message: err.message
        })
        return;
    }
    next()
}
