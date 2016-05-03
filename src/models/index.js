// Workaround for pg storing bigints as strings by default.
// Sequelize will use the pg instance required here.
// https://github.com/sequelize/sequelize/issues/1774
require('pg').defaults.parseInt8 = true
const fs = require('fs')
const path = require('path')
const Sequelize = require('sequelize')
const env = require('../util/env')

const createDatabase = () => {
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
  })
}

const addModels = (db, sequelize) => {
  fs.readdirSync(__dirname)
    .filter(file => file != 'index.js')
    .forEach(file => {
      const model = sequelize.import(path.join(__dirname, file))
      db[model.name] = model
    })

  Object.keys(db).forEach(modelName => {
    if ('associate' in db[modelName]) {
      db[modelName].associate(db)
    }
  })
}

const db = {}
const sequelize = createDatabase()
addModels(db, sequelize)
db.sequelize = sequelize
db.Sequelize = Sequelize

module.exports = db
