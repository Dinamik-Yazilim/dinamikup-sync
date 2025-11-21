"use client"

import { useEffect, useState } from 'react'
import { getItem, getList, postItem, putItem } from '@/lib/fetch'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'
import { useToast } from '@/components/ui/use-toast'
import { RefreshCcwDotIcon, StoreIcon, Users2Icon } from 'lucide-react'
import { ListGrid } from '@/components/ui216/list-grid'
import { Store, getPosIntegrationTypeList } from '@/types/Store'
import { ButtonConfirm } from '@/components/button-confirm'
import { Button } from '@/components/ui/button'
interface Props {
}
export default function SettingsPage({ }: Props) {
  const [stores, setStores] = useState<Store[]>([])

  const [token, setToken] = useState('')

  const { toast } = useToast()

  const [loading, setLoading] = useState(false)

  const router = useRouter()
  const posIntegrationTypeList = getPosIntegrationTypeList()


  const load = () => {
    setLoading(true)
    getList(`/stores`, token)
      .then(result => {
        setStores(result.docs as Store[])
      })
      .catch(err => toast({ title: 'Error', description: err || '', variant: 'destructive' }))
      .finally(() => setLoading(false))
  }

  useEffect(() => { !token && setToken(Cookies.get('token') || '') }, [])
  useEffect(() => { token && load() }, [token])

  return (
    <ListGrid
      apiPath='/stores'

      title="Mağazalar"
      icon=<StoreIcon />
      onHeaderPaint={() => <div className='grid grid-cols-7 w-full'>
        <div>İsim</div>
        <div>Default Firm</div>
        <div>Depo</div>
        <div>Sorumluluk</div>
        <div>Proje</div>
        <div>Pos</div>
        <div className='text-center'>Pasif?</div>
      </div>}
      onRowPaint={(e: Store, colIndex) => <div className='grid grid-cols-7 w-full'>
        <div className='flex flex-col gap-2'>
          <div>{e.name}</div>
          <ButtonConfirm
            title="Reset?"
            description="Son Guncelleme tarihleri resetlenecek. Onayliyor musunuz?"
            onOk={() => {
              postItem(`/storeIntegration/${e._id}/syncReset`, token, e)
                .then(result => {
                  toast({ title: 'Bilgi', description: '😀 Guncelleme tarihleri resetlendi' })
                  location.reload()
                })
                .catch(err => toast({ title: 'Hata', description: err || '', variant: 'destructive' }))
            }}
          >
            <Button variant="destructive"><RefreshCcwDotIcon /> Reset</Button>
          </ButtonConfirm>
        </div>
        <div>{e.defaultFirm}</div>
        <div>{e.warehouse}</div>
        <div>{e.responsibility}</div>
        <div>{e.project}</div>
        <div>{posIntegrationTypeList.find(r => r._id == e.posIntegration?.integrationType)?.name}</div>
        <div className='text-center'>{e.passive ? '✅' : ''}</div>
      </div>}
    />
  )
}