var supertest = require('supertest');
var should = require('should');
var shouldHttp = require('should-http');
var app = require('../../app');
var models = require('../../src/models');
var testSupport = require('../test-support');


var server = supertest.agent(app);

describe('Temperature api', () => {

  beforeEach(done => {
    testSupport.clearDatabase().then(done);
  });

  var withoutSensorId = temperature => {
    delete temperature.sensor_id;
    return temperature;
  }

  it('should return all temperature data for sensor sorted by timestamp', done => {
    var sensor = { id: testSupport.randomSensorId() }
    var now = new Date().getTime();
    var temperatures = [
      testSupport.randomTemperature(sensor.id, now + 1000),
      testSupport.randomTemperature(sensor.id, now)
    ]
    models.Sensor.create(sensor).then(() => {
      Promise.all(temperatures.map(temperature => models.Temperature.create(temperature))).then(() => {
        server.get('/api/temperatures/' + sensor.id).end((err, res) => {
          res.status.should.equal(200);
          res.body.temperatures.should.eql(temperatures.map(withoutSensorId));
          done();
        })
      })
    })
  });

  it('should create temperature data for sensor', done => {
    var sensor = { id: testSupport.randomSensorId() }
    var temperature = testSupport.randomTemperature(sensor.id)
    models.Sensor.create(sensor).then(() => {
      server.post('/api/temperatures/' + sensor.id).send(temperature).end((err, res) => {
        res.status.should.equal(201);
        res.body.should.eql(temperature);
        models.Temperature.find({ attributes: { exclude: ['id'] }}).then(temperatures => {
          temperatures.should.containEql(temperature);
          done();
        })
      })
    })
  });

  it('should return 404 when posting temperature data for nonexistent sensor', done => {
    var temperature = testSupport.randomTemperature(testSupport.randomSensorId)
    server.post('/api/temperatures/' + temperature.sensor_id).send(temperature).end((err, res) => {
      res.status.should.equal(404);
      res.body.should.equal('Sensor does not exist.');
      models.Temperature.count().then(count => {
        count.should.equal(0)
        done();
      })
    })
  });

  [{name: 'timestamp', value: new Date().getTime(), missing: 'temperature'},
   {name: 'temperature', value: 20000, missing: 'timestamp'}].forEach(field => {
    it(`should return 400 when posting temperature data without ${field.name}`, done => {
      var sensor = { id: testSupport.randomSensorId() }
      var temperature = { sensor_id: sensor.id }
      temperature[field.name] = field.value;

      models.Sensor.create(sensor).then(() => {
        server.post('/api/temperatures/' + sensor.id).send(temperature).end((err, res) => {
          res.status.should.equal(400);
          res.body.should.eql(`Field '${field.missing}' is required.`);
          models.Temperature.count().then(count => {
            count.should.equal(0)
            done();
          })
        })
      })
    });
  })
});
