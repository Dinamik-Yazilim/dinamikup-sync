import { AddressField } from './AddressField'
import { AddressType, CountryType } from './AddressType'

export interface Firm {
  _id?: string
  type?: string | 'c' | 'v' | 'cv' | undefined
  name?: string
  currency?: string
  article?: string
  billingInfo?: {
    individual?: boolean
    companyName?: string
    firstName?: string
    lastName?: string
    taxOffice?: string
    taxNumber?: string
    idCardNo?: string
  }
  address?: AddressField
  balance?: number
  passive?: boolean
}


export function firmTypeList(firmType: string, t: any) {
  if (firmType == 'c') {
    return [
      { _id: 'c', text: t('Customer') },
      { _id: 'cv', text: t('Customer & Vendor') },
      { _id: 'cc', text: t('Customer Candidate') },
    ]
  } else if (firmType == 'v') {
    return [
      { _id: 'v', text: t('Vendor') },
      { _id: 'cv', text: t('Customer & Vendor') },
    ]
  } else if (firmType == 'cc') {
    return [
      { _id: 'cc', text: t('Customer Candidate') },
    ]
  } else {
    return [
      { _id: 'c', text: t('Customer') },
      { _id: 'v', text: t('Vendor') },
      { _id: 'cv', text: t('Customer & Vendor') },
      { _id: 'cc', text: t('Customer Candidate') },
    ]
  }
}

export function firmTypeName(firmType: string, t: any) {
  switch (firmType) {
    case 'c': return t('Customer')
    case 'v': return t('Vendor')
    case 'cv': return t('Customer & Vendor')
    case 'cc': return t('Customer Candidate')
    default: return t('Unknown')
  }
}