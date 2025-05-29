export interface OrderHeader {
  _id?: string
  orderType?: string
  issueDate?: string
  docNoSerial?: string
  docNoSequence?: number
  orderNumber?: string
  documentNumber?: string
  documentDate?: string
  firmCode?: string
  firmName?: string
  warehouseId?: string
  warehouse?: string
  paymentPlanId?: string
  paymentPlan?: string
  projectId?: string
  project?: string
  responsibilityId?: string
  responsibility?: string
  quantity?: number
  delivered?: number
  amount?: number
  discountAmount1?: number
  discountAmount2?: number
  discountAmount3?: number
  discountAmount4?: number
  discountAmount5?: number
  discountAmount6?: number

  discountRate1?:number
  discountRate2?:number
  discountRate3?:number
  discountRate4?:number
  discountRate5?:number
  discountRate6?:number

  grossTotal?: number
  vatAmount?: number
  netTotal?: number
  currency?: string
  lineCount?: number
}

export interface OrderDetail {
  _id?: string
  orderId?:string
  lineNo?:number
  itemCode?:string
  itemName?:string
  barcode?:string
  quantity?:number
  delivered?:number
  remainder?:number
  unit?:string
  price?:number
  amount?:number
  discountAmount1?:number
  discountAmount2?:number
  discountAmount3?:number
  discountAmount4?:number
  discountAmount5?:number
  discountAmount6?:number

  discountRate1?:number
  discountRate2?:number
  discountRate3?:number
  discountRate4?:number
  discountRate5?:number
  discountRate6?:number
  vatRate?:number
  vatAmount?:number
  lineGrossTotal?:number
  lineNetTotal?:number
}

