const Sequelize = require('sequelize')
const db = require('../config/db')

const Faktor = db.define('faktor', {
  id: {
    type: Sequelize.INTEGER(11),
    primaryKey: true
  },
  id_penyakit: {
    type: Sequelize.INTEGER(11)
  },
  nama: {
    type: Sequelize.CHAR(255)
  }
},
{
  freezeTableName: true
})

module.exports = Faktor
