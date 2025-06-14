"use client"

import { SelectItem } from "@/app/(authenticated)/(components)/select-item"
import { ButtonSelect } from "@/components/icon-buttons"
import { Input } from "@/components/ui/input"
import { TsnGridButtonAddNew, TsnGridButtonDelete } from "@/components/ui216/tsn-grid"
import { TsnSelect } from "@/components/ui216/tsn-select"
import { moneyFormat } from "@/lib/utils"
import { PurchaseConditionDetail } from "@/types/PurchaseConditions"

interface LineItemProps {
  line: PurchaseConditionDetail
  rowIndex: number
  pcDetails: PurchaseConditionDetail[]
  setPCDetails: (e: PurchaseConditionDetail[]) => void
  t: (text: string) => string
  showDetail?: boolean
}

export function LineItem({ line, rowIndex, pcDetails, setPCDetails, t, showDetail }: LineItemProps) {
  const deleteLine = (rowIndex: number) => {
    const l = pcDetails.map((e, index) => {
      if (index == rowIndex) e.deleted = true
      return e
    })
    setPCDetails(l)
  }

  // const addNewLine = ()=>{
  //   let l = pcDetails.map(e=>e)
  //   l.push(line)
  //   setPCDetails(l)
  // }

  return (<div key={'line' + rowIndex} className={`flex  w-full gap-4 items-center`}>
    <div className="text-xs text-nowrap mt-0 text-muted-foreground">
      {rowIndex < 0 && <>Yeni</>}
      {rowIndex >= 0 && <>#{rowIndex + 1}</>}

    </div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-center w-full">
      <div className="col-span-1 flex flex-row items-center gap-2 text-start">
        <SelectItem t={t} onSelect={e => {
          setPCDetails(pcDetails.map((d, index) => {
            if (index == rowIndex) {
              d.item = e.name
              d.itemId = e._id
            }
            return d
          }))

        }} ><ButtonSelect /></SelectItem>
        {line.itemId && <div className="capitalize">{line.item?.toLowerCase()}</div>}
        {!line.itemId && <div className="text-muted-foreground">**{t('Please choose an item')}**</div>}
      </div>
      <div className="lg:col-span-2 flex flex-col gap-0">
        {line.itemId && <>
          <div className="grid grid-cols-3 lg:grid-cols-6 gap-2 w-full items-center">
            <div className='flex flex-col gap-1 items-end'>
              <Input type="number" className="text-end px-1 py-2" defaultValue={line.grossPrice}
                onBlur={e => {
                  const val = !isNaN(Number(e.target.value)) ? Number(e.target.value) : 0
                  setPCDetails(pcDetails.map((d, index) => {
                    if (index == rowIndex) d.grossPrice = val
                    return d
                  }))
                }}
                onFocus={e => e.target.select()}
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
                onFocus={e => e.target.select()}
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
                onFocus={e => e.target.select()}
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
                onFocus={e => e.target.select()}
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
                onFocus={e => e.target.select()}
              />
            </div>
            <div className='flex items-center justify-end gap-[3px]'>
              <Input className="text-end" readOnly value={moneyFormat(line.salesPrice, 4)} />
            </div>
          </div>
          {showDetail &&
            <div className="grid grid-cols-1 lg:grid-cols-6 gap-2 w-full items-center">

              <div className="lg:col-span-2">
                <TsnSelect title={''} itemClassName="px-2 py-1"
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
                  onFocus={e => e.target.select()}
                />
              </div>


              <div className='lg:col-span-3'>
                <Input className="px-1 py-2" placeholder={t('Description')} defaultValue={line.description}
                  onBlur={e => {
                    setPCDetails(pcDetails.map((d, index) => {
                      if (index == rowIndex) d.description = e.target.value
                      return d
                    }))
                  }}
                  onFocus={e => e.target.select()}
                />
              </div>
            </div>
          }
        </>}
      </div>
    </div>
    <div className='w-20 flex flex-row items-end justify-end mx-2 gap-2'>
      {rowIndex >= 0 && <TsnGridButtonDelete t={t} title={'Delete line?'} onOk={() => deleteLine(rowIndex)} />}
      {/* {rowIndex < 0 && <TsnGridButtonAddNew onClick={() => addNewLine()} />} */}
    </div>
  </div>
  )

}