import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useI18n } from '../i18n'
import LanguageSwitch from './LanguageSwitch'

export default function Header({ user, onAuthClick, onProfileClick }){
  const { t } = useI18n()

  const getInitial = (name) => {
    return name ? name.charAt(0).toUpperCase() : 'U'
  }

  return (
    <header className="app-header">
      <motion.div 
        className="logo"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Link to="/" className="logo-link" aria-label="Coffee Land">
          <img src="/logo/logo.jpg" alt={t('header.logoAlt')} className="logo-img" />
          <span className="logo-text">Coffee Land</span>
        </Link>
      </motion.div>

      <div className="header-right">
        <LanguageSwitch />
        
        <div className="header-actions">
          {user ? (
            <motion.div className="user-header-menu" style={{display:'flex', gap:'12px', alignItems:'center'}}>
              {user.loyaltyCard?.status === 'active' && (
                <motion.div 
                  className="loyalty-badge-header"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  title="Loyalty Card Active"
                >
                  💎
                </motion.div>
              )}
              <motion.button
                className="avatar-btn"
                onClick={onProfileClick}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                title={user.name || user.phone}
              >
                {getInitial(user.name)}
              </motion.button>
            </motion.div>
          ) : (
            <motion.button
              className="btn-primary"
              style={{ padding: '8px 16px', fontSize: '13px' }}
              onClick={onAuthClick}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {t('header.login')}
            </motion.button>
          )}
        </div>
      </div>
    </header>
  )
}
