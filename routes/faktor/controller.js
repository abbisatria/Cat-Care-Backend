const response = require('../../helpers/response')
const Faktor = require('../../models/faktor')
const Penyakit = require('../../models/penyakit')
const { Op } = require('sequelize')

module.exports = {
  createFaktor: async (req, res) => {
    try {
      const payload = req.body

      const existingPenyakit = await Penyakit.findOne({ where: { id: payload.id_penyakit } })

      if (existingPenyakit) {
        const result = await Faktor.create(payload)
        if (result) {
          return response(res, 200, true, 'Faktor berhasil dibuat')
        } else {
          return response(res, 400, false, 'Faktor gagal dibuat')
        }
      } else {
        return response(res, 404, false, 'Id penyakit tidak ditemukan')
      }
    } catch (err) {
      return response(res, 400, false, `${err.message || 'Bad Request'}`)
    }
  },
  updateFaktor: async (req, res) => {
    try {
      const payload = req.body
      const { id } = req.params

      const existingFaktor = await Faktor.findOne({ where: { id } })

      if (existingFaktor) {
        const existingPenyakit = await Penyakit.findOne({ where: { id: payload.id_penyakit } })

        if (existingPenyakit) {
          const result = await Faktor.update(payload, { where: { id } })
          if (result) {
            return response(res, 200, true, 'Faktor berhasil diupdate')
          } else {
            return response(res, 400, false, 'Faktor gagal diupdate')
          }
        } else {
          return response(res, 404, false, 'Id penyakit tidak ditemukan')
        }
      } else {
        return response(res, 404, false, 'Id faktor tidak ditemukan')
      }
    } catch (err) {
      return response(res, 400, false, `${err.message || 'Bad Request'}`)
    }
  },
  deleteFaktor: async (req, res) => {
    try {
      const { id } = req.params

      const existingFaktor = await Faktor.findOne({ where: { id } })

      if (existingFaktor) {
        await Faktor.destroy({ where: { id } })

        return response(res, 200, true, 'Faktor berhasil dihapus', { nama: existingFaktor.nama })
      } else {
        return response(res, 404, false, 'Id faktor tidak ditemukan')
      }
    } catch (err) {
      return response(res, 400, false, `${err.message || 'Bad Request'}`)
    }
  },
  getListFaktor: async (req, res) => {
    try {
      const { page, limit = 15, search = '' } = req.query

      const offset = (Number(page) > 1) ? (Number(page) * limit) - limit : 0

      const result = await Faktor.findAndCountAll({
        where: {
          nama: {
            [Op.like]: `%${search}%`
          }
        },
        order: [['id', 'DESC']],
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
      return response(res, 400, false, `${err.message || 'Bad Request'}`)
    }
  }
}
