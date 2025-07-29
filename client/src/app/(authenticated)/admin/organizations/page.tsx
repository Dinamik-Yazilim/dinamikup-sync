"use client"

import { useEffect, useState } from 'react'
import { getItem, getList, putItem } from '@/lib/fetch'
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
import { Organization } from '@/types/Organization'
import { ListGrid } from '@/components/ui216/list-grid'
import { Building2Icon } from 'lucide-react'
interface Props {
}
export default function SettingsPage({ }: Props) {
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [token, setToken] = useState('')
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { t } = useLanguage()

  const load = () => {
    setLoading(true)
    getList(`/admin/organizations`, token)
      .then(result => {
        setOrganizations(result.docs as Organization[])
      })
      .catch(err => toast({ title: 'Error', description: err || '', variant: 'destructive' }))
      .finally(() => setLoading(false))
  }

  useEffect(() => { !token && setToken(Cookies.get('token') || '') }, [])
  useEffect(() => { token && load() }, [token])

  return (
    <ListGrid
      apiPath='/admin/organizations'

      title={t('Organizations')}
      icon=<Building2Icon />
      onHeaderPaint={() => <div className='grid grid-cols-5 w-full'>
        <div>{t('Name')}</div>
        <div>{t('Location')}</div>
        <div>{t('Start')}</div>
        <div>{t('End')}</div>
        <div className='text-center'>{t('Passive?')}</div>
      </div>}
      onRowPaint={(e:Organization,colIndex) => <div className='grid grid-cols-5 w-full'>
        <div>{e.name}</div>
        <div>{e.location}</div>
        <div>{e.startDate}</div>
        <div>{e.endDate}</div>
        <div className='text-center'>{e.passive?'✅':''}</div>
      </div>}
    />
  )
}