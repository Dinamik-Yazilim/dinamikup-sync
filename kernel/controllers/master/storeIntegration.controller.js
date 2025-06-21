const { syncItems_pos312, syncBarcodes_pos312, syncPrices_pos312 } = require('../../posProviders/pos312/pos312Helper')
module.exports = (dbModel, sessionDoc, req, orgDoc) =>
  new Promise(async (resolve, reject) => {

    switch (req.method.toUpperCase()) {
      // case 'GET':
      //   if (req.params.param1 != undefined) {
      //     getOne(dbModel, sessionDoc, req).then(resolve).catch(reject)
      //   } else {
      //     getList(dbModel, sessionDoc, req).then(resolve).catch(reject)
      //   }
      //   break
      case 'POST':
        if (!req.params.param1) return reject(`param1 required`)
        if (req.params.param2 == 'syncReset') {
          syncReset(dbModel, sessionDoc, req, orgDoc).then(resolve).catch(reject)
        } else if (req.params.param2 == 'syncItems') {
          syncItems(dbModel, sessionDoc, req, orgDoc).then(resolve).catch(reject)
        } else if (req.params.param2 == 'syncBarcodes') {
          syncBarcodes(dbModel, sessionDoc, req, orgDoc).then(resolve).catch(reject)
        } else if (req.params.param2 == 'syncPrices') {
          syncPrices(dbModel, sessionDoc, req, orgDoc).then(resolve).catch(reject)
        } else {
          return reject(`param2 required`)
        }


        break

      default:
        restError.method(req, reject)
        break
    }
  })

function syncReset(dbModel, sessionDoc, req, orgDoc) {
  return new Promise(async (resolve, reject) => {
    try {
      const storeDoc = await db.stores.findOne({ organization: sessionDoc.organization, db: sessionDoc.db, _id: req.params.param1 })
      if (!storeDoc) return reject('store not found')
      storeDoc.posIntegration.lastUpdate_barcodes = ''
      storeDoc.posIntegration.lastUpdate_firms = ''
      storeDoc.posIntegration.lastUpdate_items = ''
      storeDoc.posIntegration.lastUpdate_prices = ''
      storeDoc.save()
        .then(() => resolve())
        .catch(reject)
    } catch (err) {
      reject(err)
    }

  })
}

function syncItems(dbModel, sessionDoc, req, orgDoc) {
  return new Promise(async (resolve, reject) => {
    try {
      const storeDoc = await db.stores.findOne({ organization: sessionDoc.organization, db: sessionDoc.db, _id: req.params.param1 })
      if (!storeDoc) return reject('store not found')
      switch (storeDoc.posIntegration.integrationType) {
        case 'pos312':
          syncItems_pos312(dbModel, sessionDoc, req, orgDoc, storeDoc).then(resolve).catch(reject)
          break
        default:
          reject('integration type not supported yet')
          break
      }
    } catch (err) {
      reject(err)
    }

  })
}

function syncBarcodes(dbModel, sessionDoc, req, orgDoc) {
  return new Promise(async (resolve, reject) => {
    try {
      const storeDoc = await db.stores.findOne({ organization: sessionDoc.organization, db: sessionDoc.db, _id: req.params.param1 })
      if (!storeDoc) return reject('store not found')
      switch (storeDoc.posIntegration.integrationType) {
        case 'pos312':
          syncBarcodes_pos312(dbModel, sessionDoc, req, orgDoc, storeDoc).then(resolve).catch(reject)
          break
        default:
          reject('integration type not supported yet')
          break
      }
    } catch (err) {
      reject(err)
    }

  })
}

function syncPrices(dbModel, sessionDoc, req, orgDoc) {
  return new Promise(async (resolve, reject) => {
    try {
      const storeDoc = await db.stores.findOne({ organization: sessionDoc.organization, db: sessionDoc.db, _id: req.params.param1 })
      if (!storeDoc) return reject('store not found')
      switch (storeDoc.posIntegration.integrationType) {
        case 'pos312':
          syncPrices_pos312(dbModel, sessionDoc, req, orgDoc, storeDoc).then(resolve).catch(reject)
          break
        default:
          reject('integration type not supported yet')
          break
      }
    } catch (err) {
      reject(err)
    }

  })
}