export function orderListQuery(top:number=100){
  return `SELECT TOP ${top} orderNumber as _id, *
, ROUND(100*CASE WHEN amount>0 THEN discountAmount1/amount ELSE 0 END,2) as discountRate1 
, ROUND(100*CASE WHEN (amount-discountAmount1)>0 THEN discountAmount2/(amount-discountAmount1) ELSE 0 END,2) as discountRate2 
, ROUND(100*CASE WHEN (amount-discountAmount1-discountAmount2)>0 THEN discountAmount3/(amount-discountAmount1-discountAmount2) ELSE 0 END,2) as discountRate3 
, ROUND(100*CASE WHEN (amount-discountAmount1-discountAmount2-discountAmount3)>0 THEN discountAmount4/(amount-discountAmount1-discountAmount2-discountAmount3) ELSE 0 END,2) as discountRate4
, ROUND(100*CASE WHEN (amount-discountAmount1-discountAmount2-discountAmount3-discountAmount4)>0 
	THEN discountAmount5/(amount-discountAmount1-discountAmount2-discountAmount3-discountAmount4) ELSE 0 END,2) as discountRate5
, ROUND(100*CASE WHEN (amount-discountAmount1-discountAmount2-discountAmount3-discountAmount4-discountAmount5)>0 
	THEN discountAmount5/(amount-discountAmount1-discountAmount2-discountAmount3-discountAmount4-discountAmount5) ELSE 0 END,2) as discountRate6
,ROUND(grossTotal+vat,2) as netTotal
FROM (
SELECT SIP.sip_tarih as issueDate, SIP.sip_evrakno_seri + CAST(SIP.sip_evrakno_sira as varchar(10)) as orderNumber, 
SIP.sip_belgeno as documentNumber,
dbo.fn_SiparisCins(SIP.sip_cins) as orderType,
SIP.sip_musteri_kod as firmCode, CARI.cari_unvan1 as firmName,
CAST(SIP.sip_depono as VARCHAR(10)) as warehouseId, CAST(SIP.sip_depono as VARCHAR(10)) + ' - ' + dbo.fn_DepoIsmi(SIP.sip_depono) as warehouse,
SUM(SIP.sip_miktar) as quantity, SUM(SIP.sip_teslim_miktar) as delivered,
ROUND(SUM(SIP.sip_tutar),2) as amount,
ROUND(SUM(SIP.sip_iskonto_1),2) as discountAmount1, ROUND(SUM(SIP.sip_iskonto_2),2) as discountAmount2, ROUND(SUM(SIP.sip_iskonto_3),2)  as discountAmount3,
ROUND(SUM(SIP.sip_iskonto_4),2) as discountAmount4, ROUND(SUM(SIP.sip_iskonto_5),2) as discountAmount5, ROUND(SUM(SIP.sip_iskonto_6),2) as discountAmount6,
ROUND(dbo.fn_SiparisNetTutar(SUM(SIP.sip_tutar),SUM(SIP.sip_iskonto_1),SUM(SIP.sip_iskonto_2),SUM(SIP.sip_iskonto_3),SUM(SIP.sip_iskonto_4),SUM(SIP.sip_iskonto_5),SUM(SIP.sip_iskonto_6)
,SUM(SIP.sip_masraf_1),SUM(SIP.sip_masraf_2),SUM(SIP.sip_masraf_3),SUM(SIP.sip_masraf_4),0,SUM(SIP.sip_masvergi),
SUM(SIP.sip_Otv_Vergi),SUM(SIP.sip_otvtutari),0,0, 1,0,0),2) as grossTotal,
ROUND(SUM(SIP.sip_vergi),2) as vat , dbo.fn_DovizSembolu(SIP.sip_doviz_cinsi) as currency,
COUNT(*) as lineCount
FROM SIPARISLER SIP INNER JOIN
CARI_HESAPLAR CARI on SIP.sip_musteri_kod = CARI.cari_kod
WHERE SIP.sip_tip=1 
and (
  ('{isClosed}'=1 AND (SIP.sip_miktar<=SIP.sip_teslim_miktar OR SIP.sip_kapat_fl=1))
   OR
  ('{isClosed}'=0 AND (SIP.sip_miktar>SIP.sip_teslim_miktar AND SIP.sip_kapat_fl=0))
  OR
  ('{isClosed}'='')
)
GROUP BY SIP.sip_tarih, SIP.sip_evrakno_seri , SIP.sip_evrakno_sira,
SIP.sip_cins, CARI.cari_unvan1,SIP.sip_musteri_kod , SIP.sip_depono,
SIP.sip_belgeno, SIP.sip_doviz_cinsi
) X
WHERE (firmCode like '%{search}%' or firmName like '%{search}%' or orderNumber like '%{search}%' or '{search}'='')
and (issueDate>='{startDate}' and issueDate<='{endDate}')
and (warehouseCode='{warehouseCode}' OR '{warehouseCode}'='')

ORDER BY issueDate DESC
`
}

