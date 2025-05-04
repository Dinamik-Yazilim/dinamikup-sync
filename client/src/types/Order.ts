import { AddressField } from './AddressField'
import { Firm } from './Firm'
import { Item } from './Item'

export interface Order {
  _id?: string
  firm?: Firm
  draft?: boolean
  type?: string | any | 'sales' | 'purchase' | 'sales_proposal' | 'purchase_proposal' | 'request' | 'transfer'
  issueDate?: string
  documentNumber?: string
  firmDocumentNumber?: string
  lineCount?: number
  quantity?: number
  total?: number
  currency?: string | 'USD' | 'TRY' | 'EUR' | 'RUB' | 'GBP' | undefined
  taxAmount?: number
  withHoldingTaxAmount?: number
  taxInclusiveTotal?: number
  note?: string
  address?: AddressField
  closed?: boolean
}

export interface OrderLine {
  _id?: string
  order?: string
  type?: string | any | 'sales' | 'purchase' | 'sales_proposal' | 'purchase_proposal' | 'request' | 'transfer'
  issueDate?: string
  item?: Item
  description?: string
  quantity?: number
  delivered?: number
  remainder?: number
  price?: number
  total?: number
  currency?: string | 'USD' | 'TRY' | 'EUR' | 'RUB' | 'GBP' | undefined
  taxAmount?: number
  withHoldingTaxAmount?: number
  taxInclusiveTotal?: number
  closed?: boolean
}

export function orderTypeName(type: string, t: any) {
  switch (type) {
    case 'sales': return t('Sales')
    case 'purchase': return t('Purchase')
    case 'sales_proposal': return t('Sales Proposal')
    case 'purchase_proposal': return t('Purchase Proposal')
    case 'request': return t('Request')
    case 'transfer': return t('Transfer')
    default: return t('Unknown')
  }
}
