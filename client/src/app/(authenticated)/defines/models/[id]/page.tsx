"use client"

import { TsnInput } from '@/components/ui216/tsn-input'
import { useLanguage } from '@/i18n'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/use-toast'
import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import { Model } from '@/types/Item'
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
  const [model, setModel] = useState<Model>()

  const load = () => {
    setLoading(true)
    getItem(`/db/models/${params.id}`, token)
      .then(result => setModel(result as Model))
      .catch(err => toast({ title: t('Error'), description: t(err || ''), variant: 'destructive' }))
      .finally(() => setLoading(false))
  }
  const save = () => {
    setLoading(true)
    if (params.id == 'addnew') {
      postItem(`/db/models`, token, model)
        .then(result => router.back())
        .catch(err => toast({ title: t('Error'), description: t(err || ''), variant: 'destructive' }))
        .finally(() => setLoading(false))
    } else {
      putItem(`/db/models/${params.id}`, token, model)
        .then(result => router.back())
        .catch(err => toast({ title: t('Error'), description: t(err || ''), variant: 'destructive' }))
        .finally(() => setLoading(false))
    }

  }
  useEffect(() => { !token && setToken(Cookies.get('token') || '') }, [])
  useEffect(() => { token && params.id != 'addnew' && load() }, [token])


  return (<StandartForm
    title={t('Model')}
    onSaveClick={save}
    onCancelClick={() => router.back()}
  >
    {!loading && <>
      <TsnSelectRemote
        title={t('Category')}
        defaultValue={model?.category?._id}
        apiPath='/db/categories'
        onValueChange={e => setModel({ ...model, category: { _id: e } })}
      />
      <TsnInput title={t('Name')} defaultValue={model?.name} onBlur={e => setModel({ ...model, name: e.target.value })} />
      <TsnInput title={t('Article')} defaultValue={model?.article} onBlur={e => setModel({ ...model, article: e.target.value })} />
    </>}
  </StandartForm>)
}

