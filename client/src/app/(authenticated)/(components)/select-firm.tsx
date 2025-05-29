import { useEffect, useState } from "react"

import {
  AlertDialog,
  AlertDialogCancel,
  // AlertDialogAction,
  // AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import { Button } from "@/components/ui/button"
import { TsnSelectRemote } from "@/components/ui216/tsn-select-remote"
import { postItem } from "@/lib/fetch"
import { useToast } from "@/components/ui/use-toast"
import { Firm, firmListQuery } from "@/types/Firm"
import Cookies from "js-cookie"
import { Input } from "@/components/ui/input"
import { cn, moneyFormat } from "@/lib/utils"
import { TsnPanel } from "@/components/ui216/tsn-panel"
import React from "react"
import { TsnDialogSelectButton } from "@/components/ui216/tsn-dialog-selectbutton"

interface Props {
  t: (text: string) => string
  children?: React.ReactNode | any
  onSelect?: (e: Firm) => void
}
export function SelectFirm({ t, children, onSelect }: Props) {
  // const [filter, setFilter] = useState<any>({  })
  const [search, setSearch] = useState('')
  const [mainLoading, setMainLoading] = useState(false)
  const [token, setToken] = useState('')
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [list, setList] = useState<Firm[]>([])
  const load = (s?: string) => {
    let q = firmListQuery(50)
    q = q.replaceAll('{search}', s || '')
    // if (f) {
    //   Object.keys(f).forEach(key => {
    //     q = q.replaceAll(`{${key}}`, f[key])
    //   })
    // }
    setLoading(true)
    postItem(`/mikro/get`, token, { query: q })
      .then(result => {
        setList(result as Firm[])
      })
      .catch(err => toast({ title: 'Error', description: err || '', variant: 'destructive' }))
      .finally(() => setLoading(false))
  }
  useEffect(() => { !token && setToken(Cookies.get('token') || '') }, [])
  useEffect(() => { token && load('') }, [token])
  // useEffect(() => { token && load(search, filter) }, [filter])

  return (
    <AlertDialog >
      <AlertDialogTrigger>{children}</AlertDialogTrigger>
      <AlertDialogContent className=" px-3 py-1 lg:max-w-[900px]">
        <AlertDialogHeader className="p-0 m-0 ">
          <AlertDialogTitle className="p-0">
            <div className="flex justify-between">
            <span>{t('Select a firm')}</span>
            <AlertDialogCancel>X</AlertDialogCancel>
            </div>
          </AlertDialogTitle>
          
        </AlertDialogHeader>
        <div className="overflow-y-auto h-[600px]">
          <div className="relative w-full pe-4">
            <div className='absolute left-1.5 top-1.5 text-xl'>🔍</div>
            <Input
              type='search'
              className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
              placeholder={t('search...')}
              defaultValue={search}
              onChange={e => {
                setSearch(e.target.value)
                e.target.value == "" && load('')
              }}
              onKeyDown={e => e.code == 'Enter' && load(search)}
            />
          </div>
         
          <div className='grid grid-cols-5 w-full text-xs lg:text-sm border-b mb-2 ps-2 pe-5'>
            <div className='col-span-2 flex flex-row gap-1'>{t('Code')}</div>
            <div className='col-span-2 flex flex-row gap-1'>{t('Name')}</div>
            <div className='text-end'>{t('Price')}</div>
          </div>
          <div className="w-fu11ll overflow-y-auto h-[450px] ps-2 pe-2 lg:pe-4">
            {list && list.map((e: Firm, rowIndex) => <TsnDialogSelectButton key={'gridList-' + rowIndex}
              onClick={(event: any) => onSelect && onSelect(e)}
              className={`flex-none p-0 border-none grid grid-cols-5 space-y-2 gap-1 w-full hover:bg-amber-500 hover:bg-opacity-15 cursor-pointer ${rowIndex % 2 == 1 ? 'bg-slate-500 bg-opacity-15' : ''} `}>
              <div className='col-span-2 flex flex-col gap-[2px] items-start text-xs lg:text-base'>
                {e.firmCode}
              </div>
              <div className='col-span-2 flex flex-col gap-[2px] items-start text-xs lg:text-base capitalize'>
                {e.firmName?.toLowerCase()}
              </div>
              <div className="flex flex-col text-xs w-20 lg:text-sm lg:w-auto">
                {e.currency}
              </div>
            </TsnDialogSelectButton>)}
          </div>
        </div>

        {/* <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Continue</AlertDialogAction>
        </AlertDialogFooter> */}
      </AlertDialogContent>
    </AlertDialog>
  )
}