const RBAC = require('./rbac')
const roleConfigPromise = require('./rolesConfigMongo')

const rbac = function () {

    /*return new Promise((resolve: any, reject: any) => {
        roleConfigPromise.then((roleConfig: any) => {
            resolve(new RBAC(roleConfig))
        })
    })*/
}

module.exports = rbac;
