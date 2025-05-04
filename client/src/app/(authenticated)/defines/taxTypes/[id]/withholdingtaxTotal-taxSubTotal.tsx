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
import { showWithholdingTax, TaxSubtotal } from '@/types/Invoice'
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

interface WhtTypeListType extends TsnListType {
  rate?: number
}
export function TaxSubTotalPopup({ trigger, defaultValue, onChange, title, description }: Props) {
  const [taxSubTotal, setTaxSubTotal] = useState<TaxSubtotal>(defaultValue || {

  })
  const [token, setToken] = useState('')
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const { t } = useLanguage()
  const [list, setList] = useState<WhtTypeListType[]>([])

  const load = () => {
    setLoading(true)
    getList(`/db/constants/withholdingTaxTypeCodes`, token)
      .then(result => {
        // const l = (result || []).map((e: any) => ({ _id: e._id, name: (e._id + ' - (' + showWithholdingTax(e.rate) + ') - ' + e.name), rate: e.rate })) as WhtTypeListType[]
        // setList(l)
        setList(result as WhtTypeListType[])
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
          <TsnInput title={t('Calculation Sequence')} type='number' min={0} max={100} defaultValue={taxSubTotal.calculationSequenceNumeric} onBlur={e => setTaxSubTotal({ ...taxSubTotal, calculationSequenceNumeric: Number(e.target.value) })} />
          <TsnSelect
            autoFocus={true}
            list={list.map((e: any) => ({ _id: e._id, name: (e._id + ' - (' + showWithholdingTax(e.rate) + ') - ' + e.name) })) as TsnListType[]}
            title={t('Withholding Tax Type Codes')}
            defaultValue={taxSubTotal.taxCategory?.taxScheme?.taxTypeCode || ''}
            onValueChange={e => {
              let found = list.find(k => k._id == e)
              if (found) {
                console.log(`found:`, found)
                setTaxSubTotal({
                  ...taxSubTotal,
                  percent: found.rate! * 100,
                  taxCategory: {
                    ...taxSubTotal.taxCategory,
                    taxScheme: {
                      ...taxSubTotal.taxCategory?.taxScheme,
                      name: found.name,
                      taxTypeCode: found._id
                    }
                  }
                })
              }
            }}
          />
          {/* <TsnInput title={t('Percent')} type='number' min={0} max={100} defaultValue={taxSubTotal.percent} onBlur={e => setTaxSubTotal({ ...taxSubTotal, percent: Number(e.target.value) })} /> */}
          {/* <TsnSelect
            list={withholdingTaxRateList}
            title={t('Withholding Vat Rate')}
            defaultValue={taxSubTotal.percent?.toString()}
            onValueChange={(e, text) => setTaxSubTotal({ ...taxSubTotal, percent: Number(e) })}
          /> */}

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


interface WithholdingTaxTotalGridProps {
  taxType: TaxType,
  setTaxType: (e: TaxType) => void,
  t: (s: string) => string
}
export function WithholdingTaxTotalGrid({ taxType, setTaxType, t }: WithholdingTaxTotalGridProps) {
  return (<div className='flex flex-col'>
    <div className='flex justify-between items-center py-2 border border-dashed rounded-lg p-2 '>
      <Label className='font-bold'>{t('Withholding Tax')}</Label>
      <TaxSubTotalPopup
        onChange={e => {
          let l = taxType?.withholdingTaxTotal || []
          l.push({
            taxSubtotal: [e]
          })
          setTaxType({ ...taxType, withholdingTaxTotal: l })

        }}
        title={t('Add New')}
        trigger={<div className='cursor-pointer px-2' >
          <PlusSquareIcon size={'24px'} />
        </div>}
      >
      </TaxSubTotalPopup>
    </div>
    <div className='border border-dashed rounded-lg p-0 text-sm'>
      <div key={'withholdingtaxTotal-a'} className={`grid grid-cols-6 gap-2 px-2 py-2 bg-orange-600 bg-opacity-20`}>
        <div>{t('Sequence')}</div>
        <div>{t('Rate')}</div>
        <div className='col-span-3'>{t('Tax Code')}</div>
        <div>#</div>
      </div>
      {taxType && taxType.withholdingTaxTotal && taxType.withholdingTaxTotal?.map((w, j) => <div key={j}>
        {w.taxSubtotal?.map((e, index) =>
          <div key={'withholdingTaxTotal-' + j + '-' + index} className={`grid grid-cols-6 gap-2 px-2 py-2 ${j % 2 == 0 ? 'bg-slate-300 bg-opacity-25' : ''} `}>
            <div>#{e.calculationSequenceNumeric}</div>
            <div>{showWithholdingTax(e.percent)}</div>
            <div className='col-span-3 flex flex-col'>
              <span>{e.taxCategory?.taxScheme?.taxTypeCode}</span>
              <span className='text-[90%] text-muted-foreground'>{e.taxCategory?.taxScheme?.name}</span>
            </div>
            <div className='flex justify-end cursor-pointer' >
              <ButtonConfirm text={t('Do you want to remove tax detail?')}
                description={e.calculationSequenceNumeric + ' ' + e.taxCategory?.taxScheme?.taxTypeCode + '\n' + e.taxCategory?.taxScheme?.name}
                onOk={() => {
                  let l = taxType.withholdingTaxTotal || []
                  l.splice(j, 1)
                  setTaxType({ ...taxType, withholdingTaxTotal: l })
                }}
              >
                <Trash2Icon color='red' size={'20px'} />
              </ButtonConfirm>
            </div>
          </div>
        )}
      </div>)}
    </div>
  </div>)
}