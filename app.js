var path = require('path');
var compression = require('compression');
var express = require('express');
var bodyParser = require('body-parser');

var sensors = require('./src/routes/sensors');
var temperatures = require('./src/routes/temperatures');

var app = express();
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/sensors', sensors);
app.use('/api/temperatures', temperatures);

app.use((req, res, next) => {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Don't leak stacktraces unless in development env
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: (app.get('env') === 'development') ? err : {}
  });
});

module.exports = app;
