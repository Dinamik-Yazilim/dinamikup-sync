"use client"

import { useLanguage } from '@/i18n'
import { ListTable } from '@/components/ui216/list-table'
import { TableCell, TableHead } from '@/components/ui/table'
import { TaxType } from '@/types/Item'
export default function DatabasesPage() {
  const { t } = useLanguage()
  return (
    <ListTable
      apiPath='/db/taxTypes'
      options={{ type: 'Update' }}
      title={t('Tax Types')}
      onHeaderPaint={() => {
        return (<>
          <TableHead>{t('Name')}</TableHead>
          <TableHead>{t('Tax Total')}</TableHead>
          <TableHead>{t('Withholding Tax')}</TableHead>
        </>)
      }}
      onRowPaint={(e: TaxType, index) => {
        return (<>
          <TableCell className='font-bold'>{e.name}</TableCell>
          <TableCell className=''>tax total..</TableCell>
          <TableCell className=''>withholding</TableCell>
        </>)
      }}

    />
  )
}

