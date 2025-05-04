"use client"

import { useLanguage } from '@/i18n'
import { ListTable } from '@/components/ui216/list-table'
import { TableCell, TableHead } from '@/components/ui/table'
import { TsnSelectRemote } from '@/components/ui216/tsn-select-remote'
import { ItemGroup } from '@/types/Item'
export default function ListPage() {
  const { t } = useLanguage()
  return (
    <ListTable
      apiPath='/db/itemGroups'
      options={{ type: 'Update' }}
      title={t('Item Groups')}
      onHeaderPaint={() => {
        return (<>
          <TableHead>{t('Main Group')}</TableHead>
          <TableHead>{t('Name')}</TableHead>
          <TableHead>{t('Article')}</TableHead>
        </>)
      }}
      onRowPaint={(e, index) => {
        return (<>
          <TableCell className=''>{e.itemMainGroup.name}</TableCell>
          <TableCell className=''>{e.name}</TableCell>
          <TableCell className=''>{e.article}</TableCell>
        </>)
      }}
      onFilterPanel={(filter: any, setFilter) => {
        return (<div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5'>
          <TsnSelectRemote
            apiPath='/db/itemMainGroups'
            title={t('Main Group')}
            defaultValue={filter.itemMainGroup}
            onValueChange={e => setFilter({ ...filter, itemMainGroup: e })}
            all
          />

        </div>)
      }}
    />
  )
}

