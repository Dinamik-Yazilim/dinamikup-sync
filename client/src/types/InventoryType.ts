import { DespatchType } from './DespatchType'
import { Item } from './Item'

export interface InventoryType {
  _id?: string
  despatch?: DespatchType
  ioType?: number | 0 | 1
  issueDate?: string
  issueTime?: string
  description?: string
  item?: Item
  quantity?: number
  thickness?: number
  width?: number
  length?: number
  weight?: number
  partiLotNo?: string
  serialNo?: string
  price?: number
  total?: number
  currency?: string | 'USD' | 'TRY' | 'EUR' | 'RUB' | 'GBP' | undefined
  taxAmount?: number
  withHoldingTaxAmount?: number
  taxInclusiveTotal?: number

}

