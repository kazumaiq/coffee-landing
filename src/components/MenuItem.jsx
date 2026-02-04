import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useI18n } from '../i18n'

export default function MenuItem({ item, onAdd, hasDiscount }){
  const { t, lang } = useI18n()
  const [size, setSize] = useState(item.sizes[0].size)

  const name = lang === 'ru' ? item.name_ru : item.name_en
  const price = item.sizes.find(s => s.size === size)?.price || item.sizes[0].price
  const currency = t('common.currency')

  const emojis = {
    espresso: '☕',
    americano: '☕',
    latte: '☕',
    iced_latte: '🧊',
    cold_brew: '🧊',
    lemonade_classic: '🍋',
    vanilla_shake: '🥛',
    vanilla: '✨',
    caramel: '✨',
    oat: '🌾',
    soy: '🫘',
    black_tea: '🫖',
    cappuccino: '☕',
    raf: '🍮',
    mocaccino: '🍫',
    flat_white: '☕',
    espresso_30: '⚡',
    espresso_60: '⚡',
    cacao: '🍫',
    ice_latte: '🧊',
    ice_cappuccino: '🧊',
    ice_americano: '🧊',
    ice_matcha_green: '🍵',
    ice_matcha_blue: '🍵',
    garnet_rose: '🌹',
    tropical: '🥭',
    watermelon_strawberry: '🍉',
    banana_shake: '🍌',
    strawberry_shake: '🍓',
    green_black: '🫖',
    sea_buckthorn: '🍊',
    matcha_green: '🍵',
    matcha_blue: '🫐'
  }

  const emoji = emojis[item.id] || '☕'

  return (
    <motion.div 
      className="item"
      whileHover={{ y: -10 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 260, damping: 22 }}
      layout
    >
      {hasDiscount && (
        <motion.div 
          className="discount-badge"
          initial={{ opacity: 0, scale: 0, rotateZ: -15 }}
          animate={{ opacity: 1, scale: 1, rotateZ: 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        >
          {t('menu.discount')}
        </motion.div>
      )}

      <motion.div 
        className="item-image"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, type: 'spring' }}
        whileHover={{ scale: 1.12, rotateZ: 4 }}
      >
        {emoji}
      </motion.div>

      <div className="item-meta">
        <motion.div 
          className="item-name"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          {name}
        </motion.div>
        <motion.div 
          className="item-size"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.15 }}
        >
          {size} • {price} {currency}
        </motion.div>
      </div>

      <div className="item-actions">
        <select 
          className="size-select"
          value={size} 
          onChange={(e)=>setSize(e.target.value)}
        >
          {item.sizes.map(s=> (
            <option key={s.size} value={s.size}>
              {s.size} — {s.price} {currency}
            </option>
          ))}
        </select>
        <motion.button 
          className="add-btn" 
          onClick={()=>onAdd({ ...item, size, price })}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 350, damping: 26 }}
        >
          ✓ {t('menu.add')}
        </motion.button>
      </div>
    </motion.div>
  )
}
