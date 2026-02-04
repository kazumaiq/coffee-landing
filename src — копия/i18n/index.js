import React, { createContext, useContext, useState, useEffect } from 'react'
import ru from './ru.json'
import en from './en.json'

const resources = { ru, en }
const StorageKey = 'lang'

const I18nContext = createContext()

export function I18nProvider({ children }) {
  const [lang, setLang] = useState(localStorage.getItem(StorageKey) || 'ru')

  useEffect(() => {
    localStorage.setItem(StorageKey, lang)
  }, [lang])

  const t = (key) => {
    const parts = key.split('.')
    let cur = resources[lang]
    for (const p of parts) {
      if (!cur) return key
      cur = cur[p]
    }
    return cur || key
  }

  return React.createElement(
    I18nContext.Provider,
    { value: { lang, setLang, t } },
    children
  )
}

export const useI18n = () => useContext(I18nContext)