export function orderHeaderQuery(orderId: string) {
  return `SELECT orderNumber as _id, *, quantity-delivered as remainder 
, ROUND(100*CASE WHEN amount>0 THEN discountAmount1/amount ELSE 0 END,2) as discountRate1 
, ROUND(100*CASE WHEN (amount-discountAmount1)>0 THEN discountAmount2/(amount-discountAmount1) ELSE 0 END,2) as discountRate2 
, ROUND(100*CASE WHEN (amount-discountAmount1-discountAmount2)>0 THEN discountAmount3/(amount-discountAmount1-discountAmount2) ELSE 0 END,2) as discountRate3 
, ROUND(100*CASE WHEN (amount-discountAmount1-discountAmount2-discountAmount3)>0 THEN discountAmount4/(amount-discountAmount1-discountAmount2-discountAmount3) ELSE 0 END,2) as discountRate4
, ROUND(100*CASE WHEN (amount-discountAmount1-discountAmount2-discountAmount3-discountAmount4)>0 
	THEN discountAmount5/(amount-discountAmount1-discountAmount2-discountAmount3-discountAmount4) ELSE 0 END,2) as discountRate5
, ROUND(100*CASE WHEN (amount-discountAmount1-discountAmount2-discountAmount3-discountAmount4-discountAmount5)>0 
	THEN discountAmount5/(amount-discountAmount1-discountAmount2-discountAmount3-discountAmount4-discountAmount5) ELSE 0 END,2) as discountRate6
,ROUND(grossTotal+vatAmount,2) as netTotal
  FROM (
    SELECT 
    dbo.fn_SiparisCins(SIP.sip_cins) as orderType,
    SIP.sip_tarih as issueDate,
    SIP.sip_evrakno_seri as docNoSerial,SIP.sip_evrakno_sira as docNoSequence,
    (SIP.sip_evrakno_seri + CAST(SIP.sip_evrakno_sira as varchar(10))) as orderNumber,
    SIP.sip_belgeno as documentNumber, SIP.sip_belge_tarih as documentDate,
    CARI.cari_kod as firmCode, CARI.cari_unvan1 as firmName,
    CAST(SIP.sip_depono as VARCHAR(10)) as warehouseId, CAST(SIP.sip_depono as VARCHAR(10)) + ' - ' + dbo.fn_DepoIsmi(SIP.sip_depono) as warehouse,
    SIP.sip_adresno,
    SUM(SIP.sip_miktar) as quantity, SUM(SIP.sip_teslim_miktar) as delivered,
    ROUND(SUM(SIP.sip_tutar),2) as amount,
    ROUND(SUM(SIP.sip_iskonto_1),2) as discountAmount1, ROUND(SUM(SIP.sip_iskonto_2),2) as discountAmount2, ROUND(SUM(SIP.sip_iskonto_3),2)  as discountAmount3,
    ROUND(SUM(SIP.sip_iskonto_4),2) as discountAmount4, ROUND(SUM(SIP.sip_iskonto_5),2) as discountAmount5, ROUND(SUM(SIP.sip_iskonto_6),2) as discountAmount6,
    ROUND(dbo.fn_SiparisNetTutar(SUM(SIP.sip_tutar),SUM(SIP.sip_iskonto_1),SUM(SIP.sip_iskonto_2),SUM(SIP.sip_iskonto_3),SUM(SIP.sip_iskonto_4),SUM(SIP.sip_iskonto_5),SUM(SIP.sip_iskonto_6)
    ,SUM(SIP.sip_masraf_1),SUM(SIP.sip_masraf_2),SUM(SIP.sip_masraf_3),SUM(SIP.sip_masraf_4),0,SUM(SIP.sip_masvergi),
    SUM(SIP.sip_Otv_Vergi),SUM(SIP.sip_otvtutari),0,0, 1,0,0),2) as grossTotal,
    ROUND(SUM(SIP.sip_vergi),2) as vatAmount , dbo.fn_DovizSembolu(SIP.sip_doviz_cinsi) as currency,
    COUNT(*) as lineCount , CAST(SIP.sip_opno as VARCHAR(10)) as paymentPlan, ISNULL(ODP.odp_kodu + '-' + ODP.odp_adi,'CASH') as paymentPlanName
    ,SIP.sip_stok_sormerk as responsibility , SIP.sip_projekodu as project
    FROM SIPARISLER SIP INNER JOIN
    CARI_HESAPLAR CARI ON SIP.sip_musteri_kod=CARI.cari_kod LEFT OUTER JOIN
    ODEME_PLANLARI ODP ON SIP.sip_opno= ODP.odp_no
    WHERE SIP.sip_tip=1
    GROUP BY SIP.sip_tarih,SIP.sip_belgeno,SIP.sip_evrakno_seri,SIP.sip_evrakno_sira,SIP.sip_belge_tarih,
    SIP.sip_depono,CARI.cari_kod, CARI.cari_unvan1, SIP.sip_adresno, SIP.sip_doviz_cinsi, SIP.sip_cins,
    SIP.sip_opno,ODP.odp_kodu, ODP.odp_adi,SIP.sip_stok_sormerk, SIP.sip_projekodu
    ) X
    WHERE orderNumber='${orderId}';`
}

