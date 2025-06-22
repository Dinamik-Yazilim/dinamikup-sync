const fs = require('fs')
const path = require('path')
const { socketSend } = require('../../lib/socketHelper')
const { getList, executeSql } = require('../../lib/mikro/mikroHelper')

exports.login = function (webServiceUrl, webServiceUsername, webServicePassword) {
  return new Promise((resolve, reject) => {
    fetch(`${webServiceUrl}/auth/loginuser`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: webServiceUsername, password: webServicePassword }),

    })
      .then(resp => {
        if (resp.ok) {
          resp
            .json()
            .then(result => {
              if (result.authToken) {
                resolve(result.authToken)
              } else {
                reject(result)
              }
            })
            .catch(reject)
        } else reject(resp.description)
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

function SetStock2(webServiceUrl, token, body) {
  return new Promise((resolve, reject) => {
    fetch(`${webServiceUrl}/integration/setstocks`, {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(body || {}),
    })
      .then(resp => {
        if (resp.ok) {
          resp
            .json()
            .then(result => {
              resolve(result)
            })
            .catch(reject)
        } else reject(`OKFalse ${resp.statusText}`)
      })
      .catch(reject)
  })
}

exports.syncItems_pos312 = function (dbModel, sessionDoc, req, orgDoc, storeDoc) {
  return new Promise(async (resolve, reject) => {
    try {
      const token312 = await exports.login(storeDoc.posIntegration.pos312.webServiceUrl,
        storeDoc.posIntegration.pos312.webServiceUsername,
        storeDoc.posIntegration.pos312.webServicePassword)

      socketSend(sessionDoc, { event: 'syncItems_progress', caption: `hazirlaniyor` })

      let Kdvler = []
      try {
        Kdvler = await GetDepartments(storeDoc.posIntegration.pos312.webServiceUrl, token312, {})
      } catch (err) {
        errorLog(`[syncItems_pos312] Error:`, err)
        return reject(`Departmanlar 312Pos tan cekilemedi`)
      }
      devLog('Kdvler:', Kdvler)
      let query = `SELECT sto_kod as code, sto_isim as [name], 
          CASE WHEN sto_kisa_ismi<>'' THEN sto_kisa_ismi ELSE SUBSTRING(sto_isim,1,20) END as shortName, 
          sto_birim1_ad as unit, sto_birim2_ad as unit2, dbo.fn_VergiYuzde(sto_perakende_vergi) as vatRate ,
          sto_lastup_date as updatedAt , sto_reyon_kodu as rayon
           FROM STOKLAR
            WHERE (sto_lastup_date>'${storeDoc.posIntegration.lastUpdate_items || ''}')
            ORDER BY sto_lastup_date`
      getList(sessionDoc, orgDoc, query)
        .then(async docs => {
          if (docs.length == 0) {
            resolve('stok kartlari guncel')
          } else {
            resolve(`${docs.length} stok karti aktarilacak`)
            let i = 0
            function calistir() {
              return new Promise(async (resolve, reject) => {
                if (i >= docs.length) return resolve()
                let unit = 1
                if (['KİLOGRAM', 'KILOGRAM', 'KG', 'kg', 'kilogram', 'KİLO', 'kilo'].includes(docs[i].unit)) {
                  unit = 2
                }
                let DepartmentId = 0
                let StockBarcodes = []
                let StockPrices = []
                const Kdv = Kdvler.find(e => e.taxValue == docs[i].vatRate)
                if (Kdv) {
                  DepartmentId = Kdv.id
                  try {
                    StockBarcodes = (await getList(sessionDoc, orgDoc, `SELECT bar_kodu as Barcode,bar_stokkodu as StockCode,
                    CASE 
                      WHEN B.bar_birimpntr=1 OR B.bar_birimpntr=0 THEN S.sto_birim1_katsayi 
                      WHEN B.bar_birimpntr=2 THEN S.sto_birim2_katsayi 
                      WHEN B.bar_birimpntr=3 THEN S.sto_birim3_katsayi 
                      WHEN B.bar_birimpntr=4 THEN S.sto_birim4_katsayi 
                      ELSE 1 END as Multiplier FROM BARKOD_TANIMLARI B INNER JOIN
                    STOKLAR S ON B.bar_stokkodu=S.sto_kod
                    WHERE B.bar_stokkodu='${docs[i].code}';
                    `) || []).map(e => {
                      if (e.Multiplier <= 0) e.Multiplier = 1
                      return e
                    })
                  } catch (err) {
                    errorLog(`[syncItems_pos312] Error:`, err)
                  }

                  try {
                    StockPrices = (await getList(sessionDoc, orgDoc, `SELECT sfiyat_stokkod as [master], 0 as isBarcode, 0 as ordr, 1001 as storeId, GETDATE() as startDate, GETDATE() as endDate, sfiyat_fiyati as price, sfiyat_fiyati as newPrice, 0 as [deleted] FROM STOK_SATIS_FIYAT_LISTELERI
                    WHERE sfiyat_listesirano=1 AND sfiyat_stokkod='${docs[i].code}';
                    `) || []).map((e, index) => {
                      return {
                        master: e.master,
                        isBarcode: false,
                        ordr: index,
                        storeId: storeDoc.posIntegration.pos312.storeId,
                        startDate: new Date().toISOString(),
                        endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 12)).toISOString(),
                        price: e.price,
                        newPrice: e.newPrice,
                        deleted: false
                      }
                    })
                  } catch (err) {
                    errorLog(`[syncItems_pos312] Error:`, err)
                  }


                  let dataItem = {
                    "Code": docs[i].code,
                    "Name": docs[i].name.replaceAll('İ', 'I'),
                    "ShortName": docs[i].shortName,
                    "Unit": unit,
                    "Status": true,
                    "Scale": unit == 2 ? true : false,
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
                    "StockPrices": StockPrices,
                    "StockRayons": [
                      {
                        "RayonId": !isNaN(Number(docs[i].rayon)) ? Number(docs[i].rayon) : 1,
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

                  try {
                    const sonuc = await SetStock2(storeDoc.posIntegration.pos312.webServiceUrl, token312, [dataItem])
                    if (sonuc) {
                      storeDoc.posIntegration.lastUpdate_items = docs[i].updatedAt
                      await storeDoc.save()
                    }
                  } catch (err) {
                    fs.writeFileSync(path.join(__dirname, 'dataItem.json'), JSON.stringify([dataItem], null, 2), 'utf8')
                    // process.exit()
                    console.log('Hata:', err, 'barkod sayisi:', StockBarcodes.length, ' kod:', docs[i].code)
                  }
                }
                socketSend(sessionDoc, {
                  event: 'syncItems_progress',
                  max: docs.length,
                  position: i + 1,
                  percent: Math.round(10 * 100 * (i + 1) / docs.length) / 10,
                  caption: `${i + 1}/${docs.length} ${docs[i].name}`
                })
                i++
                setTimeout(() => calistir().then(resolve).catch(reject), 5)
              })
            }

            calistir()
              .then(() => {
                socketSend(sessionDoc, { event: 'syncItems_progress_end' })
                console.log('bitti')
              })
              .catch(err => {
                console.error(err)
                socketSend(sessionDoc, { event: 'syncItems_progress_end' })
              })

          }
        })
        .catch(reject)

    } catch (err) {
      console.error(err)
      reject(err)
    }
  })

}


function SetBarcodes(webServiceUrl, token, body) {
  return new Promise((resolve, reject) => {
    fetch(`${webServiceUrl}/integration/setstockbarcode`, {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(body || {}),
    })
      .then(resp => {
        if (resp.ok) {
          resp
            .json()
            .then(result => {
              resolve(result)
            })
            .catch(reject)
        } else reject(resp.statusText)
      })
      .catch(reject)
  })
}
exports.syncBarcodes_pos312 = function (dbModel, sessionDoc, req, orgDoc, storeDoc) {
  return new Promise(async (resolve, reject) => {
    try {
      const token312 = await exports.login(storeDoc.posIntegration.pos312.webServiceUrl,
        storeDoc.posIntegration.pos312.webServiceUsername,
        storeDoc.posIntegration.pos312.webServicePassword)

      socketSend(sessionDoc, { event: 'syncBarcodes_progress', caption: `hazirlaniyor` })
      let query = `SELECT  bar_kodu as barcode, bar_stokkodu as code, bar_lastup_date as updatedAt FROM BARKOD_TANIMLARI
            WHERE (bar_lastup_date>'${storeDoc.posIntegration.lastUpdate_barcodes || ''}')
            ORDER BY bar_lastup_date`
      getList(sessionDoc, orgDoc, query)
        .then(async docs => {
          if (docs.length == 0) {
            resolve('barkodlar guncel')
          } else {
            resolve(`${docs.length} barkod aktarilacak`)
            let tampon = []
            let i = 0
            function calistir() {
              return new Promise(async (resolve, reject) => {
                if (i >= docs.length) return resolve()
                let data312 = {
                  "barcode": docs[i].barcode,
                  "stockCode": docs[i].code,
                  "multiplier": 0
                }


                try {
                  const sonuc = await SetBarcodes(storeDoc.posIntegration.pos312.webServiceUrl, token312, [data312])
                  if (sonuc) {
                    storeDoc.posIntegration.lastUpdate_barcodes = docs[i].updatedAt
                    await storeDoc.save()
                  }
                } catch (err) {
                  console.error('Hata:', err)
                }
                socketSend(sessionDoc, {
                  event: 'syncBarcodes_progress',
                  max: docs.length,
                  position: i + 1,
                  percent: Math.round(10 * 100 * (i + 1) / docs.length) / 10,
                  caption: `${i + 1}/${docs.length} ${docs[i].name}`
                })
                i++
                setTimeout(() => calistir().then(resolve).catch(reject), 5)
              })
            }

            calistir()
              .then(() => {
                socketSend(sessionDoc, { event: 'syncBarcodes_progress_end' })
                console.log('bitti')
              })
              .catch(err => {
                console.error(err)
                socketSend(sessionDoc, { event: 'syncBarcodes_progress_end' })
              })

          }
        })
        .catch(reject)

    } catch (err) {
      console.error(err)
      reject(err)
    }
  })

}

function SetStockPrices(webServiceUrl, token, body) {
  return new Promise((resolve, reject) => {
    fetch(`${webServiceUrl}/integration/setstockprices`, {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(body || {}),
    })
      .then(resp => {
        if (resp.ok) {
          resolve(true)
          // resp.json()
          //   .then(resolve)
          //   .catch(reject)
        } else reject(resp.statusText)
      })
      .catch(reject)
  })
}

exports.syncPrices_pos312 = function (dbModel, sessionDoc, req, orgDoc, storeDoc) {
  return new Promise(async (resolve, reject) => {
    try {
      const token312 = await exports.login(storeDoc.posIntegration.pos312.webServiceUrl,
        storeDoc.posIntegration.pos312.webServiceUsername,
        storeDoc.posIntegration.pos312.webServicePassword)

      socketSend(sessionDoc, { event: 'syncPrices_progress', caption: `hazirlaniyor` })
      let query = `SELECT sfiyat_stokkod as code, sfiyat_fiyati as price, dbo.fn_DovizSembolu(sfiyat_doviz) as currency,sfiyat_listesirano as priceNo, sfiyat_lastup_date as updatedAt FROM STOK_SATIS_FIYAT_LISTELERI
            WHERE sfiyat_listesirano=1 AND (sfiyat_lastup_date>'${storeDoc.posIntegration.lastUpdate_prices || ''}')
            ORDER BY sfiyat_lastup_date`
      getList(sessionDoc, orgDoc, query)
        .then(async docs => {
          if (docs.length == 0) {
            resolve('fiyatlar guncel')
          } else {
            resolve(`${docs.length} fiyat aktarilacak`)

            let i = 0
            function calistir() {
              return new Promise(async (resolve, reject) => {
                if (i >= docs.length) return resolve()
                let dataPrice = {
                  "master": docs[i].code,
                  "isBarcode": false,
                  "ordr": 0,
                  "storeId": storeDoc.posIntegration.pos312.storeId,
                  "startDate": new Date(docs[i].updatedAt).toISOString(),
                  "endDate": new Date(new Date().setFullYear(new Date().getFullYear() + 2)).toISOString(),
                  "price": docs[i].price,
                  "newPrice": docs[i].price,
                  "deleted": false
                }


                try {
                  const sonuc = await SetStockPrices(storeDoc.posIntegration.pos312.webServiceUrl, token312, [dataPrice])
                  console.log('sonuc:', sonuc)
                  if (sonuc) {
                    storeDoc.posIntegration.lastUpdate_prices = docs[i].updatedAt
                    await storeDoc.save()
                  }
                } catch (err) {
                  console.error('Hata:', err)
                  console.log(dataPrice)
                }
                socketSend(sessionDoc, {
                  event: 'syncPrices_progress',
                  max: docs.length,
                  position: i + 1,
                  percent: Math.round(10 * 100 * (i + 1) / docs.length) / 10,
                  caption: `${i + 1}/${docs.length} ${docs[i].code} ${docs[i].price} ${docs[i].currency}`
                })
                i++
                setTimeout(() => calistir().then(resolve).catch(reject), 5)
              })
            }

            calistir()
              .then(() => {
                socketSend(sessionDoc, { event: 'syncPrices_progress_end' })
                console.log('bitti')
              })
              .catch(err => {
                console.error(err)
                socketSend(sessionDoc, { event: 'syncPrices_progress_end', error: err.message || err || 'error' })
              })

          }
        })
        .catch(reject)

    } catch (err) {
      console.error(err)
      reject(err)
    }
  })

}

exports.syncPriceTrigger_pos312 = function (dbModel, sessionDoc, req, orgDoc, storeDoc) {
  return new Promise(async (resolve, reject) => {
    try {
      const token312 = await exports.login(storeDoc.posIntegration.pos312.webServiceUrl,
        storeDoc.posIntegration.pos312.webServiceUsername,
        storeDoc.posIntegration.pos312.webServicePassword)
      fetch(`${storeDoc.posIntegration.pos312.webServiceUrl}/integration/addtransfer`, {
        method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token312}` },
        body: JSON.stringify({
          "defination": false,
          "customer": false,
          "user": false,
          "stock": 2,
          "stores": [{
            "storeId": storeDoc.posIntegration.pos312.storeId
          }]
        }),
      })
        .then(async resp => {
          if (resp.ok) {
            resp
              .json()
              .then(result => {
                resolve(result)
              })
              .catch(reject)
          } else reject(`${await resp.json()}`)
        })
        .catch(reject)


    } catch (err) {
      console.error(err)
      reject(err)
    }
  })

}
