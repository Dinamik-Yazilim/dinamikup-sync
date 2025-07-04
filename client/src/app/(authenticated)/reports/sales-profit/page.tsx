"use client"

import { useEffect, useState } from 'react'
import { getItem, getList, postItem, putItem } from '@/lib/fetch'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'
import { useToast } from '@/components/ui/use-toast'
import { TsnSelect } from '@/components/ui216/tsn-select'
import { useLanguage } from '@/i18n'
import { StandartForm } from '@/components/ui216/standart-form'
import { TsnInput } from '@/components/ui216/tsn-input'
import { Label } from '@/components/ui/label'
import { TsnPanel } from '@/components/ui216/tsn-panel'
import { ChartAreaIcon, PackageCheckIcon, Users2Icon } from 'lucide-react'
import { getRoleList, Member } from '@/types/Member'
import { ListGrid } from '@/components/ui216/list-grid'
import { TsnGrid } from '@/components/ui216/tsn-grid'
import { moneyFormat, today } from '@/lib/utils'
import { TsnSelectRemote } from '@/components/ui216/tsn-select-remote'

export default function SalesProfitPage() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState<salesProfitQueryProps>({
    startDate:today(),
    endDate:today(),
    search:'', mainGroup:'',subGroup:'',category:'',brand:'',rayon:''
  })
  const router = useRouter()
  const { t } = useLanguage()
 
  return (
    <TsnGrid
      query={salesProfitQuery(filter)}
      title={t('Sales Profit')}
      icon=<ChartAreaIcon />
      onSearchChanged={e=>setFilter({...filter,search:e})}
      onFilterPanel={() => {
        const [mainLoading,setMainLoading]=useState(false)
        return (<div className='flex flex-col gap-1'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-2'>
            <TsnInput type='date' title={t('Start Date')} defaultValue={filter.startDate} onChange={e=>setFilter({...filter, startDate:e.target.value})} />
            <TsnInput type='date' title={t('End Date')} defaultValue={filter.endDate} onChange={e=>setFilter({...filter, endDate:e.target.value})} />
          </div>
          <TsnSelectRemote all title={t('Main Group')} value={filter.mainGroup} 
            onValueChange={e => {
              setMainLoading(true)
              setFilter({...filter,mainGroup:e, subGroup:'', category:'', brand:'', rayon:''})
              setTimeout(()=>setMainLoading(false),500)
            }}
           query={`SELECT san_kod as _id, san_isim as name FROM STOK_ANA_GRUPLARI ORDER BY san_isim`}
          //  onLoadingFinish={()=>setMainLoading(false)}
            />
          {filter.mainGroup && !mainLoading && <TsnSelectRemote all title={t('Sub Group')} value={filter.subGroup} onValueChange={e => setFilter({...filter,subGroup:e})} query={`SELECT sta_kod as _id, sta_isim as name FROM STOK_ALT_GRUPLARI WHERE sta_ana_grup_kod='${filter.mainGroup}' ORDER BY sta_isim`} />}
          {filter.mainGroup && !mainLoading && <TsnSelectRemote all title={t('Category')} value={filter.category} onValueChange={e => setFilter({...filter,category:e})} query={`SELECT ktg_kod as _id, ktg_isim as name FROM STOK_KATEGORILERI WHERE ktg_kod IN (SELECT DISTINCT sto_kategori_kodu FROM STOKLAR WHERE sto_anagrup_kod='${filter.mainGroup}') ORDER BY ktg_isim`} /> }
          {filter.mainGroup && !mainLoading && <TsnSelectRemote all title={t('Brand')} value={filter.brand} onValueChange={e => setFilter({...filter,brand:e})} query={`SELECT mrk_kod as _id, mrk_ismi as name FROM STOK_MARKALARI WHERE mrk_kod IN (SELECT DISTINCT sto_marka_kodu FROM STOKLAR WHERE sto_anagrup_kod='${filter.mainGroup}') ORDER BY mrk_ismi`} />}
          {filter.mainGroup && !mainLoading && <TsnSelectRemote all title={t('Rayon')} value={filter.rayon} onValueChange={e => setFilter({...filter,rayon:e})} query={`SELECT ryn_kod as _id, ryn_ismi as name FROM STOK_REYONLARI WHERE ryn_kod IN (SELECT DISTINCT sto_reyon_kodu FROM STOKLAR WHERE sto_anagrup_kod='${filter.mainGroup}')  ORDER BY ryn_ismi`} />}
        </div>)
      }}
      onHeaderPaint={() => <>
        <div className='grid grid-cols-8 w-full'>
          <div className='col-span-2 flex flex-row gap-1'>
            <div>{t('Code')}</div>
            <div>{t('Brand')}</div>
            <div>{t('Category')}</div>
            <div>{t('Rayon')}</div>
          </div>
          <div className='col-span-2 flex flex-row gap-1'>
            <div>{t('Name')}</div>
            <div>{t('Main Group')}</div>
            <div>{t('Sub Group')}</div>
          </div>
          <div className='text-end'>{t('Last Purchase')}</div>
          <div className='text-end'>{t('P.C. Price')}</div>
          <div className='text-end'>{t('Sales Price')}</div>
          <div className='text-end'>{t('Quantity')}</div>
        </div>
      </>}
      onRowPaint={(e: SalesProfit, rowIndex) => <div className='grid grid-cols-8 w-full'>
        <div className='col-span-2 flex flex-col gap-1 items-start'>
          <div>{e.itemCode}</div>
          <div className='text-[10px] p-[1px] px-[3px] bg-green-800 text-white rounded capitalize '>{e.brand?.toLowerCase()}</div>
          <div className='text-[10px] p-[1px] px-[3px] bg-purple-600 text-white rounded capitalize'>{e.category?.toLowerCase()}</div>
          <div className='text-[10px] p-[1px] px-[3px] bg-amber-800 text-white rounded capitalize'>{e.rayon?.toLowerCase()}</div>
        </div>
        <div className='col-span-2 flex flex-col gap-1 items-start'>
          <div className='capitalize'>{e.itemName?.toLowerCase()}</div>
          <div className='text-[10px] p-[1px] px-[3px] bg-blue-800 text-white rounded capitalize'>{e.mainGroup?.toLowerCase()}</div>
          <div className='text-[10px] p-[1px] px-[3px] bg-slate-500 text-white rounded capitalize'>{e.subGroup?.toLowerCase()}</div>
        </div>

        <div className='text-end'>{moneyFormat(e.lastPurchase)}</div>
        <div className='text-end'>{moneyFormat(e.purchaseConditionPrice)}</div>
        <div className='text-end'>{moneyFormat(e.salesPrice)}</div>
        <div className='text-end'>{e.quantity} {e.unit}</div>
      </div>}
    />
  )
}

