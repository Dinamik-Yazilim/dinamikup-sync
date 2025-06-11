"use client"

import { useToast } from "@/components/ui/use-toast"
import { StandartForm } from "@/components/ui216/standart-form"
import { useLanguage } from "@/i18n"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Cookies from 'js-cookie'
import { postItem, putItem } from "@/lib/fetch"
import { TsnInput } from "@/components/ui216/tsn-input"
import { TsnPanel } from "@/components/ui216/tsn-panel"
import { moneyFormat, oneYearLater, today } from "@/lib/utils"
import { TsnGridButtonDelete } from "@/components/ui216/tsn-grid"
import { PurchaseConditionDetail, purchaseConditionHeaderQuery, purchaseConditionDetailQuery, savePurchaseCondition } from "@/types/PurchaseConditions"
import { ChefHatIcon, EditIcon, PlusSquareIcon } from "lucide-react"

import { TsnLineGrid } from "@/components/ui216/tsn-line-grid"
import { SelectFirm } from "@/app/(authenticated)/(components)/select-firm"
import { ButtonSelect } from "@/components/icon-buttons"
import { Label } from "@/components/ui/label"
import { SelectWarehouse } from "@/app/(authenticated)/(components)/select-warehouse"
import { SelectResponsibility } from "@/app/(authenticated)/(components)/select-responsibility"
import { SelectPaymentPlan } from "@/app/(authenticated)/(components)/select-paymentPlan"
import { SelectProject } from "@/app/(authenticated)/(components)/select-project"
import { SelectSalesperson } from "@/app/(authenticated)/(components)/select-salesperson"
import { PurchaseConditionHeader } from "@/types/PurchaseConditions"
import { SelectItem } from "@/app/(authenticated)/(components)/select-item"
import { TsnSelect } from "@/components/ui216/tsn-select"
import { Input } from "@/components/ui/input"

interface Props {
  params: { id: string }
}

