"use client"

import { useToast } from "@/components/ui/use-toast"
import { StandartForm } from "@/components/ui216/standart-form"
import { useLanguage } from "@/i18n"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Cookies from 'js-cookie'
import { getItem, postItem, putItem } from "@/lib/fetch"
import { getRoleList, Member } from "@/types/Member"
import { TsnInput } from "@/components/ui216/tsn-input"
import { TsnSwitch } from "@/components/ui216/tsn-switch"
import { TsnPanel } from "@/components/ui216/tsn-panel"
import { TsnSelect } from "@/components/ui216/tsn-select"
import { moneyFormat, today } from "@/lib/utils"
import { TsnSelectRemote } from "@/components/ui216/tsn-select-remote"
import { TsnGrid, TsnGridButtonAddNew, TsnGridButtonDelete, TsnGridButtonEdit } from "@/components/ui216/tsn-grid"
import { OrderDetail, orderDetailQuery, OrderHeader, orderHeaderQuery, paymentPlanQuery, responsibilityQuery } from "@/types/Order"
import { Label } from "@/components/ui/label"
// import { OrderLineDialog } from "./order-line-dialog"
import { Button } from "@/components/ui/button"
import { CheckIcon, Edit2Icon, EditIcon, PlusSquareIcon } from "lucide-react"
import { ButtonCancel, ButtonOK } from "@/components/icon-buttons"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { TsnLineGrid } from "@/components/ui216/tsn-line-grid"

interface Props {
  params: { id: string }
}

