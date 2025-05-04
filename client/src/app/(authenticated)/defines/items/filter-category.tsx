import { TsnSelectRemote } from '@/components/ui216/tsn-select-remote'
import { useLanguage } from '@/i18n'
import { ItemGroup } from '@/types/Item'
import { useEffect, useState } from 'react'

interface Props {
  filter: any
  setFilter: (e: any) => void
  className?: string
}
export function FilterCategory({
  filter, setFilter, className
}: Props) {
  const [loading, setLoading] = useState(false)
  const { t } = useLanguage()

  useEffect(() => {
    filter.brand = ''
    filter.model = ''
  }, [filter._id])
  return (<>

    <TsnSelectRemote
      className='mt-1 mb-1'
      title={t('Category')}
      defaultValue={filter.category}
      onValueChange={e => {
        setLoading(true)
        setFilter({ ...filter, category: e.trim(), brand: '', model: '' })
        setTimeout(() => setLoading(false), 100)
      }}
      apiPath='/db/categories'
      all
    />
    {/* {!loading && filter.itemMainGroup &&
      <TsnSelectRemote
        className='mt-1 mb-1'
        title={t('Sub Group')}
        defaultValue={filter.itemGroup}
        onValueChange={e => setFilter({ ...filter, itemGroup: e })}
        apiPath={`/db/itemGroups?itemMainGroup=${filter.itemMainGroup}`}
        all
      >{t('Group')}</TsnSelectRemote>
    } */}
  </>)
}