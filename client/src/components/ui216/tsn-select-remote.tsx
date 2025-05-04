import { Label } from '@/components/ui/label'
import { TsnListType, TsnSelect, TsnSelectProps } from './tsn-select'
import { useEffect, useState } from 'react'
import { useToast } from '../ui/use-toast'
import { getList } from '@/lib/fetch'
import Cookies from 'js-cookie'
import { Skeleton } from '../ui/skeleton'

interface TsnSelectRemoteProps extends TsnSelectProps {
  apiPath?: string
  textField?: string
  // onValueChanged?:(e:)
}

export function TsnSelectRemote({ apiPath, textField = 'name', ...props }: TsnSelectRemoteProps) {
  const [token, setToken] = useState('')
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [list, setList] = useState<TsnListType[]>([])
  const load = () => {
    setLoading(true)
    getList(`${apiPath}${(apiPath || '').indexOf('?') > -1 ? '&' : '?'}pageSize=2000`, token)
      .then(result => {
        setList((result.docs || result || []).map((e: any) => { return ({ _id: e._id, text: e[textField] }) }))
      })
      .catch(err => toast({ title: 'Error', description: err || '', variant: 'destructive' }))
      .finally(() => setLoading(false))
  }
  useEffect(() => { !token && setToken(Cookies.get('token') || '') }, [])
  useEffect(() => { token && load() }, [token])

  return (<>
    {!loading && <TsnSelect list={list}  {...props} />}
    {loading && <Skeleton className='h-10 w-full mt-4' />}
  </>)
}