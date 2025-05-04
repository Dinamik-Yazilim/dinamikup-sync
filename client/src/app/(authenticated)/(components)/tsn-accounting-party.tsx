import { TsnInput } from '@/components/ui216/tsn-input'
import { TsnInputAddress } from '@/components/ui216/tsn-input-address'
import { TsnPanel } from '@/components/ui216/tsn-panel'
import { useLanguage } from '@/i18n'
import { Party } from '@/types/Party'

interface Props {
  party?: Party
  onChange?: (e: Party) => void
}
export function TsnAccountingParty({ party, onChange }: Props) {
  const { t } = useLanguage()

  return (<div className='flex flex-col gap-4'>
    <div className='grid grid-cols-1 lg:grid-cols-4 gap-4'>
      <TsnInput className='col-span-full' title={t('Legal Name')} defaultValue={party?.partyName} onBlur={e => onChange && onChange({ ...party, partyName: e.target.value })} />
      <TsnInput title={t('Tax Office')}
        defaultValue={party?.partyTaxScheme?.taxScheme?.name}
        onBlur={e => onChange && onChange({ ...party, partyTaxScheme: { ...party?.partyTaxScheme, taxScheme: { ...party?.partyTaxScheme?.taxScheme, name: e.target.value } } })}
      />
      <TsnInput title={t('Tax Number')}
        defaultValue={party?.partyIdentification?.find(e => e.schemeID == 'VKN' || e.schemeID == 'TCKN')?.ID}
        onBlur={e => {
          if (onChange) {
            const foundIndex = party?.partyIdentification?.findIndex(e => e.schemeID == 'VKN' || e.schemeID == 'TCKN')
            if (foundIndex != undefined && foundIndex > -1) {
              if (party?.partyIdentification && party?.partyIdentification[foundIndex]) {
                party.partyIdentification[foundIndex].ID = e.target.value
                onChange({ ...party, partyIdentification: party.partyIdentification })
              }
            }
          }
        }}
      />

    </div>
    <TsnPanel name='invoice_address' trigger={t('Address')}>
      <TsnInputAddress defaultValue={party?.postalAddress} onChange={e => onChange && onChange({ ...party, postalAddress: e })} />
    </TsnPanel>
  </div>)
}