// import { t } from '@/i18n/serverSide'
import { Metadata } from 'next/types'
// import { cookies } from 'next/headers'
// import __en from "@/i18n/__en.json"
// import __tr from "@/i18n/__tr.json"
// export const LANG_LISTS: any = {
//   en: __en,
//   tr: __tr,
// }
export function pageMeta(title: string, description?: string) {
  const metadata: Metadata = {
    title: `${title} - ${process.env.NEXT_PUBLIC_APP_TITLE || 'ENV ERROR'}`,
    description: `${description && description} || process.env.NEXT_PUBLIC_APP_DESCRIPTION || 'ENV Error'}`,
  }
  return metadata
}

