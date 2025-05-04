import { AddressField } from './AddressField'
import { Contact } from './Contact'
import { Person } from './Person'

export interface Party {
  websiteURI?: string,
  partyName?: string,
  person?: Person,
  partyIdentification?: PartyIdentification[],
  partyTaxScheme?: PartyTaxScheme,
  postalAddress?: AddressField
  contact?: Contact
}

export interface PartyIdentification {
  schemeID?: string
  ID?: string
}

export interface PartyTaxScheme {
  taxScheme?: TaxScheme

}

export interface TaxScheme {
  name?: string

}