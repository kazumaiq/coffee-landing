import React from 'react'
import { motion } from 'framer-motion'
import { useI18n } from '../i18n'

export default function Hero({ onViewMenu, onOrderClick }){
  const { t } = useI18n()

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' }
    }
  }

  return (
    <>
      <section className="hero">
        <motion.div 
          className="hero-content"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1 
            className="hero-title"
            variants={itemVariants}
          >
            {t('hero.title')}
          </motion.h1>
          
          <motion.p 
            className="hero-subtitle"
            variants={itemVariants}
          >
            {t('hero.subtitle')}
          </motion.p>

          <motion.div 
            className="hero-buttons"
            variants={itemVariants}
          >
            <motion.button
              className="btn-primary"
              onClick={onViewMenu}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            >
              {t('hero.viewMenu')}
            </motion.button>
            <motion.button
              className="btn-secondary"
              onClick={onOrderClick}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            >
              {t('hero.orderNow')}
            </motion.button>
          </motion.div>
        </motion.div>
      </section>
      
      {/* Wave divider */}
      <div className="wave-divider">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path className="wave-path" d="M0,60 Q300,20 600,60 T1200,60 L1200,120 L0,120 Z"></path>
        </svg>
      </div>
    </>
  )
}
