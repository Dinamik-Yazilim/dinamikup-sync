"use client"

import { useToast } from "@/components/ui/use-toast"
import { StandartForm } from "@/components/ui216/standart-form"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Cookies from 'js-cookie'
import { getItem, getList, postItem, putItem } from "@/lib/fetch"
import { StorePaymentType, StorePaymentTypeListItem } from "@/types/StorePaymentType"
import { TsnInput } from "@/components/ui216/tsn-input"
import { TsnSwitch } from "@/components/ui216/tsn-switch"
import { TsnPanel } from "@/components/ui216/tsn-panel"
import { TsnSelect } from "@/components/ui216/tsn-select"
import { SelectResponsibilityWithLabel } from "@/app/(authenticated)/(components)/select-responsibility"
import { SelectProjectWithLabel } from "@/app/(authenticated)/(components)/select-project"
import { SelectWarehouseWithLabel } from "@/app/(authenticated)/(components)/select-warehouse"
import { TsnSelectRemote } from "@/components/ui216/tsn-select-remote"
import { Store } from "@/types/Store"
import { SelectCashAccountWithLabel } from "@/app/(authenticated)/(components)/select-cashAccount"
import { SelectBankAccountWithLabel } from "@/app/(authenticated)/(components)/select-bankAccount"
import { SelectFirmWithLabel } from "@/app/(authenticated)/(components)/select-firm"
import { Button } from "@/components/ui/button"

interface Props {
  params: { id: string }
}

export default function EditPage({ params }: Props) {
  const [token, setToken] = useState('')

  const { toast } = useToast()

  const [loading, setLoading] = useState(false)

  const router = useRouter()
  const [storePaymentType, setStorePaymentType] = useState<StorePaymentType>()

  const [stores, setStores] = useState<Store[]>()

  const [paymentList, setPaymentList] = useState<StorePaymentTypeListItem[]>()



  const load = () => {
    setLoading(true)
    getItem(`/storePaymentTypes/${params.id}`, token)
      .then(result => {
        setStorePaymentType(result as StorePaymentType)

      })
      .catch(err => toast({ title: 'Hata', description: err || '', variant: 'destructive' }))
      .finally(() => setLoading(false))
  }

  const loadStores = () => {
    getList(`/stores?pageSize=1000`, token)
      .then(result => {
        result.docs && setStores(result.docs as Store[])
      })
      .catch(err => toast({ title: 'Hata', description: err || '', variant: 'destructive' }))
  }

  const loadPaymentList = () => {
    console.log('storePaymentType?.store?._id', storePaymentType?.store?._id)
    getList(`/stores/${storePaymentType?.store?._id}/paymentList`, token)
      .then((result: any[]) => {

        let list: StorePaymentTypeListItem[] = []
        if (Array.isArray(result)) {
          list = result.map(r => ({
            _id: r.id.toString(),
            type: r.type.toString(),
            name: r.name
          } as StorePaymentTypeListItem))
        }
        setPaymentList(list)
      })
      .catch(err => toast({ title: 'Hata', description: err || '', variant: 'destructive' }))
  }

  const save = () => {
    if (!storePaymentType?._id) {
      postItem(`/storePaymentTypes`, token, storePaymentType)
        .then(result => router.back())
        .catch(err => toast({ title: 'Hata', description: err || '', variant: 'destructive' }))
    } else {
      putItem(`/storePaymentTypes/${storePaymentType?._id}`, token, storePaymentType)
        .then(result => router.back())
        .catch(err => toast({ title: 'Hata', description: err || '', variant: 'destructive' }))
    }
  }


  useEffect(() => { !token && setToken(Cookies.get('token') || '') }, [])
  useEffect(() => {
    if (token) {
      loadStores()

      params.id != 'addnew' && load()
    }
  }, [token])
  useEffect(() => {
    if (token) {
      loadPaymentList()

    }
  }, [storePaymentType?.store?._id])
  return (<StandartForm
    title={params.id == 'addnew' ? 'New Paymet Type' : 'Edit Paymet Type'}
    onSaveClick={save}
    onCancelClick={() => router.back()}
    loading={loading}
  >
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <TsnSelect title="Mağaza" defaultValue={storePaymentType?.store?._id}
          onValueChange={e => setStorePaymentType({ ...storePaymentType, store: { ...storePaymentType?.store, _id: e } })}
          list={stores}
        />
        <TsnSelect title="İsim" defaultValue={storePaymentType?.paymentId?.toString()} onValueChange={e => {
          let val = paymentList?.find(p => p._id == e)
          if (val) {
            setStorePaymentType({ ...storePaymentType, paymentId: val._id, paymentName: val.name, paymentType: val.type })
          }
        }}

          list={paymentList}
        />

      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="flex gap-4">
          <SelectFirmWithLabel caption={storePaymentType?.defaultFirm} onSelect={e => { setStorePaymentType({ ...storePaymentType, defaultFirmId: e._id, defaultFirm: e.name }) }} />
          <Button variant="outline" onClick={() => { setStorePaymentType({ ...storePaymentType, defaultFirmId: '', defaultFirm: '' }) }}>Clear Firm</Button>
        </div>
      </div>
    </div>

  </StandartForm>)
}
