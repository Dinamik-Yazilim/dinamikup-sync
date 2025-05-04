"use client"

import { useEffect, useState } from 'react'
import { deleteItem, getItem, getList, postItem, putItem } from '@/lib/fetch'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'
import { getUnitName, Invoice, InvoiceLine } from '@/types/Invoice'
import { useToast } from '@/components/ui/use-toast'
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useLanguage } from '@/i18n'
import { moneyFormat } from '@/lib/utils'
import { InvoiceLinePopup } from './invoice-line-popup'
import { CheckIcon, EditIcon, ListTreeIcon, PlusSquareIcon, Trash2Icon } from 'lucide-react'
import { ButtonConfirm } from '@/components/button-confirm'

interface Props {
  invoiceId?: string
  onAddNewInvoice?: () => void
  onChange?: (e?: string) => void
}
export function GridInvoiceLine({ invoiceId, onAddNewInvoice, onChange }: Props) {
  const [lines, setLines] = useState<InvoiceLine[]>([])
  const [token, setToken] = useState('')
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { t } = useLanguage()
  const [openNewLine, setOpenNewLine] = useState(false)
  const [whtList, setWhtList] = useState([])

  const load = () => {
    if (!invoiceId) return
    setLoading(true)
    getList(`/db/invoiceLines?invoice=${invoiceId}`, token)
      .then(result => {
        setLines(result.docs as InvoiceLine[])
        getList(`/db/constants/withholdingTaxTypeCodes`, token)
          .then((w: any) => {
            setWhtList(w)
          })
          .catch(err => toast({ title: t('Error'), description: t(err || ''), variant: 'destructive' }))
      })
      .catch(err => toast({ title: 'Error', description: err || '', variant: 'destructive' }))
      .finally(() => setLoading(false))
  }
  const saveLine = (line: InvoiceLine) => {
    line.invoice = invoiceId
    setLoading(true)
    if (!line._id) {
      postItem(`/db/invoiceLines`, token, line)
        .then(result => {
          onChange && onChange(invoiceId)
          lines.push(result as InvoiceLine)
          setLines(lines)

        })
        .catch(err => toast({ title: t('Error'), description: t(err || ''), variant: 'destructive' }))
        .finally(() => setLoading(false))
    } else {
      putItem(`/db/invoiceLines/${line._id}`, token, line)
        .then(result => {
          onChange && onChange(invoiceId)
          let foundIndex = lines.findIndex(e => e._id == line._id)
          if (foundIndex > -1) {
            lines[foundIndex] = (result as InvoiceLine)
            setLines(lines)
          } else {
            lines.push(result as InvoiceLine)
            setLines(lines)
          }
        })
        .catch(err => toast({ title: t('Error'), description: t(err || ''), variant: 'destructive' }))
        .finally(() => setLoading(false))
    }

  }
  const deleteLine = (line: InvoiceLine) => {
    setLoading(true)
    deleteItem(`/db/invoiceLines/${line._id}`, token)
      .then(result => {
        onChange && onChange(invoiceId)
        const foundIndex = lines.findIndex(e => e._id == line._id)
        if (foundIndex > -1) {
          lines.splice(foundIndex, 1)
          setLines(lines)
        }
      })
      .catch(err => toast({ title: t('Error'), description: t(err || ''), variant: 'destructive' }))
      .finally(() => setLoading(false))

  }
  useEffect(() => { !token && setToken(Cookies.get('token') || '') }, [])
  useEffect(() => { token && load() }, [token])

  return (<div className='relative px-0 pt-1 pb-10 rounded binvoice binvoice-dashed my-4'>
    <Table className='text-[50%] md:text-sm lg1:te11xt-[110%]'>
      <TableHeader>
        <TableRow>
          <TableHead colSpan={4} className=''>{t('Item')}</TableHead>
          <TableHead colSpan={2} className='text-end'>{t('Quantity')}</TableHead>
          <TableHead colSpan={2} className='text-end'>{t('Price')}</TableHead>
          <TableHead colSpan={2} className='text-end'>{t('Total')}</TableHead>
          <TableHead colSpan={1} className='text-center'>{t('Closed')}</TableHead>
          <TableHead className='w-20 text-center'>#</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {lines.map((e, index) => (
          <TableRow key={(e._id || 'grid' + index)} className='items-center'>
            <TableCell colSpan={4} className='px-1'>
              <div className='flex flex-row gap-2 items-center'>
                <div className='min-w-8 text-center py-1 rounded binvoice binvoice-dashed'>{index + 1}</div>
                <div className='flex flex-col'>
                  <span className=''>{e.item?.name}</span>
                  <span className='text-[8pt] text-muted-foreground'>{e.item?.description}</span>
                </div>
              </div>
            </TableCell>
            <TableCell colSpan={2} className=''>
              <div className='flex gap-2 items-end text-sm'>
                <span className="font-bold" >{e.invoicedQuantity}</span>
                <span >{getUnitName(e.unitCode || '')}</span>
              </div>
            </TableCell>
            <TableCell colSpan={2} className=''>
              <div className='flex flex-col items-end'>
                <span className=''>{moneyFormat(e.price, 5)} {e.currency}</span>
              </div>
            </TableCell>
            <TableCell colSpan={2} className=''>
              <div className='flex flex-col items-end'>
                <span className=''>{moneyFormat(e.lineExtensionAmount)} {e.currency}</span>
              </div>
            </TableCell>
            <TableCell colSpan={1} className='text-center'>

            </TableCell>
            <TableCell className='w-22'>
              <div className='w-full flex justify-center gap-2'>
                <InvoiceLinePopup
                  title={t('Edit Line')}
                  whtList={whtList}
                  defaultValue={e}
                  trigger={
                    <div className={`cursor-pointer px-2 py-2 rounded-md bg-blue-800 text-white hover:bg-blue-500 hover:text-white`}>
                      <EditIcon size={'16px'} />
                    </div>
                  }
                  onChange={e => saveLine(e)}

                />
                <ButtonConfirm
                  onOk={() => deleteLine(e)}
                  text={t('Do you want to remove line?')}
                  description={<div className='flex flex-col gap-2'>
                    <div className='flex gap-2 items-center'>
                      <div className='min-w-8 text-center py-1 rounded binvoice binvoice-dashed'>{index + 1}</div>
                      {e.item?.name || e._id}
                    </div>
                    <div className='grid grid-cols-3'>
                      <div>{t('Quantity')}</div>
                      <div>{t('Price')}</div>
                      <div>{t('Total')}</div>
                    </div>
                    <div className='grid grid-cols-3'>
                      <div>{e.invoicedQuantity}</div>
                      <div>{moneyFormat(e.price, 4)} {e.currency}</div>
                      <div>{moneyFormat(e.lineExtensionAmount)} {e.currency}</div>
                    </div>
                  </div>}
                >
                  <div className='px-2 py-2 rounded-md bg-red-800 text-white hover:bg-red-500 hover:text-white'>
                    <Trash2Icon size={'16px'} />
                  </div>
                </ButtonConfirm>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>

    </Table>
    <div className='absolute end-1 bottom-1'>
      {!loading && invoiceId &&
        <InvoiceLinePopup
          title={t('New Line')}
          whtList={whtList}
          trigger={<div className={`py-1 rounded-lg bg-green-600 text-white hover:bg-green-800 hover:text-white px-2 flex gap-1 `}>
            <ListTreeIcon size={'20px'} /><PlusSquareIcon size={'20px'} />
          </div>}
          onChange={e => saveLine(e)}
        />
      }

      {!loading && !invoiceId && onAddNewInvoice &&
        <div
          className={`cursor-pointer py-1 rounded-lg bg-blue-600 text-white hover:bg-blue-800 hover:text-white px-2 flex gap-1 items-center`}
          onClick={() => onAddNewInvoice()}
        >
          <ListTreeIcon size={'20px'} /><CheckIcon size={'20px'} />{t('Add Line')}
        </div>
      }

    </div>
  </div>)
}
