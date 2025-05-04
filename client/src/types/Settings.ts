import { AddressField } from './AddressField'

export interface Settings {
  currency?: string | any | 'USD' | 'EUR' | 'TRY' | 'GBP' | 'RUB' | 'AZN' | 'AED'
  // taxScheme?: string | 'VKN' | 'TCKN'  // TODO: buraya genel olarak party identification eklenecek
  taxOffice?: string
  taxNumber?: string
  partyName?: string
  address?: AddressField
  invoice?: {
    prefix?: string
    profileId?: string | any | 'TEMELFATURA' | 'TICARIFATURA'

  }
}


// 'USD', 'EUR', 'TRY', 'GBP', 'RUB', 'AZN', 'AED'

export const currencyList = [
  { _id: 'USD', name: 'USD' },
  { _id: 'EUR', name: 'EUR' },
  { _id: 'TRY', name: 'TRY' },
  { _id: 'GBP', name: 'GBP' },
  { _id: 'RUB', name: 'RUB' },
  { _id: 'AZN', name: 'AZN' },
  { _id: 'AED', name: 'AED' },
]