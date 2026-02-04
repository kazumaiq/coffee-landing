import React from 'react'
import { motion } from 'framer-motion'
import { useI18n } from '../i18n'

export default function LoyaltyCard({ card, user }){
  const { t } = useI18n()
  
  const safeCard = card || { status: 'inactive', discount_percent: 10 }
  const isActive = safeCard.status === 'active'

  return (
    <motion.div 
      className={`loyalty-card ${!isActive ? 'loyalty-card-inactive' : ''}`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      whileHover={isActive ? { scale: 1.02 } : {}}
    >
      <div className="loyalty-card-content">
        <div className="loyalty-card-title">
          ☕ {t('profile.loyaltyCard')}
        </div>
        <div className="loyalty-card-status">
          {isActive ? t('profile.cardActive') : t('profile.cardInactive')}
        </div>
        <div className="loyalty-card-discount">
          {safeCard.discount_percent}%
        </div>
        <div className="loyalty-card-label">
          {t('profile.discount')}
        </div>
      </div>
    </motion.div>
  )
}
