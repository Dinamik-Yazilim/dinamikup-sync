import { FirmForm } from '@/app/(authenticated)/(components)/firm/firm-form'
import { InvoiceForm } from '@/app/(authenticated)/(components)/invoice/invoice-form'
import { OrderForm } from '@/app/(authenticated)/(components)/order/order-form'

interface Props {
  params: { id: string }
}
export default function EditPage({ params }: Props) {
  return (<InvoiceForm id={params.id} ioType={1} />)
}