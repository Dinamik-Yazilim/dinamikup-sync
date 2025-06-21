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
import { BanknoteIcon, BarcodeIcon, CircleArrowDown, ComputerIcon, Divide, Package2Icon, RefreshCcwDotIcon, StoreIcon } from "lucide-react"
import { ProgressBar } from "../../(components)/progressBar"
import { ButtonConfirm } from "@/components/button-confirm"


interface Props {
}
export default function PosPage({ }: Props) {
  const [stores, setStores] = useState<Store[]>([])
  const [token, setToken] = useState('')
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [busyItems, setBusyItems] = useState(false)
  const [busyBarcodes, setBusyBarcodes] = useState(false)
  const [busyPrices, setBusyPrices] = useState(false)
  const router = useRouter()
  const { t } = useLanguage()
  const posIntegrationTypeList = getPosIntegrationTypeList()

  const [sonucItems, setSonucItems] = useState<any>({})
  const [sonucBarcodes, setSonucBarcodes] = useState<any>({})
  const [sonucPrices, setSonucPrices] = useState<any>({})

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
      <div className="flex justify-between">
        <div className="flex gap-4"><StoreIcon /> {store.name}</div>
        {!busyItems && !busyBarcodes && !busyPrices &&
          <ButtonConfirm
            title="Reset?"
            description={'Son Guncelleme tarihleri resetlenecek. Onayliyor musunuz?'}
            onOk={() => {
              postItem(`/storeIntegration/${store._id}/syncReset`, token, store)
                .then(result => {
                  alert('Guncelleme tarihleri resetlendi')
                  location.reload()
                })
                .catch(err => toast({ title: t('Error'), description: t(err || ''), variant: 'destructive' }))
            }}
          >
            <Button variant={'destructive'}><RefreshCcwDotIcon /> Reset</Button>
          </ButtonConfirm>
        }
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-2 items-end">
        <Button disabled={busyItems} variant={'outline'}
          onClick={() => {
            setBusyItems(true)
            postItem(`/storeIntegration/${store._id}/syncItems`, token, store)
              .then(result => setSonucItems(result))
              .catch(err => toast({ title: t('Error'), description: t(err || ''), variant: 'destructive' }))
          }}
          className="flex gap-2 justify-start"
        ><Package2Icon />Stok Kartlari Aktar</Button>
        <ProgressBar className="col-span-3" title={'Stok Aktarimi'} eventName="syncItems_progress" onProgress={e => setBusyItems(true)} onFinished={() => setBusyItems(false)} />
        <div>{JSON.stringify(sonucItems)}</div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-2 items-end">
        <Button disabled={busyBarcodes} variant={'outline'}
          onClick={() => {
            setBusyBarcodes(true)
            postItem(`/storeIntegration/${store._id}/syncBarcodes`, token, store)
              .then(result => setSonucBarcodes(result))
              .catch(err => toast({ title: t('Error'), description: t(err || ''), variant: 'destructive' }))
          }}
          className="flex gap-2 justify-start"
        ><BarcodeIcon /> Barkodlari Aktar</Button>
        <ProgressBar className="col-span-3" title={'Barcode Aktarimi'} eventName="syncBarcodes_progress" onProgress={e => setBusyBarcodes(true)} onFinished={() => setBusyBarcodes(false)} />
        <div>{JSON.stringify(sonucBarcodes)}</div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-2 items-end">
        <Button disabled={busyPrices} variant={'outline'}
          onClick={() => {
            setBusyPrices(true)
            postItem(`/storeIntegration/${store._id}/syncPrices`, token, store)
              .then(result => setSonucBarcodes(result))
              .catch(err => toast({ title: t('Error'), description: t(err || ''), variant: 'destructive' }))
          }}
          className="flex gap-2 justify-start"
        ><BanknoteIcon /> Fiyatlari Aktar</Button>
        <ProgressBar className="col-span-3" title={'Fiyat Aktarimi'} eventName="syncPrices_progress" onProgress={e => setBusyPrices(true)} onFinished={() => setBusyPrices(false)} />
        <div>{JSON.stringify(sonucPrices)}</div>
      </div>
    </div >)
  }

  useEffect(() => { !token && setToken(Cookies.get('token') || '') }, [])
  useEffect(() => { token && load() }, [token])
  return (
    <StandartForm
      title={t('POS Transactions')}
      loading={loading}
      icon={<ComputerIcon />}
    >

      <div className="flex flex-col gap-8 mt-6">
        {stores && stores.map(store => <div key={store._id}>{storePage(store)}</div>)}
      </div>
    </StandartForm>
  )
}