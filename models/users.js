const Sequelize = require('sequelize')
const db = require('../config/db')

const User = db.define('users', {
  id: {
    type: Sequelize.INTEGER(11),
    primaryKey: true
  },
  email: {
    type: Sequelize.CHAR(255)
  },
  username: {
    type: Sequelize.CHAR(255)
  },
  password: {
    type: Sequelize.CHAR(255)
  },
  role: {
    type: Sequelize.INTEGER(11)
  }
},
{
  freezeTableName: true
})

module.exports = User
