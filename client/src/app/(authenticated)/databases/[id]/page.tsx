"use client"

import { TsnInput } from '@/components/ui216/tsn-input'
import { useLanguage } from '@/i18n'
import { usePathname, useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/use-toast'
import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import { Database } from '@/types/Database'
import { getItem, postItem, putItem } from '@/lib/fetch'
import { StandartForm } from '@/components/ui216/standart-form'
import { TsnSwitch } from '@/components/ui216/tsn-switch'
interface Props {
  params: { id: string }
}
export default function EditPage({ params }: Props) {
  const [token, setToken] = useState('')
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { t } = useLanguage()
  const [database, setDatabase] = useState<Database>()

  const load = () => {
    setLoading(true)
    getItem(`/databases/${params.id}`, token)
      .then(result => setDatabase(result as Database))
      .catch(err => toast({ title: t('Error'), description: t(err || ''), variant: 'destructive' }))
      .finally(() => setLoading(false))
  }

  const save = () => {
    // o && setOrder(o)
    setLoading(true)
    if (!database?._id) {
      postItem(`/databases`, token, database)
        .then(result => router.back())
        .catch(err => toast({ title: t('Error'), description: t(err || ''), variant: 'destructive' }))
        .finally(() => setLoading(false))
    } else {
      putItem(`/databases/${database._id}`, token, database)
        .then(result => router.back())
        .catch(err => toast({ title: t('Error'), description: t(err || ''), variant: 'destructive' }))
        .finally(() => setLoading(false))
    }

  }
  useEffect(() => { !token && setToken(Cookies.get('token') || '') }, [])
  useEffect(() => { token && params.id != 'addnew' && load() }, [token])


  return (<StandartForm
    title={t('Database')}
    onSaveClick={() => save()}
    onCancelClick={() => router.back()}
  >
    {!loading && <div className='flex flex-col gap-2'>
      <TsnInput title={t('Name')} defaultValue={database?.name}
        onBlur={e => setDatabase({ ...database, name: e.target.value })
        } />
      <TsnSwitch title={t('Passive?')} defaultChecked={database?.passive} onCheckedChange={e => setDatabase({ ...database, passive: e })} />

    </div>}
  </StandartForm>)
}