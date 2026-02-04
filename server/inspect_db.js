const path = require('path')
const Database = require('better-sqlite3')

const db = new Database(path.join(__dirname, 'database.db'))

const orders = db.prepare('SELECT * FROM orders ORDER BY id DESC').all()
for(const o of orders){
  o.items = db.prepare('SELECT * FROM order_items WHERE order_id=?').all(o.id)
}

console.log(JSON.stringify({ orders }, null, 2))
