"use client"

import { useLanguage } from '@/i18n'
import { ListGrid } from '@/components/ui216/list-grid'
import { Firm } from '@/types/Firm'
import { firmTypeList, firmTypeName } from '@/types/Firm'
import { TsnListType, TsnSelect } from '@/components/ui216/tsn-select'
import { useSearchParams } from 'next/navigation'
import { moneyFormat } from '@/lib/utils'

interface Props {
  type: string
}
export function FirmList({ type }: Props) {
  const { t } = useLanguage()
  // const searchParams = useSearchParams()
  // const firmType = type || searchParams.get('type') || 'cv'

  const title = type == 'c' ? t('Curstomers') : (type == 'v' ? t('Vendors') : (type == 'cv' ? t('Customers & Vendors') : 'Customer Candidates'))

  return (
    <ListGrid
      apiPath={`/db/firms?type=${type}`}
      options={{ type: 'Update' }}
      title={title}
      onHeaderPaint={() => {
        return (<div className='grid grid-cols-4 w-full'>
          <div>{t('Name')}</div>
          <div>{t('Address')}</div>
          <div>{t('Balance')}</div>
          <div className='hidden lg:table-cell text-center'>{t('Passive?')}</div>
        </div>)
      }}
      onRowPaint={(e: Firm, index) => {
        return (<div className='grid grid-cols-4 w-full'>
          <div className=''>
            <div className='flex flex-col'>
              <span className=''>{e.name}</span>
              <span className='text-[8pt] text-muted-foreground'>{firmTypeName(e.type || '', t)}</span>
            </div>
          </div>
          <div className='flex flex-col'>
            <span className='lg:font-semibold'>{e.address?.cityName}</span>
            <span className='text-[10pt] text-muted-foreground'>{e.address?.district}</span>
          </div>
          <div className='flex flex-row gap-2'>
            <span className='lg:font-semibold'>{moneyFormat(e.balance || 0)}</span>
            <span className='text-[10pt] text-muted-foreground'>{e.currency}</span>
          </div>
          <div className='hidden lg:table-cell text-center'>
            {e.passive && <>✅</>}
          </div>
        </div>)
      }}
      defaultFilter={{ passive: false }}
      onFilterPanel={(filter, setFilter) => {

        return (<div className='flex flex-col lg:flex-row  gap-4 lg:items-center '>
          <TsnSelect title={t('Passive?')}
            className='mb-1 mt-1 lg:max-w-36'
            list={[{ _id: ' ', text: '*' }, { _id: 'false', text: t('Actives') }, { _id: 'true', text: t('Passives') }]}
            defaultValue={filter.passive || 'false'}
            onValueChange={e => setFilter({ ...filter, passive: e })}
          />
          <TsnSelect title={t('Type')}
            className='mb-1 mt-1 lg:max-w-48'
            defaultValue={type}
            list={firmTypeList(type, t)}
            onValueChange={e => setFilter({ ...filter, type: e })}
            all
          />
        </div>)
      }}

    />
  )
}
