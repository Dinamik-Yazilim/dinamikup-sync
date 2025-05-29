"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { CheckIcon, EditIcon, XIcon } from 'lucide-react'
import { OrderDetail } from "@/types/Order"
import { TsnInput } from "@/components/ui216/tsn-input"
import { useLanguage } from "@/i18n"
import { ButtonHTMLAttributes, MouseEventHandler, useEffect, useState } from "react"
import { TsnSelectRemote } from "@/components/ui216/tsn-select-remote"
import { postItem } from "@/lib/fetch"
import { useToast } from "@/components/ui/use-toast"
import { Item } from "@/types/Item"
import Cookies from "js-cookie"
import { SelectItem } from "@/app/(authenticated)/(components)/select-item"
import { ButtonOK, ButtonSelect } from "@/components/icon-buttons"
import { moneyFormat } from "@/lib/utils"
import { toast } from "sonner"

interface Props {
  t: (text: string) => string
  orderDetails: OrderDetail[]
  setOrderDetails: (e: OrderDetail[]) => void
  rowIndex: number
  children?:React.ReactNode | any
  ioType?:number
}
export function OrderLineDialog({ t, orderDetails, setOrderDetails, rowIndex, children, ioType }: Props) {
  const { toast } = useToast()
  // const line = rowIndex >= 0 ? orderDetails[rowIndex] : {}
  //const [line, setLine] = useState<OrderDetail>(rowIndex >= 0 ? orderDetails[rowIndex] : {})
  const [quantity, setQuantity] = useState(rowIndex >= 0 ? orderDetails[rowIndex]?.quantity || 0 : 0)
  const [price, setPrice] = useState(rowIndex >= 0 ? orderDetails[rowIndex]?.price || 0 : 0)
  const [amount, setAmount] = useState(rowIndex >= 0 ? orderDetails[rowIndex]?.amount || 0 : 0)
  const [vatAmount, setVatAmount] = useState(rowIndex >= 0 ? orderDetails[rowIndex].vatAmount || 0 : 0)
  const [vatRate, setVatRate] = useState(rowIndex >= 0 ? orderDetails[rowIndex].vatRate || 0 : 0)
  const [itemCode, setItemCode] = useState(rowIndex >= 0 ? orderDetails[rowIndex].itemCode || '' : '')
  const [itemName, setItemName] = useState(rowIndex >= 0 ? orderDetails[rowIndex].itemName || '' : '')
  const [unit, setUnit] = useState(rowIndex >= 0 ? orderDetails[rowIndex].unit || '' : '')
  const calcAmount = (q: number, p: number) => {
    const amount = Math.round(100 * (q * p)) / 100
    const vatAmount = Math.round(100 * (amount * vatRate / 100)) / 100
    setAmount(amount)
    setVatAmount(vatAmount)
    //setLine({...line,amount:amount,vatAmount:vatAmount})
  }

  const save = (e: any) => {
    try {
      if (!itemCode) {
        e.preventDefaut()
        toast({ title: t('Error'), description: t('Item code required'), variant: 'destructive' })
        return
      }
      if (!itemName) {
        e.preventDefaut()
        toast({ title: t('Error'), description: t('Item name required'), variant: 'destructive' })
        
        return
      }
      if (quantity <= 0) {
        toast({ title: t('Error'), description: t('Quantity must be greater than zero'), variant: 'destructive' })
        e.preventDefaut()
        return
      }
      if (rowIndex < 0) {
        let l=orderDetails.map(e=>e)
        l.push({
          itemCode:itemCode,
          itemName:itemName,
          amount:amount,
          price:price,
          quantity:quantity,
          vatRate:vatRate,
          vatAmount:vatAmount,
        })
        setOrderDetails(l)
        setAmount(0)
        setPrice(0)
        setQuantity(0)
        setVatAmount(0)
        setVatRate(0)
        setItemCode('')
        setItemName('')
        setUnit('')
      } else {
        setOrderDetails(orderDetails.map((e, index) => {
          if (rowIndex == index) {
            e.itemCode = itemCode
            e.itemName = itemName
            e.amount = amount
            e.price = price
            e.quantity = quantity
            e.vatRate = vatRate
            e.vatAmount = vatAmount
          }
          return e
        }))

      }
    } catch (err) {
      toast({ title: t('Error'), description: (err || 'Error') as string, variant: 'destructive' })
    }
  }
  return (
    <Sheet>
      <SheetTrigger asChild>
        {children}

      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>
            {rowIndex >= 0 && <>Satir Duzelt</>}
            {rowIndex < 0 && <>Yeni Satir</>}
          </SheetTitle>
          {/* <SheetDescription>Açıklama alanı</SheetDescription> */}
        </SheetHeader>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col mx-2">
            <div className="flex justify-between items-center">
              <div>{itemCode}</div>
              <SelectItem t={t} onSelect={item => {
                setItemCode(item?.itemCode || '')
                setItemName(item?.itemName || '')
                setUnit(item?.unit || '')
                setVatRate(item?.vatRate || 0)
                if(ioType==0){
                  setPrice(item?.salesPrice || 0)
                }else{
                  setPrice(item?.purchaseConditionPrice || item?.lastPurchase || 0)
                }
                // setLine({...line,itemCode:item.itemCode,itemName:item.itemName})
                // setOrderDetails(orderDetails.map((e, index) => {
                //   if (rowIndex == index) {
                //     e.itemCode = item.itemCode
                //     e.itemName = item.itemName
                //   }
                //   return e
                // }))
              }}><ButtonSelect /></SelectItem>
            </div>
            <div className="capitalize">{itemName?.toLowerCase()} </div>
          </div>

          <TsnInput type={'number'} title={t('Quantity')} defaultValue={quantity} onBlur={e => {
            const q = !isNaN(Number(e.target.value)) ? Number(e.target.value) : 0
            setQuantity(q)
            calcAmount(q, price)
          }} />
          <TsnInput type={'number'} title={t('Price')} defaultValue={price} onBlur={e => {
            const p = !isNaN(Number(e.target.value)) ? Number(e.target.value) : 0
            setPrice(p)
            calcAmount(quantity, p)
          }} />

          <div>Tutar: {moneyFormat(amount)}</div>
          <div>Kdv%{vatRate}</div>
          <div>Kdv Tutar: {moneyFormat(vatAmount)}</div>
        </div>
        <SheetFooter>

          <SheetClose asChild className="cursor-pointer " onClick={save}>
            <Button size={'sm'}><CheckIcon /></Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

