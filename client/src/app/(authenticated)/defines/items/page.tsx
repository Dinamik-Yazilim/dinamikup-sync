"use client"

import { useLanguage } from '@/i18n'
import { ListTable } from '@/components/ui216/list-table'
import { TableCell, TableHead } from '@/components/ui/table'
import { useEffect, useState } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { TsnSelectRemote } from '@/components/ui216/tsn-select-remote'
import { Item, ItemGroup } from '@/types/Item'

import { TsnSelect } from '@/components/ui216/tsn-select'
import { FilterItemGroupMainGroup } from './filter-itemMainGroup'
import { FilterCategory } from './filter-category'
export default function ListPage() {
  const { t } = useLanguage()
  return (
    <ListTable
      apiPath='/db/items'
      options={{ type: 'Update' }}
      title={t('Items')}
      onHeaderPaint={() => {
        return (<>
          <TableHead>{t('Name')}</TableHead>
          <TableHead>{t('Category')}</TableHead>
          <TableHead>{t('Taxes')}</TableHead>
          <TableHead className='hidden lg:table-cell'>{t('Description')}</TableHead>
          <TableHead className='hidden lg:table-cell text-center'>{t('Passive?')}</TableHead>
        </>)
      }}
      onRowPaint={(e: Item, index) => {
        return (<>
          <TableCell className='lg:font-semibold '>
            <div className='flex flex-col'>
              {e.name}
              <div className='flex flex-col md:flex-row gap-1 text-[8pt] lg:text-xs text-wrap text-muted-foreground'>
                <span className='border border-dashed px-1 rounded-sm'>{e.itemGroup?.itemMainGroup?.name}</span>
                <span className='border border-dashed px-1 rounded-sm'>{e.itemGroup?.name}</span>
              </div>
            </div>
          </TableCell>
          <TableCell className=''>
            <div className='flex flex-col text-sm'>
              {e.category?.name}
              <div className='flex flex-col md:flex-row gap-1 text-[8pt] lg:text-xs text-wrap '>
                <span className='border border-dashed px-1 rounded-sm bg-violet-700 bg-opacity-25 te11xt-white'>{e.brand?.name}</span>
                <span className='border border-dashed px-1 rounded-sm text-muted-foreground'>{e.model?.name}</span>
              </div>
            </div>
          </TableCell>
          <TableCell className='text-sm lg:space-x-2'>
            <div className='flex flex-col '>
              {e.taxType?.name}
            </div>
          </TableCell>

          <TableCell className='hidden lg:table-cell text-sm text-muted-foreground'>{e.description}</TableCell>
          <TableCell className='hidden lg:table-cell text-center'>
            {e.passive && <>✅</>}
          </TableCell>
        </>)
      }}
      defaultFilter={{ passive: false }}
      onFilterPanel={(filter, setFilter) => {
        return (<div className='flex flex-col lg:flex-r11ow  gap-4 lg:it11ems-center '>
          <TsnSelect title={t('Passive?')}
            className='mb-1 mt-1'
            list={[{ _id: ' ', text: '*' }, { _id: 'false', text: t('Actives') }, { _id: 'true', text: t('Passives') }]}
            defaultValue={filter.passive || 'false'}
            onValueChange={e => setFilter({ ...filter, passive: e })}
          />
          <FilterItemGroupMainGroup filter={filter} setFilter={setFilter} />
          <FilterCategory filter={filter} setFilter={setFilter} />
        </div>)
      }}

    />
  )
}
