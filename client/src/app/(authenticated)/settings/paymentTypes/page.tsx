"use client"

import { useEffect, useState } from 'react'
import { getItem, getList, putItem } from '@/lib/fetch'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'
import { useToast } from '@/components/ui/use-toast'
import { useLanguage } from '@/i18n'
import { ComputerIcon, StoreIcon, Users2Icon } from 'lucide-react'
import { ListGrid } from '@/components/ui216/list-grid'
import { StorePaymentType } from '@/types/StorePaymentType'
interface Props {
}
export default function SettingsPage({ }: Props) {
  const [storePaymentTypes, setStorePaymentTypes] = useState<StorePaymentType[]>([])
  const [token, setToken] = useState('')
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { t } = useLanguage()

  const load = () => {
    setLoading(true)
    getList(`/storePaymentTypes`, token)
      .then(result => {
        setStorePaymentTypes(result.docs as StorePaymentType[])
      })
      .catch(err => toast({ title: 'Error', description: err || '', variant: 'destructive' }))
      .finally(() => setLoading(false))
  }

  useEffect(() => { !token && setToken(Cookies.get('token') || '') }, [])
  useEffect(() => { token && load() }, [token])

  return (
    <ListGrid
      apiPath='/storePaymentTypes'

      title={t('Payment Types')}
      icon=<ComputerIcon />
      onHeaderPaint={() => <div className='grid grid-cols-3 w-full'>
        <div>{t('Store')}</div>
        <div>{t('Name')}</div>
        <div>{t('Firm')}</div>
        <div className='text-center'>{t('Passive?')}</div>
      </div>}
      onRowPaint={(e: StorePaymentType, colIndex) => <div className='grid grid-cols-3 w-full'>
        <div>{e.store?.name}</div>
        <div>{e.paymentName}</div>
        <div>{e.defaultFirm}</div>
      </div>}
    />
  )
}