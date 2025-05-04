"use client"

import { TsnInput } from '@/components/ui216/tsn-input'
import { useLanguage } from '@/i18n'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useToast } from '@/components/ui/use-toast'
import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import { Order, orderTypeName } from '@/types/Order'
import { getItem, postItem, putItem } from '@/lib/fetch'
import { StandartForm } from '@/components/ui216/standart-form'
import { TsnListType, TsnSelect } from '@/components/ui216/tsn-select'
import { TsnSwitch } from '@/components/ui216/tsn-switch'
import { TsnPanel } from '@/components/ui216/tsn-panel'
import { TsnTextarea } from '@/components/ui216/tsn-textarea'
import { TsnInputAddress } from '@/components/ui216/tsn-input-address'
import { TsnSelectRemote } from '@/components/ui216/tsn-select-remote'
import { GridOrderLine } from './order-lines'
import { Label } from '@/components/ui/label'
import { moneyFormat } from '@/lib/utils'
import { NotepadTextDashedIcon } from 'lucide-react'
interface Props {
  id: string
  type?: string
}
export function OrderForm({ id, type }: Props) {
  const [token, setToken] = useState('')
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { t } = useLanguage()
  const [orderId, setOrderId] = useState(id != 'addnew' ? id : '')
  const [order, setOrder] = useState<Order>({
    issueDate: new Date().toISOString().substring(0, 10),
    closed: false,
    draft: true,
    type: type
  })

  const load = () => {
    setLoading(true)
    getItem(`/db/orders/${orderId}`, token)
      .then(result => setOrder(result as Order))
      .catch(err => toast({ title: t('Error'), description: t(err || ''), variant: 'destructive' }))
      .finally(() => setLoading(false))
  }

  const save = () => {
    // o && setOrder(o)
    setLoading(true)
    if (!order?._id) {
      postItem(`/db/orders`, token, order)
        .then(result => router.back())
        .catch(err => toast({ title: t('Error'), description: t(err || ''), variant: 'destructive' }))
        .finally(() => setLoading(false))
    } else {
      putItem(`/db/orders/${order._id}`, token, order)
        .then(result => router.back())
        .catch(err => toast({ title: t('Error'), description: t(err || ''), variant: 'destructive' }))
        .finally(() => setLoading(false))
    }

  }
  useEffect(() => { !token && setToken(Cookies.get('token') || '') }, [])
  useEffect(() => { token && orderId != '' && load() }, [token])


  return (<StandartForm
    title={orderTypeName(order?.type || '', t)}
    onSaveClick={() => save()}
    onCancelClick={() => router.back()}
  >
    {!loading && <div className='flex flex-col gap-2'>
      {/* <div className='grid grid-cols-1 lg:grid-cols-3 gap-4'>
        <TsnSelect title={t('Type')}
          defaultValue={order?.ioType?.toString()}
          list={OrderTypeList.map(e => ({ _id: e._id, text: t(e.text) }))}
          onValueChange={e => setOrder({ ...order, ioType: Number(e) })}
        />
      </div> */}
      <div className='grid grid-cols-1 lg:grid-cols-4 gap-4'>
        <TsnInput type='date' title={t('Date')} defaultValue={order?.issueDate}
          onBlur={e => setOrder({ ...order, issueDate: e.target.value })
          } />
        <TsnInput title={t('Document Number')} defaultValue={order?.documentNumber}
          onBlur={e => setOrder({ ...order, documentNumber: e.target.value })} />
        <TsnSelectRemote
          className='col-span-2'
          apiPath='/db/firms'
          title={t('Firm')}
          defaultValue={order.firm?._id}
          onValueChange={e => setOrder({ ...order, firm: { ...order.firm, _id: e } })}
        />
      </div>

      <TsnPanel name='order_address' trigger={t('Address')}>
        <TsnInputAddress defaultValue={order?.address} onChange={e => setOrder({ ...order, address: e })} />
      </TsnPanel>
      <TsnPanel name='order_note_passive' trigger={t('Notes')}>
        <TsnTextarea title={t('Note')} defaultValue={order?.note} onBlur={e => setOrder({ ...order, note: e.target.value })} />
      </TsnPanel>

      <GridOrderLine orderId={order._id} onAddNewOrder={() =>
        postItem(`/db/orders`, token, order)
          .then((result: Order) => {
            setOrder(result)
            setOrderId(result._id || '')
          })
          .catch(err => toast({ title: t('Error'), description: t(err || ''), variant: 'destructive' }))
          .finally(() => setLoading(false))

      } />
      <div className='flex flex-col-reverse md:flex-row md:items-end justify-between'>
        <div className='my-4 flex flex-col gap-4'>
          <TsnSwitch title={t('Draft?')} defaultChecked={order?.draft} onCheckedChange={e => setOrder({ ...order, draft: e })} />
          <TsnSwitch title={t('Closed?')} defaultChecked={order?.closed} onCheckedChange={e => setOrder({ ...order, closed: e })} />
        </div>
        <div className='ms-2 min-w-[320px] flex flex-col gap-2 font-mono'>
          <TotalElem title={t('Sub Total')} amount={moneyFormat(order.total)} />
          <TotalElem title={t('VAT')} amount={moneyFormat(order.taxAmount)} />
          <TotalElem title={t('WHT')} amount={moneyFormat(order.withHoldingTaxAmount)} />
          <TotalElem
            className='font-bold text-blue-800 dark:text-blue-500'
            labelClassName='text-lg md:text-xl'
            title={t('Net Total')} amount={moneyFormat(order.taxInclusiveTotal)}
          />

        </div>
      </div>

    </div>}
  </StandartForm>)
}
interface TotalElemProps {
  title?: string
  amount?: string
  className?: string
  labelClassName?: string
}

function TotalElem({ title, amount, className, labelClassName }: TotalElemProps) {
  return (<div className={`grid grid-cols-2 ${className}`}>
    <Label className={`text-xs md:text-lg ${labelClassName}`} >{title}</Label>
    <Label className={`text-xs md:text-lg text-end ${labelClassName}`}>{amount}</Label>
  </div>)
}