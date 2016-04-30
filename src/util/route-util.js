
var methodNotAllowed = (req, res, next) => {
  if (req.method !== 'OPTIONS') {
    res.status(405).send('Method Not Allowed');
  } else next()
}

var conflict = error => error.errors && error.errors.find(error => error.type === 'unique violation')

var missingField = error => {
  if (error.errors) {
    missingFieldError = error.errors.find(error => error.type === 'notNull Violation')
    if (missingFieldError) return missingFieldError.path
  }
}

module.exports = {
  methodNotAllowed: methodNotAllowed,
  missingField: missingField,
  conflict: conflict
}
