const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const cors = require('cors')

const usersRouter = require('./routes/users/router')
const penyakitRouter = require('./routes/penyakit/router')
const gejalaRouter = require('./routes/gejala/router')
const solusiRouter = require('./routes/solusi/router')
const faktorRouter = require('./routes/faktor/router')
const ruleRouter = require('./routes/rule/router')

const app = express()
const URL = '/api/v1'
app.use(cors())

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

// URL
app.use(`${URL}/users`, usersRouter)
app.use(`${URL}/penyakit`, penyakitRouter)
app.use(`${URL}/gejala`, gejalaRouter)
app.use(`${URL}/solusi`, solusiRouter)
app.use(`${URL}/faktor`, faktorRouter)
app.use(`${URL}/rule`, ruleRouter)

app.use('/', (req, res) => {
  return res.status(200).json({
    status: 200,
    message: 'Server Is Running Well'
  })
})

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
