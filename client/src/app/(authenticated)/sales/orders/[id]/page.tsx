import { FirmForm } from '@/app/(authenticated)/(components)/firm/firm-form'
import { OrderForm } from '@/app/(authenticated)/(components)/order/order-form'

interface Props {
  params: { id: string }
}
export default function EditPage({ params }: Props) {
  return (<OrderForm id={params.id} type={'sales'} />)
}