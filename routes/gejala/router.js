const express = require('express')
const { isAdmin } = require('../../helpers/auth')
const { createGejala, updateGejala, deleteGejala, getListGejala } = require('./controller')
const route = express.Router()

route.post('', isAdmin, createGejala)
route.put('/:id', isAdmin, updateGejala)
route.delete('/:id', isAdmin, deleteGejala)
route.get('', isAdmin, getListGejala)

module.exports = route
