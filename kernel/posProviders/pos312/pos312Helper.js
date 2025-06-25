const axios = require('axios')
const fs = require('fs')
const path = require('path')
const { socketSend } = require('../../lib/socketHelper')
const { getList, executeSql } = require('../../lib/mikro/mikroHelper')

exports.test = function (webServiceUrl, webServiceUsername, webServicePassword) {
  return new Promise((resolve, reject) => {
    axios({
      method: 'post',
      url: `${webServiceUrl}/auth/loginuser`,
      timeout: 120 * 60 * 1000,
      headers: { 'Content-Type': 'application/json' },
      data: { username: webServiceUsername, password: webServicePassword },

    })
      .then(result => {
        resolve(result.data)
      })
      .catch(reject)
  })

}

exports.login = function (webServiceUrl, webServiceUsername, webServicePassword) {
  return new Promise((resolve, reject) => {
    axios({
      method: 'post',
      url: `${webServiceUrl}/auth/loginuser`,
      timeout: 120 * 60 * 1000,
      headers: { 'Content-Type': 'application/json' },
      data: { username: webServiceUsername, password: webServicePassword },

    })
      .then(result => {

        if (result.data.authToken) {
          resolve(result.data.authToken)
        } else {
          console.log('result:', result.data)
          reject(result.data)
        }

      })
      .catch(reject)
  })

}


function GetDepartments(webServiceUrl, token, body) {
  return new Promise((resolve, reject) => {
    resolve([{
      "id": 1,
      "name": "KDV %0",
      "type": 1,
      "taxValue": 0.0000,
      "ecrCode": 1
    },
    {
      "id": 2,
      "name": "KDV %1",
      "type": 1,
      "taxValue": 1.0000,
      "ecrCode": 2
    },
    {
      "id": 3,
      "name": "KDV %10",
      "type": 1,
      "taxValue": 10.0000,
      "ecrCode": 3
    },
    {
      "id": 4,
      "name": "KDV %20",
      "type": 1,
      "taxValue": 20.0000,
      "ecrCode": 4
    }])
    // fetch(`${webServiceUrl}/integration/getdepartments`, {
    //   method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    //   body: JSON.stringify(body || {}),
    // })
    //   .then(resp => {
    //     if (resp.ok) {
    //       resp
    //         .json()
    //         .then(result => {
    //           resolve(result)
    //         })
    //         .catch(reject)
    //     } else reject(resp.statusText)
    //   })
    //   .catch(reject)
  })
}

function SetStock2(webServiceUrl, token, data) {
  return new Promise((resolve, reject) => {
    axios({
      method: 'post',
      url: `${webServiceUrl}/integration/setstocks`,
      timeout: 120 * 60 * 1000, // 120 dakika
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      data: data
    })
      .then(resp => {
        eventLog('resp:', resp.data)
        resolve(resp.data)
      })
      .catch(err => {
        errorLog('[pos312 SetStock] Error:', err)
        reject(err)
      })

  })
}

