"use client"

import { TsnInput } from '@/components/ui216/tsn-input'
import { useLanguage } from '@/i18n'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useToast } from '@/components/ui/use-toast'
import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import { getInvoiceTypeCodeList, getProfileIdList, getTaxTypeName, Invoice, invoiceTypeName, LegalMonetaryTotal, showWithholdingTax, TaxTotal } from '@/types/Invoice'
import { getItem, postItem, putItem } from '@/lib/fetch'
import { StandartForm } from '@/components/ui216/standart-form'
import { TsnListType, TsnSelect } from '@/components/ui216/tsn-select'
import { TsnSwitch } from '@/components/ui216/tsn-switch'
import { TsnPanel } from '@/components/ui216/tsn-panel'
import { TsnTextarea } from '@/components/ui216/tsn-textarea'
import { TsnInputAddress } from '@/components/ui216/tsn-input-address'
import { TsnSelectRemote } from '@/components/ui216/tsn-select-remote'
import { GridInvoiceLine } from './invoice-lines'
import { Label } from '@/components/ui/label'
import { moneyFormat } from '@/lib/utils'
import { NotepadTextDashedIcon } from 'lucide-react'
import { currencyList, Settings } from '@/types/Settings'
import { TsnAccountingParty } from '../tsn-accounting-party'
import { Firm } from '@/types/Firm'
import { Party } from '@/types/Party'
import { Button } from '@/components/ui/button'
interface Props {
  id: string
  ioType: number
}

