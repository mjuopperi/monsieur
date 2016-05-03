require('should')
require('should-http')
const supertest = require('supertest')
const app = require('../../app')
const models = require('../../src/models')
const testSupport = require('../test-support')


const server = supertest.agent(app)

describe('Temperature api', () => {

  beforeEach(done => {
    testSupport.clearDatabase().then(done)
  })

  const withoutSensorId = temperature => {
    delete temperature.sensor_id
    return temperature
  }

  it('should return all temperature data for sensor sorted by timestamp', done => {
    const sensor = { id: testSupport.randomSensorId() }
    const now = new Date().getTime()
    const temperatures = [
      testSupport.randomTemperature(sensor.id, now + 1000),
      testSupport.randomTemperature(sensor.id, now)
    ]
    models.Sensor.create(sensor).then(() => {
      Promise.all(temperatures.map(temperature => models.Temperature.create(temperature))).then(() => {
        server.get('/api/temperatures/' + sensor.id).end((err, res) => {
          res.status.should.equal(200)
          res.body.temperatures.should.eql(temperatures.map(withoutSensorId))
          done()
        })
      })
    })
  })

  it('should create temperature data for sensor', done => {
    const sensor = { id: testSupport.randomSensorId() }
    const temperature = testSupport.randomTemperature(sensor.id)
    models.Sensor.create(sensor).then(() => {
      server.post('/api/temperatures/' + sensor.id).send(temperature).end((err, res) => {
        res.status.should.equal(201)
        res.body.should.eql(temperature)
        models.Temperature.find({ attributes: { exclude: ['id'] }}).then(temperatures => {
          temperatures.should.containEql(temperature)
          done()
        })
      })
    })
  })

  it('should return 404 when posting temperature data for nonexistent sensor', done => {
    const temperature = testSupport.randomTemperature(testSupport.randomSensorId)
    server.post('/api/temperatures/' + temperature.sensor_id).send(temperature).end((err, res) => {
      res.status.should.equal(404)
      res.body.should.equal('Sensor does not exist.')
      models.Temperature.count().then(count => {
        count.should.equal(0)
        done()
      })
    })
  })

  const cases = [{name: 'timestamp',   value: new Date().getTime(), missing: 'temperature'},
                 {name: 'temperature', value: 20000,                missing: 'timestamp'}]
  cases.forEach(field => {
    it(`should return 400 when posting temperature data without ${field.name}`, done => {
      const sensor = { id: testSupport.randomSensorId() }
      const temperature = { sensor_id: sensor.id }
      temperature[field.name] = field.value

      models.Sensor.create(sensor).then(() => {
        server.post('/api/temperatures/' + sensor.id).send(temperature).end((err, res) => {
          res.status.should.equal(400)
          res.body.should.eql(`Field '${field.missing}' is required.`)
          models.Temperature.count().then(count => {
            count.should.equal(0)
            done()
          })
        })
      })
    })
  })
})
