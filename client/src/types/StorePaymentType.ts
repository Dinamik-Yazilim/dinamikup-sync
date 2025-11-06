import { Store } from "./Store"

export interface StorePaymentType {
  _id?: string
  organization?: string
  database?: string
  store?: Store
  paymentId?: string
  paymentType?: string
  paymentName?: string
  defaultFirmId?: string
  defaultFirm?: string

}

export interface StorePaymentTypeListItem {
  _id?: string
  type?: string
  name?: string
}