exports.syncItems_pos312 = function (dbModel, sessionDoc, req, orgDoc, storeDoc) {
  return new Promise(async (resolve, reject) => {
    let token312 = ''


    try {
      socketSend(sessionDoc, { event: 'syncItems_progress', caption: `312 Pos login in` })
      token312 = await exports.login(storeDoc.posIntegration.pos312.webServiceUrl,
        storeDoc.posIntegration.pos312.webServiceUsername,
        storeDoc.posIntegration.pos312.webServicePassword)


      socketSend(sessionDoc, { event: 'syncItems_progress', caption: `Mikrodan stok, barkod ve fiyatlar listeleniyor` })
      let Kdvler = []
      try {
        Kdvler = await GetDepartments(storeDoc.posIntegration.pos312.webServiceUrl, token312, {})
      } catch (err) {
        errorLog(`[syncItems_pos312] Error:`, err)
        return reject(`Departmanlar 312Pos tan cekilemedi`)
      }
      devLog('Kdvler:', Kdvler)

      // TODO: 10 rakami kaldirilacak, 
      let docs = await getList(sessionDoc, orgDoc, `SELECT TOP 10 sto_kod as code, sto_isim as [name], 
          CASE WHEN sto_kisa_ismi<>'' THEN sto_kisa_ismi ELSE SUBSTRING(sto_isim,1,20) END as shortName, 
          sto_birim1_ad as unit, sto_birim2_ad as unit2, dbo.fn_VergiYuzde(sto_perakende_vergi) as vatRate ,
          sto_lastup_date as updatedAt , sto_reyon_kodu as rayon
           FROM STOKLAR
            WHERE (sto_lastup_date>'${storeDoc.posIntegration.lastUpdate_items || ''}')
            AND sto_kod in (SELECT sfiyat_stokkod FROM STOK_SATIS_FIYAT_LISTELERI WHERE sfiyat_listesirano=1)
            ORDER BY sto_lastup_date`)

      if (docs.length == 0) {
        socketSend(sessionDoc, { event: 'syncItems_progress_end' })
        return resolve('stok kartlari zaten guncel')
      }
      let barcodeDocs = await getList(sessionDoc, orgDoc, `SELECT  bar_kodu as barcode, bar_stokkodu as code,
        CASE 
            WHEN B.bar_birimpntr=1 OR B.bar_birimpntr=0 THEN S.sto_birim1_katsayi 
            WHEN B.bar_birimpntr=2 THEN S.sto_birim2_katsayi 
            WHEN B.bar_birimpntr=3 THEN S.sto_birim3_katsayi 
            WHEN B.bar_birimpntr=4 THEN S.sto_birim4_katsayi 
            ELSE 1 END as Multiplier, bar_lastup_date as updatedAt FROM BARKOD_TANIMLARI B INNER JOIN
          STOKLAR S ON S.sto_kod=B.bar_stokkodu
        WHERE S.sto_lastup_date>'${storeDoc.posIntegration.lastUpdate_items || ''}'`)


      let priceDocs = await getList(sessionDoc, orgDoc, `SELECT sfiyat_stokkod as code, 0 as isBarcode, 0 as ordr, sfiyat_deposirano as storeId, GETDATE() as startDate, GETDATE() as endDate, sfiyat_fiyati as price, sfiyat_fiyati as newPrice, 0 as [deleted] FROM STOK_SATIS_FIYAT_LISTELERI F 
        INNER JOIN STOKLAR S ON S.sto_kod=F.sfiyat_stokkod
        WHERE sfiyat_listesirano=1 AND S.sto_lastup_date>'${storeDoc.posIntegration.lastUpdate_items || ''}'`)

      console.log('priceDocs.length', priceDocs.length)

      socketSend(sessionDoc, { event: 'syncItems_progress', caption: `Mikrodan Kartlar cekildi` })
      resolve(`${docs.length} adet stok karti aktarilacak. baslama:${new Date().toString()}`)
      let i = 0
      function calistir() {
        return new Promise((resolve, reject) => {
          if (i >= docs.length) return resolve(true)
          let t1 = new Date().getTime() / 1000
          let Scale = false
          let unit = 1
          if (['KİLOGRAM', 'KILOGRAM', 'KG', 'kg', 'kilogram', 'KİLO', 'kilo', 'Kilogram'].includes(docs[i].unit)) {
            unit = 2
            Scale = true
          }
          let DepartmentId = 0
          let StockBarcodes = []
          let StockPrices = []
          const Kdv = Kdvler.find(e => e.taxValue == docs[i].vatRate)
          if (Kdv) {
            DepartmentId = Kdv.id
            StockBarcodes = (barcodeDocs || []).filter(e => e.code == docs[i].code).map(e => {
              if (e.Multiplier <= 0) e.Multiplier = 1
              return {
                "barcode": e.barcode,
                "stockCode": e.code,
                "multiplier": e.Multiplier
              }
            })
            let tartiliUrunMu = StockBarcodes.find(e => (e.barcode.startsWith('28') || e.barcode.startsWith('29')) && e.barcode.length == 7)
            if (tartiliUrunMu) {
              if (!Scale) Scale = true
            }
            StockPrices = (priceDocs || []).filter(e => e.code == docs[i].code).map(e => {
              return {
                master: e.code,
                isBarcode: false,
                ordr: 1,
                storeId: e.storeId,
                startDate: new Date().toISOString(),
                endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 12)).toISOString(),
                price: e.price,
                newPrice: e.newPrice,
                deleted: false
              }
            })


            let dataItem = {
              "Code": docs[i].code,
              "Name": docs[i].name.replaceAll('İ', 'I'),
              "ShortName": docs[i].shortName,
              "Unit": unit,
              "Status": true,
              "Scale": Scale,
              "CancelTimeout": 0,
              "NoDiscount": false,
              "NoPromotion": false,
              "FreePrice": false,
              "Tare": 0,
              "MaxSale": 0,
              "LastSaleTime": "00:00:00",
              "TagUnit": 0,
              "UnitWeight": 0,
              "Returnable": true,
              "Manufacturer": "TANIMSIZ",  // TODO: buraya markasini getirelim
              "Contents": "",
              "StorageConditions": null,
              "ProductionPlace": "TR",
              "LegalDocument": "",
              "Warnings": "",
              "ImprintNumber": "",
              "ImprintName": "",
              "ProductionMethod": "",
              "ProductionDate": "2000-01-01T00:00:00",
              "BusinessName": "",
              "DomesticProduction": null,
              "StockBarcodes": StockBarcodes,
              "StockDepartments": [
                {
                  "DepartmentId": DepartmentId,
                  "StockCode": docs[i].code,
                  "Type": 1
                }
              ],
              "StockGroups": [
                {
                  "GroupId": 1,
                  "StockCode": docs[i].code
                }
              ],
              "StockPrices": StockPrices.length > 0 ? [StockPrices[0]] : [],
              "StockRayons": [
                {
                  "RayonId": !isNaN(Number(docs[i].rayon)) && Number(docs[i].rayon) != 0 ? Number(docs[i].rayon) : 1,
                  "StockCode": docs[i].code
                }
              ],
              "StockStores": null,
              "StockOptionGroups": null,
              "isNew": null,
              "Barcode": null,
              "Price": null,
              "LastChange": null,
              "CreateDate": null,
              "UpdateDate": null
            }
            SetStock2(storeDoc.posIntegration.pos312.webServiceUrl, token312, [dataItem])
              .then(async sonuc => {
                if (sonuc) {
                  storeDoc.posIntegration.lastUpdate_items = docs[i].updatedAt
                  await storeDoc.save()
                }

                let t2 = new Date().getTime() / 1000
                socketSend(sessionDoc, {
                  event: 'syncItems_progress',
                  max: docs.length,
                  position: i + 1,
                  percent: Math.round(10 * 100 * (i + 1) / docs.length) / 10,
                  caption: `Time:${Math.round(10 * (t2 - t1)) / 10}sn ${i + 1}/${docs.length} ${docs[i].code} - ${docs[i].shortName}`
                })
                i++
                setTimeout(() => calistir().then(resolve).catch(reject), 5)
              })
              .catch(err => {
                errorLog(`[syncItems_pos312] calistir() Error:`, err)
                i++
                return reject(err)
                //setTimeout(() => calistir().then(resolve).catch(reject), 50)
              })
          } else {
            i++
            setTimeout(() => calistir().then(resolve).catch(reject), 50)
          }
        })
      }

      calistir()
        .then(() => {
          socketSend(sessionDoc, { event: 'syncItems_progress_end' })
        })
        .catch(err => {
          errorLog(`[syncItems_pos312] Error:`, err)
          socketSend(sessionDoc, { event: 'syncItems_progress_end' })
        })
    } catch (err) {
      errorLog(`[syncItems_pos312] Error:`, err)
      socketSend(sessionDoc, { event: 'syncItems_progress_end' })
      reject(err)
    }



  })

}

