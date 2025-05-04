import { TsnListType, TsnSelect } from './tsn-select'
import { AddressField } from '@/types/AddressField'
import countryList from '@/lib/countryList.json'
import { useLanguage } from '@/i18n'
import { useEffect, useState } from 'react'
import { TsnInput } from './tsn-input'
export interface TsnInputAddress {
  defaultValue?: AddressField
  onChange?: (e: AddressField) => void
  readOnly?: boolean
}
export function TsnInputAddress({ defaultValue, onChange, readOnly }: TsnInputAddress) {
  const [address, setAddress] = useState<AddressField>(defaultValue || {})
  const { t } = useLanguage()
  const clist = Object.keys(countryList as any).map(key => { return ({ _id: key, text: (countryList as any)[key] } as TsnListType) })

  useEffect(() => {
    JSON.stringify(address) != JSON.stringify(defaultValue) && onChange && onChange(address)
  }, [address])
  return (<>
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 my-1'>
      <TsnSelect title={t('Country')}
        // className='ms-2 my-2 '
        list={clist}
        defaultValue={address?.country?.identificationCode || 'tr'}
        onValueChange={e => {
          let countryName = (countryList as any)[e || 'tr'] || 'Türkiye'
          setAddress({ ...address, country: { identificationCode: e, name: countryName } })
        }}
      />
      <TsnInput title={t('Region/State')} defaultValue={address?.region} onBlur={e => setAddress({ ...address, region: e.target.value })} />
      <TsnInput title={t('City')} defaultValue={address?.cityName} onBlur={e => setAddress({ ...address, cityName: e.target.value })} />
      <TsnInput title={t('District')} defaultValue={address?.district} onBlur={e => setAddress({ ...address, district: e.target.value })} />
    </div>
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-2'>
      <TsnInput title={t('City Subdivision')} defaultValue={address?.citySubdivisionName} onBlur={e => setAddress({ ...address, citySubdivisionName: e.target.value })} />

      <TsnInput title={t('Street') + '/' + t('Avenue')} defaultValue={address?.streetName} onBlur={e => setAddress({ ...address, streetName: e.target.value })} />
    </div>
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2'>
      <TsnInput title={t('Building Number')} defaultValue={address?.buildingNumber} onBlur={e => setAddress({ ...address, buildingNumber: e.target.value })} />
      <TsnInput title={t('Building/Residence')} defaultValue={address?.buildingName} onBlur={e => setAddress({ ...address, buildingName: e.target.value })} />
      <TsnInput title={t('Block')} defaultValue={address?.blockName} onBlur={e => setAddress({ ...address, blockName: e.target.value })} />
      <TsnInput title={t('Room')} defaultValue={address?.room} onBlur={e => setAddress({ ...address, room: e.target.value })} />

    </div>
  </>)
}