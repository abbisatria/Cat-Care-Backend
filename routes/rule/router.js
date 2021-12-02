const express = require('express')
const route = express.Router()
const { isAdmin } = require('../../helpers/auth')
const { createRule, updateRule, deleteRule, diagnosa, getListRule } = require('./controller')

route.post('', isAdmin, createRule)
route.post('/diagnosa', isAdmin, diagnosa)
route.put('', isAdmin, updateRule)
route.delete('/:id', isAdmin, deleteRule)
route.get('', isAdmin, getListRule)

module.exports = route