export default function UserEditPage({ params }: Props) {
  const [token, setToken] = useState('')
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { t } = useLanguage()
  const [orderHeader, setOrderHeader] = useState<OrderHeader>({ issueDate: today() })
  const [orderDetails, setOrderDetails] = useState<OrderDetail[]>([])
  const [detailLoading, setDetailLoading] = useState(false)
  const load = () => {
    setLoading(true)
    postItem(`/mikro/get`, token, { query: orderHeaderQuery(params.id) })
      .then(result => {
        setOrderHeader(result[0] as OrderHeader)
        postItem(`/mikro/get`, token, { query: orderDetailQuery(params.id) })
          .then(result => {
            setOrderDetails(result as OrderDetail[])
          })
          .catch(err => toast({ title: t('Error'), description: t(err || ''), variant: 'destructive' }))
          .finally(() => setLoading(false))
      })
      .catch(err => {
        toast({ title: t('Error'), description: t(err || ''), variant: 'destructive' })
        setLoading(false)
      })
  }


  const save = () => {
    //qwerty
  }

  const OrderCurrency = () => <span className='text-xs text-muted-foreground'>{orderHeader.currency}</span>

  const FormHeader = () => {
    return (<TsnPanel name="porder_Header" defaultOpen={true} className="mt-4" trigger={t('Header')} contentClassName="grid grid-cols-1 lg:grid-cols-2 gap-2 w-full">
      <div className="flex items-end gap-2">
        <TsnInput title={t('Document Serial')} defaultValue={orderHeader.docNoSerial}
          onBlur={e => setOrderHeader({ ...orderHeader, docNoSerial: e.target.value })} />
        <TsnInput type='number' min={1} title={t('Document Sequence')} defaultValue={orderHeader.docNoSequence}
          onBlur={e => setOrderHeader({ ...orderHeader, docNoSequence: !isNaN(Number(e.target.value)) ? Number(e.target.value) : 1 })} />
        <TsnInput type='date' title={t('Date')} defaultValue={orderHeader.issueDate?.substring(0, 10)}
          onBlur={e => setOrderHeader({ ...orderHeader, issueDate: e.target.value })} />
      </div>
      <div className="flex items-end gap-2">
        <TsnInput title={t('Document Number')} defaultValue={orderHeader.documentNumber}
          onBlur={e => setOrderHeader({ ...orderHeader, documentNumber: e.target.value })} />
        <TsnInput type='date' title={t('Document Date')} defaultValue={orderHeader.issueDate?.substring(0, 10)}
          onBlur={e => setOrderHeader({ ...orderHeader, documentDate: e.target.value })} />
        <TsnSelectRemote all title={t('Warehouse')} itemClassName='capitalize' value={orderHeader.warehouseCode} onValueChange={e => setOrderHeader({ ...orderHeader, warehouseCode: e })} query={`SELECT dep_no as _id, LOWER(dep_adi) as [name], * FROM DEPOLAR WHERE dep_envanter_harici_fl=0 ORDER BY dep_adi`} />
      </div>
      <div className="flex items-end gap-2">
        <TsnSelectRemote all title={t('Firm')} itemClassName='capitalize' value={orderHeader.firmCode} onValueChange={e => setOrderHeader({ ...orderHeader, firmCode: e })} query={`SELECT cari_kod as _id, LOWER(cari_unvan1) + ' (' + cari_kod + ')' as [name] FROM CARI_HESAPLAR WHERE cari_baglanti_tipi=1 and cari_hareket_tipi in (0,2) ORDER BY cari_unvan1`} />

      </div>
      <div className="flex items-end gap-2">
        <TsnSelectRemote title={t('Payment Plan')} value={orderHeader.paymentPlan} onValueChange={e => setOrderHeader({ ...orderHeader, paymentPlan: e })}
          itemClassName="capitalize"
          query={paymentPlanQuery()} />

        <TsnSelectRemote title={t('Responsibility')} value={orderHeader.responsibility} onValueChange={e => setOrderHeader({ ...orderHeader, responsibility: e })}
          itemClassName="capitalize" empty
          query={responsibilityQuery()} />

        <TsnSelectRemote title={t('Project')} value={orderHeader.project} onValueChange={e => setOrderHeader({ ...orderHeader, project: e })}
          itemClassName="capitalize" empty
          query={responsibilityQuery()} />
      </div>
    </TsnPanel>)
  }

  const FormDetail = () => {
    return (<TsnPanel name="porder_Detail" defaultOpen={true} className="mt-4" trigger={t('Lines')} contentClassName="relative grid grid-cols-1gap-2 w-full">
      <TsnLineGrid
        list={orderDetails}
        onHeaderPaint={() =>
          <div className="flex  w-full gap-2">
            <div className="text-xs text-nowrap mt-2 text-muted-foreground">#</div>
            <div className="grid grid-cols-8 gap-1 w-full items-center">
              <div>{t('Item Code')}</div>
              <div>{t('Item Name')}</div>
              <div className="text-end">{t('Quantity')}</div>
              <div className="text-end">{t('Price')}</div>
              <div className="text-end">{t('Amount')}</div>
              <div className="text-center">{t('Discounts')}</div>
              <div className="text-end">{t('VAT')}</div>
              <div className="text-end">{t('Net Total')}</div>
            </div>
            <div className='w-20 p-1 flex justify-end lg:justify-end'>
              <TsnGridButtonAddNew onClick={() => alert('qwerty')} />
            </div>
          </div>
        }
        onRowPaint={(e: OrderDetail, rowIndex) =>
          <div key={'line' + rowIndex} className="flex  w-full gap-2 items-center">
            <div className="text-xs text-nowrap mt-2 text-muted-foreground">#{rowIndex + 1}</div>
            <div className="grid grid-cols-8 gap-1 w-full items-center">
              <div className="flex flex-col">
                <div>{e.itemCode}</div>
                <div className="text-xs text-muted-foreground">{e.barcode}</div>
              </div>
              <div>{e.itemName}</div>
              <div className='flex flex-col items-end'>
                <div className="flex items-center gap-[3px]">{e.quantity}  <span className='text-xs text-muted-foreground capitalize'>{e.unit?.toLowerCase()}</span></div>
                <div className='text-muted-foreground text-xs'>{e.delivered}/{e.remainder}</div>
              </div>
              <div className='flex items-center justify-end gap-[3px]'>
                {moneyFormat(e.price)}<span className='text-xs text-muted-foreground ms-1'>{orderHeader.currency}</span>
              </div>
              <div className='flex flex-col gap-1 items-end'>
                <div className='flex items-center gap-[3px]'>{moneyFormat(e.amount)} <span className='text-xs text-muted-foreground'>{orderHeader.currency}</span></div>

              </div>
              <div className='grid grid-cols-3 text-end justify-end px-2 text-xs text-muted-foreground'>
                {e.discountRate1! > 0 && <div>%{e.discountRate1} </div>}
                {e.discountRate2! > 0 && <div>%{e.discountRate2} </div>}
                {e.discountRate3! > 0 && <div>%{e.discountRate3} </div>}
                {e.discountRate4! > 0 && <div>%{e.discountRate4} </div>}
                {e.discountRate5! > 0 && <div>%{e.discountRate5} </div>}
                {e.discountRate6! > 0 && <div>%{e.discountRate6} </div>}
              </div>
              <div className='flex items-center justify-end gap-[3px]'>
                {moneyFormat(e.vatAmount)}<span className='text-xs text-muted-foreground ms-1'>{orderHeader.currency}</span>
              </div>
              <div className='flex items-center justify-end gap-[3px]'>{moneyFormat(e.lineNetTotal)}<span className='text-xs text-muted-foreground ms-1'>{orderHeader.currency}</span></div>

            </div>
            <div className='w-20 flex flex-row items-end justify-end mx-2 gap-2'>
              {/* <OrderLineDialog trigger={()=><div>Edit</div>} line={e} lineIndex={rowIndex} onOk={(e)=>alert('ok')} onCancel={()=>alert('cancel')} /> */}
              {/* {OrderLineDialog({
                t: t,
                trigger: <div className="cursor-pointer bg-indigo-600 px-[5px] py-[4px] rounded-md" ><EditIcon width={'20px'} /></div>,
                title: t('Edit Line'), orderLine: e, rowIndex: rowIndex
              })} */}
              {OrderLineDialog(rowIndex)}
              <TsnGridButtonDelete t={t} title={'delete line?'} />
            </div>
          </div>
        }

      />

    </TsnPanel>)
  }

  const FormFooter = () => {
    return (<TsnPanel name="porder_Footer" defaultOpen={true} className="mt-4" trigger={t('Totals')} contentClassName="grid grid-cols-1 lg:grid-cols-4 gap-2 w-full">
      <div className="flex flex-col gap-2">
        <div className="grid grid-cols-2">
          <div>{t('Line Total')}</div>
          <div className="text-end">{moneyFormat(orderHeader.amount)} <OrderCurrency /></div>
        </div>
        <div className="grid grid-cols-2">
          <div>{t('Discount Total')}</div>
          <div className="text-end">{moneyFormat(orderHeader.discountAmount1! + orderHeader.discountAmount2! + orderHeader.discountAmount3! + orderHeader.discountAmount4! + orderHeader.discountAmount5! + orderHeader.discountAmount6!)} <OrderCurrency /></div>
        </div>
        <div className="grid grid-cols-2">
          <div>{t('Gross Total')}</div>
          <div className="text-end">{moneyFormat(orderHeader.grossTotal)} <OrderCurrency /></div>
        </div>
        <div className="grid grid-cols-2">
          <div>{t('VAT')}</div>
          <div className="text-end">{moneyFormat(orderHeader.vatAmount)} <OrderCurrency /></div>
        </div>
        <div className="grid grid-cols-2">
          <div>{t('Net Total')}</div>
          <div className="text-end">{moneyFormat(orderHeader.netTotal)} <OrderCurrency /></div>
        </div>
      </div>
    </TsnPanel>)
  }

  const OrderLineDialog = (rowIndex: number) => {
    const line = rowIndex >= 0 ? orderDetails[rowIndex] : {}
    return (
      <Sheet>
        <SheetTrigger asChild>
          <div className="cursor-pointer bg-indigo-600 px-[5px] py-[4px] rounded-md" ><EditIcon width={'20px'} /></div>

        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>
              {rowIndex >= 0 && <>Satir Duzelt</>}
              {rowIndex < 0 && <>Yeni Satir</>}
            </SheetTitle>
            <SheetDescription>Açıklama alanı</SheetDescription>
          </SheetHeader>
          <div className="flex flex-col">
            <div>itemCode:{line?.itemCode}</div>
            <div>itemName:{line?.itemName}</div>
            <TsnInput type={'number'} title={t('Quantity')} defaultValue={line?.quantity} onBlur={e => {
              const q = !isNaN(Number(e.target.value)) ? Number(e.target.value) : 0
              setOrderDetails(orderDetails.map((e, index) => {
                if (rowIndex == index) {
                  e.quantity = q
                }
                return e
              }))
              // setLine({ ...line, quantity: !isNaN(Number(e.target.value)) ? Number(e.target.value) : 0 })
              // calcAmount(Number(e.target.value), line.price)
            }} />
            <TsnInput type={'number'} title={t('Price')} defaultValue={line?.price} onBlur={e => {
              const p = !isNaN(Number(e.target.value)) ? Number(e.target.value) : 0
              setOrderDetails(orderDetails.map((e, index) => {
                if (rowIndex == index) {
                  e.price = p
                }
                return e
              }))

              // setLine({ ...line, price: !isNaN(Number(e.target.value)) ? Number(e.target.value) : 0 })
              // calcAmount(line.quantity, Number(e.target.value))
            }} />

            <div>{line?.amount}</div>
            <div>Kdv%{line?.vatRate}</div>
          </div>
          <SheetFooter>
            {/* <AlertDialogAction className='bg-blue-600 text-white hover:bg-blue-800 hover:text-white' onClick={() => onOk && onOk()}><CheckIcon /></AlertDialogAction>
          <AlertDialogCancel className='bg-gray-600 text-white hover:bg-gray-800 hover:text-white' onClick={() => onCancel && onCancel()}><XIcon /></AlertDialogCancel> */}
            <SheetClose asChild>
              <Button><CheckIcon /></Button>
              {/* <Button variant={'secondary'}><XIcon /></Button> */}
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    )
  }

  useEffect(() => { !token && setToken(Cookies.get('token') || '') }, [])
  useEffect(() => { token && params.id != 'addnew' && load() }, [token])

  return (<StandartForm
    title={params.id == 'addnew' ? t('New Order') : t('Edit Order')}
    onSaveClick={save}
    onCancelClick={() => router.back()}
    loading={loading}

  >
    <div className="relative w-full h-full">
      {FormHeader()}
      {FormDetail()}
      {FormFooter()}
      {/* {showOrderLineDialog && <OrderLineDialog />} */}
      {/* <pre>{JSON.stringify(orderDetails, null, 2)}</pre> */}
    </div>

  </StandartForm>)
}

