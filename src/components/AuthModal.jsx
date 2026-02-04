import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import { useI18n } from '../i18n'

export default function AuthModal({ isOpen, onClose, onSuccess }){
  const { t } = useI18n()
  const [isLogin, setIsLogin] = useState(true)
  const [name, setName] = useState('')
  const [country, setCountry] = useState('+996')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)

  const handleAuth = async (e) => {
    e.preventDefault()
    if(!phone) return alert(t('auth.enterPhone'))
    
    setLoading(true)
    try {
      const res = await axios.post('/api/users/login', {
        name: isLogin ? undefined : name,
        phone: country + phone
      })
      localStorage.setItem('user', JSON.stringify(res.data))
      onSuccess(res.data)
      onClose()
    } catch(err) {
      alert('Error: ' + (err.response?.data || err.message))
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="modal"
            initial={{ opacity: 0, scale: 0.8, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              className="modal-close" 
              onClick={onClose}
            >
              ✕
            </button>

            <h2 className="modal-title">
              {isLogin ? t('auth.login') : t('auth.register')}
            </h2>

            <form onSubmit={handleAuth} className="form">
              {!isLogin && (
                <input
                  placeholder={t('auth.enterName')}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              )}

              <div style={{ display: 'flex', gap: '8px' }}>
                <select value={country} onChange={(e) => setCountry(e.target.value)}>
                  <option value="+996">🇰🇬 Kyrgyzstan +996</option>
                  <option value="+7">🇷🇺 Russia +7</option>
                  <option value="+7">🇰🇿 Kazakhstan +7</option>
                  <option value="+998">🇺🇿 Uzbekistan +998</option>
                </select>
                <input
                  placeholder={t('auth.enterPhone')}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  type="tel"
                  required
                />
              </div>

              <motion.button
                type="submit"
                className="btn-primary"
                style={{ width: '100%' }}
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? '...' : (isLogin ? t('auth.login') : t('auth.register'))}
              </motion.button>
            </form>

            <div className="auth-toggle">
              {isLogin ? t('auth.noAccount') : t('auth.haveAccount')}
              {' '}
              <a onClick={() => setIsLogin(!isLogin)}>
                {isLogin ? t('auth.register') : t('auth.login')}
              </a>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
