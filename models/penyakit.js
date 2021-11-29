const Sequelize = require('sequelize')
const db = require('../config/db')

const Penyakit = db.define('penyakit', {
  id: {
    type: Sequelize.INTEGER(11),
    primaryKey: true
  },
  nama: {
    type: Sequelize.CHAR(255)
  }
},
{
  freezeTableName: true
})

module.exports = Penyakit
