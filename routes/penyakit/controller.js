const response = require('../../helpers/response')
const Penyakit = require('../../models/penyakit')
const { Op } = require('sequelize')

module.exports = {
  createPenyakit: async (req, res) => {
    try {
      const payload = req.body

      const result = await Penyakit.create(payload)

      if (result) {
        return response(res, 200, true, 'Penyakit berhasil dibuat')
      } else {
        return response(res, 400, false, 'Penyakit gagal dibuat')
      }
    } catch (err) {
      return response(res, 400, false, `${err.message || 'Bad Request'}`)
    }
  },
  updatePenyakit: async (req, res) => {
    try {
      const { id } = req.params
      const payload = req.body

      const existingPenyakit = await Penyakit.findOne({ where: { id } })

      if (existingPenyakit) {
        await Penyakit.update(payload, { where: { id } })

        return response(res, 200, true, 'Penyakit berhasil diupdate', payload)
      } else {
        return response(res, 404, false, 'Id penyakit tidak ditemukan')
      }
    } catch (err) {
      return response(res, 400, false, `${err.message || 'Bad Request'}`)
    }
  },
  deletePenyakit: async (req, res) => {
    try {
      const { id } = req.params

      const existingPenyakit = await Penyakit.findOne({ where: { id } })

      if (existingPenyakit) {
        await Penyakit.destroy({ where: { id } })

        return response(res, 200, true, 'Penyakit berhasil dihapus', { nama: existingPenyakit.nama })
      } else {
        return response(res, 404, false, 'Id penyakit tidak ditemukan')
      }
    } catch (err) {
      return response(res, 400, false, `${err.message || 'Bad Request'}`)
    }
  },
  getListPenyakit: async (req, res) => {
    try {
      const { page, limit = 5, search = '' } = req.query

      const offset = (Number(page) > 1) ? (Number(page) * limit) - limit : 0

      const result = await Penyakit.findAndCountAll({
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
