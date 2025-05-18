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
import { TsnInputAddress } from '@/components/ui216/tsn-input-address'
import { PackageCheckIcon, TruckIcon, Users2Icon } from 'lucide-react'
import { getRoleList, Member } from '@/types/Member'
import { ListGrid } from '@/components/ui216/list-grid'
import { TsnGrid } from '@/components/ui216/tsn-grid'
import { moneyFormat, startOfLastMonth, today } from '@/lib/utils'
import { TsnSelectRemote } from '@/components/ui216/tsn-select-remote'


export default function InventoryPage() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { t } = useLanguage()


  return (
    <TsnGrid
      apiPath='/mikro/get'
      query={`SELECT TOP 200 orderNumber as _id, *
, ROUND(100*CASE WHEN amount>0 THEN dicountAmount1/amount ELSE 0 END,2) as discountRate1 
, ROUND(100*CASE WHEN (amount-dicountAmount1)>0 THEN dicountAmount2/(amount-dicountAmount1) ELSE 0 END,2) as discountRate2 
, ROUND(100*CASE WHEN (amount-dicountAmount1-dicountAmount2)>0 THEN dicountAmount3/(amount-dicountAmount1-dicountAmount2) ELSE 0 END,2) as discountRate3 
, ROUND(100*CASE WHEN (amount-dicountAmount1-dicountAmount2-dicountAmount3)>0 THEN dicountAmount4/(amount-dicountAmount1-dicountAmount2-dicountAmount3) ELSE 0 END,2) as discountRate4
, ROUND(100*CASE WHEN (amount-dicountAmount1-dicountAmount2-dicountAmount3-dicountAmount4)>0 
	THEN dicountAmount5/(amount-dicountAmount1-dicountAmount2-dicountAmount3-dicountAmount4) ELSE 0 END,2) as discountRate5
, ROUND(100*CASE WHEN (amount-dicountAmount1-dicountAmount2-dicountAmount3-dicountAmount4-dicountAmount5)>0 
	THEN dicountAmount5/(amount-dicountAmount1-dicountAmount2-dicountAmount3-dicountAmount4-dicountAmount5) ELSE 0 END,2) as discountRate6
,ROUND(subTotal+vat,2) as netTotal
FROM (
SELECT SIP.sip_tarih as issueDate, SIP.sip_evrakno_seri + CAST(SIP.sip_evrakno_sira as varchar(10)) as orderNumber, 
SIP.sip_belgeno as documentNumber,
dbo.fn_SiparisCins(SIP.sip_cins) as Cins,
SIP.sip_musteri_kod as firmCode, CARI.cari_unvan1 as firmName,
CAST(SIP.sip_depono as VARCHAR(10)) as warehouseCode, dbo.fn_DepoIsmi(SIP.sip_depono) as warehouseName, 
SUM(SIP.sip_miktar) as quantity, SUM(SIP.sip_teslim_miktar) as delivered,
ROUND(SUM(SIP.sip_tutar),2) as amount,
ROUND(SUM(SIP.sip_iskonto_1),2) as dicountAmount1, ROUND(SUM(SIP.sip_iskonto_2),2) as dicountAmount2, ROUND(SUM(SIP.sip_iskonto_3),2)  as dicountAmount3,
ROUND(SUM(SIP.sip_iskonto_4),2) as dicountAmount4, ROUND(SUM(SIP.sip_iskonto_5),2) as dicountAmount5, ROUND(SUM(SIP.sip_iskonto_6),2) as dicountAmount6,
ROUND(dbo.fn_SiparisNetTutar(SUM(SIP.sip_tutar),SUM(SIP.sip_iskonto_1),SUM(SIP.sip_iskonto_2),SUM(SIP.sip_iskonto_3),SUM(SIP.sip_iskonto_4),SUM(SIP.sip_iskonto_5),SUM(SIP.sip_iskonto_6)
,SUM(SIP.sip_masraf_1),SUM(SIP.sip_masraf_2),SUM(SIP.sip_masraf_3),SUM(SIP.sip_masraf_4),0,SUM(SIP.sip_masvergi),
SUM(SIP.sip_Otv_Vergi),SUM(SIP.sip_otvtutari),0,0, 1,0,0),2) as subTotal,
ROUND(SUM(SIP.sip_vergi),2) as vat , dbo.fn_DovizSembolu(SIP.sip_doviz_cinsi) as currency
FROM SIPARISLER SIP INNER JOIN
CARI_HESAPLAR CARI on SIP.sip_musteri_kod = CARI.cari_kod
WHERE SIP.sip_tip=1 
GROUP BY SIP.sip_tarih, SIP.sip_evrakno_seri , SIP.sip_evrakno_sira,
SIP.sip_cins, CARI.cari_unvan1,SIP.sip_musteri_kod , SIP.sip_depono,
SIP.sip_belgeno, SIP.sip_doviz_cinsi
) X
WHERE (firmCode like '%{search}%' or firmName like '%{search}%' or orderNumber like '%{search}%' or '{search}'='')
and (issueDate>='{startDate}' and issueDate<='{endDate}')
and (warehouseCode='{warehouseCode}' OR '{warehouseCode}'='')
ORDER BY issueDate DESC
`}
      options={{ showAddNew: true, showEdit: true, showDelete: true, showSearch: true, type: 'Update' }}
      defaultFilter={{ startDate: startOfLastMonth(), endDate: today() }}
      title={t('Purchase Orders')}
      icon=<TruckIcon />
      onFilterPanel={(filter, setFilter) => {
        return (<div className='flex flex-col gap-1'>
          <TsnInput type='date' title={t('Start Date')} defaultValue={filter.startDate} onBlur={e => setFilter({ ...filter, startDate: e.target.value })} />
          <TsnInput type='date' title={t('End Date')} defaultValue={filter.endDate} onBlur={e => setFilter({ ...filter, endDate: e.target.value })} />
          <TsnSelectRemote all title={t('Warehouse')} itemClassName='capitalize' value={filter.warehouseCode} onValueChange={e=>setFilter({...filter,warehouseCode:e})} query={`SELECT dep_no as _id, LOWER(dep_adi) as [name], * FROM DEPOLAR WHERE dep_envanter_harici_fl=0 ORDER BY dep_adi`}   />
        </div>)
      }}
      onHeaderPaint={() => <>
        <div className='grid grid-cols-8 w-full'>
          <div className=''>{t('Date')}/{t('Order No')}</div>
          <div className='col-span-2'>{t('Firm')}</div>
          <div className=''>{t('Warehouse')}</div>
          <div className='text-end'>{t('Quantity')}</div>
          <div className='text-end'>{t('Amount')}/{t('Discounts')}</div>
          <div className='text-end'>{t('VAT')}</div>
          <div className='text-end'>{t('Net Total')}</div>
        </div>
      </>}
      onRowPaint={(e: any, colIndex) => <div className='grid grid-cols-8 w-full items-center'>
        <div className='flex flex-col gap-1 items-start'>
          <div>{new Date(e.issueDate).toLocaleDateString()}</div>
          <div className='text-xs p-[2px] rounded bg-green-700 text-white'>{e.orderNumber}</div>

        </div>
        <div className='col-span-2 flex flex-col gap-1 items-start'>
          <div className='capitalize'>{e.firmName.toLowerCase()}</div>
          <div className='text-xs text-muted-foreground'>{e.firmCode}</div>
        </div>
        
        <div>
          <div className='capitalize'>{e.warehouseName.toLowerCase()}</div>
        </div>
        <div className='flex flex-col items-end'>
          <div>{e.quantity - e.delivered}</div>
          <div className='text-muted-foreground text-xs'>{e.quantity}-{e.delivered}</div>
        </div>
        <div className='flex flex-col gap-1 items-end'>
          <div className='flex items-center gap-[3px]'>{moneyFormat(e.amount)}<span className='text-xs text-muted-foreground'>{e.currency}</span></div>
          {(e.discountRate1 > 0 || e.discountRate2 > 0 || e.discountRate3 > 0 || e.discountRate4 > 0 || e.discountRate5 > 0 || e.discountRate6 > 0) &&
            <div className='flex flex-col items-center text-[10px] rounded border border-dashed p-[2px] bg-blue-500 bg-opacity-15'>
              <div>{t('Discounts')}</div>
              <div className='text-xs text-muted-foreground'>
                {e.discountRate1 > 0 && <span>%{e.discountRate1} </span>}
                {e.discountRate2 > 0 && <span>%{e.discountRate2} </span>}
                {e.discountRate3 > 0 && <span>%{e.discountRate3} </span>}
                {e.discountRate4 > 0 && <span>%{e.discountRate4} </span>}
                {e.discountRate5 > 0 && <span>%{e.discountRate5} </span>}
                {e.discountRate6 > 0 && <span>%{e.discountRate6} </span>}
              </div>

            </div>
          }
        </div>

        <div className='flex items-center justify-end gap-[3px]'>{moneyFormat(e.vat)}<span className='text-xs text-muted-foreground ms-1'>{e.currency}</span></div>
        <div className='flex items-center justify-end gap-[3px]'>{moneyFormat(e.netTotal)}<span className='text-xs text-muted-foreground ms-1'>{e.currency}</span></div>
      </div>}
    />
  )
}