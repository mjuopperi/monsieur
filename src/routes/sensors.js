const models  = require('../models')
const express = require('express')
const routeUtil = require('../util/route-util')

const router  = express.Router()

router.get('/', (req, res) => {
  models.Sensor.findAll().then(sensors => res.json({sensors: sensors}))
})

router.post('/', (req, res) => {
  models.Sensor.create(req.body).then(sensor => {
    res.status(201).json(sensor)
  }).catch(error => {
    if(routeUtil.conflict(error)) {
      res.status(409).json(`Sensor with id ${req.body.id} already exists.`)
    } else {
      res.status(400).json('Bad request.')
    }
  })
})

router.delete('/:id', (req, res) => {
  models.Sensor.findById(req.params.id).then(sensor => {
    if(sensor) sensor.destroy()
    res.status(204).json()
  })
})

router.use((req, res, next) => routeUtil.methodNotAllowed(req, res, next))

module.exports = router
