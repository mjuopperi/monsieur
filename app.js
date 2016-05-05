const path = require('path')
const compression = require('compression')
const express = require('express')
const bodyParser = require('body-parser')

const webpack = require('webpack')
const webpackMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const config = require('./webpack.config')

const sensors = require('./src/routes/sensors')
const temperatures = require('./src/routes/temperatures')

const app = express()

app.use(compression())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use('/api/sensors', sensors)
app.use('/api/temperatures', temperatures)

if (app.get('env') === 'development') {
  const compiler = webpack(config)
  const middleware = webpackMiddleware(compiler, {
    publicPath: config.output.publicPath,
    contentBase: 'src',
    stats: {
      colors: true,
      hash: false,
      timings: true,
      chunks: false,
      chunkModules: false,
      modules: false
    }
  })
  app.use(middleware)
  app.use(webpackHotMiddleware(compiler))
  app.get('*', (req, res) => {
    res.write(middleware.fileSystem.readFileSync(path.join(__dirname, 'public/index.html')))
    res.end()
  })
}

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
