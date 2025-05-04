export interface Location {
  _id?: string
  type?: string | any | 'warehouse' | 'shop' | 'office' | 'factory' | 'other'
  name?: string
  article?: string
  passive?: boolean
  subLocations: SubLocation[]
}

export interface SubLocation {
  _id?: string
  code?: string
  passive?: boolean
}

export function getLocationTypeList(t: any) {
  return [
    { _id: 'warehouse', text: t('Warehouse') },
    { _id: 'shop', text: t('Shop') },
    { _id: 'office', text: t('Office') },
    { _id: 'factory', text: t('Factory') },
    { _id: 'other', text: t('other') },
  ]
}