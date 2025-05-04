"use client"

import { useLanguage } from '@/i18n'
import { ListTable } from '@/components/ui216/list-table'
import { TableCell, TableHead } from '@/components/ui/table'
import { Database } from '@/types/Database'

export default function DatabasesPage() {
  const { t } = useLanguage()
  return (
    <ListTable
      apiPath='/databases'
      title={t('Database List')}
      onHeaderPaint={() => {
        return (<>
          <TableHead>{t('Name')}</TableHead>
          <TableHead>{t('Identifier')}</TableHead>
        </>)
      }}
      onRowPaint={(e: Database, index) => {
        return (<>
          <TableCell className='font-bold'>{e.name}</TableCell>
          <TableCell className='font-mono'>{e.identifier}</TableCell>
        </>)
      }}
    />
  )
}

