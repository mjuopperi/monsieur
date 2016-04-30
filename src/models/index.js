// Workaround for pg storing bigints as strings by default.
// Sequelize will use the pg instance required here.
// https://github.com/sequelize/sequelize/issues/1774
require('pg').defaults.parseInt8 = true
var fs = require('fs');
var path = require('path');
var Sequelize = require('sequelize');
var env = require('../util/env');

var createDatabase = () => {
  return new Sequelize(env.db.database, env.db.user, env.db.password, {
    host: env.db.host,
    port: env.db.port,
    dialect: 'postgres',
    pool: {
      max: 5,
      min: 0,
      idle: 10000
    },
    define: {
      timestamps: false
    },
    logging: false
  });
}

var addModels = (db, sequelize) => {
  fs.readdirSync(__dirname)
    .filter(file => file != 'index.js')
    .forEach(file => {
      var model = sequelize.import(path.join(__dirname, file));
      db[model.name] = model
    });

  Object.keys(db).forEach(modelName => {
    if ('associate' in db[modelName]) {
      db[modelName].associate(db);
    }
  });
}

var db = {};
var sequelize = createDatabase();
addModels(db, sequelize);
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
