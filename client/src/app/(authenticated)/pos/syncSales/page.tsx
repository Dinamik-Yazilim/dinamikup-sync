"use client"

import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { StandartForm } from "@/components/ui216/standart-form"
import { getList, postItem } from "@/lib/fetch"
import { getPosIntegrationTypeList, Store } from "@/types/Store"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import Cookies from 'js-cookie'
import { BanknoteIcon, BarcodeIcon, CircleArrowDown, ComputerIcon, Divide, Grid2x2PlusIcon, MoveRightIcon, Package2Icon, RefreshCcwDotIcon, StoreIcon, WandSparklesIcon } from "lucide-react"
import { ProgressBar } from "../../(components)/progressBar"
import { ButtonConfirm } from "@/components/button-confirm"
import { Input } from "@/components/ui/input"
import { today, yesterday } from "@/lib/utils"

interface StorePageProps {
  store: Store
  token: string
  startDate: string
  endDate: string
  setStartDate: (date: string) => void
  setEndDate: (date: string) => void
  audioRef: React.RefObject<HTMLAudioElement>
}

function StorePage({ store, token, startDate, endDate, setStartDate, setEndDate, audioRef }: StorePageProps) {
  const { toast } = useToast()
  const [busySales, setBusySales] = useState(false)
  const [sonucSales, setSonucSales] = useState<any>({})

  useEffect(() => { !busySales && audioRef?.current && audioRef.current.play() }, [busySales, audioRef])

  return (
    <div className="border rounded-md border-dashed px-4 py-2 flex flex-col gap-4 w-full min-h-40">
      <div className="flex justify-between items-center">
        <div className="flex gap-4"><StoreIcon /> {store.name}</div>
        <div className="flex justify-end items-center">
          <div>Tarih:</div>
          <div className="flex justify-end items-center">
            <Input type='date' defaultValue={startDate} onChange={e => setStartDate(e.target.value)} />
            -
            <Input type='date' defaultValue={endDate} onChange={e => setEndDate(e.target.value)} />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-2 items-end">
        <Button disabled={busySales} variant="outline"
          onClick={() => {
            setBusySales(true)
            postItem(`/storeIntegration/${store._id}/syncSales`, token, { startDate: startDate, endDate: endDate })
              .then(result => setSonucSales(result))
              .catch(err => {
                setSonucSales(err)
                toast({ title: 'Hata', description: err || '', variant: 'destructive' })
              })
          }}
          className="flex gap-2 justify-start"
        ><Package2Icon />Transfer</Button>
        <ProgressBar storeId={store._id} className="col-span-3" title="Satış aktarımı" eventName="syncSales_progress" onProgress={e => setBusySales(true)} onFinished={() => setBusySales(false)} />
        <div>{JSON.stringify(sonucSales)}</div>
      </div>
    </div>
  )
}

interface Props {
}
export default function PosGetSalesPage({ }: Props) {
  const [stores, setStores] = useState<Store[]>([])
  const [token, setToken] = useState('')
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const [startDate, setStartDate] = useState(yesterday())
  const [endDate, setEndDate] = useState(yesterday())
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const load = () => {
    setLoading(true)
    getList(`/stores`, token)
      .then(result => {
        setStores(result.docs as Store[])
      })
      .catch(err => toast({ title: 'Error', description: err || '', variant: 'destructive' }))
      .finally(() => setLoading(false))
  }

  const [endDate, setEndDate] = useState(yesterday())
  const audioRef = useRef<HTMLAudioElement | null>(null)

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
    <StandartForm
      title="Mikro Aktarım"
      loading={loading}
      icon={<WandSparklesIcon />}
    >
      <div className="flex flex-col gap-8 mt-6">
        {stores && stores.map(store => (
          <StorePage
            key={store._id}
            store={store}
            token={token}
            startDate={startDate}
            endDate={endDate}
            setStartDate={setStartDate}
            setEndDate={setEndDate}
            audioRef={audioRef}
          />
        ))}
      </div>
      <audio ref={audioRef} src="/mp3/notification-1.mp3" />
    </StandartForm>
  )
}