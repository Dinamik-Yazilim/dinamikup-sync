const axios = require('axios')
const fs = require('fs')
const path = require('path')
const { socketSend } = require('../../lib/socketHelper')
const { getList, executeSql, getListDb, executeSqlDb } = require('../../lib/mikro/mikroHelper')
const { workDataCreatePOQuery, workDataCreatePRHQuery, workDataCreateSTHQuery } = require('../../lib/mikro/workdata')

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

      let docs = await getList(sessionDoc, orgDoc, `SELECT sto_kod as code, sto_isim as [name], 
          CASE WHEN sto_kisa_ismi<>'' THEN sto_kisa_ismi ELSE SUBSTRING(sto_isim,1,20) END as shortName, 
          sto_birim1_ad as unit, sto_birim2_ad as unit2, dbo.fn_VergiYuzde(sto_perakende_vergi) as vatRate ,
          sto_lastup_date as updatedAt , sto_reyon_kodu as rayon
           FROM STOKLAR
            WHERE sto_kod in (SELECT sfiyat_stokkod FROM STOK_SATIS_FIYAT_LISTELERI WHERE sfiyat_listesirano=1)
            AND (sto_lastup_date>'${storeDoc.posIntegration.lastUpdate_items || ''}' 
              OR sto_kod IN (SELECT bar_stokkodu FROM BARKOD_TANIMLARI WHERE bar_lastup_date>'${storeDoc.posIntegration.lastUpdate_items || ''}') 
              OR sto_kod IN (SELECT sfiyat_stokkod FROM STOK_SATIS_FIYAT_LISTELERI WHERE sfiyat_lastup_date>'${storeDoc.posIntegration.lastUpdate_items || ''}') 
            )
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
    //return resolve([ddd])
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
    const startDate = (req.getValue('startDate') || '').substring(0, 10) + 'T00:00:00'
    const endDate = (req.getValue('endDate') || '').substring(0, 10) + 'T23:59:59'
    eventLog('[syncGetSales_pos312]'.green, 'startDate:', startDate, 'endDate:', endDate)
    try {
      if (!storeDoc.warehouseId) return reject(`${storeDoc.name} magaza depo no tanimlanmamis`)
      if (endDate < startDate) return reject(`baslangic tarihi bitisten buyuk olamaz`)
      socketSend(sessionDoc, { event: 'syncSales_progress', caption: `Mikro WorkData olusturuluyor` })
      await mikroWorkDataOlustur(orgDoc, storeDoc, startDate.substring(0, 10), endDate.substring(0, 10))
      socketSend(sessionDoc, { event: 'syncSales_progress', caption: `312 Pos login in` })
      token312 = await exports.login(storeDoc.posIntegration.pos312.webServiceUrl,
        storeDoc.posIntegration.pos312.webServiceUsername,
        storeDoc.posIntegration.pos312.webServicePassword)

      eventLog('[syncGetSales_pos312]'.green, 'GetDocuments started')
      socketSend(sessionDoc, { event: 'syncSales_progress', caption: `312 Pos GetDocuments` })
      GetDocuments(storeDoc.posIntegration.pos312.webServiceUrl, token312, { startDate: startDate, endDate: endDate })
        .then(fisler => {
          eventLog('[syncGetSales_pos312] fisler adet:'.green, fisler.length)
          // fs.writeFileSync(path.join(__dirname, 'syncSales.json.txt'), JSON.stringify(fisler, null, 2), 'utf8')
          resolve('Mikroya Aktarim Basliyor. Evrak Sayisi:' + fisler.length)
          socketSend(sessionDoc, { event: 'syncSales_progress', caption: `Aktariliyor`, max: fisler.length, position: 0, percent: 0 })
          let i = 0
          function calistir() {
            return new Promise((resolve, reject) => {
              if (i >= fisler.length) return resolve()

              // fs.writeFileSync(path.join(__dirname, 'fisData.json.txt'), JSON.stringify(fisler[i], null, 2), 'utf8')
              mikroWorkDataAktar(orgDoc, storeDoc, fisler[i])
                .then(sonuc => {
                  // eventLog('[syncGetSales_pos312]'.green, 'sonuc:', sonuc)
                  socketSend(sessionDoc, { event: 'syncSales_progress', caption: `${fisler[i].date} Kalem:${fisler[i].sales.length} Station:${fisler[i].stationId} Batch:${fisler[i].batchNo}/${fisler[i].stanNo}`, max: fisler.length, position: (i + 1), percent: 100 * (i + 1) / fisler.length })
                  i++
                  setTimeout(() => calistir().then(resolve).catch(reject), 100)
                })
                .catch(reject)
            })
          }
          calistir()
            .then(() => {
              eventLog('[syncGetSales_pos312]'.green, 'Bitti')
              socketSend(sessionDoc, { event: 'syncSales_progress_end' })
            })
            .catch(err => {
              errorLog('[syncGetSales_pos312]'.green, 'Error:', err)
            })
            .finally(() => socketSend(sessionDoc, { event: 'syncSales_progress_end' }))

        })
        .catch(err => {
          errorLog(`[syncSales_pos312] Error:`, err)
          socketSend(sessionDoc, { event: 'syncSales_progress_end' })
          reject(err)
        })
    } catch (err) {
      errorLog(`[syncSales_pos312] Error:`, err)
      socketSend(sessionDoc, { event: 'syncSales_progress_end' })
      reject(err)
    }
  })
}


function mikroWorkDataOlustur(orgDoc, storeDoc, startDate, endDate) {
  return new Promise((resolve, reject) => {
    let i = 0;
    console.log('startDate:', startDate, ' endDate:', endDate)
    let d1 = new Date(startDate + ' 11:00:00')
    let d2 = new Date(endDate + ' 11:00:00')
    let tarih = d1
    while (tarih <= d2) {
      let query = ``
      query += workDataCreatePOQuery(tarih, storeDoc.warehouseId) + '\n'
      query += workDataCreatePRHQuery(tarih, storeDoc.warehouseId) + '\n'
      query += workDataCreateSTHQuery(tarih, storeDoc.warehouseId) + '\n'

      executeSqlDb(orgDoc, storeDoc.db + '_WORKDATA', query)
        .then(resolve)
        .catch(reject)
      tarih.setDate(tarih.getDate() + 1)
    }
    resolve()
  })
}

function mikroWorkDataAktar(orgDoc, storeDoc, fisData) {
  return new Promise(async (resolve, reject) => {
    try {
      if (!fisData.batchNo) return resolve()
      if (!fisData.stanNo) return resolve()
      const posComputerDoc = await db.storePosComputers.findOne({
        organization: orgDoc._id,
        db: storeDoc.db,
        store: storeDoc._id,
        integrationCode: fisData.stationId,
      })
      if (!posComputerDoc) return reject(`POS Bilgisayari tanimlanmamis. stationId:${fisData.stationId}`)
      if (!posComputerDoc.cashAccountId) reject(`POS Bilgisayari:${posComputerDoc.name} nakit kasa tanimlanmamis`)
      if (!posComputerDoc.bankAccountId) reject(`POS Bilgisayari:${posComputerDoc.name} banka hesabi tanimlanmamis`)

      const tarih = util.yyyyMMdd(fisData.date)
      const depoNo = util.pad(storeDoc.warehouseId, 3)
      let query = `
        DECLARE @Tarih DATETIME='${fisData.date.substring(0, 10)}'
        DECLARE @EvrakSira INT=${fisData.batchNo || 0}${util.pad(fisData.stanNo || 0, 4)};
        DECLARE @EvrakSeri VARCHAR(50)='${posComputerDoc.salesDocNoSerial || ''}';
        DECLARE @DepoNo INT = ${storeDoc.warehouseId};
        DECLARE @MikroUserNo INT = 99;
        DECLARE @SatirNo INT = -1;
        DECLARE @VergiPntr INT = 0;
        DECLARE @VergiYuzde FLOAT = 0;
        DECLARE @VergiMatrah0 FLOAT=0;
        DECLARE @VergiMatrah1 FLOAT=0;
        DECLARE @VergiMatrah2 FLOAT=0;
        DECLARE @VergiMatrah3 FLOAT=0;
        DECLARE @VergiMatrah4 FLOAT=0;
        DECLARE @VergiMatrah5 FLOAT=0;
        DECLARE @VergiMatrah6 FLOAT=0;

        DECLARE @Vergi0 FLOAT=0;
        DECLARE @Vergi1 FLOAT=0;
        DECLARE @Vergi2 FLOAT=0;
        DECLARE @Vergi3 FLOAT=0;
        DECLARE @Vergi4 FLOAT=0;
        DECLARE @Vergi5 FLOAT=0;
        DECLARE @Vergi6 FLOAT=0;
        DECLARE @OdemeOran FLOAT=0;

        IF NOT EXISTS(SELECT * FROM S_${tarih}_${depoNo} WHERE integrationCode='${fisData.id}') BEGIN
      `

      fisData.sales.forEach((e, rowIndex) => {
        let netTutar = e.unitPrice * e.quantity
        let tutar = netTutar / (1 + e.departmentValue / 100)
        let vergi = netTutar - tutar
        query += `
          SET @SatirNo=@SatirNo+1;
          SET @VergiYuzde=${e.departmentValue};
          SELECT @VergiPntr=CASE WHEN ${storeDoc.db}.dbo.fn_VergiYuzde(0)=@VergiYuzde THEN 0
          WHEN ${storeDoc.db}.dbo.fn_VergiYuzde(1)=@VergiYuzde THEN 1
          WHEN ${storeDoc.db}.dbo.fn_VergiYuzde(2)=@VergiYuzde THEN 2
          WHEN ${storeDoc.db}.dbo.fn_VergiYuzde(3)=@VergiYuzde THEN 3
          WHEN ${storeDoc.db}.dbo.fn_VergiYuzde(4)=@VergiYuzde THEN 4
          WHEN ${storeDoc.db}.dbo.fn_VergiYuzde(5)=@VergiYuzde THEN 5
          WHEN ${storeDoc.db}.dbo.fn_VergiYuzde(6)=@VergiYuzde THEN 6
          ELSE 0 END;

          SELECT @VergiMatrah0=@VergiMatrah0 + CASE WHEN @VergiPntr=0 THEN ${tutar} ELSE 0 END;
          SELECT @VergiMatrah1=@VergiMatrah1 + CASE WHEN @VergiPntr=1 THEN ${tutar} ELSE 0 END;
          SELECT @VergiMatrah2=@VergiMatrah2 + CASE WHEN @VergiPntr=2 THEN ${tutar} ELSE 0 END;
          SELECT @VergiMatrah3=@VergiMatrah3 + CASE WHEN @VergiPntr=3 THEN ${tutar} ELSE 0 END;
          SELECT @VergiMatrah4=@VergiMatrah4 + CASE WHEN @VergiPntr=4 THEN ${tutar} ELSE 0 END;
          SELECT @VergiMatrah5=@VergiMatrah5 + CASE WHEN @VergiPntr=5 THEN ${tutar} ELSE 0 END;
          SELECT @VergiMatrah6=@VergiMatrah6 + CASE WHEN @VergiPntr=6 THEN ${tutar} ELSE 0 END;

          SELECT @Vergi0=@Vergi0 + CASE WHEN @VergiPntr=0 THEN ${vergi} ELSE 0 END;
          SELECT @Vergi1=@Vergi1 + CASE WHEN @VergiPntr=1 THEN ${vergi} ELSE 0 END;
          SELECT @Vergi2=@Vergi2 + CASE WHEN @VergiPntr=2 THEN ${vergi} ELSE 0 END;
          SELECT @Vergi3=@Vergi3 + CASE WHEN @VergiPntr=3 THEN ${vergi} ELSE 0 END;
          SELECT @Vergi4=@Vergi4 + CASE WHEN @VergiPntr=4 THEN ${vergi} ELSE 0 END;
          SELECT @Vergi5=@Vergi5 + CASE WHEN @VergiPntr=5 THEN ${vergi} ELSE 0 END;
          SELECT @Vergi6=@Vergi6 + CASE WHEN @VergiPntr=6 THEN ${vergi} ELSE 0 END;
        
          INSERT INTO S_${tarih}_${depoNo} (sth_Guid, sth_DBCno, sth_SpecRECno, sth_iptal, sth_fileid, sth_hidden, sth_kilitli, sth_degisti, sth_checksum, sth_create_user, sth_create_date, sth_lastup_user, sth_lastup_date, sth_special1, sth_special2, sth_special3, sth_firmano, sth_subeno, sth_tarih, sth_tip, sth_cins, sth_normal_iade, sth_evraktip, sth_evrakno_seri, sth_evrakno_sira, sth_satirno, sth_belge_no, sth_belge_tarih, sth_stok_kod, sth_isk_mas1, sth_isk_mas2, sth_isk_mas3, sth_isk_mas4, sth_isk_mas5, sth_isk_mas6, sth_isk_mas7, sth_isk_mas8, sth_isk_mas9, sth_isk_mas10, sth_sat_iskmas1, sth_sat_iskmas2, sth_sat_iskmas3, sth_sat_iskmas4, sth_sat_iskmas5, sth_sat_iskmas6, sth_sat_iskmas7, sth_sat_iskmas8, sth_sat_iskmas9, sth_sat_iskmas10, sth_pos_satis, sth_promosyon_fl, sth_cari_cinsi, sth_cari_kodu, sth_cari_grup_no, sth_isemri_gider_kodu, sth_plasiyer_kodu, sth_har_doviz_cinsi, sth_har_doviz_kuru, sth_alt_doviz_kuru, sth_stok_doviz_cinsi, sth_stok_doviz_kuru, sth_miktar, sth_miktar2, sth_birim_pntr, sth_tutar, sth_iskonto1, sth_iskonto2, sth_iskonto3, sth_iskonto4, sth_iskonto5, sth_iskonto6, sth_masraf1, sth_masraf2, sth_masraf3, sth_masraf4, sth_vergi_pntr, sth_vergi, sth_masraf_vergi_pntr, sth_masraf_vergi, sth_netagirlik, sth_odeme_op, sth_aciklama, sth_sip_uid, sth_fat_uid, sth_giris_depo_no, sth_cikis_depo_no, sth_malkbl_sevk_tarihi, sth_cari_srm_merkezi, sth_stok_srm_merkezi, sth_fis_tarihi, sth_fis_sirano, sth_vergisiz_fl, sth_maliyet_ana, sth_maliyet_alternatif, sth_maliyet_orjinal, sth_adres_no, sth_parti_kodu, sth_lot_no, sth_kons_uid, sth_proje_kodu, sth_exim_kodu, sth_otv_pntr, sth_otv_vergi, sth_brutagirlik, sth_disticaret_turu, sth_otvtutari, sth_otvvergisiz_fl, sth_oiv_pntr, sth_oiv_vergi, sth_oivvergisiz_fl, sth_fiyat_liste_no, sth_oivtutari, sth_Tevkifat_turu, sth_nakliyedeposu, sth_nakliyedurumu, sth_yetkili_uid, sth_taxfree_fl, sth_ilave_edilecek_kdv, sth_ismerkezi_kodu, sth_HareketGrupKodu1, sth_HareketGrupKodu2, sth_HareketGrupKodu3, sth_Olcu1, sth_Olcu2, sth_Olcu3, sth_Olcu4, sth_Olcu5, sth_FormulMiktarNo, sth_FormulMiktar, sth_eirs_senaryo, sth_eirs_tipi, sth_teslim_tarihi, sth_matbu_fl, sth_satis_fiyat_doviz_cinsi, sth_satis_fiyat_doviz_kuru, sth_eticaret_kanal_kodu, sth_bagli_ithalat_kodu,
          sth_tevkifat_sifirlandi_fl, integrationCode)
          VALUES(NEWID(), 0, 0, 0, 1002, 0, 0, 0, 0, @MikroUserNo, GETDATE(), @MikroUserNo, GETDATE(), 
          '', '', '', 0, 0, @Tarih, 1 /*sth_tip*/, 1 /*sth_cins*/, 0 /*sth_normal_iade*/,1 /*sth_evraktip*/, 
          @EvrakSeri, @EvrakSira, @SatirNo, '${fisData.batchNo || 0}' /*sth_belge_no*/, @Tarih /*sth_belge_tarih*/,
          '${e.stockCode}' /*sth_stok_kod*/, 0 /*sth_isk_mas1*/, 0 /*sth_isk_mas2*/, 0 /*sth_isk_mas3*/, 0 /*sth_isk_mas4*/, 0 /*sth_isk_mas5*/, 0 /*sth_isk_mas6*/,
          0 /*sth_isk_mas7*/, 0 /*sth_isk_mas8*/, 0 /*sth_isk_mas9*/, 0 /*sth_isk_mas10*/, 0 /*sth_sat_iskmas1*/, 0 /*sth_sat_iskmas2*/, 0 /*sth_sat_iskmas3*/,
          0 /*sth_sat_iskmas4*/, 0 /*sth_sat_iskmas5*/, 0 /*sth_sat_iskmas6*/, 0 /*sth_sat_iskmas7*/, 0 /*sth_sat_iskmas8*/, 0 /*sth_sat_iskmas9*/, 0 /*sth_sat_iskmas10*/,
          0 /*sth_pos_satis*/, 0 /*sth_promosyon_fl*/, 0 /*sth_cari_cinsi*/, '' /*sth_cari_kodu*/, 0 /*sth_cari_grup_no*/, 
          '' /*sth_isemri_gider_kodu*/, '' /*sth_plasiyer_kodu*/, 0 /*sth_har_doviz_cinsi*/, 0 /*sth_har_doviz_kuru*/, 0 /*sth_alt_doviz_kuru*/, 
          0 /*sth_stok_doviz_cinsi*/, 0 /*sth_stok_doviz_kuru*/, ${e.quantity} /*sth_miktar*/, 0 /*sth_miktar2*/, 1 /*sth_birim_pntr*/, 
          ${tutar} /*sth_tutar*/, 0 /*sth_iskonto1*/, 0 /*sth_iskonto2*/, 0 /*sth_iskonto3*/, 0 /*sth_iskonto4*/, 0 /*sth_iskonto5*/, 0 /*sth_iskonto6*/, 
          0 /*sth_masraf1*/, 0 /*sth_masraf2*/, 0 /*sth_masraf3*/, 0 /*sth_masraf4*/, @VergiPntr /*sth_vergi_pntr*/, 
          ${vergi} /*sth_vergi*/, 0 /*sth_masraf_vergi_pntr*/, 0 /*sth_masraf_vergi*/, 0 /*sth_netagirlik*/, 0 /*sth_odeme_op*/,
          '${e.barcode}' /*sth_aciklama*/, '00000000-0000-0000-0000-000000000000' /*sth_sip_uid*/, '00000000-0000-0000-0000-000000000000' /*sth_fat_uid*/, 
          0 /*sth_giris_depo_no*/, @DepoNo /*sth_cikis_depo_no*/, @Tarih /*sth_malkbl_sevk_tarihi*/, '${posComputerDoc.responsibilityId || storeDoc.responsibilityId}' /*sth_cari_srm_merkezi*/, 
          '${posComputerDoc.responsibilityId || storeDoc.responsibilityId}' /*sth_stok_srm_merkezi*/, '1899-12-30 00:00:00.000' /*sth_fis_tarihi*/, 0 /*sth_fis_sirano*/, 
          0 /*sth_vergisiz_fl*/, 0 /*sth_maliyet_ana*/, 0 /*sth_maliyet_alternatif*/, 0 /*sth_maliyet_orjinal*/, 0 /*sth_adres_no*/, 
          '' /*sth_parti_kodu*/, 0 /*sth_lot_no*/, '00000000-0000-0000-0000-000000000000' /*sth_kons_uid*/, 
          '${posComputerDoc.projectId || storeDoc.projectId}' /*sth_proje_kodu*/, '' /*sth_exim_kodu*/, 0 /*sth_otv_pntr*/, 0 /*sth_otv_vergi*/, 
          0 /*sth_brutagirlik*/, 1 /*sth_disticaret_turu*/, 0 /*sth_otvtutari*/, 0 /*sth_otvvergisiz_fl*/, 0 /*sth_oiv_pntr*/, 
          0 /*sth_oiv_vergi*/, 0 /*sth_oivvergisiz_fl*/, 1 /*sth_fiyat_liste_no*/, 0 /*sth_oivtutari*/, 0 /*sth_Tevkifat_turu*/, 
          0 /*sth_nakliyedeposu*/, 0 /*sth_nakliyedurumu*/, '00000000-0000-0000-0000-000000000000' /*sth_yetkili_uid*/, 0 /*sth_taxfree_fl*/, 
          0 /*sth_ilave_edilecek_kdv*/, '' /*sth_ismerkezi_kodu*/, '' /*sth_HareketGrupKodu1*/, '' /*sth_HareketGrupKodu2*/, '' /*sth_HareketGrupKodu3*/, 
          0 /*sth_Olcu1*/, 0 /*sth_Olcu2*/, 0 /*sth_Olcu3*/, 0 /*sth_Olcu4*/, 0 /*sth_Olcu5*/, 0 /*sth_FormulMiktarNo*/, 0 /*sth_FormulMiktar*/, 
          0 /*sth_eirs_senaryo*/, 0 /*sth_eirs_tipi*/, '1899-12-30 00:00:00.000' /*sth_teslim_tarihi*/, 0 /*sth_matbu_fl*/, 0 /*sth_satis_fiyat_doviz_cinsi*/, 
          0 /*sth_satis_fiyat_doviz_kuru*/, '' /*sth_eticaret_kanal_kodu*/, '' /*sth_bagli_ithalat_kodu*/, 0 /*sth_tevkifat_sifirlandi_fl*/,
          '${fisData.id}');
        `
      })
      query += `SET @SatirNo=-1;`
      let odemeToplam = 0
      fisData.payments.forEach(e => {
        odemeToplam += e.amount
      })

      fisData.payments.forEach(e => {
        query += `SET @SatirNo=@SatirNo+1;
          SET @OdemeOran=${e.amount}/${odemeToplam};
          INSERT INTO O_${tarih}_${depoNo} (po_Guid, po_DBCno, po_SpecRECno, po_iptal, po_fileid, po_hidden, po_kilitli, po_degisti, po_checksum, po_create_user, po_create_date, po_lastup_user, po_lastup_date, po_special1, po_special2, po_special3, po_firmano, po_subeno, po_KasaKodu, po_BelgeNo, po_MyeZNo, po_KasiyerKodu, po_BelgeTarihi, po_BelgeToplam, po_VerMtrh0, po_VerMtrh1, po_VerMtrh2, po_VerMtrh3, po_VerMtrh4, po_VerMtrh5, po_VerMtrh6, po_VerMtrh7, po_VerMtrh8, po_VerMtrh9, po_VerMtrh10, po_VerMtrh11, po_VerMtrh12, po_VerMtrh13, po_VerMtrh14, po_VerMtrh15, po_VerMtrh16, po_VerMtrh17, po_VerMtrh18, po_VerMtrh19, po_VerMtrh20, po_Vergi1, po_Vergi2, po_Vergi3, po_Vergi4, po_Vergi5, po_Vergi6, po_Vergi7, po_Vergi8, po_Vergi9, po_Vergi10, po_Vergi11, po_Vergi12, po_Vergi13, po_Vergi14, po_Vergi15, po_Vergi16, po_Vergi17, po_Vergi18, po_Vergi19, po_Vergi20, po_Fisfatura, po_Pozisyon, po_CariKodu, po_Yuvarlama, po_Odm_AnaDtut1, po_Odm_OrjDtut1, po_Odm_AnaDtut2, po_Odm_OrjDtut2, po_Odm_AnaDtut3, po_Odm_OrjDtut3, po_Odm_AnaDtut4, po_Odm_OrjDtut4, po_Odm_AnaDtut5, po_Odm_OrjDtut5, po_Odm_AnaDtut6, po_Odm_OrjDtut6, po_Odm_AnaDtut7, po_Odm_OrjDtut7, po_Odm_AnaDtut8, po_Odm_OrjDtut8, po_Odm_AnaDtut9, po_Odm_OrjDtut9, po_Odm_AnaDtut10, po_Odm_OrjDtut10, po_Odm_AnaDtut11, po_Odm_OrjDtut11, po_Odm_AnaDtut12, po_Odm_OrjDtut12, po_Odm_AnaDtut13, po_Odm_OrjDtut13, po_Odm_AnaDtut14, po_Odm_OrjDtut14, po_Odm_AnaDtut15, po_Odm_OrjDtut15, po_Odm_AnaDtut16, po_Odm_OrjDtut16, po_Odm_AnaDtut17, po_Odm_OrjDtut17, po_Odm_AnaDtut18, po_Odm_OrjDtut18, po_Odm_AnaDtut19, po_Odm_OrjDtut19, po_Odm_AnaDtut20, po_Odm_OrjDtut20, po_Odm_AnaDtut21, po_Odm_OrjDtut21, po_Odm_AnaDtut22, po_Odm_OrjDtut22, po_Odm_AnaDtut23, po_Odm_OrjDtut23, po_Odm_AnaDtut24, po_Odm_OrjDtut24, po_Odm_AnaDtut25, po_Odm_OrjDtut25, po_Odm_AnaDtut26, po_Odm_OrjDtut26, po_Odm_AnaDtut27, po_Odm_OrjDtut27, po_Odm_AnaDtut28, po_Odm_OrjDtut28, po_Odm_AnaDtut29, po_Odm_OrjDtut29, po_Odm_AnaDtut30, po_Odm_OrjDtut30, po_Odm_AnaDtut31, po_Odm_OrjDtut31, po_Odm_AnaDtut32, po_Odm_OrjDtut32, po_Odm_AnaDtut33, po_Odm_OrjDtut33, po_Odm_AnaDtut34, po_Odm_OrjDtut34, po_Odm_AnaDtut35, po_Odm_OrjDtut35, po_Odm_AnaDtut36, po_Odm_OrjDtut36, po_Odm_AnaDtut37, po_Odm_OrjDtut37, 
            po_Odm_AnaDtut38, po_Odm_OrjDtut38, po_Odm_AnaDtut39, po_Odm_OrjDtut39, po_Odm_AnaDtut40, po_Odm_OrjDtut40, po_Odm_AnaDtut41, po_Odm_OrjDtut41, po_Odm_AnaDtut42, po_Odm_OrjDtut42, po_Odm_AnaDtut43, po_Odm_OrjDtut43, po_Odm_AnaDtut44, po_Odm_OrjDtut44, po_Odm_AnaDtut45, po_Odm_OrjDtut45, po_Odm_AnaDtut46, po_Odm_OrjDtut46, po_Odm_AnaDtut47, po_Odm_OrjDtut47, po_Odm_AnaDtut48, po_Odm_OrjDtut48, po_Odm_AnaDtut49, po_Odm_OrjDtut49, po_Odm_AnaDtut50, po_Odm_OrjDtut50, po_Vadeler_OdemeTipi1, po_Vadeler_vade1, 
            po_Vadeler_Tutar1, po_Vadeler_OdemeTipi2, po_Vadeler_vade2, po_Vadeler_Tutar2, po_Vadeler_OdemeTipi3, po_Vadeler_vade3, po_Vadeler_Tutar3, po_Vadeler_OdemeTipi4, po_Vadeler_vade4, po_Vadeler_Tutar4, po_Vadeler_OdemeTipi5, po_Vadeler_vade5, po_Vadeler_Tutar5, po_Vadeler_OdemeTipi6, po_Vadeler_vade6, po_Vadeler_Tutar6, po_Vadeler_OdemeTipi7, po_Vadeler_vade7, po_Vadeler_Tutar7, po_Vadeler_OdemeTipi8, po_Vadeler_vade8, po_Vadeler_Tutar8, po_Vadeler_OdemeTipi9, po_Vadeler_vade9, po_Vadeler_Tutar9, po_Vadeler_OdemeTipi10, po_Vadeler_vade10, po_Vadeler_Tutar10, po_Vadeler_OdemeTipi11, po_Vadeler_vade11, po_Vadeler_Tutar11, po_Vadeler_OdemeTipi12, po_Vadeler_vade12, po_Vadeler_Tutar12, po_Vadeler_OdemeTipi13, po_Vadeler_vade13, po_Vadeler_Tutar13, po_Vadeler_OdemeTipi14, po_Vadeler_vade14, po_Vadeler_Tutar14, po_Vadeler_OdemeTipi15, po_Vadeler_vade15, po_Vadeler_Tutar15, po_Vadeler_OdemeTipi16, po_Vadeler_vade16, po_Vadeler_Tutar16, po_Vadeler_OdemeTipi17, po_Vadeler_vade17, po_Vadeler_Tutar17, po_Vadeler_OdemeTipi18, po_Vadeler_vade18, po_Vadeler_Tutar18, po_Vadeler_OdemeTipi19, po_Vadeler_vade19, po_Vadeler_Tutar19, po_Vadeler_OdemeTipi20, po_Vadeler_vade20, po_Vadeler_Tutar20, po_Vadeler_OdemeTipi21, po_Vadeler_vade21, po_Vadeler_Tutar21, po_Vadeler_OdemeTipi22, po_Vadeler_vade22, po_Vadeler_Tutar22, po_Vadeler_OdemeTipi23, po_Vadeler_vade23, po_Vadeler_Tutar23, po_Vadeler_OdemeTipi24, po_Vadeler_vade24, po_Vadeler_Tutar24, po_Vadeler_OdemeTipi25, po_Vadeler_vade25, po_Vadeler_Tutar25, po_Vadeler_OdemeTipi26, po_Vadeler_vade26, po_Vadeler_Tutar26, po_Vadeler_OdemeTipi27, po_Vadeler_vade27, po_Vadeler_Tutar27, po_Vadeler_OdemeTipi28, po_Vadeler_vade28, po_Vadeler_Tutar28, po_Vadeler_OdemeTipi29, po_Vadeler_vade29, po_Vadeler_Tutar29, po_Vadeler_OdemeTipi30, po_Vadeler_vade30, po_Vadeler_Tutar30, po_Vadeler_OdemeTipi31, po_Vadeler_vade31, po_Vadeler_Tutar31, po_Vadeler_OdemeTipi32, po_Vadeler_vade32, po_Vadeler_Tutar32, po_Vadeler_OdemeTipi33, po_Vadeler_vade33, po_Vadeler_Tutar33, po_Vadeler_OdemeTipi34, po_Vadeler_vade34, po_Vadeler_Tutar34, po_Vadeler_OdemeTipi35, po_Vadeler_vade35, po_Vadeler_Tutar35, po_Vadeler_OdemeTipi36, po_Vadeler_vade36, po_Vadeler_Tutar36, po_Tks_Satis, 
            po_Tks_Satis_Tutar, po_Odm_TaksitTipi1, po_Odm_TaksitTipi2, po_Odm_TaksitTipi3, po_Odm_TaksitTipi4, po_Odm_TaksitTipi5, po_Odm_TaksitTipi6, po_Odm_TaksitTipi7, po_Odm_TaksitTipi8, po_Odm_TaksitTipi9, po_Odm_TaksitTipi10, po_Odm_TaksitTipi11, po_Odm_TaksitTipi12, po_Odm_TaksitTipi13, po_Odm_TaksitTipi14, po_Odm_TaksitTipi15, po_Odm_TaksitTipi16, po_Odm_TaksitTipi17, po_Odm_TaksitTipi18, po_Odm_TaksitTipi19, po_Odm_TaksitTipi20, po_Odm_TaksitTipi21, po_Odm_TaksitTipi22, po_Odm_TaksitTipi23, po_Odm_TaksitTipi24, po_Odm_TaksitTipi25, po_Odm_TaksitTipi26, po_Odm_TaksitTipi27, po_Odm_TaksitTipi28, po_Odm_TaksitTipi29, po_Odm_TaksitTipi30, po_Odm_TaksitTipi31, po_Odm_TaksitTipi32, po_Odm_TaksitTipi33, po_Odm_TaksitTipi34, po_Odm_TaksitTipi35, po_Odm_TaksitTipi36, po_Odm_TaksitTipi37, po_Odm_TaksitTipi38, po_Odm_TaksitTipi39, po_Odm_TaksitTipi40, po_Odm_TaksitTipi41, po_Odm_TaksitTipi42, po_Odm_TaksitTipi43, po_Odm_TaksitTipi44, po_Odm_TaksitTipi45, po_Odm_TaksitTipi46, po_Odm_TaksitTipi47, po_Odm_TaksitTipi48, po_Odm_TaksitTipi49, po_Odm_TaksitTipi50, po_OdemeNo1, po_ProvizyonKodu1, po_ProvizyonTutari1, po_OdemeNo2, po_ProvizyonKodu2, po_ProvizyonTutari2, po_OdemeNo3, po_ProvizyonKodu3, po_ProvizyonTutari3, po_OdemeNo4, po_ProvizyonKodu4, po_ProvizyonTutari4, po_OdemeNo5, po_ProvizyonKodu5, po_ProvizyonTutari5, po_OdemeNo6, po_ProvizyonKodu6, po_ProvizyonTutari6, po_Tahsilat_evrakno_seri, po_Tahsilat_evrakno_sira, po_Tahsilat_Tutari, po_ParaUstuOdemeTipi, po_ParaUstuAnaDtut, po_ParaUstuOrjDtut, po_EvrakID, po_AdresNo, po_EArsivSeri, po_EArsivSira, po_ZNo, po_FNo, po_EJNo, po_OKCEvrakID, po_YolcuBeraberKod, po_YolcuBeraberIstisnaKodu, po_YolcuBeraberAraciKurumKodu, po_GibeGonderildiFl
          , integrationCode)
          VALUES(NEWID(), 0, 0, 0, 1003, 0, 0, 0, 0, @MikroUserNo, GETDATE(), @MikroUserNo, GETDATE(), '', '', '', 0, 0, 
            @EvrakSeri /*po_KasaKodu*/, @EvrakSira /*po_BelgeNo*/, ${fisData.batchNo || 0} /*po_MyeZNo*/, '' /*po_KasiyerKodu*/, 
            '${fisData.endDate}' /*po_BelgeTarihi*/, ${e.amount} /*po_BelgeToplam*/, @VergiMatrah0*@OdemeOran /*po_VerMtrh0*/, 
            @VergiMatrah1*@OdemeOran /*po_VerMtrh1*/, @VergiMatrah2*@OdemeOran /*po_VerMtrh2*/, @VergiMatrah3*@OdemeOran /*po_VerMtrh3*/,
            @VergiMatrah4*@OdemeOran /*po_VerMtrh4*/, @VergiMatrah5*@OdemeOran /*po_VerMtrh5*/, @VergiMatrah6*@OdemeOran /*po_VerMtrh6*/, 
            0 /*po_VerMtrh7*/, 0 /*po_VerMtrh8*/, 0 /*po_VerMtrh9*/, 0 /*po_VerMtrh10*/, 0 /*po_VerMtrh11*/, 0 /*po_VerMtrh12*/, 0 /*po_VerMtrh13*/, 
            0 /*po_VerMtrh14*/, 0 /*po_VerMtrh15*/, 0 /*po_VerMtrh16*/, 0 /*po_VerMtrh17*/, 0 /*po_VerMtrh18*/, 0 /*po_VerMtrh19*/, 0 /*po_VerMtrh20*/, 
            @Vergi1*@OdemeOran /*po_Vergi1*/, @Vergi2*@OdemeOran /*po_Vergi2*/, @Vergi3*@OdemeOran /*po_Vergi3*/, @Vergi4*@OdemeOran /*po_Vergi4*/, 
            @Vergi5*@OdemeOran /*po_Vergi5*/, @Vergi6*@OdemeOran /*po_Vergi6*/, 0 /*po_Vergi7*/, 0 /*po_Vergi8*/, 0 /*po_Vergi9*/, 
            0 /*po_Vergi10*/, 0 /*po_Vergi11*/, 0 /*po_Vergi12*/, 0 /*po_Vergi13*/, 0 /*po_Vergi14*/, 0 /*po_Vergi15*/, 0 /*po_Vergi16*/, 
            0 /*po_Vergi17*/, 0 /*po_Vergi18*/, 0 /*po_Vergi19*/, 0 /*po_Vergi20*/, 0 /*po_Fisfatura*/, 1 /*po_Pozisyon*/, 
            '' /*po_CariKodu*/, 0 /*po_Yuvarlama*/, ${e.amount} /*po_Odm_AnaDtut1*/, ${e.amount} /*po_Odm_OrjDtut1*/, 0 /*po_Odm_AnaDtut2*/, 0 /*po_Odm_OrjDtut2*/, 0 /*po_Odm_AnaDtut3*/, 0 /*po_Odm_OrjDtut3*/, 0 /*po_Odm_AnaDtut4*/, 
            0 /*po_Odm_OrjDtut4*/, 0 /*po_Odm_AnaDtut5*/, 0 /*po_Odm_OrjDtut5*/, 0 /*po_Odm_AnaDtut6*/, 0 /*po_Odm_OrjDtut6*/, 0 /*po_Odm_AnaDtut7*/, 0 /*po_Odm_OrjDtut7*/, 
            0 /*po_Odm_AnaDtut8*/, 0 /*po_Odm_OrjDtut8*/, 0 /*po_Odm_AnaDtut9*/, 0 /*po_Odm_OrjDtut9*/, 0 /*po_Odm_AnaDtut10*/, 0 /*po_Odm_OrjDtut10*/, 
            0 /*po_Odm_AnaDtut11*/, 0 /*po_Odm_OrjDtut11*/, 0 /*po_Odm_AnaDtut12*/, 0 /*po_Odm_OrjDtut12*/, 0 /*po_Odm_AnaDtut13*/, 0 /*po_Odm_OrjDtut13*/, 
            0 /*po_Odm_AnaDtut14*/, 0 /*po_Odm_OrjDtut14*/, 0 /*po_Odm_AnaDtut15*/, 0 /*po_Odm_OrjDtut15*/, 0 /*po_Odm_AnaDtut16*/, 0 /*po_Odm_OrjDtut16*/, 
            0 /*po_Odm_AnaDtut17*/, 0 /*po_Odm_OrjDtut17*/, 0 /*po_Odm_AnaDtut18*/, 0 /*po_Odm_OrjDtut18*/, 0 /*po_Odm_AnaDtut19*/, 0 /*po_Odm_OrjDtut19*/, 
            0 /*po_Odm_AnaDtut20*/, 0 /*po_Odm_OrjDtut20*/, 0 /*po_Odm_AnaDtut21*/, 0 /*po_Odm_OrjDtut21*/, 0 /*po_Odm_AnaDtut22*/, 0 /*po_Odm_OrjDtut22*/, 
            0 /*po_Odm_AnaDtut23*/, 0 /*po_Odm_OrjDtut23*/, 0 /*po_Odm_AnaDtut24*/, 0 /*po_Odm_OrjDtut24*/, 0 /*po_Odm_AnaDtut25*/, 0 /*po_Odm_OrjDtut25*/, 
            0 /*po_Odm_AnaDtut26*/, 0 /*po_Odm_OrjDtut26*/, 0 /*po_Odm_AnaDtut27*/, 0 /*po_Odm_OrjDtut27*/, 0 /*po_Odm_AnaDtut28*/, 0 /*po_Odm_OrjDtut28*/, 
            0 /*po_Odm_AnaDtut29*/, 0 /*po_Odm_OrjDtut29*/, 0 /*po_Odm_AnaDtut30*/, 0 /*po_Odm_OrjDtut30*/, 0 /*po_Odm_AnaDtut31*/, 0 /*po_Odm_OrjDtut31*/, 
            0 /*po_Odm_AnaDtut32*/, 0 /*po_Odm_OrjDtut32*/, 0 /*po_Odm_AnaDtut33*/, 0 /*po_Odm_OrjDtut33*/, 0 /*po_Odm_AnaDtut34*/, 0 /*po_Odm_OrjDtut34*/, 
            0 /*po_Odm_AnaDtut35*/, 0 /*po_Odm_OrjDtut35*/, 0 /*po_Odm_AnaDtut36*/, 0 /*po_Odm_OrjDtut36*/, 0 /*po_Odm_AnaDtut37*/, 0 /*po_Odm_OrjDtut37*/, 
            0 /*po_Odm_AnaDtut38*/, 0 /*po_Odm_OrjDtut38*/, 0 /*po_Odm_AnaDtut39*/, 0 /*po_Odm_OrjDtut39*/, 0 /*po_Odm_AnaDtut40*/, 
            0 /*po_Odm_OrjDtut40*/, 0 /*po_Odm_AnaDtut41*/, 0 /*po_Odm_OrjDtut41*/, 0 /*po_Odm_AnaDtut42*/, 0 /*po_Odm_OrjDtut42*/, 0 /*po_Odm_AnaDtut43*/, 
            0 /*po_Odm_OrjDtut43*/, 0 /*po_Odm_AnaDtut44*/, 0 /*po_Odm_OrjDtut44*/, 0 /*po_Odm_AnaDtut45*/, 0 /*po_Odm_OrjDtut45*/, 0 /*po_Odm_AnaDtut46*/, 
            0 /*po_Odm_OrjDtut46*/, 0 /*po_Odm_AnaDtut47*/, 0 /*po_Odm_OrjDtut47*/, 0 /*po_Odm_AnaDtut48*/, 0 /*po_Odm_OrjDtut48*/, 0 /*po_Odm_AnaDtut49*/, 
            0 /*po_Odm_OrjDtut49*/, 0 /*po_Odm_AnaDtut50*/, 0 /*po_Odm_OrjDtut50*/,  0 /*po_Vadeler_OdemeTipi1*/, 
            '1899-12-30 00:00:00.000' /*po_Vadeler_vade1*/, 0 /*po_Vadeler_Tutar1*/, 0 /*po_Vadeler_OdemeTipi2*/,
            '1899-12-30 00:00:00.000' /*po_Vadeler_vade2*/, 0 /*po_Vadeler_Tutar2*/, 0 /*po_Vadeler_OdemeTipi3*/, 
            '1899-12-30 00:00:00.000' /*po_Vadeler_vade3*/, 0 /*po_Vadeler_Tutar3*/, 0 /*po_Vadeler_OdemeTipi4*/,
            '1899-12-30 00:00:00.000' /*po_Vadeler_vade4*/, 0 /*po_Vadeler_Tutar4*/, 0 /*po_Vadeler_OdemeTipi5*/,
            '1899-12-30 00:00:00.000' /*po_Vadeler_vade5*/, 0 /*po_Vadeler_Tutar5*/, 0 /*po_Vadeler_OdemeTipi6*/, 
            '1899-12-30 00:00:00.000' /*po_Vadeler_vade6*/, 0 /*po_Vadeler_Tutar6*/, 0 /*po_Vadeler_OdemeTipi7*/, 
            '1899-12-30 00:00:00.000' /*po_Vadeler_vade7*/, 0 /*po_Vadeler_Tutar7*/, 0 /*po_Vadeler_OdemeTipi8*/, 
            '1899-12-30 00:00:00.000' /*po_Vadeler_vade8*/, 0 /*po_Vadeler_Tutar8*/, 0 /*po_Vadeler_OdemeTipi9*/,
            '1899-12-30 00:00:00.000' /*po_Vadeler_vade9*/, 0 /*po_Vadeler_Tutar9*/, 0 /*po_Vadeler_OdemeTipi10*/, 
            '1899-12-30 00:00:00.000' /*po_Vadeler_vade10*/, 0 /*po_Vadeler_Tutar10*/, 0 /*po_Vadeler_OdemeTipi11*/, 
            '1899-12-30 00:00:00.000' /*po_Vadeler_vade11*/, 0 /*po_Vadeler_Tutar11*/, 0 /*po_Vadeler_OdemeTipi12*/,
            '1899-12-30 00:00:00.000' /*po_Vadeler_vade12*/, 0 /*po_Vadeler_Tutar12*/, 0 /*po_Vadeler_OdemeTipi13*/,
            '1899-12-30 00:00:00.000' /*po_Vadeler_vade13*/, 0 /*po_Vadeler_Tutar13*/, 0 /*po_Vadeler_OdemeTipi14*/,
            '1899-12-30 00:00:00.000' /*po_Vadeler_vade14*/, 0 /*po_Vadeler_Tutar14*/, 0 /*po_Vadeler_OdemeTipi15*/,
            '1899-12-30 00:00:00.000' /*po_Vadeler_vade15*/, 0 /*po_Vadeler_Tutar15*/, 0 /*po_Vadeler_OdemeTipi16*/,
            '1899-12-30 00:00:00.000' /*po_Vadeler_vade16*/, 0 /*po_Vadeler_Tutar16*/, 0 /*po_Vadeler_OdemeTipi17*/,
            '1899-12-30 00:00:00.000' /*po_Vadeler_vade17*/, 0 /*po_Vadeler_Tutar17*/, 0 /*po_Vadeler_OdemeTipi18*/,
            '1899-12-30 00:00:00.000' /*po_Vadeler_vade18*/, 0 /*po_Vadeler_Tutar18*/, 0 /*po_Vadeler_OdemeTipi19*/,
            '1899-12-30 00:00:00.000' /*po_Vadeler_vade19*/, 0 /*po_Vadeler_Tutar19*/, 0 /*po_Vadeler_OdemeTipi20*/,
            '1899-12-30 00:00:00.000' /*po_Vadeler_vade20*/, 0 /*po_Vadeler_Tutar20*/, 0 /*po_Vadeler_OdemeTipi21*/,
            '1899-12-30 00:00:00.000' /*po_Vadeler_vade21*/, 0 /*po_Vadeler_Tutar21*/, 0 /*po_Vadeler_OdemeTipi22*/,
            '1899-12-30 00:00:00.000' /*po_Vadeler_vade22*/, 0 /*po_Vadeler_Tutar22*/, 0 /*po_Vadeler_OdemeTipi23*/,
            '1899-12-30 00:00:00.000' /*po_Vadeler_vade23*/, 0 /*po_Vadeler_Tutar23*/, 0 /*po_Vadeler_OdemeTipi24*/,
            '1899-12-30 00:00:00.000' /*po_Vadeler_vade24*/, 0 /*po_Vadeler_Tutar24*/, 0 /*po_Vadeler_OdemeTipi25*/,
            '1899-12-30 00:00:00.000' /*po_Vadeler_vade25*/, 0 /*po_Vadeler_Tutar25*/, 0 /*po_Vadeler_OdemeTipi26*/,
            '1899-12-30 00:00:00.000' /*po_Vadeler_vade26*/, 0 /*po_Vadeler_Tutar26*/, 0 /*po_Vadeler_OdemeTipi27*/,
            '1899-12-30 00:00:00.000' /*po_Vadeler_vade27*/, 0 /*po_Vadeler_Tutar27*/, 0 /*po_Vadeler_OdemeTipi28*/,
            '1899-12-30 00:00:00.000' /*po_Vadeler_vade28*/, 0 /*po_Vadeler_Tutar28*/, 0 /*po_Vadeler_OdemeTipi29*/,
            '1899-12-30 00:00:00.000' /*po_Vadeler_vade29*/, 0 /*po_Vadeler_Tutar29*/, 0 /*po_Vadeler_OdemeTipi30*/,
            '1899-12-30 00:00:00.000' /*po_Vadeler_vade30*/, 0 /*po_Vadeler_Tutar30*/, 0 /*po_Vadeler_OdemeTipi31*/,
            '1899-12-30 00:00:00.000' /*po_Vadeler_vade31*/, 0 /*po_Vadeler_Tutar31*/, 0 /*po_Vadeler_OdemeTipi32*/,
            '1899-12-30 00:00:00.000' /*po_Vadeler_vade32*/, 0 /*po_Vadeler_Tutar32*/, 0 /*po_Vadeler_OdemeTipi33*/,
            '1899-12-30 00:00:00.000' /*po_Vadeler_vade33*/, 0 /*po_Vadeler_Tutar33*/, 0 /*po_Vadeler_OdemeTipi34*/,
            '1899-12-30 00:00:00.000' /*po_Vadeler_vade34*/, 0 /*po_Vadeler_Tutar34*/, 0 /*po_Vadeler_OdemeTipi35*/,
            '1899-12-30 00:00:00.000' /*po_Vadeler_vade35*/, 0 /*po_Vadeler_Tutar35*/, 0 /*po_Vadeler_OdemeTipi36*/,
            '1899-12-30 00:00:00.000' /*po_Vadeler_vade36*/, 0 /*po_Vadeler_Tutar36*/, 0 /*po_Tks_Satis*/, 
            0 /*po_Tks_Satis_Tutar*/, 0 /*po_Odm_TaksitTipi1*/, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0 /*po_Odm_TaksitTipi50*/, 0 /*po_OdemeNo1*/, '' /*po_ProvizyonKodu1*/, 0 /*po_ProvizyonTutari1*/, 
            0 /*po_OdemeNo2*/, '' /*po_ProvizyonKodu2*/, 0 /*po_ProvizyonTutari2*/, 
            0 /*po_OdemeNo3*/, '' /*po_ProvizyonKodu3*/, 0 /*po_ProvizyonTutari3*/,
            0 /*po_OdemeNo4*/, '' /*po_ProvizyonKodu4*/, 0 /*po_ProvizyonTutari4*/, 
            0 /*po_OdemeNo5*/, '' /*po_ProvizyonKodu5*/, 0 /*po_ProvizyonTutari5*/, 
            0 /*po_OdemeNo6*/, '' /*po_ProvizyonKodu6*/, 0 /*po_ProvizyonTutari6*/, 
            '' /*po_Tahsilat_evrakno_seri*/, 0 /*po_Tahsilat_evrakno_sira*/, 0 /*po_Tahsilat_Tutari*/, 1 /*po_ParaUstuOdemeTipi*/,
            0 /*po_ParaUstuAnaDtut*/, 0 /*po_ParaUstuOrjDtut*/, 
            '' /*po_EvrakID*/, 0 /*po_AdresNo*/, '' /*po_EArsivSeri*/, '' /*po_EArsivSira*/, 0 /*po_ZNo*/, 0 /*po_FNo*/, 0 /*po_EJNo*/, 
            '' /*po_OKCEvrakID*/, '' /*po_YolcuBeraberKod*/, '' /*po_YolcuBeraberIstisnaKodu*/, 
            '' /*po_YolcuBeraberAraciKurumKodu*/, 0 /*po_GibeGonderildiFl*/, '${fisData.id}' /*integrationCode*/);
          `
      })
      query += `END;`

      // fs.writeFileSync(path.join(__dirname, 'workdataInsert_query.sql'), query, 'utf8')
      executeSqlDb(orgDoc, storeDoc.db + '_WORKDATA', query)
        .then(resolve)
        .catch(reject)
    } catch (error) {
      reject(error)
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
