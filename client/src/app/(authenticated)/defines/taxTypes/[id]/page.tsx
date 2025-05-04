"use client"

import { TsnInput } from '@/components/ui216/tsn-input'
import { useLanguage } from '@/i18n'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/use-toast'
import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import { TaxType } from '@/types/Item'
import { getItem, postItem, putItem } from '@/lib/fetch'
import { StandartForm } from '@/components/ui216/standart-form'
import { TaxTotalGrid } from './taxTotal-taxSubTotal'
import { WithholdingTaxTotalGrid } from './withholdingtaxTotal-taxSubTotal'
interface Props {
  params: { id: string }
}
export default function EditPage({ params }: Props) {
  const [token, setToken] = useState('')
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { t } = useLanguage()
  const [taxType, setTaxType] = useState<TaxType>({
    taxTotal: {
      taxSubtotal: []
    },
    withholdingTaxTotal: []
  })

  const load = () => {
    setLoading(true)
    getItem(`/db/taxTypes/${params.id}`, token)
      .then(result => {
        console.log(`result:`, result)
        setTaxType(result as TaxType)
      })
      .catch(err => toast({ title: t('Error'), description: t(err || ''), variant: 'destructive' }))
      .finally(() => setLoading(false))
  }
  const save = () => {
    setLoading(true)
    console.log(`taxType:`, taxType)
    if (params.id == 'addnew') {
      postItem(`/db/taxTypes`, token, taxType)
        .then(result => router.back())
        .catch(err => toast({ title: t('Error'), description: t(err || ''), variant: 'destructive' }))
        .finally(() => setLoading(false))
    } else {
      putItem(`/db/taxTypes/${params.id}`, token, taxType)
        .then(result => router.back())
        .catch(err => toast({ title: t('Error'), description: t(err || ''), variant: 'destructive' }))
        .finally(() => setLoading(false))
    }
  }

  useEffect(() => { !token && setToken(Cookies.get('token') || '') }, [])
  useEffect(() => { token && params.id != 'addnew' && load() }, [token])


  return (<StandartForm
    title={t('Tax Type')}
    onSaveClick={save}
    onCancelClick={() => router.back()}
  >
    {!loading && <>
      <TsnInput title={t('Name')} defaultValue={taxType?.name} onBlur={e => setTaxType({ ...taxType, name: e.target.value })} />
      {/* <TsnInput title={t('Article')} defaultValue={taxType?.article} onBlur={e => setTaxType({ ...taxType, article: e.target.value })} /> */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <TaxTotalGrid taxType={taxType} setTaxType={setTaxType} t={t} />
        <WithholdingTaxTotalGrid taxType={taxType} setTaxType={e => {
          console.log(`e:`, e)
          setTaxType(e)
        }} t={t} />
      </div>
      {/* <pre>{JSON.stringify(taxType, null, 2)}</pre> */}
    </>}
  </StandartForm>)
}

