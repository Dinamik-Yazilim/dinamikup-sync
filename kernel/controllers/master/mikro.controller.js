const { mssql } = require('../../lib/connectorAbi')
module.exports = (dbModel, sessionDoc, req, orgDoc) =>
  new Promise(async (resolve, reject) => {

    switch (req.params.param1) {
      case 'get':
        getList(dbModel, sessionDoc, req, orgDoc).then(resolve).catch(reject)
        break
      case 'save':
        executeSql(dbModel, sessionDoc, req, orgDoc).then(resolve).catch(reject)
        break
      default:
        restError.method(req, reject)
        break
    }
  })


function getList(dbModel, sessionDoc, req, orgDoc) {
  return new Promise(async (resolve, reject) => {
    try {
      let query = `use ${sessionDoc.db};
      ${req.getValue('query') || ''}
      `
      mssql(orgDoc.connector.clientId, orgDoc.connector.clientPass, orgDoc.connector.mssql, query)
        .then(result => {
          if (result.recordsets) {
            resolve(result.recordsets[0])
          } else {
            resolve([])
          }
        })
        .catch(reject)
    } catch (err) {
      reject(err)
    }
  })
}

function executeSql(dbModel, sessionDoc, req, orgDoc) {
  return new Promise(async (resolve, reject) => {
    try {
      let query = `use ${sessionDoc.db};
      BEGIN TRY
        BEGIN TRAN T216;
          ${req.getValue('query') || ''}
        COMMIT TRAN T216;
      END TRY
      BEGIN CATCH
        IF @@TRANCOUNT > 0 
          ROLLBACK TRAN
        DECLARE @ErrorMessage NVARCHAR(4000);
        DECLARE @ErrorSeverity INT;
        DECLARE @ErrorState INT;
        
        SELECT 
          @ErrorMessage = ERROR_MESSAGE(),
          @ErrorSeverity = ERROR_SEVERITY(),
          @ErrorState = ERROR_STATE();
        
        RAISERROR (@ErrorMessage, @ErrorSeverity, @ErrorState);
      END CATCH
      `
      mssql(orgDoc.connector.clientId, orgDoc.connector.clientPass, orgDoc.connector.mssql, query)
        .then(result => {
          resolve({ rowsAffected: (result.rowsAffected || []).reduce((a, b) => a + b, 0) })
        })
        .catch(reject)
    } catch (err) {
      reject(err)
    }
  })
}
