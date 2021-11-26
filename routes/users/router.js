const express = require('express')
const { register, login, updateProfile } = require('./controller')
const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.put('/updateProfile/:id', updateProfile)

module.exports = router
