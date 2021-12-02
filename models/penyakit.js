const Sequelize = require('sequelize')
const db = require('../config/db')
const Rule = require('./rule')
const Faktor = require('./faktor')
const Solusi = require('./solusi')

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

Penyakit.hasMany(Rule, { foreignKey: 'id_penyakit' })
Penyakit.hasOne(Faktor, { foreignKey: 'id_penyakit' })
Penyakit.hasOne(Solusi, { foreignKey: 'id_penyakit' })

module.exports = Penyakit
