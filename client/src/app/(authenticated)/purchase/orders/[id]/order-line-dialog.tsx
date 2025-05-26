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
import { useEffect, useState } from "react"
import { TsnSelectRemote } from "@/components/ui216/tsn-select-remote"
import { postItem } from "@/lib/fetch"
import { useToast } from "@/components/ui/use-toast"
import { Item } from "@/types/Item"
import Cookies from "js-cookie"
import { ItemSelect } from "./item-select"
import { ButtonOK, ButtonSelect } from "@/components/icon-buttons"
import { moneyFormat } from "@/lib/utils"

interface Props {
  t: (text: string) => string,
  orderDetails: OrderDetail[],
  setOrderDetails: (e: OrderDetail[]) => void,
  rowIndex: number
}
export function OrderLineDialog({ t, orderDetails, setOrderDetails, rowIndex }: Props) {
  // const line = rowIndex >= 0 ? orderDetails[rowIndex] : {}
  //const [line, setLine] = useState<OrderDetail>(rowIndex >= 0 ? orderDetails[rowIndex] : {})
  const [amount,setAmount]=useState(rowIndex >= 0 ? orderDetails[rowIndex]?.amount || 0:0)
  const [vatAmount,setVatAmount]=useState(rowIndex >= 0 ? orderDetails[rowIndex].vatAmount || 0:0)
  const [vatRate,setVatRate]=useState(rowIndex >= 0 ? orderDetails[rowIndex].vatRate || 0:0)
  const [itemCode,setItemCode]=useState(rowIndex >= 0 ? orderDetails[rowIndex].itemCode || '':'')
  const [itemName,setItemName]=useState(rowIndex >= 0 ? orderDetails[rowIndex].itemName || '':'')
  const [unit,setUnit]=useState(rowIndex >= 0 ? orderDetails[rowIndex].unit || '':'')
  const calcAmount=(q:number,p:number)=>{
    const amount=Math.round(100*(q*p))/100
    const vatAmount=Math.round(100*(amount*vatRate/100))/100
    setAmount(amount)
    setVatAmount(vatAmount)
    //setLine({...line,amount:amount,vatAmount:vatAmount})
  }
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
          {/* <SheetDescription>Açıklama alanı</SheetDescription> */}
        </SheetHeader>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col mx-2">
            <div className="flex justify-between items-center">
              <div>{itemCode}</div>
              <ItemSelect t={t} onSelect={item => {
                setItemCode(item?.itemCode || '')
                setItemName(item?.itemName || '')
                setUnit(item?.unit || '')
                setVatRate(item?.vatRate || 0)
                // setLine({...line,itemCode:item.itemCode,itemName:item.itemName})
                // setOrderDetails(orderDetails.map((e, index) => {
                //   if (rowIndex == index) {
                //     e.itemCode = item.itemCode
                //     e.itemName = item.itemName
                //   }
                //   return e
                // }))
              }}><ButtonSelect /></ItemSelect>
            </div>
            <div className="capitalize">{itemName?.toLowerCase()} </div>
          </div>

          <TsnInput type={'number'} title={t('Quantity')} defaultValue={line?.quantity} onBlur={e => {
            const q = !isNaN(Number(e.target.value)) ? Number(e.target.value) : 0
            // setOrderDetails(orderDetails.map((e, index) => {
            //   if (rowIndex == index) {
            //     e.quantity = q
            //   }
            //   return e
            // }))
            setLine({ ...line, quantity: q})
            calcAmount(q, line.price || 0)
          }} />
          <TsnInput type={'number'} title={t('Price')} defaultValue={line?.price} onBlur={e => {
            const p = !isNaN(Number(e.target.value)) ? Number(e.target.value) : 0
            // setOrderDetails(orderDetails.map((e, index) => {
            //   if (rowIndex == index) {
            //     e.price = p
            //   }
            //   return e
            // }))

            setLine({ ...line, price: p })
            calcAmount(line.quantity || 0, p)
          }} />

          <div>Tutar: {moneyFormat(amount)}</div>
          <div>Kdv%{line?.vatRate}</div>
          <div>Kdv Tutar: {moneyFormat(vatAmount)}</div>
        </div>
        <SheetFooter>
          {/* <AlertDialogAction className='bg-blue-600 text-white hover:bg-blue-800 hover:text-white' onClick={() => onOk && onOk()}><CheckIcon /></AlertDialogAction>
          <AlertDialogCancel className='bg-gray-600 text-white hover:bg-gray-800 hover:text-white' onClick={() => onCancel && onCancel()}><XIcon /></AlertDialogCancel> */}
          <SheetClose asChild className="cursor-pointer " onClick={e=>e.preventDefault()}>
            <Button size={'sm'}><CheckIcon /></Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

