const models = require('../src/models')

const randomSensorId = () => '28-' + Math.random().toString(12).slice(2, 14)

const randomTemperature = (sensorId, timestamp) => {
  return {
    sensor_id: sensorId,
    timestamp: timestamp ? timestamp : Math.floor(Math.random() * new Date().getTime()),
    temperature: Math.floor(Math.random() * 60000) - 20000 // -20 to 40 °C
  }
}

const clearDatabase = done => {
  return models.Sensor.findAll().then(sensors => {
    sensors.forEach(sensor => sensor.destroy())
    return models.Temperature.destroy({ truncate : true }).then(() => { if(done) done() })
  })
}

before(done => {
  models.sequelize.sync({ force : true })
    .then(() => done())
    .catch(error => done(error))
})

after(done => {
  clearDatabase(done)
})

module.exports = {
  randomSensorId: randomSensorId,
  randomTemperature: randomTemperature,
  clearDatabase: clearDatabase
}
