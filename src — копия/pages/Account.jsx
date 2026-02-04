import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import LoyaltyCard from '../components/LoyaltyCard'
import { useI18n } from '../i18n'
import axios from 'axios'

export default function Account(){
  const { t } = useI18n()
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [userCard, setUserCard] = useState(null)
  const [orders, setOrders] = useState([])

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem('user')||'null')
    if(!u) {
      navigate('/login')
      return
    }
    setUser(u)
    setUserCard(u.loyaltyCard)

    const syncCard = async () => {
      try {
        const res = await axios.get(`/api/users/${u.phone}/loyalty`)
        const card = res.data
        setUserCard(card)
        const updated = { ...u, loyaltyCard: card }
        localStorage.setItem('user', JSON.stringify(updated))
        setUser(updated)
        window.dispatchEvent(new Event('user-updated'))
      } catch (e) {
        console.error(e)
      }
    }
    
    const getOrders = async () => {
      try{
        const res = await axios.get(`/api/orders?phone=${u.phone}`)
        setOrders(res.data.orders || [])
      }catch(e){
        console.error(e)
      }
    }
    syncCard()
    getOrders()
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem('user')
    navigate('/')
  }

  if(!user) return <div className="container"><p>Loading...</p></div>

  return (
    <motion.div 
      className="container"
      initial={{opacity:0}}
      animate={{opacity:1}}
    >
      <div className="profile-header">
        <motion.div 
          className="avatar-btn"
          whileHover={{scale:1.1}}
        >
          {user.name?.charAt(0).toUpperCase()}
        </motion.div>
        <div>
          <h1>{user.name}</h1>
          <p>{user.phone}</p>
        </div>
      </div>

      <motion.div
        initial={{y:20, opacity:0}}
        animate={{y:0, opacity:1}}
        transition={{delay:0.1}}
      >
        <h2 style={{marginTop:'2rem', marginBottom:'1rem'}}>{t('profile.loyaltyCard')}</h2>
        <LoyaltyCard card={userCard} user={user} />
      </motion.div>

      <motion.div
        initial={{y:20, opacity:0}}
        animate={{y:0, opacity:1}}
        transition={{delay:0.2}}
      >
        <h2 style={{marginTop:'2rem', marginBottom:'1rem'}}>{t('order.history')}</h2>
        {orders.length === 0 ? (
          <p>{t('order.noOrders')}</p>
        ) : (
          <div className="orders-list">
            {orders.map(order => (
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <span className="order-id">#{order.id}</span>
                  <span className={`order-status status-${order.status}`}>
                    {t(`order.status.${order.status}`)}
                  </span>
                </div>
                <div className="order-info">
                  <p><strong>{t('order.total')}:</strong> {order.total} {t('common.currency')}</p>
                  {order.discount_applied > 0 && (
                    <p className="discount-line">
                      <strong>💎 {t('profile.discount')}:</strong> -{order.discount_applied} {t('common.currency')}
                    </p>
                  )}
                  <p><strong>{t('order.finalTotal')}:</strong> {order.final_total || order.total} {t('common.currency')}</p>
                  {order.pickup_time && (
                    <p><strong>{t('cart.pickupTime')}:</strong> {order.pickup_time}</p>
                  )}
                  {order.comment && (
                    <p><strong>{t('cart.comment')}:</strong> {order.comment}</p>
                  )}
                  <p style={{fontSize:'0.85rem', color:'#999'}}>
                    {new Date(order.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      <motion.button 
        className="btn-logout"
        onClick={handleLogout}
        whileHover={{scale:1.05}}
        whileTap={{scale:0.95}}
        style={{marginTop:'2rem'}}
      >
        {t('profile.logout')}
      </motion.button>
    </motion.div>
  )
}
