"use client"

import { useEffect, useState } from 'react'
import { deleteItem, getItem, getList, postItem, putItem } from '@/lib/fetch'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'
import { OrderLine } from '@/types/Order'
import { useToast } from '@/components/ui/use-toast'
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useLanguage } from '@/i18n'
import { moneyFormat } from '@/lib/utils'
import { OrderLinePopup } from './order-line-popup'
import { CheckIcon, EditIcon, ListTreeIcon, PlusSquareIcon, Trash2Icon } from 'lucide-react'
import { ButtonConfirm } from '@/components/button-confirm'

interface Props {
  orderId?: string
  onAddNewOrder?: () => void
}
export function GridOrderLine({ orderId, onAddNewOrder }: Props) {
  const [lines, setLines] = useState<OrderLine[]>([])
  const [token, setToken] = useState('')
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { t } = useLanguage()
  const [openNewLine, setOpenNewLine] = useState(false)
  const load = () => {
    console.log('orderId', orderId)
    if (!orderId) return
    setLoading(true)
    getList(`/db/orderLines?order=${orderId}`, token)
      .then(result => setLines(result.docs as OrderLine[]))
      .catch(err => toast({ title: 'Error', description: err || '', variant: 'destructive' }))
      .finally(() => setLoading(false))
  }
  const saveLine = (line: OrderLine) => {
    line.order = orderId
    setLoading(true)
    if (!line._id) {
      postItem(`/db/orderLines`, token, line)
        .then(result => {
          lines.push(result as OrderLine)
          setLines(lines)
        })
        .catch(err => toast({ title: t('Error'), description: t(err || ''), variant: 'destructive' }))
        .finally(() => setLoading(false))
    } else {
      putItem(`/db/orderLines/${line._id}`, token, line)
        .then(result => {
          let foundIndex = lines.findIndex(e => e._id == line._id)
          if (foundIndex > -1) {
            lines[foundIndex] = (result as OrderLine)
            setLines(lines)
          } else {
            lines.push(result as OrderLine)
            setLines(lines)
          }
        })
        .catch(err => toast({ title: t('Error'), description: t(err || ''), variant: 'destructive' }))
        .finally(() => setLoading(false))
    }

  }
  const deleteLine = (line: OrderLine) => {
    setLoading(true)
    deleteItem(`/db/orderLines/${line._id}`, token)
      .then(result => {
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

  return (<div className='relative px-0 pt-1 pb-10 rounded border border-dashed my-4'>
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
                <div className='min-w-8 text-center py-1 rounded border border-dashed'>{index + 1}</div>
                <div className='flex flex-col'>
                  <span className=''>{e.item?.name}</span>
                  <span className='text-[8pt] text-muted-foreground'>loremm df{e.description}</span>
                </div>
              </div>
            </TableCell>
            <TableCell colSpan={2} className=''>
              <div className='flex flex-col items-end'>
                <span className=''>{e.quantity}</span>
                <span className='text-muted-foreground'>{e.delivered} K:{e.remainder}</span>
              </div>
            </TableCell>
            <TableCell colSpan={2} className=''>
              <div className='flex flex-col items-end'>
                <span className=''>{moneyFormat(e.price, 5)} {e.currency}</span>
              </div>
            </TableCell>
            <TableCell colSpan={2} className=''>
              <div className='flex flex-col items-end'>
                <span className=''>{moneyFormat(e.total)} {e.currency}</span>
              </div>
            </TableCell>
            <TableCell colSpan={1} className='text-center'>
              {e.closed && <>✅</>}
            </TableCell>
            <TableCell className='w-22'>
              <div className='w-full flex justify-center gap-2'>
                <OrderLinePopup
                  title={t('Edit Line')}
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
                      <div className='min-w-8 text-center py-1 rounded border border-dashed'>{index + 1}</div>
                      {e.item?.name || e.description || e._id}
                    </div>
                    <div className='grid grid-cols-3'>
                      <div>{t('Quantity')}</div>
                      <div>{t('Price')}</div>
                      <div>{t('Total')}</div>
                    </div>
                    <div className='grid grid-cols-3'>
                      <div>{e.quantity}</div>
                      <div>{moneyFormat(e.price, 4)} {e.currency}</div>
                      <div>{moneyFormat(e.total)} {e.currency}</div>
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
      {!loading && orderId &&
        <OrderLinePopup
          title={t('New Line')}
          trigger={<div className={`py-1 rounded-lg bg-green-600 text-white hover:bg-green-800 hover:text-white px-2 flex gap-1 `}>
            <ListTreeIcon size={'20px'} /><PlusSquareIcon size={'20px'} />
          </div>}
          onChange={e => saveLine(e)}
        />
      }

      {!loading && !orderId && onAddNewOrder &&
        <div
          className={`cursor-pointer py-1 rounded-lg bg-blue-600 text-white hover:bg-blue-800 hover:text-white px-2 flex gap-1 items-center`}
          onClick={() => onAddNewOrder()}
        >
          <ListTreeIcon size={'20px'} /><CheckIcon size={'20px'} />{t('Add Line')}
        </div>
      }

    </div>
  </div>)
}
