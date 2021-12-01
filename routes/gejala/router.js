const express = require('express')
const { isAdmin } = require('../../helpers/auth')
const { createGejala, updateGejala, deleteGejala, getListGejala } = require('./controller')
const route = express.Router()
const multer = require('multer')
const os = require('os')

route.post('', isAdmin, multer({ dest: os.tmpdir() }).single('image'), createGejala)
route.put('/:id', isAdmin, multer({ dest: os.tmpdir() }).single('image'), updateGejala)
route.delete('/:id', isAdmin, deleteGejala)
route.get('', isAdmin, getListGejala)

module.exports = route
