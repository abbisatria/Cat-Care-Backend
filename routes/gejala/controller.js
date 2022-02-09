const response = require('../../helpers/response')
const Gejala = require('../../models/gejala')
const { Op } = require('sequelize')
const path = require('path')
const fs = require('fs')

module.exports = {
  createGejala: async (req, res) => {
    try {
      const payload = req.body

      if (req.file) {
        const tmpPath = req.file.path
        const originalExt = req.file.originalname.split('.')[req.file.originalname.split('.').length - 1]
        const filename = req.file.filename + '.' + originalExt
        const targetPath = path.resolve(path.resolve(__dirname, '../../'), `public/images/${filename}`)

        const src = fs.createReadStream(tmpPath)
        const dest = fs.createWriteStream(targetPath)

        src.pipe(dest)

        src.on('end', async () => {
          const result = await Gejala.create({ ...payload, image: filename })
          if (result) {
            return response(res, 200, true, 'Gejala berhasil dibuat')
          } else {
            return response(res, 400, false, 'Gejala gagal dibuat')
          }
        })
      } else {
        const result = await Gejala.create(payload)
        if (result) {
          return response(res, 200, true, 'Gejala berhasil dibuat')
        } else {
          return response(res, 400, false, 'Gejala gagal dibuat')
        }
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
        if (req.file) {
          const tmpPath = req.file.path
          const originalExt = req.file.originalname.split('.')[req.file.originalname.split('.').length - 1]
          const filename = req.file.filename + '.' + originalExt
          const targetPath = path.resolve(path.resolve(__dirname, '../../'), `public/images/${filename}`)

          const src = fs.createReadStream(tmpPath)
          const dest = fs.createWriteStream(targetPath)

          src.pipe(dest)

          src.on('end', async () => {
            const currentImage = path.resolve(path.resolve(__dirname, '../../'), `public/images/${existingGejala.image}`)
            if (fs.existsSync(currentImage)) {
              fs.unlinkSync(currentImage)
            }
            const result = await Gejala.update({ ...payload, image: filename }, { where: { id } })
            if (result) {
              return response(res, 200, true, 'Gejala berhasil diupdate', payload)
            } else {
              return response(res, 400, false, 'Gejala gagal diupdate')
            }
          })
        } else {
          const result = await Gejala.update(payload, { where: { id } })
          if (result) {
            return response(res, 200, true, 'Gejala berhasil diupdate', payload)
          } else {
            return response(res, 400, false, 'Gejala gagal diupdate')
          }
        }
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
        const currentImage = path.resolve(path.resolve(__dirname, '../../'), `public/images/${existingGejala.image}`)
        if (fs.existsSync(currentImage)) {
          fs.unlinkSync(currentImage)
        }

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
      const { page, limit = 15, search = '' } = req.query

      const offset = (Number(page) > 1) ? (Number(page) * limit) - limit : 0

      let result

      if (!page) {
        result = await Gejala.findAll()
        return response(res, 200, true, 'List Gejala', result)
      } else {
        result = await Gejala.findAndCountAll({
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
        return response(res, 200, true, 'List Gejala', finalResult)
      }
    } catch (err) {
      console.log(err)
      return response(res, 400, false, `${err.message || 'Bad Request'}`)
    }
  }
}
