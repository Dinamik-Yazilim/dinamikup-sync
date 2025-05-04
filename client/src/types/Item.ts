import { TaxTotal } from './Invoice'

export interface Item {
  _id?: string
  itemGroup?: ItemGroup
  category?: Category
  name?: string
  description?: string
  keyword?: string
  brand?: Brand
  model?: Model
  buyersItemIdentification?: string
  sellersItemIdentification?: string
  manufacturersItemIdentification?: string
  taxType?: TaxType
  exportTaxType?: TaxType
  unit?: string
  additionalItemIdentification?: string[]
  passive?: boolean
}

export interface TaxType {
  _id?: string
  name?: string
  taxTotal?: TaxTotal
  withholdingTaxTotal?: TaxTotal[]
}
export interface Category {
  _id?: string
  name?: string
  article?: string
}

export interface Brand {
  _id?: string
  category?: Category
  name?: string
  logo?: string
  article?: string
}

export interface Model {
  _id?: string
  category?: Category
  name?: string
  logo?: string
  article?: string
}



export interface ItemMainGroup {
  _id?: string
  name?: string
  article?: string
}

export interface ItemGroup {
  _id?: string
  itemMainGroup?: ItemMainGroup
  name?: string
  article?: string

}

export interface Barcode {
  _id?: string
  item?: Item
  barcode?: string
  factor?: number
  variant1?: any
  variant2?: any
  variant3?: any
  variant4?: any

}


