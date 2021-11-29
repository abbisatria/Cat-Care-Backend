const response = require('../../helpers/response')
const Gejala = require('../../models/gejala')
const { Op } = require('sequelize')

module.exports = {
  createGejala: async (req, res) => {
    try {
      const payload = req.body

      const result = await Gejala.create(payload)

      if (result) {
        return response(res, 200, true, 'Gejala berhasil dibuat')
      } else {
        return response(res, 400, false, 'Gejala gagal dibuat')
      }
    } catch (err) {
      return response(res, 400, false, `${err.message || 'Bad Request'}`)
    }
  },
  updateGejala: async (req, res) => {
    try {
      const { id } = req.params
      const payload = req.body

      const existingGejala = await Gejala.findOne({ where: { id } })

      if (existingGejala) {
        await Gejala.update(payload, { where: { id } })

        return response(res, 200, true, 'Gejala berhasil diupdate', payload)
      } else {
        return response(res, 404, false, 'Id gejala tidak ditemukan')
      }
    } catch (err) {
      return response(res, 400, false, `${err.message || 'Bad Request'}`)
    }
  },
  deleteGejala: async (req, res) => {
    try {
      const { id } = req.params

      const existingGejala = await Gejala.findOne({ where: { id } })

      if (existingGejala) {
        await Gejala.destroy({ where: { id } })

        return response(res, 200, true, 'Gejala berhasil dihapus', { nama: existingGejala.nama })
      } else {
        return response(res, 404, false, 'Id gejala tidak ditemukan')
      }
    } catch (err) {
      return response(res, 400, false, `${err.message || 'Bad Request'}`)
    }
  },
  getListGejala: async (req, res) => {
    try {
      const { page, limit = 5, search = '' } = req.query

      const offset = (Number(page) > 1) ? (Number(page) * limit) - limit : 0

      const result = await Gejala.findAndCountAll({
        where: {
          nama: {
            [Op.like]: `%${search}%`
          }
        },
        limit: Number(limit),
        offset: Number(offset)
      })

      const finalResult = {
        count: result.count,
        pageCount: Math.ceil(result.count / Number(limit)) || 0,
        data: result.rows
      }

      return response(res, 200, true, 'List Penyakit', finalResult)
    } catch (err) {
      console.log(err)
      return response(res, 400, false, `${err.message || 'Bad Request'}`)
    }
  }
}
