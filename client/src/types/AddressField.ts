import { CountryType } from './AddressType'

export interface AddressField {
  room?: string
  streetName?: string
  blockName?: string
  buildingName?: string
  buildingNumber?: string
  citySubdivisionName?: string
  cityName?: string
  postalZone?: string
  postbox?: string
  region?: string
  district?: string
  country?: CountryType
}