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
import { Settings2Icon, SettingsIcon } from 'lucide-react'
import { TsnSwitch } from '@/components/ui216/tsn-switch'
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
    setLoading(true)
    getItem(`/settings`, token)
      .then(result => {
        console.log('result', result)
        setSettings(result.settings as Settings)
      })
      .catch(err => toast({ title: 'Error', description: err || '', variant: 'destructive' }))
      .finally(() => setLoading(false))
  }

  const save = () => {
    setLoading(true)
    putItem(`/settings`, token, {settings:settings})
      .then(result => {
        router.push('/')
      })
      .catch(err => toast({ title: t('Error'), description: t(err || ''), variant: 'destructive' }))
      .finally(() => setLoading(false))

  }

  useEffect(() => { !token && setToken(Cookies.get('token') || '') }, [])
  useEffect(() => { token && load() }, [token])

  return (
    <StandartForm
      title={t('Working Parameters')}
      onSaveClick={save}
      onCancelClick={() => router.back()}
      icon=<Settings2Icon />
      loading={loading}
    >
      <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
        <TsnSwitch title={t('VAT Included')} defaultChecked={settings?.vatIncluded} onCheckedChange={e=>setSettings({...settings,vatIncluded:e})} />
      </div>
    </StandartForm>
  )
}