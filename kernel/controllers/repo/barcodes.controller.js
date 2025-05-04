module.exports = (dbModel, sessionDoc, req) =>
  new Promise(async (resolve, reject) => {

    switch (req.method.toUpperCase()) {
      case 'GET':
        if (req.params.param1 != undefined) {
          getOne(dbModel, sessionDoc, req).then(resolve).catch(reject)
        } else {
          getList(dbModel, sessionDoc, req).then(resolve).catch(reject)
        }
        break
      case 'POST':
        post(dbModel, sessionDoc, req).then(resolve).catch(reject)

        break
      case 'PUT':
        put(dbModel, sessionDoc, req).then(resolve).catch(reject)
        break
      case 'DELETE':
        deleteItem(dbModel, sessionDoc, req).then(resolve).catch(reject)
        break
      default:
        restError.method(req, reject)
        break
    }
  })

function getOne(dbModel, sessionDoc, req) {
  return new Promise((resolve, reject) => {
    dbModel.barcodes
      .findOne({ _id: req.params.param1 })
      .populate('item')
      .then(resolve)
      .catch(reject)
  })
}

function getList(dbModel, sessionDoc, req) {
  return new Promise(async (resolve, reject) => {
    try {
      let options = {
        page: req.query.page || 1,
        limit: req.query.pageSize || 10,
        populate: ['item']
      }
      let filter = {}
      if (req.query.item && req.query.item != '*') filter.item = req.query.item
      if (req.query.search) {
        filter.$or = [
          { name: { $regex: `.*${req.query.search}.*`, $options: 'i' } },
          { article: { $regex: `.*${req.query.search}.*`, $options: 'i' } },
        ]
      }
      dbModel.barcodes
        .paginate(filter, options)
        .then(resolve)
        .catch(reject)
    } catch (err) {
      reject(err)
    }

  })
}

function post(dbModel, sessionDoc, req) {
  return new Promise(async (resolve, reject) => {
    try {

      let data = req.body || {}
      delete data._id
      if (!data.barcode) return reject('barcode required')
      if (!data.item) return reject('item required')
      const itemDoc = await dbModel.items.findOne({ _id: data.item })
      if (!itemDoc) return reject(`item not found`)
      const c = await dbModel.barcodes.countDocuments({ barcode: data.barcode })
      if (c > 0) return reject(`barcode already exists`)

      const newDoc = new dbModel.barcodes(data)


      if (!epValidateSync(newDoc, reject)) return
      newDoc.save()
        .then(resolve)
        .catch(reject)

    } catch (err) {
      reject(err)
    }

  })
}

function put(dbModel, sessionDoc, req) {
  return new Promise(async (resolve, reject) => {
    try {

      if (req.params.param1 == undefined) return restError.param1(req, reject)
      let data = req.body || {}
      delete data._id

      let doc = await dbModel.barcodes.findOne({ _id: req.params.param1 })
      if (!doc) return reject(`record not found`)

      doc = Object.assign(doc, data)
      if (!epValidateSync(doc, reject)) return
      if (await dbModel.barcodes.countDocuments({ barcode: doc.barcode, _id: { $ne: doc._id } }) > 0)
        return reject(`barcode already exists`)

      doc.save()
        .then(resolve)
        .catch(reject)
    } catch (err) {
      reject(err)
    }

  })
}

function deleteItem(dbModel, sessionDoc, req) {
  return new Promise(async (resolve, reject) => {
    try {
      if (req.params.param1 == undefined) return restError.param1(req, reject)

      dbModel.barcodes.removeOne(sessionDoc, { _id: req.params.param1 })
        .then(resolve)
        .catch(reject)
    } catch (err) {
      reject(err)
    }
  })
}
