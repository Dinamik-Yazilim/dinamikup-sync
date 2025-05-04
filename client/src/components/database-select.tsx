"use client"
import * as React from "react"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import { useLanguage } from '@/i18n'
import { Button } from './ui/button'
import { DatabaseIcon, DatabaseZapIcon, ListIcon, RefreshCcwDotIcon, Settings2Icon } from 'lucide-react'
import { getItem, postItem } from '@/lib/fetch'
import { Database } from '@/types/Database'
import { useToast } from './ui/use-toast'
import { Skeleton } from './ui/skeleton'
import { useRouter } from 'next/navigation'


export function DatabaseSelect() {
  const [db, setDb] = useState('')
  const [dbList, setDbList] = useState<Database[]>([])
  const [token, setToken] = useState('')
  const [loading, setLoading] = useState(false)
  const { t } = useLanguage()
  const { toast } = useToast()
  const router = useRouter()

  const setVariables = (l: Database[]) => {
    const d = Cookies.get('db') || ''
    const foundIndex = l.findIndex((e: Database) => e._id == d)
    if (foundIndex > -1) {
      setDb(d)
      Cookies.set('databaseName', l[foundIndex].name || '')
    } else if (l.length > 0) {
      setDb(l[l.length - 1]._id || '')
      Cookies.set('databaseName', l[l.length - 1].name || '')
    } else {
      setDb('')
      Cookies.remove('db')
      Cookies.remove('databaseName')
    }
  }

  const changeDb = (dbId: string) => {
    setLoading(true)
    postItem(`/session/change/db/${dbId}`, token)
      .then(result => {
        toast({ title: t('Database changed'), description: `database:${result.db.name}`, variant: 'default', duration: 1500 })
        setTimeout(() => location.reload(), 400)
      })
      .catch(err => toast({ title: err, variant: 'destructive', duration: 1500 }))
      .finally(() => setLoading(false))
  }

  const load = () => {
    setLoading(true)
    getItem(`/databases`, token)
      .then(result => {
        setDbList(result.docs as Database[])
        // Cookies.set('dbList', JSON.stringify(l))
        setVariables(result.docs as Database[])
      })
      .catch(err => toast({ title: err, variant: 'destructive', duration: 1500 }))
      .finally(() => setLoading(false))
  }
  useEffect(() => { !token && setToken(Cookies.get('token') || '') }, [])
  useEffect(() => { token && load() }, [token])

  return (
    <>

      {!loading &&
        <div className='flex gap-4'>
          <Select
            defaultValue={db}
            onValueChange={e => {
              Cookies.set('db', e)
              setVariables(dbList)
              changeDb(e)

            }}
          // onOpenChange={e => {
          //   !e && load()
          // }}
          >
            <SelectTrigger className={`w-[180px] px-1 border-0`}>
              <SelectValue placeholder={'[' + t('Select Database') + ']'} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {dbList.map((e, index) =>
                  <SelectItem key={'database' + index} value={e._id || ''}>
                    <div className={`flex gap-2 items-center uppercase ${db == e._id ? 'text-[#1e40af] dark:text-[#eab308] font-bold' : ''}`}>
                      {db == e._id && <DatabaseZapIcon />}
                      {db != e._id && <DatabaseIcon />}
                      {e.name}
                    </div>

                  </SelectItem>)
                }
              </SelectGroup>
              <SelectGroup>
                <SelectLabel onClick={() => router.push('/databases')} className='cursor-pointer flex items-center gap-2'>
                  <ListIcon size={'16px'} />  {t('Database List')}
                </SelectLabel>
                <SelectSeparator />
                <SelectLabel onClick={() => router.push('/settings')} className='cursor-pointer flex items-center gap-2'>
                  <Settings2Icon size={'16px'} />  {t('Settings')}
                </SelectLabel>
              </SelectGroup>
            </SelectContent>
          </Select>

        </div>
      }
      {loading && <Skeleton className='w-[140px]' />}
    </>
  )
}