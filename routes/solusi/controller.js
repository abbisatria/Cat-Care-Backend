const response = require('../../helpers/response')
const Solusi = require('../../models/solusi')
const Penyakit = require('../../models/penyakit')
const { Op } = require('sequelize')

module.exports = {
  createSolusi: async (req, res) => {
    try {
      const payload = req.body

      const existingPenyakit = await Penyakit.findOne({ where: { id: payload.id_penyakit } })

      if (existingPenyakit) {
        const result = await Solusi.create(payload)
        if (result) {
          return response(res, 200, true, 'Solusi berhasil dibuat')
        } else {
          return response(res, 400, false, 'Solusi gagal dibuat')
        }
      } else {
        return response(res, 404, false, 'Id penyakit tidak ditemukan')
      }
    } catch (err) {
      return response(res, 400, false, `${err.message || 'Bad Request'}`)
    }
  },
  updateSolusi: async (req, res) => {
    try {
      const payload = req.body
      const { id } = req.params

      const existingSolusi = await Solusi.findOne({ where: { id } })

      if (existingSolusi) {
        const existingPenyakit = await Penyakit.findOne({ where: { id: payload.id_penyakit } })

        if (existingPenyakit) {
          const result = await Solusi.update(payload, { where: { id } })
          if (result) {
            return response(res, 200, true, 'Solusi berhasil diupdate')
          } else {
            return response(res, 400, false, 'Solusi gagal diupdate')
          }
        } else {
          return response(res, 404, false, 'Id penyakit tidak ditemukan')
        }
      } else {
        return response(res, 404, false, 'Id solusi tidak ditemukan')
      }
    } catch (err) {
      return response(res, 400, false, `${err.message || 'Bad Request'}`)
    }
  },
  deleteSolusi: async (req, res) => {
    try {
      const { id } = req.params

      const existingSolusi = await Solusi.findOne({ where: { id } })

      if (existingSolusi) {
        await Solusi.destroy({ where: { id } })

        return response(res, 200, true, 'Solusi berhasil dihapus', { nama: existingSolusi.nama })
      } else {
        return response(res, 404, false, 'Id solusi tidak ditemukan')
      }
    } catch (err) {
      return response(res, 400, false, `${err.message || 'Bad Request'}`)
    }
  },
  getListSolusi: async (req, res) => {
    try {
      const { page, limit = 5, search = '' } = req.query

      const offset = (Number(page) > 1) ? (Number(page) * limit) - limit : 0

      const result = await Solusi.findAndCountAll({
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

      return response(res, 200, true, 'List Solusi', finalResult)
    } catch (err) {
      return response(res, 400, false, `${err.message || 'Bad Request'}`)
    }
  }
}
