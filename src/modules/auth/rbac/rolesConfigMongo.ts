const db = require("../../db").default;

const roleConfigPromise = db.roles.findAll();

export default roleConfigPromise
