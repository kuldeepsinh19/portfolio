#!/usr/bin/env bash
# ============================================================================
# setup.sh — Bootstrap React + Node + Express + TypeScript project (Linux/Mac)
# Usage:  ./setup.sh <project-name> [mysql|pg]
# Example: ./setup.sh myapp mysql
# ============================================================================

set -e  # exit on any error

PROJECT="${1:-myapp}"
DB="${2:-mysql}"   # mysql (default) or pg

if [ -d "$PROJECT" ]; then
  echo "❌ Folder '$PROJECT' already exists. Aborting."
  exit 1
fi

echo "🚀 Creating project: $PROJECT  (DB: $DB)"
mkdir -p "$PROJECT" && cd "$PROJECT"

# ─── BACKEND ────────────────────────────────────────────────────────────────
echo "📦 Setting up backend..."
mkdir backend && cd backend
npm init -y > /dev/null

if [ "$DB" = "pg" ]; then
  npm install express cors dotenv pg
  npm install -D typescript ts-node nodemon @types/express @types/node @types/cors @types/pg
  DB_DRIVER="pg"
  DB_URL="postgresql://postgres:password@localhost:5432/${PROJECT}_db"
else
  npm install express cors dotenv mysql2
  npm install -D typescript ts-node nodemon @types/express @types/node @types/cors
  DB_DRIVER="mysql2"
  DB_URL="mysql://root:password@localhost:3306/${PROJECT}_db"
fi

# tsconfig.json
cat > tsconfig.json <<'EOF'
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "rootDir": "./src",
    "outDir": "./dist",
    "strict": true,
    "esModuleInterop": true,
    "resolveJsonModule": true
  }
}
EOF

# package.json scripts
node -e "
const fs = require('fs');
const pkg = JSON.parse(fs.readFileSync('package.json'));
pkg.scripts = {
  dev: 'nodemon --exec ts-node src/server.ts',
  build: 'tsc',
  start: 'node dist/server.js'
};
fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
"

# folder structure
mkdir -p src/db src/routes src/controllers src/types

# .env
cat > .env <<EOF
PORT=3000
DATABASE_URL=$DB_URL
EOF

# .gitignore
cat > .gitignore <<'EOF'
node_modules
dist
.env
EOF

# db/index.ts
if [ "$DB" = "pg" ]; then
cat > src/db/index.ts <<'EOF'
import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

pool.connect((err, _c, release) => {
  if (err) console.error('DB failed:', err.message);
  else { console.log('PostgreSQL connected'); release(); }
});

export default pool;
EOF
else
cat > src/db/index.ts <<'EOF'
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const pool = mysql.createPool(process.env.DATABASE_URL as string);

pool.getConnection()
  .then(c => { console.log('MySQL connected'); c.release(); })
  .catch((err: Error) => console.error('DB failed:', err.message));

export default pool;
EOF
fi

# types
cat > src/types/item.types.ts <<'EOF'
export interface Item {
  id: number;
  title: string;
  created_at: Date;
}
export interface CreateItemBody { title: string; }
export interface UpdateItemBody { title?: string; }
EOF

# controller
if [ "$DB" = "pg" ]; then
cat > src/controllers/item.controller.ts <<'EOF'
import { Request, Response } from 'express';
import pool from '../db';
import { CreateItemBody } from '../types/item.types';

export const getAll = async (_req: Request, res: Response): Promise<void> => {
  try {
    const r = await pool.query('SELECT * FROM items ORDER BY created_at DESC');
    res.json(r.rows);
  } catch { res.status(500).json({ error: 'Failed' }); }
};

export const create = async (req: Request<{}, {}, CreateItemBody>, res: Response): Promise<void> => {
  const { title } = req.body;
  if (!title?.trim()) { res.status(400).json({ error: 'Title required' }); return; }
  try {
    const r = await pool.query('INSERT INTO items (title) VALUES ($1) RETURNING *', [title.trim()]);
    res.status(201).json(r.rows[0]);
  } catch { res.status(500).json({ error: 'Failed' }); }
};

export const remove = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  try {
    const r = await pool.query('DELETE FROM items WHERE id = $1 RETURNING *', [req.params.id]);
    if (r.rows.length === 0) { res.status(404).json({ error: 'Not found' }); return; }
    res.status(204).send();
  } catch { res.status(500).json({ error: 'Failed' }); }
};
EOF
else
cat > src/controllers/item.controller.ts <<'EOF'
import { Request, Response } from 'express';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import pool from '../db';
import { CreateItemBody } from '../types/item.types';

export const getAll = async (_req: Request, res: Response): Promise<void> => {
  try {
    const [rows] = await pool.execute<RowDataPacket[]>('SELECT * FROM items ORDER BY created_at DESC');
    res.json(rows);
  } catch { res.status(500).json({ error: 'Failed' }); }
};