function GetDocuments(webServiceUrl, token, data) {
  return new Promise((resolve, reject) => {
    axios({
      method: 'post',
      url: `${webServiceUrl}/integration/getdocuments`,
      timeout: 120 * 60 * 1000, // 120 dakika
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      data: data
    })
      .then(resp => {
        resolve(resp.data)
      })
      .catch(err => {
        errorLog('[pos312 SetStock] Error:', err.response.data.errors || err.response.data.error)
        reject(err.response.data.errors || err.response.data.error)
      })

  })
}

exports.syncSales_pos312 = function (dbModel, sessionDoc, req, orgDoc, storeDoc) {
  return new Promise(async (resolve, reject) => {
    let token312 = ''
    const startDate = req.getValue('startDate')
    const endDate = req.getValue('endDate')
    eventLog('[syncGetSales_pos312]'.green, 'startDate:', startDate, 'endDate:', endDate)
    try {
      socketSend(sessionDoc, { event: 'syncSales_progress', caption: `312 Pos login in` })
      token312 = await exports.login(storeDoc.posIntegration.pos312.webServiceUrl,
        storeDoc.posIntegration.pos312.webServiceUsername,
        storeDoc.posIntegration.pos312.webServicePassword)

      eventLog('[syncGetSales_pos312]'.green, 'GetDocuments started')
      socketSend(sessionDoc, { event: 'syncSales_progress', caption: `312 Pos GetDocuments` })
      GetDocuments(storeDoc.posIntegration.pos312.webServiceUrl, token312, { startDate: startDate, endDate: endDate })
        .then(result => {
          // eventLog('[syncGetSales_pos312] result:'.green, result)
          resolve('Mikroya Aktarim Basliyor. Evrak Sayisi:')
          socketSend(sessionDoc, { event: 'syncSales_progress_end' })
        })
        .catch(reject)
    } catch (err) {
      // errorLog(`[syncItems_pos312] Error:`, err)
      socketSend(sessionDoc, { event: 'syncSales_progress_end' })
      reject(err)
    }



  })

}
