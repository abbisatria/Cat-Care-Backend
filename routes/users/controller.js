const response = require('../../helpers/response')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../../models/users')

module.exports = {
  register: async (req, res) => {
    try {
      const { email, username, password } = req.body
      const isExists = await User.findOne({ where: { email } })
      if (!isExists) {
        const salt = await bcrypt.genSalt()
        const encryptedPassword = await bcrypt.hash(password, salt)
        const createUser = await User.create({ email, password: encryptedPassword, username, role: 2 })
        if (createUser) {
          return response(res, 200, true, 'Register Berhasil')
        } else {
          return response(res, 400, false, 'Register Gagal')
        }
      }
    } catch (err) {
      return response(res, 400, false, `${err.message || 'Bad Request'}`)
    }
  },
  login: async (req, res) => {
    try {
      const { username, password } = req.body
      const existingUser = await User.findOne({ where: { username } })
      if (existingUser) {
        const compare = bcrypt.compareSync(password, existingUser.password)
        if (compare) {
          const token = jwt.sign({ username, email: existingUser.email }, process.env.APP_KEY)
          return response(res, 200, true, 'Login berhasil', { token })
        } else {
          return response(res, 401, false, 'Password salah')
        }
      } else {
        return response(res, 200, true, 'Username tidak ditemukan, Silahkan register terlebih dahulu')
      }
    } catch (err) {
      return response(res, 400, false, `${err.message || 'Bad Request'}`)
    }
  },
  updateProfile: async (req, res) => {
    try {
      const { id } = req.params
      const { username, email, password } = req.body

      const existingUser = await User.findOne({ where: { id } })

      if (existingUser) {
        let payload = {
          email,
          username
        }
        if (password) {
          const salt = await bcrypt.genSalt()
          const encryptedPassword = await bcrypt.hash(password, salt)
          payload = { ...payload, password: encryptedPassword }
        }
        await User.update(payload, { where: { id } })
        const result = await User.findOne({ id })
        return response(res, 200, true, 'Update profile berhasil', { email: result.email, username: result.username })
      } else {
        return response(res, 404, false, 'Id user tidak ditemukan')
      }
    } catch (err) {
      return response(res, 400, false, `${err.message || 'Bad Request'}`)
    }
  }
}
