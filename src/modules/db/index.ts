// import fs from "fs";
// import path from "path";
// const Sequelize = require("sequelize");
// const Op = Sequelize.Op;
// const operatorsAliases = Object.entries(Op).reduce(
//   (acc: any, [name, value]) => {
//     acc[`$${name}`] = value;
    
//     return acc;
//   },
//   {}
// );

// const db: any = {};
// const {
//   DBURL
// } = require('../../../config/index');

// const sequelize = new Sequelize(DBURL);

// fs.readdirSync(`${__dirname}/models`).forEach(file => {
//   const model = sequelize.import(path.join(`${__dirname}/models/`, file));
//   db[model.name] = model;
// });

// Object.keys(db).forEach(modelName => {
//   if (db[modelName].associate) {
//     db[modelName].associate(db);
//   }
// });

// db.sequelize = sequelize;
// db.Sequelize = Sequelize;
// db.Op = Op;

// sequelize.sync({
//   // force: true
// });

// export default db;
