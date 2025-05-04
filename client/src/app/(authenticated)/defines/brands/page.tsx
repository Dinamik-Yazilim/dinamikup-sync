"use client"

import { useLanguage } from '@/i18n'
import { ListTable } from '@/components/ui216/list-table'
import { TableCell, TableHead } from '@/components/ui/table'
import { TsnSelectRemote } from '@/components/ui216/tsn-select-remote'
export default function DatabasesPage() {
  const { t } = useLanguage()
  return (
    <ListTable
      apiPath='/db/brands'
      options={{ type: 'Update' }}
      title={t('Brands')}
      onHeaderPaint={() => {
        return (<>
          <TableHead>{t('Name')}</TableHead>
          <TableHead>{t('Logo')}</TableHead>
          <TableHead>{t('Article')}</TableHead>
        </>)
      }}
      onRowPaint={(e, index) => {
        return (<>
          <TableCell className='flex flex-col'>
            <span className='font-bold'>{e.name}</span>
            <span className='text-[80%]'>{e.category?.name}</span>
          </TableCell>
          <TableCell className=''><img src={e.logo} alt="" /></TableCell>
          <TableCell className=''>{e.article}</TableCell>
        </>)
      }}
      onFilterPanel={(filter, setFilter) => {
        return (
          <TsnSelectRemote
            title={t('Category')}
            defaultValue={filter.category}
            apiPath='/db/categories'
            onValueChange={e => setFilter({ ...filter, category: e })}
            all
          />
        )
      }}
    />
  )
}

