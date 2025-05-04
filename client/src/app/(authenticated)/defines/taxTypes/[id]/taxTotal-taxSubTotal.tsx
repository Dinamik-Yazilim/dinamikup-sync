"use client"

import { useEffect, useState } from 'react'
import { useToast } from '@/components/ui/use-toast'
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
import { Button } from "@/components/ui/button"
import { ButtonCancel, ButtonOK } from '@/components/icon-buttons'
import { CheckIcon, PlusSquareIcon, Trash2Icon, XIcon } from 'lucide-react'
import { TsnSelectRemote } from '@/components/ui216/tsn-select-remote'
import { useLanguage } from '@/i18n'
import { TsnInput } from '@/components/ui216/tsn-input'
import { TsnSwitch } from '@/components/ui216/tsn-switch'
import { TaxSubtotal } from '@/types/Invoice'
import Cookies from 'js-cookie'
import { getList } from '@/lib/fetch'
import { TsnListType, TsnSelect } from '@/components/ui216/tsn-select'
import { Label } from '@/components/ui/label'
import { TaxType } from '@/types/Item'
import { ButtonConfirm } from '@/components/button-confirm'

interface Props {
  trigger?: any
  defaultValue?: TaxSubtotal
  onChange?: (e: TaxSubtotal) => void
  title?: any
  description?: any
}
export function TaxSubTotalPopup({ trigger, defaultValue, onChange, title, description }: Props) {
  const [taxSubTotal, setTaxSubTotal] = useState<TaxSubtotal>(defaultValue || {})
  const [token, setToken] = useState('')
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const { t } = useLanguage()
  const [list, setList] = useState<TsnListType[]>([])

  const load = () => {
    setLoading(true)
    getList(`/db/constants/taxTypeCodes`, token)
      .then(result => {
        const l = (result || []).map((e: any) => ({ _id: e._id, name: (e._id + ' - ' + e.name) })) as TsnListType[]
        setList(l)
      })
      .catch(err => toast({ title: 'Error', description: err || '', variant: 'destructive' }))
      .finally(() => setLoading(false))

  }

  useEffect(() => { !token && setToken(Cookies.get('token') || '') }, [])
  useEffect(() => { token && load() }, [token])

  return (<>
    <AlertDialog>
      <AlertDialogTrigger asChild className='cursor-pointer'>
        {trigger}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <div>
          <TsnInput
            title={t('Calculation Sequence')}
            type='number' min={0} max={100}
            defaultValue={taxSubTotal.calculationSequenceNumeric}
            onBlur={e => setTaxSubTotal({ ...taxSubTotal, calculationSequenceNumeric: Number(e.target.value) })}
          />
          <TsnSelect
            autoFocus={true}
            list={list}
            title={t('Tax Type Codes')}
            defaultValue={taxSubTotal.taxCategory?.taxScheme?.taxTypeCode || ''}
            onValueChange={(e, text) => {
              setTaxSubTotal({
                ...taxSubTotal,
                taxCategory: {
                  ...taxSubTotal.taxCategory,
                  taxScheme: { ...taxSubTotal.taxCategory?.taxScheme, name: text?.split(' - ')[1], taxTypeCode: e }
                }
              })
            }}
          />
          <TsnInput
            title={t('Percent')}
            type='number' min={0} max={100}

            defaultValue={taxSubTotal.percent}
            onBlur={e => setTaxSubTotal({ ...taxSubTotal, percent: Number(e.target.value) })}
          />

        </div>

        <AlertDialogFooter className='flex justify-end items-center gap-4'>
          <div className='flex justify-start'>

          </div>
          <div className='flex flex-row justify-end items-center'>
            <AlertDialogAction onClick={e => {

              onChange && onChange(taxSubTotal)
            }}><CheckIcon /></AlertDialogAction>
            <AlertDialogCancel className='mt-0'><XIcon /></AlertDialogCancel>
          </div>

        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </>)
}


interface TaxTotalGridProps {
  taxType: TaxType,
  setTaxType: (e: TaxType) => void,
  t: (s: string) => string
}
export function TaxTotalGrid({ taxType, setTaxType, t }: TaxTotalGridProps) {
  return (<div className='flex flex-col'>
    <div className='flex justify-between items-center py-2 border border-dashed rounded-lg p-2 '>
      <Label className='font-bold'>{t('Tax')}</Label>
      <TaxSubTotalPopup
        onChange={e => {
          let l = taxType?.taxTotal?.taxSubtotal || []
          l.push(e)
          setTaxType({ ...taxType, taxTotal: { ...taxType?.taxTotal, taxSubtotal: l } })

        }}
        title={t('Add New')}
        defaultValue={{ calculationSequenceNumeric: (taxType?.taxTotal?.taxSubtotal?.length || 0) + 1 }}
        trigger={<div className='cursor-pointer px-2' >
          <PlusSquareIcon size={'24px'} />
        </div>}
      >
      </TaxSubTotalPopup>
    </div>
    <div className='border border-dashed rounded-lg p-0 text-sm'>
      <div key={'taxTotal-a'} className={`grid grid-cols-6 gap-2 px-2 py-2 bg-orange-600 bg-opacity-20`}>
        <div>{t('Sequence')}</div>
        <div>{t('Percent')}</div>
        <div className='col-span-3'>{t('Tax Code')}</div>
        <div>#</div>
      </div>
      {taxType && taxType.taxTotal && taxType.taxTotal?.taxSubtotal?.map((e, index) =>
        <div key={'taxTotal-' + index} className={`grid grid-cols-6 gap-2 px-2 py-2 ${index % 2 == 0 ? 'bg-slate-300 bg-opacity-25' : ''} `}>
          <div>#{e.calculationSequenceNumeric}</div>
          <div>%{e.percent}</div>
          <div className='col-span-3 flex flex-col'>
            <span>{e.taxCategory?.taxScheme?.taxTypeCode}</span>
            <span className='text-[90%] text-muted-foreground'>{e.taxCategory?.taxScheme?.name}</span>
          </div>
          <div className='flex justify-end cursor-pointer' >
            <ButtonConfirm text={t('Do you want to remove tax detail?') + index}
              onOk={() => {
                let l = taxType.taxTotal?.taxSubtotal || []
                l.splice(index, 1)
                setTaxType({ ...taxType, taxTotal: { ...taxType?.taxTotal, taxSubtotal: l } })
              }}
            >
              <Trash2Icon color='red' size={'20px'} />
            </ButtonConfirm>
          </div>
        </div>
      )}
    </div>
  </div>)
}