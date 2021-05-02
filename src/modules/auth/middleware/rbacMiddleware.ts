const rbacPromise = require('../rbac')

const rbacMiddleware = async function (req: any, res: any, next: any) {

    let user = req.user;
    const rbac = await rbacPromise()
    
    /*if (user) {
        rbac.addUserRoles(user.id, [user.role.name])
    }
    req.rbac = rbac;*/
    next();
    
}

module.exports = rbacMiddleware;