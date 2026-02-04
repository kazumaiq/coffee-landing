const express = require('express')
module.exports = function(db){
  const router = express.Router()

  router.post('/login', (req,res)=>{
    const { phone, name } = req.body
    if(!phone) return res.status(400).send('phone required')
    const existing = db.prepare('SELECT * FROM users WHERE phone=?').get(phone)
    if(existing) {
      const card = db.prepare('SELECT * FROM loyalty_cards WHERE user_id=?').get(existing.id)
      return res.json({ ...existing, loyaltyCard: card })
    }
    const info = db.prepare('INSERT INTO users (name, phone, avatar) VALUES (?,?,?)').run(name||'', phone, null)
    const user = db.prepare('SELECT * FROM users WHERE id=?').get(info.lastInsertRowid)
    const card = db.prepare('SELECT * FROM loyalty_cards WHERE user_id=?').get(info.lastInsertRowid)
    res.json({ ...user, loyaltyCard: card })
  })

  router.get('/:phone/orders', (req,res)=>{
    const phone = req.params.phone
    const orders = db.prepare('SELECT * FROM orders WHERE phone=? ORDER BY id DESC').all(phone)
    for(const o of orders) o.items = db.prepare('SELECT * FROM order_items WHERE order_id=?').all(o.id)
    res.json(orders)
  })

  router.get('/:phone/loyalty', (req,res)=>{
    const phone = req.params.phone
    const user = db.prepare('SELECT * FROM users WHERE phone=?').get(phone)
    if(!user) return res.json(null)
    const card = db.prepare('SELECT * FROM loyalty_cards WHERE user_id=?').get(user.id)
    res.json(card)
  })

  // Admin: get all users with their loyalty cards
  router.get('/admin/users', (req,res)=>{
    if(req.headers['x-admin']!=='1') return res.status(403).send('forbidden')
    const users = db.prepare('SELECT * FROM users ORDER BY id DESC').all()
    for(const u of users) {
      u.loyaltyCard = db.prepare('SELECT * FROM loyalty_cards WHERE user_id=?').get(u.id)
    }
    res.json({ users })
  })

  // Admin: give/revoke loyalty card
  router.patch('/admin/users/:id/loyalty', (req,res)=>{
    if(req.headers['x-admin']!=='1') return res.status(403).send('forbidden')
    const { action } = req.body
    const userId = req.params.id
    
    if(action === 'give') {
      const existing = db.prepare('SELECT * FROM loyalty_cards WHERE user_id=?').get(userId)
      if(!existing) {
        db.prepare('INSERT INTO loyalty_cards (user_id, status, discount_percent, activated_at) VALUES (?,?,?,?)').run(
          userId, 'active', 10, new Date().toISOString()
        )
      } else {
        db.prepare('UPDATE loyalty_cards SET status=?, activated_at=? WHERE user_id=?').run(
          'active', new Date().toISOString(), userId
        )
      }
    } else if(action === 'revoke') {
      db.prepare('UPDATE loyalty_cards SET status=? WHERE user_id=?').run('inactive', userId)
    }
    
    const user = db.prepare('SELECT * FROM users WHERE id=?').get(userId)
    const card = db.prepare('SELECT * FROM loyalty_cards WHERE user_id=?').get(userId)
    res.json({ user, card })
  })

  return router
}
