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

interface Props {
  t: (text: string) => string,
  orderDetails: OrderDetail[],
  setOrderDetails: (e: OrderDetail[]) => void,
  rowIndex: number
}
export function OrderLineDialog({ t, orderDetails, setOrderDetails, rowIndex }: Props) {
  const line = rowIndex >= 0 ? orderDetails[rowIndex] : {}
  const [mainGroups, setMainGroups] = useState([])
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
          <div><ItemSelect t={t} >Item Sec</ItemSelect></div>
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

