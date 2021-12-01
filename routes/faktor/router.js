const express = require('express')
const { isAdmin } = require('../../helpers/auth')
const { createFaktor, getListFaktor, updateFaktor, deleteFaktor } = require('./controller')
const route = express.Router()

route.post('', isAdmin, createFaktor)
route.put('/:id', isAdmin, updateFaktor)
route.delete('/:id', isAdmin, deleteFaktor)
route.get('', isAdmin, getListFaktor)

module.exports = route
