const express = require('express')

module.exports = function(db){
  const router = express.Router()

  router.post('/', (req,res)=>{
    try {
      const { customer_name, phone, items, total, guest, pickup_time, comment } = req.body
      if(!phone) return res.status(400).json({ error: 'phone required' })
      if(!Array.isArray(items) || items.length === 0) return res.status(400).json({ error: 'items required' })

      const now = new Date().toISOString()
      
      // Check for loyalty card discount
      let discountApplied = 0
      let finalTotal = total
      const user = db.prepare('SELECT * FROM users WHERE phone=?').get(phone)
      if(user){
        const card = db.prepare('SELECT * FROM loyalty_cards WHERE user_id=? AND status=?').get(user.id, 'active')
        if(card){
          discountApplied = Math.round(total * card.discount_percent / 100)
          finalTotal = total - discountApplied
        }
      }
      
      const insert = db.prepare(
        'INSERT INTO orders (customer_name, phone, total, discount_applied, final_total, guest, status, created_at, pickup_time, comment) VALUES (?,?,?,?,?,?,?,?,?,?)'
      )
      const info = insert.run(
        customer_name, 
        phone, 
        total, 
        discountApplied, 
        finalTotal, 
        guest?1:0, 
        'new', 
        now,
        pickup_time || null,
        comment || null
      )
      const orderId = info.lastInsertRowid

      const insertItem = db.prepare('INSERT INTO order_items (order_id,item_id,name,size,price) VALUES (?,?,?,?,?)')
      const stmt = db.transaction((its)=>{
        for(const it of its){
          insertItem.run(orderId, it.id, it.name_en || it.name_ru || it.id, it.size, it.price)
        }
      })
      stmt(items)
      
      const order = db.prepare('SELECT * FROM orders WHERE id=?').get(orderId)
      res.json({ order, discountApplied, finalTotal })
    } catch (e) {
      console.error(e)
      res.status(500).json({ error: e.message })
    }
  })

  // admin list OR user orders
  router.get('/', (req,res)=>{
    try {
      const phone = req.query.phone
      if(phone){
        const orders = db.prepare('SELECT * FROM orders WHERE phone=? ORDER BY id DESC').all(phone)
        for(const o of orders){
          o.items = db.prepare('SELECT * FROM order_items WHERE order_id=?').all(o.id)
        }
        return res.json({ orders })
      }
      
      if(req.headers['x-admin']!=='1') return res.status(403).send('forbidden')
      const orders = db.prepare('SELECT * FROM orders ORDER BY id DESC').all()
      for(const o of orders){
        o.items = db.prepare('SELECT * FROM order_items WHERE order_id=?').all(o.id)
      }
      res.json(orders)
    } catch (e) {
      console.error(e)
      res.status(500).json({ error: e.message })
    }
  })

  router.put('/:id/status', (req,res)=>{
    if(req.headers['x-admin']!=='1') return res.status(403).send('forbidden')
    const { status } = req.body
    db.prepare('UPDATE orders SET status=? WHERE id=?').run(status, req.params.id)
    res.json({ ok:true })
  })

  router.get('/stats', (req,res)=>{
    if(req.headers['x-admin']!=='1') return res.status(403).send('forbidden')
    const { start, end } = req.query
    let where = ''
    const params = []
    if(start){ where += " AND date(created_at) >= date(?)"; params.push(start) }
    if(end){ where += " AND date(created_at) <= date(?)"; params.push(end) }

    const totalOrders = db.prepare('SELECT COUNT(*) as c FROM orders WHERE 1=1 ' + where).get(...params).c
    const totalRevenue = db.prepare('SELECT SUM(final_total) as s FROM orders WHERE 1=1 ' + where).get(...params).s || 0
    const today = new Date().toISOString().slice(0,10)
    const ordersToday = db.prepare("SELECT COUNT(*) as c FROM orders WHERE substr(created_at,1,10)=?").get(today).c
    const revenueToday = db.prepare("SELECT SUM(final_total) as s FROM orders WHERE substr(created_at,1,10)=?").get(today).s || 0

    const popular = db.prepare(
      'SELECT name, COUNT(*) as cnt FROM order_items JOIN orders ON order_items.order_id = orders.id WHERE 1=1 ' + where + ' GROUP BY name ORDER BY cnt DESC LIMIT 10'
    ).all(...params)

    res.json({ totalOrders, totalRevenue, ordersToday, revenueToday, popular })
  })

  router.get('/user/:phone', (req,res)=>{
    const phone = req.params.phone
    const orders = db.prepare('SELECT * FROM orders WHERE phone=? ORDER BY id DESC').all(phone)
    for(const o of orders) o.items = db.prepare('SELECT * FROM order_items WHERE order_id=?').all(o.id)
    res.json(orders)
  })

  return router
}
