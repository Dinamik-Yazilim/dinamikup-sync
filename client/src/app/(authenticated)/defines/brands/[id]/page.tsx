"use client"

import { TsnInput } from '@/components/ui216/tsn-input'
import { useLanguage } from '@/i18n'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/use-toast'
import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import { Brand } from '@/types/Item'
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
  const [brand, setBrand] = useState<Brand>()

  const load = () => {
    setLoading(true)
    getItem(`/db/brands/${params.id}`, token)
      .then(result => setBrand(result as Brand))
      .catch(err => toast({ title: t('Error'), description: t(err || ''), variant: 'destructive' }))
      .finally(() => setLoading(false))
  }
  const save = () => {
    setLoading(true)
    if (params.id == 'addnew') {
      postItem(`/db/brands`, token, brand)
        .then(result => router.back())
        .catch(err => toast({ title: t('Error'), description: t(err || ''), variant: 'destructive' }))
        .finally(() => setLoading(false))
    } else {
      putItem(`/db/brands/${params.id}`, token, brand)
        .then(result => router.back())
        .catch(err => toast({ title: t('Error'), description: t(err || ''), variant: 'destructive' }))
        .finally(() => setLoading(false))
    }

  }
  useEffect(() => { !token && setToken(Cookies.get('token') || '') }, [])
  useEffect(() => { token && params.id != 'addnew' && load() }, [token])


  return (<StandartForm
    title={t('Brand')}
    onSaveClick={save}
    onCancelClick={() => router.back()}
  >
    {!loading && <>
      <TsnSelectRemote
        title={t('Category')}
        defaultValue={brand?.category?._id}
        apiPath='/db/categories'
        onValueChange={e => setBrand({ ...brand, category: { _id: e } })}
      />
      <TsnInput title={t('Name')} defaultValue={brand?.name} onBlur={e => setBrand({ ...brand, name: e.target.value })} />
      <TsnInput title={t('Article')} defaultValue={brand?.article} onBlur={e => setBrand({ ...brand, article: e.target.value })} />
    </>}
  </StandartForm>)
}