export default function PurchaseConditionPage({ params }: Props) {
  const ioType = 1
  const [token, setToken] = useState('')
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { t } = useLanguage()
  const [pcHeader, setPCHeader] = useState<PurchaseConditionHeader>({
    issueDate: today(),
    documentDate: today(),
    startDate: today(),
    endDate: oneYearLater(),
    docNoSequence: 0
  })
  const [pcDetails, setPCDetails] = useState<PurchaseConditionDetail[]>([])

  const load = () => {
    setLoading(true)
    postItem(`/mikro/get`, token, { query: purchaseConditionHeaderQuery(params.id) })
      .then(result => {
        console.log('buraya geldi1')
        setPCHeader(result[0] as PurchaseConditionHeader)
        postItem(`/mikro/get`, token, { query: purchaseConditionDetailQuery(params.id) })
          .then(result => {
            setPCDetails(result as PurchaseConditionDetail[])
          })
          .catch(err => toast({ title: t('Error'), description: t(err || ''), variant: 'destructive' }))
          .finally(() => setLoading(false))
      })
      .catch(err => {
        toast({ title: t('Error'), description: t(err || ''), variant: 'destructive' })
        setLoading(false)
      })
  }


  const save = () => {
    savePurchaseCondition(token, pcHeader, pcDetails)
      .then(() => {
        toast({ title: `🙂 ${t('Success')}`, description: t('Document has been saved successfuly'), duration: 800 })
        setTimeout(() => router.back(), 1000)
      })
      .catch(err => toast({ title: t('Error'), description: t(err || ''), variant: 'destructive' }))
  }

  const deleteLine = (rowIndex: number) => {
    // let l = purhaseConditionDetails
    // l.splice(rowIndex, 1)
    // setPurhaseConditionDetails(l.map(e => e))
    const l = pcDetails.map((e, index) => {
      if (index == rowIndex) e.deleted = true
      return e
    })
    setPCDetails(l)
  }

  const calculateLine = (line: PurchaseConditionDetail, index: number) => {

  }

  const OrderCurrency = () => <span className='text-xs text-muted-foreground'>{pcHeader.currency}</span>

  const FormHeader = () => {
    return (<TsnPanel name="pcondition_Header" defaultOpen={true} className="mt-4" trigger={t('Header')} contentClassName="grid grid-cols-1 lg:grid-cols-6 gap-2 w-full">
      <div className="col-span-1 lg:col-span-6 grid grid-cols-1 lg:grid-cols-5 w-full items-center gap-2">
        <TsnInput title={t('Document Serial')} defaultValue={pcHeader.docNoSerial}
          onBlur={e => setPCHeader({ ...pcHeader, docNoSerial: e.target.value })}
          disabled={params.id != 'addnew'}
        />
        <TsnInput type='number' min={0} title={t('Document Sequence')} defaultValue={pcHeader.docNoSequence}
          disabled
        />
        <TsnInput type='date' title={t('Date')} defaultValue={pcHeader.issueDate?.substring(0, 10)}
          onBlur={e => setPCHeader({ ...pcHeader, issueDate: e.target.value })} />
        <TsnInput title={t('Document Number')} defaultValue={pcHeader.documentNumber}
          onBlur={e => setPCHeader({ ...pcHeader, documentNumber: e.target.value })} />
        <TsnInput type='date' title={t('Document Date')} defaultValue={pcHeader.issueDate?.substring(0, 10)}
          onBlur={e => setPCHeader({ ...pcHeader, documentDate: e.target.value })} />
      </div>
      <div className="col-span-4 lg:col-span-4 w-full p-2 pe-4 flex items-start justify-between  border rounded-md border-dashed">
        <div className="flex flex-col gap-1">
          <Label className="text-muted-foreground">{t('Firm')}</Label>
          <div className="capitalize">{pcHeader.firm?.toLowerCase()}</div>
        </div>
        <SelectFirm t={t} onSelect={e => {
          setPCHeader({ ...pcHeader, firmId: e._id, firm: e.name })
        }} ><ButtonSelect /></SelectFirm>

      </div>
      <div className="col-span-2 lg:col-span-2 w-full flex justify-between p-2 pe-4 items-start  border rounded-md border-dashed">
        <div className="flex flex-col gap-1">
          <Label className="text-muted-foreground">{t('Warehouse')}</Label>
          <div className="capitalize">{pcHeader.warehouse}</div>
        </div>
        <SelectWarehouse t={t} onSelect={e => {
          setPCHeader({ ...pcHeader, warehouseId: e._id, warehouse: e.name })
        }} ><ButtonSelect /></SelectWarehouse>

      </div>

      <div className="col-span-1 lg:col-span-6 grid grid-cols-1 lg:grid-cols-4 justify-between gap-2">
        <div className="w-full flex justify-between p-2 pe-4 items-start  border rounded-md border-dashed">
          <div className="flex flex-col gap-1">
            <Label className="text-muted-foreground">{t('Payment Plan')}</Label>
            <div className="capitalize">{pcHeader.paymentPlan}</div>
          </div>
          <SelectPaymentPlan t={t} onSelect={e => { setPCHeader({ ...pcHeader, paymentPlanId: e._id, paymentPlan: e.name }) }} ><ButtonSelect /></SelectPaymentPlan>

        </div>
        <div className="w-full flex justify-between p-2 pe-4 items-start  border rounded-md border-dashed">
          <div className="flex flex-col gap-1">
            <Label className="text-muted-foreground">{t('Project')}</Label>
            <div className="capitalize">{pcHeader.project}</div>
          </div>
          <SelectProject t={t} onSelect={e => { setPCHeader({ ...pcHeader, projectId: e._id, project: e.name }) }} ><ButtonSelect /></SelectProject>

        </div>
        <div className="w-full flex justify-between p-2 pe-4 items-start  border rounded-md border-dashed">
          <div className="flex flex-col gap-1">
            <Label className="text-muted-foreground">{t('Responsibility')}</Label>
            <div className="capitalize">{pcHeader.responsibility}</div>
          </div>
          <SelectResponsibility t={t} onSelect={e => { setPCHeader({ ...pcHeader, responsibilityId: e._id, responsibility: e.name }) }} ><ButtonSelect /></SelectResponsibility>

        </div>
        <div className="w-full flex justify-between p-2 pe-4 items-start  border rounded-md border-dashed">
          <div className="flex flex-col gap-1">
            <Label className="text-muted-foreground">{t('Purchase person')}</Label>
            <div className="capitalize">{pcHeader.salesperson}</div>
          </div>
          <SelectSalesperson t={t} onSelect={e => { setPCHeader({ ...pcHeader, salespersonId: e._id, salesperson: e.name }) }} ><ButtonSelect /></SelectSalesperson>

        </div>
      </div>
    </TsnPanel>)
  }

  const FormDetail = () => {
    return (<TsnPanel name="pcondition_Detail" defaultOpen={true} className="mt-4" trigger={t('Lines')} contentClassName="relative grid grid-cols-1gap-2 w-full">
      <TsnLineGrid
        list={pcDetails}
        onHeaderPaint={() =>
          <div className="flex  w-full gap-2">
            <div className="text-xs text-nowrap mt-2 text-muted-foreground">#</div>
            <div className="grid grid-cols-12 gap-1 w-full items-center">
              <div className="col-span-3">{t('Item')}</div>
              <div className="">{t('Condition')}</div>
              <div className="text-end">{t('Quantity')}</div>
              <div className="text-end">{t('Gross Price')}</div>
              <div className="text-end">{t('%Dis.1')}</div>
              <div className="text-end">{t('%Dis.2')}</div>
              <div className="text-end">{t('%Dis.3')}</div>
              <div className="text-end">{t('Profit')}</div>
              <div className="text-end">{t('Net Price')}</div>
              <div className="">{t('Description')}</div>

            </div>
            <div className='w-20 p-1 flex justify-end lg:justify-end'>

            </div>
          </div>
        }
        onRowPaint={(line: PurchaseConditionDetail, rowIndex) => <>
          {!line.deleted &&
            <div key={'line' + rowIndex} className="flex  w-full gap-2 items-center">
              <div className="text-xs text-nowrap mt-0 text-muted-foreground">#{rowIndex + 1}</div>
              <div className="grid grid-cols-12 gap-2 w-full items-center">
                <div className="col-span-3 flex flex-row justify-between gap-2">
                  <div className="capitalize">{line.item?.toLowerCase()}</div>
                  <SelectItem t={t} onSelect={e => {
                    setPCDetails(pcDetails.map((d, index) => {
                      if (index == rowIndex) {
                        d.item = e.name
                        d.itemId = e._id
                        return d
                      } else {
                        return d
                      }
                    }))

                  }} ><ButtonSelect /></SelectItem>
                </div>
                <div>
                  <TsnSelect title={''} itemClassName="px-1 py-1"
                    list={[{ _id: '0', name: 'Şartsız' }, { _id: '1', name: 'Tek seferdeki miktar' }, { _id: '2', name: 'Toplam alım miktar' }]}
                    value={(line.quantityCondition || '0').toString()}
                    onValueChange={e => setPCDetails(pcDetails.map((d, index) => {
                      if (index == rowIndex) d.quantityCondition = Number(e)
                      return d
                    }))}
                  />
                </div>
                <div className='flex flex-col'>
                  
                  <Input type="number" className="text-end" defaultValue={line.quantity}
                    onBlur={e => {
                      const val = !isNaN(Number(e.target.value)) ? Number(e.target.value) : 0
                      setPCDetails(pcDetails.map((d, index) => {
                        if (index == rowIndex) d.quantity = val
                        return d
                      }))
                    }}
                  />
                </div>
                <div className='flex flex-col gap-1 items-end'>
                  <Input type="number" className="text-end px-1 py-2" defaultValue={line.grossPrice}
                    onBlur={e => {
                      const val = !isNaN(Number(e.target.value)) ? Number(e.target.value) : 0
                      setPCDetails(pcDetails.map((d, index) => {
                        if (index == rowIndex) d.grossPrice = val
                        return d
                      }))
                    }}
                  />
                </div>
                <div className='flex items-center justify-end gap-[3px]'>
                  <Input type="number" className="text-end px-1 py-2" defaultValue={line.discountRate1}
                    onBlur={e => {
                      const val = !isNaN(Number(e.target.value)) ? Number(e.target.value) : 0
                      setPCDetails(pcDetails.map((d, index) => {
                        if (index == rowIndex) d.discountRate1 = val
                        return d
                      }))
                    }}
                  />
                </div>
                <div className='flex items-center justify-end gap-[3px]'>
                  <Input type="number" className="text-end px-1 py-2" defaultValue={line.discountRate2}
                    onBlur={e => {
                      const val = !isNaN(Number(e.target.value)) ? Number(e.target.value) : 0
                      setPCDetails(pcDetails.map((d, index) => {
                        if (index == rowIndex) d.discountRate2 = val
                        return d
                      }))
                    }}
                  />
                </div>
                <div className='flex items-center justify-end gap-[3px]'>
                  <Input type="number" className="text-end px-1 py-2" defaultValue={line.discountRate3}
                    onBlur={e => {
                      const val = !isNaN(Number(e.target.value)) ? Number(e.target.value) : 0
                      setPCDetails(pcDetails.map((d, index) => {
                        if (index == rowIndex) d.discountRate3 = val
                        return d
                      }))
                    }}
                  />
                </div>
                <div className='flex items-center justify-end gap-[3px]'>
                  <Input type="number" className="text-end px-1 py-2" defaultValue={line.profitRate}
                    onBlur={e => {
                      const val = !isNaN(Number(e.target.value)) ? Number(e.target.value) : 0
                      setPCDetails(pcDetails.map((d, index) => {
                        if (index == rowIndex) d.profitRate = val
                        return d
                      }))
                    }}
                  />
                </div>
                <div className='flex items-center justify-end gap-[3px]'>
                  {moneyFormat(line.salesPrice, 4)}
                </div>
                <div className='flex items-center justify-start gap-[3px] '>
                  <Input className="px-1 py-2" placeholder={t('Description')} defaultValue={line.description}
                    onBlur={e => {
                      setPCDetails(pcDetails.map((d, index) => {
                        if (index == rowIndex) d.description = e.target.value
                        return d
                      }))
                    }}
                  />
                </div>
              </div>
              <div className='w-20 flex flex-row items-end justify-end mx-2 gap-2'>


                <TsnGridButtonDelete t={t} title={'delete line?'} onOk={() => deleteLine(rowIndex)} />
              </div>
            </div>
          }
        </>}

      />

    </TsnPanel>)
  }

  const FormFooter = () => {
    return (<TsnPanel name="pcondition_Footer" defaultOpen={true} className="mt-4" trigger={t('Totals')} contentClassName="grid grid-cols-1 lg:grid-cols-4 gap-2 w-full">
      Kalem Sayisi: {pcDetails.length}
    </TsnPanel>)
  }


  useEffect(() => { !token && setToken(Cookies.get('token') || '') }, [])
  useEffect(() => { token && params.id != 'addnew' && load() }, [token])

  return (<StandartForm
    title={params.id == 'addnew' ? t('New Purchase Condition') : t('Edit Purchase Condition')}
    onSaveClick={save}
    onCancelClick={() => router.back()}
    loading={loading}

  >
    <div className="relative w-full h-full">
      {FormHeader()}
      {FormDetail()}
      {FormFooter()}
    </div>

  </StandartForm>)
}

