import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useI18n } from '../i18n'

export default function LanguageSwitch(){
  const { lang, setLang } = useI18n()
  
  const toggleLang = () => setLang(lang==='ru'?'en':'ru')
  const displayText = lang==='ru'?'EN':'RU'
  
  return (
    <motion.div>
      <motion.button 
        className="lang-switch"
        onClick={toggleLang}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={lang}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
          >
            {displayText}
          </motion.div>
        </AnimatePresence>
      </motion.button>
    </motion.div>
  )
}
