const express = require('express')
const { isAdmin } = require('../../helpers/auth')
const { createPenyakit, updatePenyakit, deletePenyakit, getListPenyakit } = require('./controller')
const route = express.Router()

route.post('', isAdmin, createPenyakit)
route.put('/:id', isAdmin, updatePenyakit)
route.delete('/:id', isAdmin, deletePenyakit)
route.get('', isAdmin, getListPenyakit)

module.exports = route
