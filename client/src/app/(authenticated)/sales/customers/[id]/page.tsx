import { FirmForm } from '@/app/(authenticated)/(components)/firm/firm-form'

interface Props {
  params: { id: string }
}
export default function EditPage({ params }: Props) {
  return (<FirmForm id={params.id} ftype='c' />)
}