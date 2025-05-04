import { TsnSelectRemote } from '@/components/ui216/tsn-select-remote'
import { useLanguage } from '@/i18n'
import { ItemGroup } from '@/types/Item'
import { useEffect, useState } from 'react'

interface Props {
  filter: any
  setFilter: (e: ItemGroup) => void
  className?: string
}
export function FilterItemGroupMainGroup({
  filter, setFilter, className
}: Props) {
  const [loading, setLoading] = useState(false)
  const { t } = useLanguage()

  // useEffect(() => { }, [])
  // useEffect(() => { }, [])
  useEffect(() => {
    filter.itemMainGroup = ''
    filter.itemGroup = ''
  }, [filter._id])
  return (<>

    <TsnSelectRemote
      className='mt-1 mb-1'
      title={t('Main Group')}
      defaultValue={filter.itemMainGroup}
      onValueChange={e => {
        setLoading(true)
        setFilter({ ...filter, itemMainGroup: e.trim(), itemGroup: '' })
        setTimeout(() => setLoading(false), 100)
      }}
      apiPath='/db/itemMainGroups'
      all
    />
    {/* >{t('Main Group')}</TsnSelectRemote> */}
    {!loading && filter.itemMainGroup &&
      <TsnSelectRemote
        className='mt-1 mb-1'
        title={t('Sub Group')}
        defaultValue={filter.itemGroup}
        onValueChange={e => setFilter({ ...filter, itemGroup: e })}
        apiPath={`/db/itemGroups?itemMainGroup=${filter.itemMainGroup}`}
        all
      />
    }
  </>)
}