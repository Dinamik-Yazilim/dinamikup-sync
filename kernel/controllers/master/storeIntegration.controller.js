const { socketSend } = require('../../lib/socketHelper')
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
        if (req.params.param2 == 'syncItems') {
          syncItems(dbModel, sessionDoc, req).then(resolve).catch(reject)
        } else {
          return reject(`param2 required`)
        }


        break

      default:
        restError.method(req, reject)
        break
    }
  })


function syncItems(dbModel, sessionDoc, req) {
  return new Promise(async (resolve, reject) => {
    try {
      const storeDoc = await db.stores.findOne({ organization: sessionDoc.organization, db: sessionDoc.db, _id: req.params.param1 })
      if (!storeDoc) return reject('store not found')
      switch (storeDoc.posIntegration.integrationType) {
        case 'pos312':
          syncItems_pos312(dbModel, sessionDoc, req, storeDoc).then(resolve).catch(reject)
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

function syncItems_pos312(dbModel, sessionDoc, req, storeDoc) {
  return new Promise(async (resolve, reject) => {
    resolve('stok kartlari isleniyor')
    try {

      let i = 0
      function calistir() {
        return new Promise((resolve, reject) => {
          if (i >= 150) return resolve()
          socketSend(sessionDoc, {
            event: 'syncItems_progress',
            max: 150,
            position: i + 1,
            percent: Math.round(10 * 100 * (i + 1) / 150) / 10,
            caption: `stok isleniyor ${i + 1}`
          })
          setTimeout(() => {
            i++
            calistir().then(resolve).catch(reject)
          }, 300)
        })
      }

      calistir()
        .then(() => {
          console.log('150 sayim bitti')
          socketSend(sessionDoc, { event: 'syncItems_progress_end' })
        })
        .catch(err => {
          socketSend(sessionDoc, { event: 'syncItems_progress_end' })
          console.error(err)
        })
    } catch (err) {
      console.error(err)
    }

  })

}