export const create = async (req: Request<{}, {}, CreateItemBody>, res: Response): Promise<void> => {
  const { title } = req.body;
  if (!title?.trim()) { res.status(400).json({ error: 'Title required' }); return; }
  try {
    const [r] = await pool.execute<ResultSetHeader>('INSERT INTO items (title) VALUES (?)', [title.trim()]);
    const [rows] = await pool.execute<RowDataPacket[]>('SELECT * FROM items WHERE id = ?', [r.insertId]);
    res.status(201).json(rows[0]);
  } catch { res.status(500).json({ error: 'Failed' }); }
};

export const remove = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  try {
    const [r] = await pool.execute<ResultSetHeader>('DELETE FROM items WHERE id = ?', [req.params.id]);
    if (r.affectedRows === 0) { res.status(404).json({ error: 'Not found' }); return; }
    res.status(204).send();
  } catch { res.status(500).json({ error: 'Failed' }); }
};
EOF
fi

# routes
cat > src/routes/item.routes.ts <<'EOF'
import { Router } from 'express';
import { getAll, create, remove } from '../controllers/item.controller';

const router = Router();
router.get('/', getAll);
router.post('/', create);
router.delete('/:id', remove);
export default router;
EOF

# app.ts
cat > src/app.ts <<'EOF'
import express, { Application } from 'express';
import cors from 'cors';
import itemRoutes from './routes/item.routes';

const app: Application = express();
app.use(express.json());
app.use(cors({ origin: 'http://localhost:5173' }));
app.use('/api/items', itemRoutes);
app.get('/health', (_req, res) => res.json({ status: 'ok' }));
export default app;
EOF

# server.ts
cat > src/server.ts <<'EOF'
import app from './app';
import dotenv from 'dotenv';
dotenv.config();
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server: http://localhost:${PORT}`));
EOF

cd ..

# ─── FRONTEND ───────────────────────────────────────────────────────────────
echo "📦 Setting up frontend..."
npm create vite@latest frontend -- --template react-ts
cd frontend
npm install
npm install axios

mkdir -p src/api src/components

cat > src/api/items.ts <<'EOF'
import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:3000/api' });

export interface Item { id: number; title: string; }

export const fetchItems = (): Promise<Item[]> =>
  API.get<Item[]>('/items').then(r => r.data);

export const createItem = (title: string): Promise<Item> =>
  API.post<Item>('/items', { title }).then(r => r.data);

export const deleteItem = (id: number): Promise<void> =>
  API.delete(`/items/${id}`).then(() => undefined);
EOF

cat > src/App.tsx <<'EOF'
import { useState, useEffect } from 'react';
import { fetchItems, createItem, deleteItem, Item } from './api/items';

function App() {
  const [items, setItems] = useState<Item[]>([]);
  const [title, setTitle] = useState('');

  useEffect(() => { fetchItems().then(setItems).catch(console.error); }, []);

  const add = async () => {
    if (!title.trim()) return;
    const item = await createItem(title.trim());
    setItems(prev => [item, ...prev]);
    setTitle('');
  };

  const remove = async (id: number) => {
    await deleteItem(id);
    setItems(prev => prev.filter(i => i.id !== id));
  };

  return (
    <div style={{ maxWidth: 600, margin: '40px auto', fontFamily: 'sans-serif' }}>
      <h1>Items</h1>
      <input value={title} onChange={e => setTitle(e.target.value)} placeholder="New item" />
      <button onClick={add}>Add</button>
      <ul>{items.map(i => (
        <li key={i.id}>{i.title} <button onClick={() => remove(i.id)}>x</button></li>
      ))}</ul>
    </div>
  );
}
export default App;
EOF

cd ..

# ─── DONE ───────────────────────────────────────────────────────────────────
echo ""
echo "✅ Done! Project '$PROJECT' is ready."
echo ""
echo "Next steps:"
echo "  1. Create the database '${PROJECT}_db' and an 'items' table:"
if [ "$DB" = "pg" ]; then
  echo "     CREATE TABLE items (id SERIAL PRIMARY KEY, title VARCHAR(255), created_at TIMESTAMP DEFAULT NOW());"
else
  echo "     CREATE TABLE items (id INT AUTO_INCREMENT PRIMARY KEY, title VARCHAR(255), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);"
fi
echo "  2. Update password in $PROJECT/backend/.env"
echo "  3. Start backend:   cd $PROJECT/backend  && npm run dev"
echo "  4. Start frontend:  cd $PROJECT/frontend && npm run dev"
echo "  5. Open http://localhost:5173"
    