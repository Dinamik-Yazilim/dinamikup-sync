"use client"

import { useLanguage } from '@/i18n'
import { ListTable } from '@/components/ui216/list-table'
import { TableCell, TableHead } from '@/components/ui/table'
export default function DatabasesPage() {
  const { t } = useLanguage()
  return (
    <ListTable
      apiPath='/db/categories'
      options={{ type: 'Update' }}
      title={t('Categories')}
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

