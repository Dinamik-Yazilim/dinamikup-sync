"use client"

import { TsnInput } from '@/components/ui216/tsn-input'
import { useLanguage } from '@/i18n'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/use-toast'
import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import { ItemGroup } from '@/types/Item'
import { getItem, postItem, putItem } from '@/lib/fetch'
import { StandartForm } from '@/components/ui216/standart-form'
import { TsnSelectRemote } from '@/components/ui216/tsn-select-remote'
interface Props {
  params: { id: string }
}
export default function EditPage({ params }: Props) {
  const [token, setToken] = useState('')
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { t } = useLanguage()
  const [itemGroup, setItemGroup] = useState<ItemGroup>()

  const load = () => {
    setLoading(true)
    getItem(`/db/itemGroups/${params.id}`, token)
      .then(result => setItemGroup(result as ItemGroup))
      .catch(err => toast({ title: t('Error'), description: t(err || ''), variant: 'destructive' }))
      .finally(() => setLoading(false))
  }
  const save = () => {
    setLoading(true)
    if (params.id == 'addnew') {
      postItem(`/db/itemGroups`, token, itemGroup)
        .then(result => router.back())
        .catch(err => toast({ title: t('Error'), description: t(err || ''), variant: 'destructive' }))
        .finally(() => setLoading(false))
    } else {
      putItem(`/db/itemGroups/${params.id}`, token, itemGroup)
        .then(result => router.back())
        .catch(err => toast({ title: t('Error'), description: t(err || ''), variant: 'destructive' }))
        .finally(() => setLoading(false))
    }

  }
  useEffect(() => { !token && setToken(Cookies.get('token') || '') }, [])
  useEffect(() => { token && params.id != 'addnew' && load() }, [token])


  return (<StandartForm
    title={t('Main Group')}
    onSaveClick={save}
    onCancelClick={() => router.back()}
  >
    {!loading && <>
      <TsnSelectRemote
        apiPath='/db/itemMainGroups'
        title={t('Main Group')}
        defaultValue={itemGroup?.itemMainGroup?._id || ''}
        onValueChange={e => setItemGroup({ ...itemGroup, itemMainGroup: { _id: e } })}
      />
      <TsnInput title={t('Name')} defaultValue={itemGroup?.name} onBlur={e => setItemGroup({ ...itemGroup, name: e.target.value })} />
      <TsnInput title={t('Article')} defaultValue={itemGroup?.article} onBlur={e => setItemGroup({ ...itemGroup, article: e.target.value })} />
    </>}
  </StandartForm>)
}

