"use client"

import { useEffect, useState } from 'react'
import { getItem, putItem } from '@/lib/fetch'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'
import { Settings } from '@/types/Settings'
import { useToast } from '@/components/ui/use-toast'
import { TsnSelect } from '@/components/ui216/tsn-select'
import { useLanguage } from '@/i18n'
import { StandartForm } from '@/components/ui216/standart-form'
import { TsnInput } from '@/components/ui216/tsn-input'
import { Label } from '@/components/ui/label'
import { TsnPanel } from '@/components/ui216/tsn-panel'
import { TsnInputAddress } from '@/components/ui216/tsn-input-address'
import { SettingsIcon } from 'lucide-react'
interface Props {
}
export default function SettingsPage({ }: Props) {
  const [settings, setSettings] = useState<Settings>()
  const [token, setToken] = useState('')
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { t } = useLanguage()

  const load = () => {
    // setLoading(true)
    // getItem(`/db/settings`, token)
    //   .then(result => {
    //     setSettings(result as Settings)
    //     Cookies.set('dbSettings', JSON.stringify(result as Settings))
    //   })
    //   .catch(err => toast({ title: 'Error', description: err || '', variant: 'destructive' }))
    //   .finally(() => setLoading(false))
  }

  const save = () => {
    setLoading(true)
    putItem(`/db/settings`, token, settings)
      .then(result => {
        getItem(`/db/settings`, token)
          .then(result => {
            Cookies.set('dbSettings', JSON.stringify(result as Settings))
            router.back()
          })
          .catch(err => toast({ title: 'Error', description: err || '', variant: 'destructive' }))
      })
      .catch(err => toast({ title: t('Error'), description: t(err || ''), variant: 'destructive' }))
      .finally(() => setLoading(false))

  }

  useEffect(() => { !token && setToken(Cookies.get('token') || '') }, [])
  useEffect(() => { token && load() }, [token])

  return (
    <StandartForm
      title={t('Settings') + ' - ' + t('Working Parameters')}
      onSaveClick={save}
      onCancelClick={() => router.back()}
      icon=<SettingsIcon />
    >
      {!loading && <>
        <div className='flex flex-col ga-4'>
          settings
        </div>
      </>}
    </StandartForm>
  )
}