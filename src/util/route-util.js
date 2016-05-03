
const methodNotAllowed = (req, res, next) => {
  if (req.method !== 'OPTIONS') {
    res.status(405).send('Method Not Allowed')
  } else next()
}

const conflict = error => error.errors && error.errors.find(error => error.type === 'unique violation')

const missingField = error => {
  if (error.errors) {
    const missingFieldError = error.errors.find(error => error.type === 'notNull Violation')
    if (missingFieldError) return missingFieldError.path
  }
}

module.exports = {
  methodNotAllowed: methodNotAllowed,
  missingField: missingField,
  conflict: conflict
}
