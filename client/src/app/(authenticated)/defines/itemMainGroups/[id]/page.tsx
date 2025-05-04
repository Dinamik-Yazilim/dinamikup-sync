"use client"

import { TsnInput } from '@/components/ui216/tsn-input'
import { useLanguage } from '@/i18n'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/use-toast'
import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import { ItemMainGroup } from '@/types/Item'
import { getItem, postItem, putItem } from '@/lib/fetch'
import { StandartForm } from '@/components/ui216/standart-form'
interface Props {
  params: { id: string }
}
export default function EditPage({ params }: Props) {
  const [token, setToken] = useState('')
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { t } = useLanguage()
  const [itemMainGroup, setItemMainGroup] = useState<ItemMainGroup>()

  const load = () => {
    setLoading(true)
    getItem(`/db/itemMainGroups/${params.id}`, token)
      .then(result => setItemMainGroup(result as ItemMainGroup))
      .catch(err => toast({ title: t('Error'), description: t(err || ''), variant: 'destructive' }))
      .finally(() => setLoading(false))
  }
  const save = () => {
    setLoading(true)
    if (params.id == 'addnew') {
      postItem(`/db/itemMainGroups`, token, itemMainGroup)
        .then(result => router.back())
        .catch(err => toast({ title: t('Error'), description: t(err || ''), variant: 'destructive' }))
        .finally(() => setLoading(false))
    } else {
      putItem(`/db/itemMainGroups/${params.id}`, token, itemMainGroup)
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
      <TsnInput title={t('Name')} defaultValue={itemMainGroup?.name} onBlur={e => setItemMainGroup({ ...itemMainGroup, name: e.target.value })} />
      <TsnInput title={t('Article')} defaultValue={itemMainGroup?.article} onBlur={e => setItemMainGroup({ ...itemMainGroup, article: e.target.value })} />
    </>}
  </StandartForm>)
}

