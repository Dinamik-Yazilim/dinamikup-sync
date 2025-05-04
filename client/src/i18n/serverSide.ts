import __en from "./__en.json"
import __tr from "./__tr.json"
// import { createGlobalState } from "react-hooks-global-state"
import { cookies } from 'next/headers'
export const LANG_LISTS: any = {
  en: __en,
  tr: __tr,
}

export const changeLanguage = (language: string) => {
  cookies().set("lang", language)
}


export const t = (key: string) => {
  const lang = cookies().get('lang')?.value || 'en'
  const list = LANG_LISTS[lang || 'en'] || __en
  if (Object.keys(list).includes(key)) {
    return list[key] as string
  } else {
    return key
  }
}