interface NameValue {
  name: string
  value: number
}
export function InvoiceForm({ id, ioType }: Props) {
  const [token, setToken] = useState('')
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [firmLoading, setFirmLoading] = useState(false)
  const [totalLoading, setTotalLoading] = useState(false)
  const router = useRouter()
  const { t } = useLanguage()
  const settings = JSON.parse(Cookies.get('dbSettings') || '{}') as Settings
  const [invoiceId, setInvoiceId] = useState(id != 'addnew' ? id : '')
  const [invoice, setInvoice] = useState<Invoice>({})
  const [tevkifat, setTevkifat] = useState<NameValue[]>([])
  const [vergi, setVergi] = useState<NameValue[]>([])

  const load = () => {
    setLoading(true)
    getItem(`/db/invoices/${invoiceId}`, token)
      .then((result: Invoice) => {
        setInvoice(result)
        calcVergiler(result.taxTotal, result.withholdingTaxTotal, result.legalMonetaryTotal)
      })
      .catch(err => toast({ title: t('Error'), description: t(err || ''), variant: 'destructive' }))
      .finally(() => setLoading(false))
  }

  const save = () => {
    // o && setInvoice(o)
    setLoading(true)
    if (!invoice?._id) {
      postItem(`/db/invoices`, token, invoice)
        .then(result => router.back())
        .catch(err => toast({ title: t('Error'), description: t(err || ''), variant: 'destructive' }))
        .finally(() => setLoading(false))
    } else {
      putItem(`/db/invoices/${invoice._id}`, token, invoice)
        .then(result => router.back())
        .catch(err => toast({ title: t('Error'), description: t(err || ''), variant: 'destructive' }))
        .finally(() => setLoading(false))
    }

  }

  const calcVergiler = (taxTotal?: TaxTotal, withholdingTaxTotal?: TaxTotal[], legalMonetaryTotal?: LegalMonetaryTotal) => {
    if (taxTotal && taxTotal.taxSubtotal) {
      const v = taxTotal.taxSubtotal.map(e => {
        return {
          name: `${getTaxTypeName(e.taxCategory?.taxScheme?.taxTypeCode)} %${e.percent}:`,
          value: e.taxAmount
        } as NameValue
      })
      setVergi(v)
    }
    if (withholdingTaxTotal) {
      console.log(`withholdingTaxTotal:`, withholdingTaxTotal)
      const t = withholdingTaxTotal.map(e => {
        if (e.taxSubtotal && e.taxSubtotal.length > 0) {
          return {
            name: `${e.taxSubtotal[0].taxCategory?.taxScheme?.taxTypeCode} ${showWithholdingTax(e.taxSubtotal[0].percent)} - ${e.taxSubtotal[0].taxCategory?.taxScheme?.name}`,
            value: e.taxAmount
          } as NameValue
        } else {
          return {
            name: '',
            value: 0
          } as NameValue
        }
      })
      setTevkifat(t)
    }
  }

  useEffect(() => { !token && setToken(Cookies.get('token') || '') }, [])
  useEffect(() => {
    if (token) {
      if (invoiceId != '') {
        load()
      } else {
        setLoading(true)
        let party = {
          partyIdentification: [{ schemeID: 'VKN', ID: settings.taxNumber }],
          partyName: settings.partyName,
          postalAddress: settings.address,
          partyTaxScheme: { taxScheme: { name: settings.taxOffice } },
        }
        setInvoice({
          issueDate: new Date().toISOString().substring(0, 10),
          draft: true,
          ioType: ioType,
          currency: settings.currency,
          profileId: settings.invoice?.profileId,
          invoiceTypeCode: 'SATIS',
          accountingSupplierParty: ioType == 0 ? party : {},
          accountingCustomerParty: ioType == 1 ? party : {},
          firm: {}
        })
        setTimeout(() => setLoading(false), 100)
      }
    }
  }, [token])


  return (<StandartForm
    title={invoiceTypeName(invoice?.ioType || 0, t)}
    onSaveClick={() => save()}
    onCancelClick={() => router.back()}
  >
    {!loading && <div className='flex flex-col gap-2'>
      {/* <div className='grid grid-cols-1 lg:grid-cols-3 gap-4'>
        <TsnSelect title={t('Type')}
          defaultValue={invoice?.ioType?.toString()}
          list={InvoiceTypeList.map(e => ({ _id: e._id, text: t(e.text) }))}
          onValueChange={e => setInvoice({ ...invoice, ioType: Number(e) })}
        />
      </div> */}
      <div className='grid grid-cols-1 lg:grid-cols-4 gap-4'>
        <TsnSelect
          title={t('Profile')}
          list={getProfileIdList(t)}
          defaultValue={invoice.profileId}
          onValueChange={e => setInvoice({ ...invoice, profileId: e })}
        />
        <TsnSelect
          title={t('Type')}
          list={getInvoiceTypeCodeList(t)}
          defaultValue={invoice.invoiceTypeCode}
          onValueChange={e => setInvoice({ ...invoice, invoiceTypeCode: e })}
        />
        <TsnInput type='date' title={t('Date')} defaultValue={invoice?.issueDate}
          onBlur={e => setInvoice({ ...invoice, issueDate: e.target.value })
          } />
        <TsnInput title={t('Invoice Number')} defaultValue={invoice?.ID}
          onBlur={e => setInvoice({ ...invoice, ID: e.target.value })} />
        <div className='col-span-2 flex items-end w-full gap-4'>
          <TsnSelect
            title={t('Currency')}
            list={currencyList}
            defaultValue={invoice.currency}
            onValueChange={e => setInvoice({ ...invoice, currency: e })}
          />
          <TsnInput type='number' className='text-end' inputClassName='text-end' title={t('Exchange Rate')} defaultValue={invoice.exchangeRate?.calculationRate}
            onBlur={e => setInvoice({ ...invoice, exchangeRate: { ...invoice.exchangeRate, calculationRate: Number(e.target.value) } })}
          />
          <Button className='mb-1 text-xs px-2' variant={'outline'}
            onClick={() => {
              fetch('https://hasanadiguzel.com.tr/api/kurgetir')
                .then(response => response.json())
                .then((data: any) => {

                  let currencyName = ''
                  switch (invoice.currency) {
                    case 'USD':
                      currencyName = 'US DOLLAR'
                      break
                    case 'EUR':
                      currencyName = 'EURO'
                      break
                    case 'RUB':
                      currencyName = 'RUSSIAN ROUBLE'
                      break
                    case 'GBP':
                      currencyName = 'POUND STERLING'
                      break
                    case 'AZN':
                      currencyName = 'AZERBAIJANI NEW MANAT'
                      break
                    case 'AED':
                      currencyName = 'UNITED ARAB EMIRATES DIRHAM'
                      break
                    default:
                      currencyName = 'US DOLLAR'
                      break
                  }
                  const found = (data.TCMB_AnlikKurBilgileri || []).find((e: any) => e.CurrencyName == currencyName)
                  if (found) {
                    setInvoice({ ...invoice, exchangeRate: { ...invoice.exchangeRate, calculationRate: found.ForexSelling } })
                  }
                })
                .catch(err => toast({ title: t('Error'), description: t(err || ''), variant: 'destructive' }))
            }}
          >TCMB Döviz Satış</Button>
        </div>
      </div>


      <div className={`flex ${ioType == 0 ? 'flex-col lg:flex-row' : 'flex-col-reverse lg:flex-row-reverse'} lg:justify-between lg:items-start gap-4`}>
        <div className='w-full flex flex-col gap-2'>
          <div className='w-full h-[65px]'>
            &nbsp;
          </div>
          <TsnPanel className='bg-slate-400 bg-opacity-5' name='invoice_left_party' trigger={ioType == 0 ? t('Vendor') : t('Customer')}>
            <TsnAccountingParty party={ioType == 0 ? invoice.accountingSupplierParty : invoice.accountingCustomerParty}
              onChange={e => {
                if (ioType == 0) {
                  setInvoice({ ...invoice, accountingSupplierParty: e })
                } else {
                  setInvoice({ ...invoice, accountingCustomerParty: e })
                }
              }}
            />
          </TsnPanel>
        </div>
        <div className='w-full flex flex-col gap-2'>
          <TsnSelectRemote
            className=''
            apiPath={`/db/firms?type=${invoice.ioType == 0 ? 'c' : 'v'}`}
            title={invoice.ioType == 0 ? t('Customer') : t('Vendor')}
            defaultValue={invoice.firm?._id}
            onValueChange={e => {
              setFirmLoading(true)
              getItem(`/db/firms/${e}`, token)
                .then((result: Firm) => {
                  let party: Party = {
                    postalAddress: result.address,
                    partyName: result.billingInfo?.companyName,
                    partyTaxScheme: { taxScheme: { name: result.billingInfo?.taxOffice } },
                    partyIdentification: [{
                      schemeID: result.billingInfo?.individual && result.billingInfo?.taxNumber?.length == 11 ? 'TCKN' : 'VKN',
                      ID: result.billingInfo?.taxNumber
                    }]
                  }
                  if (ioType == 0) {
                    setInvoice({ ...invoice, firm: { ...invoice.firm, _id: e }, accountingCustomerParty: party })
                  } else {
                    setInvoice({ ...invoice, firm: { ...invoice.firm, _id: e }, accountingSupplierParty: party })
                  }
                })
                .catch(err => toast({ title: t('Error'), description: t(err || ''), variant: 'destructive' }))
                .finally(() => setFirmLoading(false))


            }}
          />
          {!firmLoading &&
            <TsnPanel name='invoice_right_party' trigger={ioType == 1 ? t('Vendor') : t('Customer')}>
              <TsnAccountingParty party={ioType == 1 ? invoice.accountingSupplierParty : invoice.accountingCustomerParty}
                onChange={e => {
                  if (ioType == 1) {
                    setInvoice({ ...invoice, accountingSupplierParty: e })
                  } else {
                    setInvoice({ ...invoice, accountingCustomerParty: e })
                  }
                }}
              />
            </TsnPanel>
          }
        </div>

      </div>


      <GridInvoiceLine invoiceId={invoice._id} onAddNewInvoice={() => {
        postItem(`/db/invoices`, token, invoice)
          .then((result: Invoice) => {
            setInvoice(result)
            setInvoiceId(result._id || '')
          })
          .catch(err => toast({ title: t('Error'), description: t(err || ''), variant: 'destructive' }))
          .finally(() => setLoading(false))

      }}
        onChange={e => {
          setTotalLoading(true)

          getItem(`/db/invoices/getHeader/${invoice._id}`, token)
            .then((result: Invoice) => {
              setInvoice({
                ...invoice,
                legalMonetaryTotal: result.legalMonetaryTotal,
                taxTotal: result.taxTotal,
                withholdingTaxTotal: result.withholdingTaxTotal,
                lineCountNumeric: result.lineCountNumeric
              })
              calcVergiler(result.taxTotal, result.withholdingTaxTotal, result.legalMonetaryTotal)
            })
            .catch(err => toast({ title: t('Error'), description: t(err || ''), variant: 'destructive' }))
            .finally(() => setTotalLoading(false))
        }}
      />
      <div className='flex flex-col-reverse md:flex-row md:items-end justify-between'>
        <div className='my-4 flex flex-col gap-4'>
          <TsnSwitch title={t('Draft?')} defaultChecked={invoice?.draft} onCheckedChange={e => setInvoice({ ...invoice, draft: e })} />
        </div>

        <div className='ms-2 min-w-[320px] '>
          {!totalLoading &&
            <div className='flex flex-col gap-2 font-mono'>
              <TotalElem title={t('Sub Total')} amount={moneyFormat(invoice.legalMonetaryTotal?.taxExclusiveAmount)} />
              <div className={`grid grid-cols-3  max-w-[350px]`}>
                <Label className={`text-xs md:text-lg`} >{t('VAT')}</Label>
                <div className={`text-xs md:text-sm text-muted-foreground`}>
                  {vergi.map(e => e.name + ' ' + moneyFormat(e.value) + ' ' + invoice.currency || 'TL').join(`, `)}
                </div>
                <div className='flex justify-end'>{moneyFormat(vergi.reduce((acc, e) => acc += e.value, 0))}</div>
              </div>
              <div className={`grid grid-cols-3 max-w-[350px]`}>
                <Label className={`text-xs md:text-lg`} >{t('WHT')}</Label>
                <div className={`text-xs md:text-sm text-muted-foreground text-wrap`}>
                  {tevkifat.map(e => e.name + ' ' + moneyFormat(e.value) + ' ' + invoice.currency || 'TL').join(`, `)}
                </div>
                <div className='flex justify-end'>{moneyFormat(tevkifat.reduce((acc, e) => acc += e.value, 0))}</div>
              </div>
              <TotalElem title={t('Discount')} amount={moneyFormat(invoice.legalMonetaryTotal?.allowanceTotalAmount)} />
              <TotalElem title={t('Charge')} amount={moneyFormat(invoice.legalMonetaryTotal?.chargeTotalAmount)} />
              <TotalElem
                className='font-bold text-blue-800 dark:text-blue-500'
                labelClassName='text-lg md:text-xl'
                title={t('Net Total')} amount={moneyFormat(invoice.legalMonetaryTotal?.taxInclusiveAmount)}
              />
            </div>
          }
        </div>
      </div>
      <TsnPanel name='invoice_note_passive' trigger={t('Notes')}>
        <TsnTextarea title={t('Note')} defaultValue={invoice?.note?.join('\n')} onBlur={e => setInvoice({ ...invoice, note: e.target.value.split('\n') })} />
      </TsnPanel>
    </div>}
  </StandartForm>)
}
interface TotalElemProps {
  title?: string
  amount?: string
  className?: string
  labelClassName?: string
}

function TotalElem({ title, amount, className, labelClassName }: TotalElemProps) {
  return (<div className={`grid grid-cols-2 ${className}`}>
    <Label className={`text-xs md:text-lg ${labelClassName}`} >{title}</Label>
    <Label className={`text-xs md:text-lg text-end ${labelClassName}`}>{amount}</Label>
  </div>)
}