export interface SalesProfit {
  _id?:string
  itemCode?:string 
  itemName?:string
  unit?:string
  mainGroup?:string
  subGroup?:string
  category?:string
  rayon?:string
  brand?:string
  lastPurchase?:number
  purchaseConditionPrice?:number
  purchaseConditionGrossPrice?:number
  salesPrice?:number
  quantity?:number
  
}

interface salesProfitQueryProps {
  top?:number
  search?:string
  startDate?:string
  endDate?:string
  warehouseId?:string
  mainGroup?:string
  subGroup?:string
  category?:string
  brand?:string
  rayon?:string
}

function salesProfitQuery({top=100,search='',
  startDate=new Date().toISOString().substring(0,10),
  endDate=new Date().toISOString().substring(0,10),
  mainGroup='',subGroup='',category='',brand='',rayon='', warehouseId='0'
  }:salesProfitQueryProps){
  return `
  DECLARE @Tarih1 DATETIME='${startDate}';
DECLARE @Tarih2 DATETIME='${endDate}';
DECLARE @DepoNo INT = ${warehouseId};
  SELECT top ${top}  S.sto_Guid as _id, S.sto_kod as itemCode, S.sto_isim as itemName, S.sto_birim1_ad as unit,
ISNULL(SAN.san_isim,'') as mainGroup, ISNULL(STA.sta_isim,'') as [subGroup],
ISNULL(KTG.ktg_isim,'') as category ,
ISNULL(RYN.ryn_ismi,'') as rayon ,
ISNULL(MRK.mrk_ismi,'') as brand 
,ISNULL(STH.SatisMiktar,0) as quantity
,ISNULL(STH.Tutar,0) as amount
,ISNULL(STH.Iskonto,0) as discount
,ISNULL(STH.AraToplam,0) as grossTotal
,ISNULL(STH.Vergi,0) as vatAmount
,ISNULL(STH.AraToplam,0)+ISNULL(STH.Vergi,0) as netTotal
,ROUND(CASE WHEN STH.SatisMiktar>0 THEN ISNULL(STH.AraToplam,0)/STH.SatisMiktar ELSE 0 END,2) as AvgPrice
,ROUND(CASE WHEN STH.SatisMiktar>0 THEN (ISNULL(STH.AraToplam,0)+ISNULL(STH.Vergi,0))/STH.SatisMiktar ELSE 0 END,2) as AvgNetPrice

FROM STOKLAR S WITH (NOLOCK) LEFT OUTER JOIN
STOK_ANA_GRUPLARI SAN ON S.sto_anagrup_kod = SAN.san_kod LEFT OUTER JOIN
STOK_ALT_GRUPLARI STA ON S.sto_altgrup_kod=STA.sta_kod LEFT OUTER JOIN
STOK_KATEGORILERI KTG ON S.sto_kategori_kodu= KTG.ktg_kod LEFT OUTER JOIN
STOK_REYONLARI RYN ON S.sto_reyon_kodu=RYN.ryn_kod LEFT OUTER JOIN
STOK_MARKALARI MRK ON S.sto_marka_kodu=MRK.mrk_kod

INNER JOIN
(SELECT sth_stok_kod,
ROUND(sum(CASE WHEN (sth_tip=1 OR (sth_tip=0 AND sth_normal_iade=1))  THEN
dbo.fn_StokHareketNetDeger(sth_tutar,0,0,0,0,0,0, sth_masraf1,sth_masraf2,sth_masraf3,sth_masraf4,sth_otvtutari,sth_oivtutari,sth_tip,0,sth_har_doviz_kuru,sth_alt_doviz_kuru,sth_stok_doviz_kuru) *
Case When sth_normal_iade=1 then -1.0 else 1.0 end
ELSE 0 END ),2) AS Tutar,
ROUND(sum(sth_iskonto1 + sth_iskonto2 + sth_iskonto3 + sth_iskonto4 + sth_iskonto5 + sth_iskonto6),2) as Iskonto,
ROUND(sum(CASE WHEN (sth_tip=1 OR (sth_tip=0 AND sth_normal_iade=1)) THEN
dbo.fn_StokHareketNetDeger(sth_tutar,sth_iskonto1,sth_iskonto2,sth_iskonto3,sth_iskonto4,sth_iskonto5,sth_iskonto6, sth_masraf1,sth_masraf2,sth_masraf3,sth_masraf4,sth_otvtutari,sth_oivtutari,sth_tip,0,sth_har_doviz_kuru,sth_alt_doviz_kuru,sth_stok_doviz_kuru) *
Case When sth_normal_iade=1 then -1.0 else 1.0 end
ELSE 0 END ),2) AS AraToplam,
ROUND(sum(CASE WHEN (sth_tip=1 OR (sth_tip=0 AND sth_normal_iade=1))   THEN
sth_vergi * Case When sth_normal_iade=1 then -1.0 else 1.0 end
ELSE 0 END ),2) AS Vergi,
ROUND(sum(CASE WHEN (sth_tip=1 OR (sth_tip=0 AND sth_normal_iade=1))  THEN
sth_miktar * Case When sth_normal_iade=1 then -1.0 else 1.0 end
ELSE 0 END ),2) AS SatisMiktar
FROM STOK_HAREKETLERI WITH (NOLOCK)
WHERE (sth_cikis_depo_no= @DepoNo) AND sth_tarih>=@Tarih1 AND sth_tarih<=@Tarih2
AND NOT sth_fat_uid IS NULL AND sth_fat_uid<>'00000000-0000-0000-0000-000000000000'
AND ((sth_tip=1 AND sth_normal_iade=0) OR (sth_tip=0 AND sth_normal_iade=1))
GROUP BY sth_stok_kod) STH ON S.sto_kod = STH.sth_stok_kod


 WHERE (S.sto_kod like '%${search}%' or S.sto_isim like '%${search}%') AND
 (S.sto_anagrup_kod='${mainGroup}' OR '${mainGroup}'='') AND
 (S.sto_altgrup_kod='${subGroup}' OR '${subGroup}'='') AND
 (S.sto_kategori_kodu='${category}' OR '${category}'='') AND
 (S.sto_marka_kodu='${brand}' OR '${brand}'='') AND
 (S.sto_reyon_kodu='${rayon}' OR '${rayon}'='')


`
}