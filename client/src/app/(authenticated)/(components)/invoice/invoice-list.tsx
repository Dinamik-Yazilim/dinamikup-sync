"use client"

import { useLanguage } from '@/i18n'
import { ListGrid } from '@/components/ui216/list-grid'
// import { TableCell, TableHead } from '@/components/ui/table'
import { Invoice } from '@/types/Invoice'

import { TsnSelect } from '@/components/ui216/tsn-select'
import { moneyFormat } from '@/lib/utils'
import { useSearchParams } from 'next/dist/client/components/navigation'

interface Props {
  ioType?: number
  title?: string
}
export function InvoiceList({ ioType, title }: Props) {
  const { t } = useLanguage()
  return (
    <ListGrid
      apiPath={`/db/invoices?ioType=${ioType}`}
      options={{ type: 'Update' }}
      title={title}
      onHeaderPaint={() => {
        return (<div className='w-full grid grid-cols-5 gap-2'>
          <div>{t('Invoice Number')}</div>
          <div>{t('Date')}</div>
          <div>{t('Firm')}</div>
          <div className='text-end'>{t('Total')}</div>
          <div className='text-center'>{t('Status')}</div>
        </div>)
      }}
      onRowPaint={(e: Invoice, index) => {
        return (<div className='w-full grid grid-cols-5 gap-2'>
          <div className='text-[0.875rem]'>
            <div className='flex flex-col'>
              <span className='font-bold'>{e.ID}</span>
              <div className='flex flex-col md:flex-row gap-1'>
                {ProfileDiv(e.profileId)}
                {InvoiceTypeDiv(e.invoiceTypeCode)}
              </div>

            </div>
          </div>
          <div className='text-[0.875rem]'>
            <div className='flex flex-col'>
              <span className=''>{e.issueDate}</span>
              <span className='text-[80%] text-muted-foreground'>{e.issueTime?.substring(0, 8)}</span>

            </div>
          </div>
          <div className='text-[0.875rem]'>
            <div className='flex flex-col'>
              <span className=''>{e.firm?.name}</span>
              <span className='text-[80%] text-muted-foreground'>{e.lineCountNumeric} Kalem</span>
            </div>
          </div>
          <div className='text-end text-[0.875rem]'>
            <div className='flex flex-col'>
              <span className=''>{moneyFormat(e.legalMonetaryTotal?.taxInclusiveAmount)} {e.currency}</span>
              <span className='flex flex-col text-[80%] text-muted-foreground'>{moneyFormat(e.taxTotal?.taxAmount)} {e.currency}
                {e.withholdingTaxTotal &&
                  <span>{t('WHT')}:{moneyFormat(e.withholdingTaxTotal.reduce((acc, w) => acc += (w.taxAmount || 0), 0))} {e.currency}</span>
                }
              </span>
            </div>
          </div>
          <div className='text-center text-[0.875rem]'>
            {e.draft && <span className={`text-[80%] px-[6px] py-[2px] rounded-md text-center metin-golge bg-[#254547] text-white w-16`}>TASLAK</span>}
          </div>
        </div>)
      }}
      defaultFilter={{ closed: false }}
      onFilterPanel={(filter, setFilter) => {

        return (<div className='flex flex-col lg:flex-row  gap-4 lg:items-center '>
          <TsnSelect title={t('Draft?')}
            className='mb-1 mt-1 lg:max-w-36'
            list={[{ _id: ' ', text: '*' }, { _id: 'false', text: t('Normal') }, { _id: 'true', text: t('Draft') }]}
            defaultValue={filter.draft || ' '}
            onValueChange={e => setFilter({ ...filter, draft: e })}
          />

        </div>)
      }}

    />
  )
}

function ProfileDiv(profileId: string) {
  const className = 'text-[80%] px-[3px] py-[2px] rounded-md text-center metin-golge'
  switch (profileId) {
    case 'TEMELFATURA':
      return (<span className={`${className} bg-[#47d1de] text-white w-16`}>Temel</span>)
    case 'TICARIFATURA':
      return (<span className={`${className} bg-[#9ba037] text-white w-16`}>Ticari</span>)
    case 'EARSIVFATURA':
      return (<span className={`${className} bg-[#9f4555] text-white w-16`}>E-Arşiv</span>)
    case 'IHRACAT':
      return (<span className={`${className} bg-[#990099] text-white w-16`}>İhracat</span>)
    case 'YOLCUBERABERFATURA':
      return (<span className={`${className} bg-[#994555] text-white w-20`}>YolcuBeraber</span>)
    default:
      return (
        <span className={`${className} bg-gray-600 text-white w-16`}>{profileId}</span>
      )
  }

}

function InvoiceTypeDiv(invoiceTypeCode: string) {
  const className = 'text-[80%] px-[3px] py-[2px] rounded-md text-center metin-golge'
  switch (invoiceTypeCode) {
    case 'SATIS':
      return (<span className={`${className} bg-[#3437f5] text-white w-16`}>Satış</span>)
    case 'IADE':
      return (<span className={`${className} bg-[#ee2e2e] text-white w-16`}>İade</span>)
    case 'TEVKIFAT':
      return (<span className={`${className} bg-[#1b9c37] text-white w-16`}>Tevkifat</span>)
    case 'ISTISNA':
      return (<span className={`${className} bg-[#ecf01c] text-white w-16`}>İstisna</span>)
    case 'OZELMATRAH':
      return (<span className={`${className} bg-[#4c2d7c] text-white w-20`}>ÖzelMatrah</span>)
    case 'IHRACKAYITLI':
      return (<span className={`${className} bg-[#255032] text-white w-20`}>İhraçKayıtlı</span>)
    default:
      return (
        <span className={`${className} bg-gray-600 text-white w-16`}>{invoiceTypeCode}</span>
      )
  }

}