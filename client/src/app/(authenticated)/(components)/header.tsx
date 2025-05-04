"use client"

import { ThemeToggleButton } from '@/components/theme-toggle-button'
import { HeaderLogo2 } from '@/components/logo'
import CustomLink from '@/components/custom-link'
import { Input } from "@/components/ui/input"
import { UserMenu } from './user-menu'
import { FC, useEffect, useState } from 'react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { BoxesIcon, DatabaseIcon, FactoryIcon, HomeIcon, PiggyBankIcon, ShoppingCartIcon, TruckIcon } from 'lucide-react'
import { useLanguage } from '@/i18n'
import Cookies from 'js-cookie'
import { DatabaseSelect } from '@/components/database-select'
import { NotificationButton } from '@/components/notify-icon'
const MENU = [
  { text: 'Sales', icon: '🛒', href: '/sales' },
  { text: 'Purchase', icon: '🚚', href: '/purchase' },
  { text: 'Finance', icon: '💰', href: '/finance' },
  { text: 'Inventory', icon: '📦', href: '/inventory' },
  { text: 'Production', icon: '🏭', href: '/production' },
]
export function Header() {
  const { t } = useLanguage()

  return (
    <header className="flex h-16 items-center justify-between bor11der-b bg-white px-0 md:px-2 dark:border-gray-800 dark:bg-gray-950"    >
      <div className="flex items-center gap-2">
        <CustomLink className="" href="/">
          <HeaderLogo2 className='' />
        </CustomLink>
        <div className='hidden lg:flex'>
          <DatabaseSelect />
        </div>

        {/* <div className='text-xs flex'><DatabaseIcon size={'16px'} /> {Cookies.get('databaseName') || ''}</div> */}
      </div>
      <div className="flex items-center gap-2">
        <div className=" hidden gap-4 text-sm font-medium lg:flex  md:items-center">
          {MENU.map((e, index) =>
            <CustomLink key={'menu' + index} className="flex flex-col items-center rounded-md px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800" href={e.href}>
              <div className='text-2xl  drop-shadow-[1px_1px_1px_black] dark:drop-shadow-none' >{e.icon}</div> {t(e.text)}
            </CustomLink>
          )}

        </div>
        <NotificationButton />
        <UserMenu />
        <div className='flex lg:hidden'><MobileMenu /></div>

      </div>
    </header>
  )
}

function MobileMenu() {
  return (<>
    <DropdownMenu >
      <DropdownMenuTrigger asChild  >
        <Button className="rounded-full border border-gray-200 w-12 h-12 dark:border-gray-800"
          size="icon"
          variant="ghost"
        >
          <i className="fa-solid fa-bars"></i>
          <span className="sr-only">Toggle user menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" >

        {MENU.map((e, index) =>
          <DropdownMenuItem key={'mmenu' + index}>
            <Link href="/" className='flex items-center gap-2'>
              <div className='text-2xl'>{e.icon}</div> {e.text}
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <DatabaseSelect />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </>)
}