const Sequelize = require('sequelize')
const db = require('../config/db')
const Gejala = require('./gejala')

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

Rule.hasOne(Gejala, { sourceKey: 'id_gejala', foreignKey: 'id' })

module.exports = Rule
