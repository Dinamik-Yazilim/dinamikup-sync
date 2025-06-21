const { getList, executeSql } = require('../../lib/mikro/mikroHelper')
module.exports = (dbModel, sessionDoc, req, orgDoc) =>
  new Promise(async (resolve, reject) => {

    switch (req.params.param1) {
      case 'get':
        getList(dbModel, sessionDoc, req, orgDoc, '').then(resolve).catch(reject)
        break
      case 'getWorkData':
        getList(dbModel, sessionDoc, req, orgDoc, '_WORKDATA').then(resolve).catch(reject)
        break
      case 'save':
        executeSql(dbModel, sessionDoc, req, orgDoc, '').then(resolve).catch(reject)
        break
      case 'saveWorkData':
        executeSql(dbModel, sessionDoc, req, orgDoc, '_WORKDATA').then(resolve).catch(reject)
        break
      default:
        restError.method(req, reject)
        break
    }
  })

