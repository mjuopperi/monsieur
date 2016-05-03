const path = require('path')
const compression = require('compression')
const express = require('express')
const bodyParser = require('body-parser')

const sensors = require('./src/routes/sensors')
const temperatures = require('./src/routes/temperatures')

const app = express()
app.use(compression())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

app.use('/api/sensors', sensors)
app.use('/api/temperatures', temperatures)

app.use((req, res, next) => {
  const err = new Error('Not Found')
  err.status = 404
  next(err)
})

// Don't leak stacktraces unless in development env
app.use((err, req, res) => {
  res.status(err.status || 500)
  res.render('error', {
    message: err.message,
    error: (app.get('env') === 'development') ? err : {}
  })
})

module.exports = app
