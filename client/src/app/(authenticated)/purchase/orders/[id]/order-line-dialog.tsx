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
import { CheckIcon, XIcon } from 'lucide-react'
import { OrderDetail } from "@/types/Order"
import { TsnInput } from "@/components/ui216/tsn-input"
import { useLanguage } from "@/i18n"
import { useState } from "react"

interface Props {
  className?: string
  title?: string
  description?: string
  trigger?: React.ReactNode | any
  onOk?: (e: OrderDetail) => void
  onCancel?: () => void
  orderLine?: OrderDetail
  rowIndex?: number
  t:(text:string)=>string
}

export function OrderLineDialog({
  className = "",
  title = "?",
  description = "",
  trigger,
  onOk = undefined,
  onCancel = undefined,
  orderLine = {},
  rowIndex,
  t
}: Props) {
  const line=orderLine
  const calcAmount = (quantity?: number, price?: number) => {
    line.amount = Math.round(100 * (quantity || 0) * (price || 0)) / 100
  }
  return (
    <Sheet>
      <SheetTrigger asChild>
        {trigger}
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>{description}</SheetDescription>
        </SheetHeader>
        <div className="flex flex-col">
          <div>itemCode:{line?.itemCode}</div>
          <div>itemName:{line?.itemName}</div>
          <TsnInput type={'number'} title={t('Quantity')} defaultValue={line?.quantity} onBlur={e => {
            // setLine({ ...line, quantity: !isNaN(Number(e.target.value)) ? Number(e.target.value) : 0 })
            // calcAmount(Number(e.target.value), line.price)
          }} />
          <TsnInput type={'number'} title={t('Price')} defaultValue={line?.price} onBlur={e => {
            // setLine({ ...line, price: !isNaN(Number(e.target.value)) ? Number(e.target.value) : 0 })
            // calcAmount(line.quantity, Number(e.target.value))
          }} />

          <div>{line?.amount}</div>
          <div>Kdv 2%{line?.vatRate}</div>
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