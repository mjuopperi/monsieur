const models  = require('../models')
const express = require('express')
const routeUtil = require('../util/route-util')

const router  = express.Router()

const withoutId = temperature => {
  const t = {}
  Object.keys(temperature.dataValues).filter(k => k != 'id')
        .forEach(key => t[key] = temperature.dataValues[key])
  return t
}

router.get('/:sensorId', (req, res) => {
  models.Temperature.findAll({
    where: { 'sensor_id': req.params.sensorId },
    attributes: {
      exclude: ['id', 'sensor_id']
    },
    order: [['timestamp', 'DESC']]
  }).then(temperatures => res.json({temperatures: temperatures}))
})

router.post('/:sensorId', (req, res) => {
  models.Sensor.findById(req.params.sensorId).then(sensor => {
    if(!sensor) res.status(404).json('Sensor does not exist.')
    else {
      const data = req.body
      data.sensor_id = sensor.id
      models.Temperature.create(data).then(temperature => {
        res.status(201).json(withoutId(temperature))
      }).catch(error => {
        const missingField = routeUtil.missingField(error)
        if (missingField) {
          res.status(400).json(`Field '${missingField}' is required.`)
        } else {
          res.status(400).json('Bad request.')
        }
      })
    }
  })
})

router.use((req, res, next) => routeUtil.methodNotAllowed(req, res, next))

module.exports = router
