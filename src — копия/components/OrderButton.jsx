import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useI18n } from '../i18n'
import axios from 'axios'

export default function OrderButton({ items, user, userCard, onPlaced }){
  const { t, lang } = useI18n()
  const [modal, setModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState(user?.name || '')
  const [phone, setPhone] = useState(user?.phone || '')
  const [pickupTime, setPickupTime] = useState('')
  const [comment, setComment] = useState('')

  const total = items.reduce((s,i)=>s+((i.price||0) * (i.qty||1)),0)
  const discount = userCard?.status==='active' ? userCard.discount_percent : 0
  const discountAmount = discount ? Math.round(total*discount/100) : 0
  const finalTotal = total - discountAmount

  const place = async () => {
    if(!phone) return alert(t('cart.enterPhone') || 'Enter phone')
    setLoading(true)
    try{
      const payload = {
        customer_name: name || 'Guest',
        phone,
        items: items.map(it=>({...it, qty: it.qty||1})),
        total,
        pickup_time: pickupTime,
        comment,
        guest: !user
      }
      const res = await axios.post('/api/orders', payload)
      setModal(false)
      onPlaced && onPlaced(res.data)
      alert(t('order.success')+': '+(res.data.order?.id || '—'))
    }catch(e){
      console.error(e)
      const errorText = e.response?.data?.error || e.response?.data || e.message
      alert('Error: '+ errorText)
    }finally{
      setLoading(false)
    }
  }

  if(items.length===0) return null

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: {duration: 0.3} }
  }

  const getItemName = (it) => {
    if(lang === 'ru') return it.name_ru || it.name_en || it.name || it.id
    return it.name_en || it.name_ru || it.name || it.id
  }

  return (
    <>
      <motion.button 
        className="order-button"
        onClick={()=>setModal(true)}
        whileHover={{scale:1.05}}
        whileTap={{scale:0.95}}
        initial={{opacity:0, y:100}}
        animate={{opacity:1, y:0}}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <span className="badge">{items.length}</span>
        {t('order.placeOrder')}
      </motion.button>

      <AnimatePresence>
        {modal && (
          <motion.div 
            className="modal-overlay"
            initial={{opacity:0}}
            animate={{opacity:1}}
            exit={{opacity:0}}
            onClick={()=>setModal(false)}
          >
            <motion.div 
              className="modal"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              onClick={e=>e.stopPropagation()}
            >
              <h2>{t('order.confirm')}</h2>
              
              <div className="order-summary">
                {items.map((it, i)=>(
                  <div key={i} className="summary-item">
                    <span>{getItemName(it)} ({it.size||'std'})</span>
                    <span>{it.price * (it.qty||1)} {t('common.currency')}</span>
                  </div>
                ))}
              </div>
              
              <div className="modal-row">
                <input placeholder={t('cart.name')} value={name} onChange={e=>setName(e.target.value)} />
                <input placeholder={t('cart.phone')} value={phone} onChange={e=>setPhone(e.target.value)} type="tel" />
              </div>

              <div style={{marginTop:8}}>
                <label style={{color:'#6f7a73',fontSize:13}}>{t('cart.pickupTime')}</label>
                <input
                  value={pickupTime}
                  onChange={e=>setPickupTime(e.target.value)}
                  placeholder={t('cart.pickupTimePlaceholder')}
                />
              </div>

              <div style={{marginTop:8}}>
                <label style={{color:'#6f7a73',fontSize:13}}>{t('cart.comment')}</label>
                <textarea
                  rows={2}
                  value={comment}
                  onChange={e=>setComment(e.target.value)}
                  placeholder={t('cart.commentPlaceholder')}
                />
              </div>

              <div className="summary-total">
                <span>{t('order.total')}:</span>
                <span>{total} {t('common.currency')}</span>
              </div>

              {discount > 0 && (
                <div className="summary-discount">
                  <span>💎 {t('profile.discount')} ({discount}%):</span>
                  <span className="discount-value">-{discountAmount} {t('common.currency')}</span>
                </div>
              )}

              <div className="summary-final">
                <span>{t('order.finalTotal')}:</span>
                <span>{finalTotal} {t('common.currency')}</span>
              </div>

              <div className="modal-actions">
                <button className="btn-secondary" onClick={()=>setModal(false)}>
                  {t('common.cancel')}
                </button>
                <button 
                  className="btn-primary"
                  onClick={place}
                  disabled={loading}
                >
                  {loading ? t('common.loading')+'...' : t('order.confirm')}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
