"use client"

import { TsnInput } from '@/components/ui216/tsn-input'
import { useLanguage } from '@/i18n'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { useToast } from '@/components/ui/use-toast'
import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import { Firm } from '@/types/Firm'
import { getItem, postItem, putItem } from '@/lib/fetch'
import { StandartForm } from '@/components/ui216/standart-form'
import { TsnListType, TsnSelect } from '@/components/ui216/tsn-select'
import { firmTypeList, firmTypeName } from '@/types/Firm'
import { TsnSwitch } from '@/components/ui216/tsn-switch'
import { TsnPanel } from '@/components/ui216/tsn-panel'
import { TsnInputAddress } from '@/components/ui216/tsn-input-address'
import { currencyList, Settings } from '@/types/Settings'
import { moneyFormat } from '@/lib/utils'

interface Props {
  id: string
  ftype?: string
}

export function FirmForm({ id, ftype }: Props) {
  const [token, setToken] = useState('')
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { t } = useLanguage()
  const [title, setTitle] = useState('')
  const settings = JSON.parse(Cookies.get('dbSettings') || '{}') as Settings
  const [firm, setFirm] = useState<Firm>({ type: ftype, currency: settings.currency || 'TRY' })

  const load = () => {
    setLoading(true)
    return new Promise<Firm>((resolve, reject) => {
      getItem(`/db/firms/${id}`, token)
        .then(result => {
          setFirm(result as Firm)
          resolve(result as Firm)
        })
        .catch(err => {
          toast({ title: t('Error'), description: t(err || ''), variant: 'destructive' })
          reject(err)
        })
        .finally(() => setLoading(false))
    })

  }
  const save = () => {
    setLoading(true)
    if (id == 'addnew') {
      postItem(`/db/firms`, token, firm)
        .then(result => router.back())
        .catch(err => toast({ title: t('Error'), description: t(err || ''), variant: 'destructive' }))
        .finally(() => setLoading(false))
    } else {
      putItem(`/db/firms/${id}`, token, firm)
        .then(result => router.back())
        .catch(err => toast({ title: t('Error'), description: t(err || ''), variant: 'destructive' }))
        .finally(() => setLoading(false))
    }

  }
  useEffect(() => { !token && setToken(Cookies.get('token') || '') }, [])
  useEffect(() => {
    if (token) {
      if (id == 'addnew') {
        setFirm({ type: ftype })
        setTitle(firmTypeName(ftype || '', t))
      } else {
        load()
          .then(result => {
            setTitle(firmTypeName(result.type || '', t))
          })
          .catch()

      }
    }


  }, [token])


  return (<StandartForm
    title={title}
    onSaveClick={save}
    onCancelClick={() => router.back()}
  >
    {!loading && <div>


      <div className='grid grid-cols-1 md:grid-cols-6 md:gap-2'>
        <TsnSelect title={t('Type')}
          defaultValue={ftype || firm.type}
          list={firmTypeList(ftype || firm?.type || '', t)}
          onValueChange={e => setFirm({ ...firm, type: e })}
        />

        <TsnInput className='md:col-span-4' title={t('Name')} defaultValue={firm?.name} onBlur={e => setFirm({ ...firm, name: e.target.value })} />
        <TsnInput title={t('Article')} defaultValue={firm?.article} onBlur={e => setFirm({ ...firm, article: e.target.value })} />
      </div>
      <div className='grid grid-cols-2 md:grid-cols-4 gap-2'>
        <TsnInput title={t('Balance')} defaultValue={moneyFormat(firm.balance || 0)} readOnly inputClassName='text-end' />
        <TsnSelect
          title={t('Currency')}
          list={currencyList}
          defaultValue={firm.currency}

          disabled={firm.balance != 0}
          onValueChange={e => setFirm({ ...firm, currency: e })}
        />
      </div>

      <div className='grid grid-cols-1 gap-4'>
        <TsnPanel
          name='firm_billing_info'
          trigger={t('Billing Info')}
        >
          <TsnSwitch title={t('Individual Firm')} defaultChecked={firm?.billingInfo?.individual} onCheckedChange={e => setFirm({ ...firm, billingInfo: { ...firm?.billingInfo, individual: e } })} />
          <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-2'>
            <TsnInput title={t('Company Name')} defaultValue={firm?.billingInfo?.companyName} onBlur={e => setFirm({ ...firm, billingInfo: { ...firm?.billingInfo, companyName: e.target.value } })} />
            <TsnInput title={t('Tax Office')} defaultValue={firm?.billingInfo?.taxOffice} onBlur={e => setFirm({ ...firm, billingInfo: { ...firm?.billingInfo, taxOffice: e.target.value } })} />
            <TsnInput title={t('Tax Number')} defaultValue={firm?.billingInfo?.taxNumber} onBlur={e => setFirm({ ...firm, billingInfo: { ...firm?.billingInfo, taxNumber: e.target.value } })} />
            {firm?.billingInfo?.individual && <>
              <TsnInput title={t('First Name')} defaultValue={firm?.billingInfo?.firstName} onBlur={e => setFirm({ ...firm, billingInfo: { ...firm?.billingInfo, firstName: e.target.value } })} />
              <TsnInput title={t('Last Name')} defaultValue={firm?.billingInfo?.lastName} onBlur={e => setFirm({ ...firm, billingInfo: { ...firm?.billingInfo, lastName: e.target.value } })} />
              <TsnInput title={t('ID Card Number')} defaultValue={firm?.billingInfo?.idCardNo} onBlur={e => setFirm({ ...firm, billingInfo: { ...firm?.billingInfo, idCardNo: e.target.value } })} />
            </>}
          </div>
        </TsnPanel>
        <TsnPanel
          name='firm_address'
          trigger={t('Address')}
        >
          <TsnInputAddress defaultValue={firm?.address} onChange={e => setFirm({ ...firm, address: e })} />
        </TsnPanel>
      </div>
      <TsnSwitch className='mt-4' title={t('Passive?')} defaultChecked={firm?.passive} onCheckedChange={e => setFirm({ ...firm, passive: e })} />
    </div>}
  </StandartForm>)
}

