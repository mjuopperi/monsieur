const supertest = require('supertest')
const should = require('should')
const app = require('../../app')
const models = require('../../src/models')
const testSupport = require('../test-support')

const server = supertest.agent(app)

describe('Sensor api', () => {

  beforeEach(done => {
    testSupport.clearDatabase().then(done)
  })

  it('should return all existing sensors', done => {
    const s1 = testSupport.randomSensor()
    const s2 = testSupport.randomSensor()
    models.Sensor.create(s1).then(() => {
      models.Sensor.create(s2).then(() => {
        server.get('/api/sensors').end((err, res) => {
          res.status.should.equal(200)
          res.body.sensors.should.containEql(s1)
          res.body.sensors.should.containEql(s2)
          done()
        })
      })
    })
  })

  it('should create sensor', done => {
    const sensor = testSupport.randomSensor()
    server.post('/api/sensors').send(sensor).end((err, res) => {
      res.status.should.equal(201)
      res.should.be.json()
      res.body.should.eql(sensor)
      models.Sensor.findById(sensor.id).then(sensor => {
        should.exist(sensor)
        done()
      })
    })
  })

  it('should not create sensor with existing id', done => {
    const existingSensor = testSupport.randomSensor()
    models.Sensor.create(existingSensor).then(() => {
      server.post('/api/sensors').send(existingSensor).end((err, res) => {
        res.status.should.equal(409)
        done()
      })
    })
  })

  it('should delete sensor', done => {
    const sensor = testSupport.randomSensor()
    models.Sensor.create(sensor).then(() => {
      server.delete('/api/sensors/' + sensor.id).end((err, res) => {
        res.status.should.equal(204)
        models.Sensor.findById(sensor.id).then(sensor => {
          should.not.exist(sensor)
          done()
        })
      })
    })
  })

  it('should fail silently when deleting nonexistent sensor', done => {
    server.delete('/api/sensors/' + testSupport.randomSensorId()).end((err, res) => {
      res.status.should.equal(204)
      done()
    })
  })
})
