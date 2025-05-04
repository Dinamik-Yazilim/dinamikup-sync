import { AddressField } from './AddressField'
import { Firm } from './Firm'
import { InventoryType } from './InventoryType'

export interface DespatchType {
  _id?: string
  firm?: Firm
  ioType?: number | 0 | 1
  issueDate?: string
  issueTime?: string
  documentNumber?: string
  lineCount?: number
  quantity?: number
  total?: number
  currency?: string | 'USD' | 'TRY' | 'EUR' | 'RUB' | 'GBP' | undefined
  taxAmount?: number
  withHoldingTaxAmount?: number
  taxInclusiveTotal?: number
  note?: string
  address?: AddressField
  driver?: {
    firstName?: string
    lastName?: string
    idCardNo?: string
  },
  vechiclePlate?: string,
  lines?: InventoryType[]
}

