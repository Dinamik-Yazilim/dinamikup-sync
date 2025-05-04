"use client"

import { useEffect, useState } from 'react'
import { getItem, getList } from '@/lib/fetch'
import Cookies from 'js-cookie'
import { getUnitCodeList, InvoiceLine, showWithholdingTax } from '@/types/Invoice'
import { useToast } from '@/components/ui/use-toast'
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogTrigger,
// } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { ButtonCancel, ButtonOK } from '@/components/icon-buttons'
import { CheckIcon, Trash2Icon, XIcon } from 'lucide-react'
import { TsnSelectRemote } from '@/components/ui216/tsn-select-remote'
import { useLanguage } from '@/i18n'
import { TsnInput } from '@/components/ui216/tsn-input'
import { TsnSwitch } from '@/components/ui216/tsn-switch'
import { Item } from '@/types/Item'
import { moneyFormat } from '@/lib/utils'
// import {
//   Tabs,
//   TabsContent,
//   TabsList,
//   TabsTrigger,
// } from "@/components/ui/tabs"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { TsnSelect } from '@/components/ui216/tsn-select'

interface Props {
  trigger?: any
  defaultValue?: InvoiceLine
  onChange?: (e: InvoiceLine) => void
  title?: any
  description?: any
  whtList?: any[]
}
export function InvoiceLinePopup({
  trigger, defaultValue, onChange, title, description, whtList = []
}: Props) {
  const [invoiceLine, setInvoiceLine] = useState<InvoiceLine>(defaultValue || {

  })
  const [quantity, setQuantity] = useState(defaultValue?.invoicedQuantity || 0)
  const [price, setPrice] = useState(defaultValue?.price || 0)
  const [total, setTotal] = useState(defaultValue?.lineExtensionAmount || 0)
  const [vatRate, setVatRate] = useState(0)
  const [vatAmount, setVatAmount] = useState(0)
  const [whtRate, setWhtRate] = useState(0)
  const [whtTaxTypeCode, setWhtTaxTypeCode] = useState('')
  const [whtTaxTypeName, setWhtTaxTypeName] = useState('')

  const { toast } = useToast()
  const { t } = useLanguage()
  const [token, setToken] = useState('')
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState(0)
  const [clearingWHT, setClearingWHT] = useState(false)

  const calcVatAmount = (t: number, vr: number) => {
    const va = Math.round(100 * t * vr / 100) / 100
    const txtVatAmount = document.getElementById('txtVatAmount') as HTMLInputElement
    setVatAmount(va)
    txtVatAmount.value = va.toString()
    setInvoiceLine({
      ...invoiceLine,
      taxTotal: {
        taxAmount: va,
        taxSubtotal: [{
          percent: vr,
          calculationSequenceNumeric: 1,
          taxableAmount: t,
          taxAmount: va,
          taxCategory: {
            taxScheme: {
              name: 'KDV',
              taxTypeCode: '0015'
            }
          }
        }]
      }
    })
  }
  const Tab1 = () => {
    return (<div className={`${activeTab == 0 ? 'flex' : 'hidden'} flex-col gap-2`}>
      <div className='grid grid-cols-3 gap-2'>
        <TsnSelectRemote
          className='col-span-2'
          apiPath='/db/items'
          title={t('Item')}
          defaultValue={invoiceLine.item?._id}
          onValueChange={e => {
            // setInvoiceLine({
            //   ...invoiceLine,
            //   item: { ...invoiceLine.item, _id: e },
            // })
            getItem(`/db/items/${e}`, token)
              .then((result: Item) => {
                setInvoiceLine({
                  ...invoiceLine,
                  item: { ...invoiceLine.item, _id: e },
                  // taxTotal: result.taxType?.taxTotal,
                  // withholdingTaxTotal: result.taxType?.withholdingTaxTotal,
                })
              })
              .catch(err => toast({ title: t('Error'), description: t(err || ''), variant: 'destructive' }))


          }}
        />
        <TsnSelect title={t('Unit')}
          defaultValue={invoiceLine.unitCode}
          list={getUnitCodeList(t)}
          onValueChange={e => setInvoiceLine({ ...invoiceLine, unitCode: e })}
        />
      </div>
      <div className='grid grid-cols-3 gap-2'>
        <TsnInput className='text-end' inputClassName='text-end' id='txtQuantity' type={'number'} title={t('Quantity')} defaultValue={quantity}

          onFocus={e => {
            setQuantity(isNaN(Number(e.target.value)) ? 0 : Number(e.target.value))
            e.target.select()
          }}
          onBlur={e => {
            if (e.target.value != quantity.toString()) {
              const q = isNaN(Number(e.target.value)) ? 0 : Number(e.target.value)
              setQuantity(q)
              const t = Math.round(100 * price * q) / 100
              const txtTotal = document.getElementById('txtTotal') as HTMLInputElement
              setTotal(t)
              txtTotal.value = t.toString()
              calcVatAmount(t, vatRate)
            }
          }}
        />
        <TsnInput className='text-end' inputClassName='text-end' id='txtPrice' type={'number'} title={t('Price')} defaultValue={price}
          onFocus={e => {
            setPrice(isNaN(Number(e.target.value)) ? 0 : Number(e.target.value))
            e.target.select()
          }}
          onBlur={e => {
            if (e.target.value != price.toString()) {
              const p = isNaN(Number(e.target.value)) ? 0 : Number(e.target.value)
              setPrice(p)
              const t = Math.round(100 * p * quantity) / 100
              const txtTotal = document.getElementById('txtTotal') as HTMLInputElement
              setTotal(t)
              txtTotal.value = t.toString()
              calcVatAmount(t, vatRate)
            }
          }}
        />

        <TsnInput className='text-end' inputClassName='text-end' id='txtTotal' type={'number'} title={t('Total')} defaultValue={total}
          onFocus={e => {
            setTotal(isNaN(Number(e.target.value)) ? 0 : Number(e.target.value))
            e.target.select()
          }}
          onBlur={async e => {
            if (e.target.value != total.toString()) {
              const t = isNaN(Number(e.target.value)) ? 0 : Number(e.target.value)
              setTotal(t)
              const p = quantity > 0 ? Math.round(10000 * t / quantity) / 10000 : 0
              const txtPrice = document.getElementById('txtPrice') as HTMLInputElement
              setPrice(p)
              txtPrice.value = p.toString()
              calcVatAmount(t, vatRate)
            }
          }}
        />
      </div>
      <div className='grid grid-cols-3 gap-2'>
        <TsnInput className='text-end' inputClassName='text-end' id='txtVatRate'
          type={'number'} title={t('Vat %')} defaultValue={vatRate}
          onFocus={e => {
            setVatRate(isNaN(Number(e.target.value)) ? 0 : Number(e.target.value))
            e.target.select()
          }}
          onBlur={e => {
            if (e.target.value != vatRate.toString()) {
              const vr = isNaN(Number(e.target.value)) ? 0 : Number(e.target.value)
              setVatRate(vr)
              calcVatAmount(total, vr)
            }
          }}
        />
        <TsnInput className='text-end' inputClassName='text-end' id='txtVatAmount' type={'number'} title={t('Vat Amount')} defaultValue={vatAmount}
          readOnly
          onFocus={e => {
            setVatAmount(isNaN(Number(e.target.value)) ? 0 : Number(e.target.value))
            e.target.select()
          }}
        />


      </div>
      <div className='grid grid-cols-3 gap-2 items-end'>
        <div className='col-span-2'>
          {!clearingWHT &&
            <TsnSelect title={t('Withholding Tax')}
              defaultValue={whtTaxTypeCode}
              list={whtList.map(e => ({ _id: e._id, name: `${e._id} - ${showWithholdingTax(e.rate)} - ${e.name}` }))}
              onValueChange={e => {
                const found = whtList.find(k => k._id == e)
                if (found) {
                  const ta = Math.round(100 * vatAmount * found.rate / 100) / 100
                  setWhtRate(found.rate || 0)
                  setWhtTaxTypeCode(found._id)
                  setWhtTaxTypeName(found.name)
                  setInvoiceLine({
                    ...invoiceLine,
                    withholdingTaxTotal: [{
                      taxAmount: ta,
                      taxSubtotal: [{
                        calculationSequenceNumeric: 1,
                        percent: found.rate,
                        // taxableAmount:
                        taxAmount: ta,
                        taxCategory: {
                          taxScheme: {
                            name: found.name,
                            taxTypeCode: found._id
                          }
                        }
                      }]
                    }]
                  })
                } else {
                  setWhtRate(0)
                  setInvoiceLine({ ...invoiceLine, withholdingTaxTotal: [] })
                }
              }}
            />
          }
        </div>
        {invoiceLine.withholdingTaxTotal && invoiceLine.withholdingTaxTotal.length > 0 &&
          <div className='flex items-center gap-2 mb-1'>
            <div>{whtRate}</div>
            <Button
              onClick={() => {
                setClearingWHT(true)
                setWhtTaxTypeCode('')
                setWhtTaxTypeName('')
                setWhtRate(0)
                setInvoiceLine({ ...invoiceLine, withholdingTaxTotal: [] })
                setTimeout(() => setClearingWHT(false), 200)
              }}
              size={'icon'}
              variant={'outline'}
            ><Trash2Icon size={'22px'} color='red' /></Button>
          </div>
        }
      </div>
      <TsnInput title={t('Description')} defaultValue={invoiceLine.note?.join('\n')} onBlur={e => setInvoiceLine({ ...invoiceLine, note: e.target.value.split('\n') })} />
    </div>)
  }

  const Tab2 = () => {
    return (<div className={`${activeTab == 1 ? 'flex' : 'hidden'} flex-col gap-2`}>
      <div className='grid grid-cols-3 gap-2'>
        <TsnInput title={'deneme'} />
      </div>
    </div>
    )
  }
  useEffect(() => { !token && setToken(Cookies.get('token') || '') }, [])
  useEffect(() => {
    const findex = invoiceLine.taxTotal?.taxSubtotal?.findIndex(e => e.taxCategory?.taxScheme?.taxTypeCode == '0015')
    if (findex != undefined && findex > -1 && invoiceLine.taxTotal?.taxSubtotal && invoiceLine.taxTotal?.taxSubtotal[findex]) {
      const vr = invoiceLine.taxTotal?.taxSubtotal[findex].percent || 0
      const va = invoiceLine.taxTotal?.taxSubtotal[findex].taxAmount || 0
      setVatRate(vr)
      setVatAmount(va)
    }
    if (invoiceLine.withholdingTaxTotal && (invoiceLine.withholdingTaxTotal || []).length > 0) {
      const wht = invoiceLine.withholdingTaxTotal[0]
      setWhtRate(wht.taxAmount || 0)
      if (wht.taxSubtotal && wht.taxSubtotal.length > 0) {
        setWhtTaxTypeCode(wht.taxSubtotal[0].taxCategory?.taxScheme?.taxTypeCode || '')
        setWhtTaxTypeName(wht.taxSubtotal[0].taxCategory?.taxScheme?.name || '')
      } else {
        setWhtTaxTypeCode('')
        setWhtTaxTypeName('')
      }

    } else {
      setWhtRate(0)
      setWhtTaxTypeCode('')
      setWhtTaxTypeName('')
    }
  }, [token])
  return (<>
    <AlertDialog>
      <AlertDialogTrigger asChild className='cursor-pointer'>
        {trigger}
      </AlertDialogTrigger>

      <AlertDialogContent className=''>
        <AlertDialogHeader>
          <AlertDialogTitle className='flex justify-between items-center'>
            <div>{title}</div>
            <div className='flex gap-2'>
              <Button className={`${activeTab == 0 ? 'bg-green-700 text-white' : ''}`} onClick={() => setActiveTab(0)} variant={'outline'}>{t('General')}</Button>
              <Button className={`${activeTab == 1 ? 'bg-green-700 text-white' : ''}`} onClick={() => setActiveTab(1)} variant={'outline'}>{t('Other')}</Button>
            </div>
          </AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <div className='h-[390px] flex flex-col items-start'>
          {Tab1()}
          {Tab2()}
        </div>
        <AlertDialogFooter className='flex justify-end items-center gap-4'>
          <div className='flex justify-start'>
            {/* <pre>
              {JSON.stringify(invoiceLine.withholdingTaxTotal, null, 2)}
            </pre> */}
          </div>
          <div className='flex flex-row justify-end items-center gap-2'>
            <AlertDialogAction onClick={e => {
              if (!invoiceLine.item) {
                e.preventDefault()
                toast({ title: t('Item required'), variant: 'destructive' })
                return
              }
              onChange && onChange({ ...invoiceLine, invoicedQuantity: quantity, price: price, lineExtensionAmount: total })
            }}><CheckIcon /></AlertDialogAction>
            <AlertDialogCancel className='mt-0'><XIcon /></AlertDialogCancel>
          </div>

        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </>)
}