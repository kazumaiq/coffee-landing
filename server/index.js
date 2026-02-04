const express = require('express')
const cors = require('cors')
const path = require('path')
const fs = require('fs')
const Database = require('better-sqlite3')

const app = express()
app.use(cors())
app.use(express.json())

const DB_PATH = path.join(__dirname, 'database.db')
const db = new Database(DB_PATH)

// init
db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  phone TEXT UNIQUE,
  avatar TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS loyalty_cards (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER UNIQUE,
  status TEXT DEFAULT 'inactive',
  discount_percent INTEGER DEFAULT 10,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  activated_at TEXT,
  FOREIGN KEY(user_id) REFERENCES users(id)
);
CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  customer_name TEXT,
  phone TEXT,
  total INTEGER,
  discount_applied INTEGER DEFAULT 0,
  final_total INTEGER,
  guest INTEGER DEFAULT 1,
  status TEXT DEFAULT 'new',
  created_at TEXT,
  pickup_time TEXT,
  comment TEXT
);
CREATE TABLE IF NOT EXISTS order_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id INTEGER,
  item_id TEXT,
  name TEXT,
  size TEXT,
  price INTEGER
);
`)

// simple migrations for existing DBs
try{
  const userCols = db.prepare("PRAGMA table_info('users')").all()
  const hasAvatar = userCols.some(c=>c.name==='avatar')
  if(!hasAvatar){
    db.prepare('ALTER TABLE users ADD COLUMN avatar TEXT').run()
    console.log('Migration: added users.avatar')
  }

  const orderCols = db.prepare("PRAGMA table_info('orders')").all()
  const orderColNames = new Set(orderCols.map(c => c.name))
  const addOrderColumn = (name, ddl) => {
    if(!orderColNames.has(name)){
      db.prepare(`ALTER TABLE orders ADD COLUMN ${ddl}`).run()
      console.log(`Migration: added orders.${name}`)
    }
  }

  addOrderColumn('discount_applied', 'discount_applied INTEGER DEFAULT 0')
  addOrderColumn('final_total', 'final_total INTEGER')
  addOrderColumn('guest', 'guest INTEGER DEFAULT 1')
  addOrderColumn('status', "status TEXT DEFAULT 'new'")
  addOrderColumn('created_at', 'created_at TEXT')
  addOrderColumn('pickup_time', 'pickup_time TEXT')
  addOrderColumn('comment', 'comment TEXT')

  // ensure existing null created_at rows get timestamp
  db.prepare("UPDATE orders SET created_at = CURRENT_TIMESTAMP WHERE created_at IS NULL").run()
  console.log('Migration: set created_at for existing orders')
}catch(e){
  console.warn('Migration check failed', e.message)
}

// routes
app.use('/api/orders', require('./routes/orders')(db))
app.use('/api/users', require('./routes/users')(db))

// serve public assets
app.use('/public', express.static(path.join(__dirname, '..', 'public')))

// in production serve built frontend
if (process.env.NODE_ENV === 'production'){
  const dist = path.join(__dirname, '..', 'dist')
  if (fs.existsSync(dist)){
    app.use(express.static(dist))
    app.get('*', (req,res)=>{
      res.sendFile(path.join(dist, 'index.html'))
    })
  }
}

function startServer(port){
  const server = app.listen(port, ()=> console.log('Server listening on', port))
  server.on('error', (err)=>{
    if(err.code === 'EADDRINUSE'){
      console.warn(`Port ${port} in use, trying ${port+1}`)
      startServer(port+1)
    } else {
      console.error(err)
      process.exit(1)
    }
  })
}

const initialPort = process.env.PORT ? parseInt(process.env.PORT,10) : 4000
startServer(initialPort)
