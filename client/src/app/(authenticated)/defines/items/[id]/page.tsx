"use client"

import { TsnInput } from '@/components/ui216/tsn-input'
import { DataForm } from '@/components/ui216/data-form'
import { useLanguage } from '@/i18n'

import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/use-toast'
import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import { Item, ItemMainGroup } from '@/types/Item'
import { getItem, postItem, putItem } from '@/lib/fetch'
import { StandartForm } from '@/components/ui216/standart-form'
import { TsnTextarea } from '@/components/ui216/tsn-textarea'
import { TsnSelectRemote } from '@/components/ui216/tsn-select-remote'
import { TsnSelect } from '@/components/ui216/tsn-select'
import { TsnSwitch } from '@/components/ui216/tsn-switch'
import { TsnPanel } from '@/components/ui216/tsn-panel'
interface Props {
  params: { id: string }
}
export default function EditPage({ params }: Props) {
  const [token, setToken] = useState('')
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { t } = useLanguage()
  const [item, setItem] = useState<Item>()
  const [itemMainGroup, setItemMainGroup] = useState<string>()
  const [groupLoading, setGroupLoading] = useState(false)
  const [category, setCategory] = useState<string>()
  const [categoryLoading, setCategoryLoading] = useState(false)

  const load = () => {
    setLoading(true)
    getItem(`/db/items/${params.id}`, token)
      .then(result => {
        console.log(`result:`, result)
        console.log(`result as item:`, result as Item)
        setItem(result as Item)
        setGroupLoading(true)
        setCategoryLoading(true)
        setItemMainGroup((result as Item).itemGroup?.itemMainGroup?._id)
        setCategory((result as Item).category?._id)
        setTimeout(() => {
          setGroupLoading(false)
          setCategoryLoading(false)
        }, 300)
      })
      .catch(err => toast({ title: t('Error'), description: t(err || ''), variant: 'destructive' }))
      .finally(() => setLoading(false))
  }
  const save = () => {
    setLoading(true)
    if (params.id == 'addnew') {
      postItem(`/db/items`, token, item)
        .then(result => router.back())
        .catch(err => toast({ title: t('Error'), description: t(err || ''), variant: 'destructive' }))
        .finally(() => setLoading(false))
    } else {
      putItem(`/db/items/${params.id}`, token, item)
        .then(result => router.back())
        .catch(err => toast({ title: t('Error'), description: t(err || ''), variant: 'destructive' }))
        .finally(() => setLoading(false))
    }

  }
  useEffect(() => { !token && setToken(Cookies.get('token') || '') }, [])
  useEffect(() => { token && params.id != 'addnew' && load() }, [token])


  return (<StandartForm
    title={t('Items')}
    onSaveClick={save}
    onCancelClick={() => router.back()}
  >
    {!loading && <>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <TsnSelectRemote
          apiPath='/db/itemMainGroups'
          title={t('Main Group')}
          defaultValue={itemMainGroup}
          onValueChange={e => {
            setGroupLoading(true)
            setItemMainGroup(e)
            setTimeout(() => setGroupLoading(false), 100)
          }}
        />
        {!groupLoading && itemMainGroup && <TsnSelectRemote
          apiPath={`/db/itemGroups?itemMainGroup=${itemMainGroup}`}
          title={t('Sub Group')}
          defaultValue={item && item.itemGroup?._id}
          onValueChange={e => setItem({ ...item, itemGroup: { _id: e } })}
        />}
      </div>

      <TsnInput title={t('Name')} defaultValue={item?.name} onBlur={e => setItem({ ...item, name: e.target.value })} />
      <div className='flex flex-col gap-4'>
        <TsnPanel name='other' trigger={t('Other')}>
          <TsnTextarea title={t('Description')} defaultValue={item?.description} onChange={e => setItem({ ...item, description: e.target.value })} />

          <div className='grid grid-cols-1 md:grid-cols-2 md:gap-4'>
            <TsnSelectRemote
              apiPath='/db/taxTypes'
              title={t('Tax Type')}
              defaultValue={item && item?.taxType?._id}
              onValueChange={e => setItem({ ...item, taxType: { _id: e } })}
            />
            {item && item?.taxType?._id &&
              <TsnSelectRemote
                apiPath='/db/taxTypes'
                title={t('Export Tax Type')}
                defaultValue={item && (item?.exportTaxType?._id || item?.taxType?._id)}
                onValueChange={e => setItem({ ...item, exportTaxType: { _id: e } })}
              />
            }
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <TsnSelectRemote
              apiPath='/db/categories'
              title={t('Category')}
              defaultValue={category}
              onValueChange={e => {
                setCategoryLoading(true)
                setCategory(e)
                setTimeout(() => setCategoryLoading(false), 100)
                setItem({ ...item, category: { _id: e } })
              }}
            />
            {!categoryLoading && category &&
              <div className='flex items-center gap-4'>
                <TsnSelectRemote
                  apiPath={`/db/brands?category=${category}`}
                  title={t('Brand')}
                  defaultValue={item && item.brand?._id}
                  onValueChange={e => setItem({ ...item, brand: { _id: e } })}
                />
                <TsnSelectRemote
                  apiPath={`/db/models?category=${category}`}
                  title={t('Model')}
                  defaultValue={item && item.model?._id}
                  onValueChange={e => setItem({ ...item, model: { _id: e } })}
                />
              </div>
            }
          </div>
          <TsnSwitch title={t('Passive?')} defaultChecked={item?.passive} onCheckedChange={e => setItem({ ...item, passive: e })} />
        </TsnPanel>
        <TsnPanel name='barcode' trigger='Barcodes'>

        </TsnPanel>
      </div>
    </>}
  </StandartForm>)
}

