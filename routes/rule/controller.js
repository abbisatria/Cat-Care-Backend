const response = require('../../helpers/response')
const Rule = require('../../models/rule')
const Penyakit = require('../../models/penyakit')
const { Op } = require('sequelize')
const Faktor = require('../../models/faktor')
const Solusi = require('../../models/solusi')
const Gejala = require('../../models/gejala')

module.exports = {
  createRule: async (req, res) => {
    try {
      const payload = req.body

      const existingPenyakit = await Rule.findOne({ where: { id_penyakit: payload.id_penyakit } })

      if (!existingPenyakit) {
        if (payload.id_gejala && payload.id_gejala.length > 0) {
          const data = payload.id_gejala.map(val => {
            return {
              id_penyakit: payload.id_penyakit,
              id_gejala: val
            }
          })
          const result = await Rule.bulkCreate(data)
          if (result) {
            return response(res, 200, true, 'Rule berhasil dibuat')
          } else {
            return response(res, 400, false, 'Rule gagal dibuat')
          }
        } else {
          return response(res, 400, false, 'Gejala harus diisi')
        }
      } else {
        return response(res, 400, false, 'Penyakit sudah terdaftar')
      }
    } catch (err) {
      return response(res, 400, false, `${err.message || 'Bad Request'}`)
    }
  },
  updateRule: async (req, res) => {
    try {
      const payload = req.body

      const existingPenyakit = await Rule.findOne({ where: { id_penyakit: payload.id_penyakit } })

      if (existingPenyakit) {
        if (payload.id_gejala && payload.id_gejala.length > 0) {
          await Rule.destroy({ where: { id_penyakit: payload.id_penyakit } })
          const data = payload.id_gejala.map(val => {
            return {
              id_penyakit: payload.id_penyakit,
              id_gejala: val
            }
          })
          const result = await Rule.bulkCreate(data)
          if (result) {
            return response(res, 200, true, 'Rule berhasil diupdate')
          } else {
            return response(res, 400, false, 'Rule gagal diupdate')
          }
        } else {
          return response(res, 400, false, 'Gejala harus diisi')
        }
      } else {
        return response(res, 404, false, 'Penyakit tidak ditemukan')
      }
    } catch (err) {
      return response(res, 400, false, `${err.message || 'Bad Request'}`)
    }
  },
  deleteRule: async (req, res) => {
    try {
      const { id } = req.params

      const existingPenyakit = await Rule.findOne({ where: { id_penyakit: id } })

      if (existingPenyakit) {
        await Rule.destroy({ where: { id_penyakit: id } })

        return response(res, 200, true, 'Rule berhasil dihapus')
      } else {
        return response(res, 404, false, 'Penyakit tidak ditemukan')
      }
    } catch (err) {
      return response(res, 400, false, `${err.message || 'Bad Request'}`)
    }
  },
  diagnosa: async (req, res) => {
    try {
      const payload = req.body

      const gejala = await Rule.findAll({
        where: {
          id_gejala: {
            [Op.in]: payload.id_gejala
          }
        },
        attributes: ['id_penyakit', 'id_gejala']
      })

      const tmpg = []

      gejala.forEach(val => {
        if (!tmpg.includes(val.id_penyakit)) {
          tmpg.push(val.id_penyakit)
        }
      })

      const gejalaPenyakit = await Penyakit.findAll({
        include: [
          {
            model: Rule,
            attributes: ['id_gejala']
          },
          {
            model: Faktor,
            attributes: ['nama']
          },
          {
            model: Solusi,
            attributes: ['nama']
          }
        ],
        where: {
          id: {
            [Op.in]: tmpg
          }
        },
        attributes: [['id', 'id_penyakit'], ['nama', 'nama_penyakit']]
      })

      let result = {}

      gejalaPenyakit.forEach(val => {
        let total = 0
        payload.id_gejala.forEach((item, idx) => {
          if (val.dataValues.rules.filter(rls => rls.dataValues.id_gejala === Number(item)).length > 0) {
            total += 1
          }
        })
        const data = {
          id_penyakit: val.dataValues.id_penyakit,
          nama_penyakit: val.dataValues.nama_penyakit,
          faktor: val.dataValues.faktor ? val.dataValues.faktor.nama : '-',
          solusi: val.dataValues.solusi.nama,
          total_persen: (total / val.dataValues.rules.length) * 100
        }
        if (result.id_penyakit) {
          if (data.total_persen > result.total_persen) {
            result = data
          }
        } else {
          result = data
        }
      })

      return response(res, 200, true, 'Hasil diagnosa', result)
    } catch (err) {
      return response(res, 400, false, `${err.message || 'Bad Request'}`)
    }
  },
  getListRule: async (req, res) => {
    try {
      const { page, limit = 15, search = '' } = req.query

      const offset = (Number(page) > 1) ? (Number(page) * limit) - limit : 0

      const result = await Penyakit.findAndCountAll({
        where: {
          nama: {
            [Op.like]: `%${search}%`
          }
        },
        include: [
          {
            model: Rule,
            include: [
              {
                model: Gejala,
                attributes: ['nama']
              }
            ],
            where: {
              id_gejala: {
                [Op.not]: null
              }
            },
            attributes: ['id_gejala']
          },
          {
            model: Faktor,
            attributes: ['nama']
          },
          {
            model: Solusi,
            attributes: ['nama']
          }
        ],
        order: [['id', 'DESC']],
        limit: Number(limit),
        offset: Number(offset)
      })

      const finalResult = {
        count: result.count,
        pageCount: Math.ceil(result.count / Number(limit)) || 0,
        data: result.rows
      }

      return response(res, 200, true, 'List Rule', finalResult)
    } catch (err) {
      return response(res, 400, false, `${err.message || 'Bad Request'}`)
    }
  }
}
