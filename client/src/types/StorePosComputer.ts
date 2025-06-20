export interface PosStoreComputer {
  _id?: string
  organization?: string
  database?: string
  name?: string
  responsibilityId?: string
  responsibility?: string
  projectId?: string
  project?: string
  cashAccountId?: string
  cashAccount?: string
  bankAccountId?: string
  bankAccount?: string
  paymentDevices?: PaymentDevice[]
  scale?:Scale
  passive?: boolean
}

export interface PaymentDevice {

}

export interface Scale {
  connectionType?: string
  comPortOptions?: any
}