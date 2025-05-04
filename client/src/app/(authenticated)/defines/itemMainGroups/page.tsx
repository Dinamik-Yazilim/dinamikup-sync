"use client"

import { useLanguage } from '@/i18n'
import { ListTable } from '@/components/ui216/list-table'
import { TableCell, TableHead } from '@/components/ui/table'
export default function DatabasesPage() {
  const { t } = useLanguage()
  return (
    <ListTable
      apiPath='/db/itemMainGroups'
      options={{ type: 'Update' }}
      title={t('Item Main Groups')}
      onHeaderPaint={() => {
        return (<>
          <TableHead>{t('Name')}</TableHead>
          <TableHead>{t('Article')}</TableHead>
        </>)
      }}
      onRowPaint={(e, index) => {
        return (<>
          <TableCell className='font-bold'>{e.name}</TableCell>
          <TableCell className=''>{e.article}</TableCell>
        </>)
      }}

    />
  )
}

