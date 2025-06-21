"use client"

import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { StandartForm } from "@/components/ui216/standart-form"
import { useLanguage } from "@/i18n"
import { getList, postItem } from "@/lib/fetch"
import { getPosIntegrationTypeList, Store } from "@/types/Store"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Cookies from 'js-cookie'
import { ListGrid } from "@/components/ui216/list-grid"
import { ComputerIcon, Divide, StoreIcon } from "lucide-react"
import { ProgressBar } from "../../(components)/progressBar"


interface Props {
}
export default function PosPage({ }: Props) {
  const [stores, setStores] = useState<Store[]>([])
  const [token, setToken] = useState('')
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [busy, setBusy] = useState(false)
  const router = useRouter()
  const { t } = useLanguage()
  const posIntegrationTypeList = getPosIntegrationTypeList()
  
  const [sonuc, setSonuc] = useState<any>({})

  const load = () => {
    setLoading(true)
    getList(`/stores`, token)
      .then(result => {
        setStores(result.docs as Store[])
      })
      .catch(err => toast({ title: 'Error', description: err || '', variant: 'destructive' }))
      .finally(() => setLoading(false))
  }



  const storePage = (store: Store) => {
    return (<div className="border rounded-md border-dashed px-4 py-2 flex flex-col gap-4 w-full min-h-40">
      <div className="flex gap-4"><StoreIcon /> {store.name}</div>

      <Button disabled={busy} className="w-40" variant={'outline'}
        onClick={() => {
          postItem(`/storeIntegration/${store._id}/syncItems`, token, store)
            .then(result => setSonuc(result))
            .catch(err => toast({ title: t('Error'), description: t(err || ''), variant: 'destructive' }))
        }}
      >Stok Aktarim Test</Button>
      <pre>{JSON.stringify(sonuc,null,2)}</pre>
    </div>)
  }

  useEffect(() => { !token && setToken(Cookies.get('token') || '') }, [])
  useEffect(() => { token && load() }, [token])
  return (
    <StandartForm
      title={t('POS Transactions')}
      loading={loading}
      icon={<ComputerIcon />}
    >
      <ProgressBar eventName="syncItems_progress" onProgress={e=>setBusy(true)} onFinished={()=>setBusy(false)} />
      <div className="flex flex-col gap-8 mt-6">
        {stores && stores.map(store => <div key={store._id}>{storePage(store)}</div>)}
      </div>
    </StandartForm>
  )
}