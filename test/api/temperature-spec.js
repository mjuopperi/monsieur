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

  const groupByInterval = (interval) => (acc, t) => {
    const timestamp = Math.floor(t.timestamp / interval) * interval
    const temperature = t.temperature
    acc[timestamp] = acc[timestamp] ? acc[timestamp] : []
    acc[timestamp].push(temperature)
    return acc
  }

  const groupedByIntervalToArray = (groupedByInterval) => Object.keys(groupedByInterval).map(interval => {
    const ts = groupedByInterval[interval]
    return {
      timestamp: parseInt(interval),
      // Use toFixed with parseInt instead of Math.round
      // because PostgreSQL rounds -0.5 down instead of up
      temperature: parseInt((ts.reduce((acc, t) => acc + t) / ts.length).toFixed())
    }
  })

  it('should return all temperature data for sensor sorted by timestamp', done => {
    const sensor = { id: testSupport.randomSensorId() }
    const temperatures = [...Array(20).keys()].map(() => testSupport.randomTemperature(sensor.id))
    models.Sensor.create(sensor).then(() => {
      Promise.all(temperatures.map(temperature => models.Temperature.create(temperature))).then(() => {
        server.get('/api/temperatures/' + sensor.id).end((err, res) => {
          res.status.should.equal(200)
          const expected = temperatures.slice()
            .sort((a, b) => b.timestamp - a.timestamp)
            .map(withoutSensorId)
          res.body.temperatures.should.eql(expected)
          done()
        })
      })
    })
  })

  it('should return summary of temperatures for a sensor grouped by interval', done => {
    const sensor = { id: testSupport.randomSensorId() }
    const end = Date.now()
    const start = end - 12 * 60 * 60 * 1000
    const queryStart = end - 6 * 60 * 60 * 1000
    const interval = Math.floor((end - start) / 60)
    const temperatures = [...Array(240)].map((_, i) => testSupport.randomTemperature(sensor.id, end - i * interval / 2))
    models.Sensor.create(sensor).then(() => {
      Promise.all(temperatures.map(temperature => models.Temperature.create(temperature))).then(() => {
        server.get(`/api/temperatures/${sensor.id}/${queryStart}-${end}`).end((err, res) => {
          res.status.should.equal(200)
          res.body.temperatures.length.should.be.within(59, 61)
          const groupedByInterval = temperatures.slice()
            .filter(t => t.timestamp >= queryStart && t.timestamp  <= end)
            .map(withoutSensorId)
            .reduce(groupByInterval(interval / 2), {})
          const expected = groupedByIntervalToArray(groupedByInterval)
            .sort((a, b) => a.timestamp - b.timestamp)

          res.body.temperatures.should.eql(expected)
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
