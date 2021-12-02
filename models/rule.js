const Sequelize = require('sequelize')
const db = require('../config/db')

const Rule = db.define('rule', {
  id: {
    type: Sequelize.INTEGER(11),
    primaryKey: true
  },
  id_penyakit: {
    type: Sequelize.INTEGER(11)
  },
  id_gejala: {
    type: Sequelize.INTEGER(11)
  }
},
{
  freezeTableName: true
})

module.exports = Rule
