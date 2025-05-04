"use client"

import { Button } from '@/components/ui/button'
import { useLanguage } from '@/i18n'
import { BoxesIcon, FolderTreeIcon, GroupIcon, NetworkIcon, PercentIcon, ShirtIcon, ShoppingBagIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
export default function InventoryPage() {
  const router = useRouter()
  const { t } = useLanguage()

  return (<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
    <Button onClick={() => router.push('/defines/items')} variant={'outline'} className='flex justify-start gap-4'>
      <BoxesIcon />{t('Items')}
    </Button>
    <Button onClick={() => router.push('/defines/itemMainGroups')} variant={'outline'} className='flex justify-start gap-4'>
      <GroupIcon /> {t('Item Main Groups')}
    </Button>
    <Button onClick={() => router.push('/defines/itemGroups')} variant={'outline'} className='flex justify-start gap-4'>
      <FolderTreeIcon /> {t('Item Groups')}
    </Button>
    <Button onClick={() => router.push('/defines/categories')} variant={'outline'} className='flex justify-start gap-4'>
      <NetworkIcon /> {t('Categories')}
    </Button>
    <Button onClick={() => router.push('/defines/brands')} variant={'outline'} className='flex justify-start gap-4'>
      <ShoppingBagIcon /> {t('Brands')}
    </Button>
    <Button onClick={() => router.push('/defines/models')} variant={'outline'} className='flex justify-start gap-4'>
      <ShirtIcon /> {t('Models')}
    </Button>
    <Button onClick={() => router.push('/defines/taxTypes')} variant={'outline'} className='flex justify-start gap-4'>
      <PercentIcon /> {t('Tax Types')}
    </Button>
  </div>)
}