"use client"

import { Button } from '@/components/ui/button'
import { MenuPage } from '@/components/ui216/menu-page'
import { useLanguage } from '@/i18n'
import { NotebookPenIcon, UsersIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { FirmList } from '../../(components)/firm/firm-list'
import { OrderList } from '../../(components)/order/order-list'
export default function CustomersPage() {
  const { t } = useLanguage()

  return (<OrderList type={'sales'} title={t('Sales Orders')} />)
}