export function orderDetailQuery(orderId: string) {
  return `SELECT *, quantity-delivered as remainder 
, ROUND(100*CASE WHEN amount>0 THEN discountAmount1/amount ELSE 0 END,2) as discountRate1 
, ROUND(100*CASE WHEN (amount-discountAmount1)>0 THEN discountAmount2/(amount-discountAmount1) ELSE 0 END,2) as discountRate2 
, ROUND(100*CASE WHEN (amount-discountAmount1-discountAmount2)>0 THEN discountAmount3/(amount-discountAmount1-discountAmount2) ELSE 0 END,2) as discountRate3 
, ROUND(100*CASE WHEN (amount-discountAmount1-discountAmount2-discountAmount3)>0 THEN discountAmount4/(amount-discountAmount1-discountAmount2-discountAmount3) ELSE 0 END,2) as discountRate4
, ROUND(100*CASE WHEN (amount-discountAmount1-discountAmount2-discountAmount3-discountAmount4)>0 
	THEN discountAmount5/(amount-discountAmount1-discountAmount2-discountAmount3-discountAmount4) ELSE 0 END,2) as discountRate5
, ROUND(100*CASE WHEN (amount-discountAmount1-discountAmount2-discountAmount3-discountAmount4-discountAmount5)>0 
	THEN discountAmount5/(amount-discountAmount1-discountAmount2-discountAmount3-discountAmount4-discountAmount5) ELSE 0 END,2) as discountRate6
,ROUND(lineGrossTotal+vatAmount,2) as lineNetTotal
FROM (
SELECT SIP.sip_Guid as _id,
(SIP.sip_evrakno_seri + CAST(SIP.sip_evrakno_sira as VARCHAR(10))) as orderId,
SIP.sip_satirno as [lineNo], SIP.sip_stok_kod as itemCode, S.sto_isim as itemName
, ISNULL((SELECT TOP 1 bar_kodu FROM BARKOD_TANIMLARI WHERE bar_stokkodu= S.sto_kod),'') as barcode
,SIP.sip_miktar as quantity, SIP.sip_teslim_miktar as delivered, S.sto_birim1_ad as unit
,SIP.sip_b_fiyat as price, SIP.sip_tutar as amount ,
SIP.sip_iskonto_1 as discountAmount1,SIP.sip_iskonto_2 as discountAmount2,SIP.sip_iskonto_3 as discountAmount3,SIP.sip_iskonto_4 as discountAmount4,SIP.sip_iskonto_5 as discountAmount5,SIP.sip_iskonto_6 as discountAmount6,
dbo.fn_VergiYuzde(SIP.sip_vergi_pntr) as vatRate, SIP.sip_vergi as vatAmount,
dbo.fn_SiparisNetTutar(SIP.sip_tutar,SIP.sip_iskonto_1,SIP.sip_iskonto_2,SIP.sip_iskonto_3,SIP.sip_iskonto_4,SIP.sip_iskonto_5,SIP.sip_iskonto_6
,SIP.sip_masraf_1,SIP.sip_masraf_2,SIP.sip_masraf_3,SIP.sip_masraf_4,0, SIP.sip_masvergi,SIP.sip_Otv_Vergi,SIP.sip_otvtutari
,SIP.sip_vergisiz_fl,SIP.sip_doviz_cinsi, SIP.sip_doviz_kuru, SIP.sip_alt_doviz_kuru, 0) as lineGrossTotal

FROM SIPARISLER SIP INNER JOIN
STOKLAR S ON SIP.sip_stok_kod = S.sto_kod

WHERE 1=1
) X
WHERE orderId='${orderId}'
order by [lineNo]
  `
}

export function paymentPlanQuery(){
  return `SELECT _id, [name] FROM (
            SELECT '0' as _id, 'Peşin' as [name]
            union all
            SELECT CAST(odp_no as VARCHAR(10)) as _id, LOWER(LTRIM(RTRIM(odp_kodu + ' ' + odp_adi))) as [name]  FROM ODEME_PLANLARI 
            ) X
            `
}

export function responsibilityQuery(){
  return `SELECT som_kod as _id, LOWER(som_isim) as [name] FROM SORUMLULUK_MERKEZLERI ORDER BY som_isim`
}

export function projectQuery(){
  return `SELECT pro_kodu as _id, LOWER(pro_adi) as [name] FROM PROJELER ORDER BY pro_adi`
}