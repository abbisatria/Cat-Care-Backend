const jwt = require('jsonwebtoken')
const response = require('./response')

module.exports = {
  authCheck: (req, res, next) => {
    const { authorization } = req.headers
    if (authorization && authorization.startsWith('Bearer')) {
      const token = authorization.substr(7)
      const data = jwt.verify(token, process.env.APP_KEY)
      if (data) {
        req.userData = data
        return next()
      }
    }
    return response(res, 401, false, 'Authorization needed')
  },
  isAdmin: (req, res, next) => {
    const { authorization } = req.headers
    if (authorization && authorization.startsWith('Bearer')) {
      const token = authorization.substr(7)
      const data = jwt.verify(token, process.env.APP_KEY)
      if (data) {
        req.userData = data
        if (req.userData.role > 1) {
          return response(res, 401, 'You are not admin!')
        } else {
          return next()
        }
      }
    }
    return response(res, 401, false, 'Authorization needed')
  }
}
