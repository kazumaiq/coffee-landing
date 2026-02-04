import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useI18n } from '../i18n'

export default function Cart({ items, onRemove, discount }){
  const { t } = useI18n()
  const total = items.reduce((s, i) => s + (i.price || 0), 0)
  const discountAmount = discount ? Math.round(total * discount / 100) : 0

  if(items.length === 0) return null

  return (
    <motion.div 
      className="cart-container"
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <AnimatePresence mode="popLayout">
        {items.map((it, idx)=> (
          <motion.div 
            key={idx} 
            layout
            className="cart-item"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.2 }}
          >
            <div className="cart-item-info">
              <div className="cart-item-name">
                {it.name_en || it.name_ru}
              </div>
              <div className="cart-item-details">
                {it.size}
              </div>
            </div>
            
            <div className="cart-item-price">
              {it.price} {t('common.currency')}
            </div>

            <motion.button 
              className="cart-remove-btn"
              onClick={()=>onRemove(idx)}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.8 }}
            >
              ✕
            </motion.button>
          </motion.div>
        ))}
      </AnimatePresence>

      <div className="cart-total">
        <span className="cart-total-label">{t('cart.total')}:</span>
        <motion.span 
          className="cart-total-value"
          key={total}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          {total} {t('common.currency')}
        </motion.span>
      </div>

      {discountAmount > 0 && (
        <motion.div 
          className="cart-discount"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <span className="cart-discount-label">
            {t('cart.withDiscount')} ({discount}%):
          </span>
          <motion.span 
            className="cart-discount-value"
            key={discountAmount}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            -{discountAmount} {t('common.currency')}
          </motion.span>
        </motion.div>
      )}
    </motion.div>
  )
}
