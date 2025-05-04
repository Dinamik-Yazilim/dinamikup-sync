"use client"

import { useLanguage } from '@/i18n'
import './box.css'

export default function Home() {
  const { t } = useLanguage()
  return (
    <div className='container relative px-0 py-4 flex flex-col gap-4'>
      <h1>{t('Home')}</h1>
      <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Deleniti nesciunt velit officia quod! In consequatur repellat est! Quas officia explicabo sapiente, minima fugit suscipit et consequuntur ipsam, sequi accusantium dolores?</p>

    </div>
  )
}
