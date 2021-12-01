const express = require('express')
const { isAdmin } = require('../../helpers/auth')
const { createSolusi, updateSolusi, deleteSolusi, getListSolusi } = require('./controller')
const route = express.Router()

route.post('', isAdmin, createSolusi)
route.put('/:id', isAdmin, updateSolusi)
route.delete('/:id', isAdmin, deleteSolusi)
route.get('', isAdmin, getListSolusi)

module.exports = route
