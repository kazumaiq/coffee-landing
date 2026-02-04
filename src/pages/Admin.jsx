import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import axios from 'axios'
import { useI18n } from '../i18n'

export default function Admin(){
  const { t } = useI18n()
  const [auth, setAuth] = useState(false)
  const [orders, setOrders] = useState([])
  const [users, setUsers] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(false)

  const load = async () => {
    try {
      const oRes = await axios.get('/api/orders', { headers: { 'x-admin': '1' } })
      setOrders(oRes.data)
      
      const uRes = await axios.get('/api/users/admin/users', { headers: { 'x-admin': '1' } })
      setUsers(uRes.data.users || [])
      
      const sRes = await axios.get('/api/orders/stats', { headers: { 'x-admin': '1' } })
      setStats(sRes.data)
    } catch(e) {
      console.error(e)
    }
  }

  useEffect(() => { if(auth) load() }, [auth])

  const login = (e) => {
    e.preventDefault()
    const f = new FormData(e.target)
    const u = f.get('user'), p = f.get('pass')
    if(u==='admin' && p==='admin') setAuth(true)
    else alert('invalid')
  }

  const markCompleted = async (id) => {
    try {
      await axios.put(`/api/orders/${id}/status`, { status: 'completed' }, { headers: { 'x-admin':'1' } })
      load()
    } catch(e) {
      console.error(e)
    }
  }

  const giveCard = async (userId) => {
    if(!confirm(t('admin.confirmCard'))) return
    setLoading(true)
    try {
      await axios.patch(`/api/users/admin/users/${userId}/loyalty`, { action: 'give' }, { headers: { 'x-admin': '1' } })
      load()
    } catch(e) {
      alert('Error: ' + e.message)
    } finally {
      setLoading(false)
    }
  }

  const revokeCard = async (userId) => {
    if(!confirm(t('admin.confirmRevoke'))) return
    setLoading(true)
    try {
      await axios.patch(`/api/users/admin/users/${userId}/loyalty`, { action: 'revoke' }, { headers: { 'x-admin': '1' } })
      load()
    } catch(e) {
      alert('Error: ' + e.message)
    } finally {
      setLoading(false)
    }
  }

  if(!auth) return (
    <div className="container" style={{maxWidth:'400px', margin:'4rem auto'}}>
      <motion.div
        initial={{opacity:0, y:20}}
        animate={{opacity:1, y:0}}
      >
        <h2>{t('admin.title')}</h2>
        <form onSubmit={login} className="form" style={{marginTop:'2rem'}}>
          <input name="user" defaultValue="admin" placeholder="Username" required />
          <input name="pass" type="password" defaultValue="admin" placeholder="Password" required />
          <motion.button 
            className="btn-primary" 
            whileHover={{scale:1.05}}
            whileTap={{scale:0.95}}
          >
            {t('common.login')}
          </motion.button>
        </form>
      </motion.div>
    </div>
  )

  return (
    <motion.div 
      className="admin-panel container"
      initial={{opacity:0}}
      animate={{opacity:1}}
    >
      <h2>{t('admin.title')}</h2>
      
      <motion.div 
        className="stats-grid"
        initial={{y:20, opacity:0}}
        animate={{y:0, opacity:1}}
        transition={{delay:0.1}}
      >
        <h3>{t('admin.stats')}</h3>
        <div className="stat-item">
          <span className="stat-label">{t('admin.totalOrders')}:</span>
          <span className="stat-value">{stats?.totalOrders}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">{t('admin.ordersToday')}:</span>
          <span className="stat-value">{stats?.ordersToday}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">{t('admin.totalRevenue')}:</span>
          <span className="stat-value">{stats?.totalRevenue} {t('common.currency')}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">{t('admin.revenueToday')}:</span>
          <span className="stat-value">{stats?.revenueToday} {t('common.currency')}</span>
        </div>
      </motion.div>

      <motion.section
        initial={{y:20, opacity:0}}
        animate={{y:0, opacity:1}}
        transition={{delay:0.2}}
      >
        <h3 style={{marginTop:'3rem'}}>{t('admin.users')}</h3>
        <div className="users-list">
          {users.map((user, i) => (
            <motion.div 
              key={user.id} 
              className="user-card"
              initial={{opacity:0, x:-20}}
              animate={{opacity:1, x:0}}
              transition={{delay:0.1*i}}
            >
              <div className="user-info">
                <div className="user-name">{user.name}</div>
                <div className="user-phone">{user.phone}</div>
              </div>
              <div className="user-card-status">
                {user.loyaltyCard?.status === 'active' ? (
                  <span className="badge-active">💎 {t('admin.cardActive')}</span>
                ) : (
                  <span className="badge-inactive">✗ {t('admin.cardInactive')}</span>
                )}
              </div>
              <div className="user-actions">
                {user.loyaltyCard?.status !== 'active' ? (
                  <motion.button 
                    className="btn-small btn-success"
                    onClick={() => giveCard(user.id)}
                    disabled={loading}
                    whileHover={{scale:1.05}}
                    whileTap={{scale:0.95}}
                  >
                    {t('admin.giveCard')}
                  </motion.button>
                ) : (
                  <motion.button 
                    className="btn-small btn-danger"
                    onClick={() => revokeCard(user.id)}
                    disabled={loading}
                    whileHover={{scale:1.05}}
                    whileTap={{scale:0.95}}
                  >
                    {t('admin.revokeCard')}
                  </motion.button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      <motion.section
        initial={{y:20, opacity:0}}
        animate={{y:0, opacity:1}}
        transition={{delay:0.3}}
      >
        <h3 style={{marginTop:'3rem'}}>{t('admin.orders')}</h3>
        <div className="orders-list">
          {orders.map((o, i) => (
            <motion.div 
              key={o.id} 
              className="order-card admin-order"
              initial={{opacity:0, y:10}}
              animate={{opacity:1, y:0}}
              transition={{delay:0.05*i}}
            >
              <div className="order-header">
                <span className="order-id">#{o.id}</span>
                <span className={`order-status status-${o.status}`}>{t(`order.status.${o.status}`)}</span>
              </div>
              <div className="order-details">
                <p><strong>{o.customer_name}</strong> — {o.phone}</p>
                <p>{o.items?.length || 0} items — {o.total} {t('common.currency')}</p>
                {o.final_total && (
                  <p><strong>{t('order.finalTotal')}:</strong> {o.final_total} {t('common.currency')}</p>
                )}
                {o.discount_applied > 0 && (
                  <p className="discount-line">💎 {t('profile.discount')}: -{o.discount_applied} {t('common.currency')}</p>
                )}
                {o.pickup_time && (
                  <p><strong>{t('cart.pickupTime')}:</strong> {o.pickup_time}</p>
                )}
                {o.comment && (
                  <p><strong>{t('cart.comment')}:</strong> {o.comment}</p>
                )}
              </div>
              {o.status !== 'completed' && (
                <motion.button 
                  className="btn-small btn-success"
                  onClick={() => markCompleted(o.id)}
                  whileHover={{scale:1.05}}
                  whileTap={{scale:0.95}}
                >
                  {t('admin.markCompleted')}
                </motion.button>
              )}
            </motion.div>
          ))}
        </div>
      </motion.section>
    </motion.div>
  )
}
