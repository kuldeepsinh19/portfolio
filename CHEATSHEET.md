# React + Node + Express + TypeScript — Interview Cheatsheet

> One-page reference. Memorize the order. Build bottom-up.

---

## 0. Mental Model (think before typing)

```
DB schema  →  Backend (types → db → controller → routes → app → server)  →  Frontend (api → components → App)
```

Build **left to right**. Test **each layer** before moving on.

---

## 1. Plan in 60 seconds

1. **Data shape** — what columns?
2. **Endpoints** — `GET / POST / PUT / DELETE` paths
3. **UI** — what does the user click?

---

## 2. Backend Setup (run order — never deviate)

```bash
mkdir myapp && cd myapp
mkdir backend && cd backend
npm init -y
npm install express cors dotenv mysql2          # or: pg
npm install -D typescript ts-node nodemon @types/express @types/node @types/cors
npx tsc --init
```

### `tsconfig.json` — replace with:
```json
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
```

### `package.json` scripts:
```json
"scripts": {
  "dev": "nodemon --exec ts-node src/server.ts",
  "build": "tsc",
  "start": "node dist/server.js"
}
```

### `.env`:
```
PORT=3000
DATABASE_URL=mysql://root:password@localhost:3306/myapp_db
```

### Folder structure:
```
backend/src/
├── types/         ← interfaces (no imports)
├── db/index.ts    ← connection pool
├── controllers/   ← business logic
├── routes/        ← URL → controller map
├── app.ts         ← express config + middleware
└── server.ts      ← app.listen()
```

---

## 3. Backend Code Templates

### `src/db/index.ts` (MySQL)
```typescript
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const pool = mysql.createPool(process.env.DATABASE_URL as string);
export default pool;
```

### `src/types/<name>.types.ts`
```typescript
export interface Item { id: number; title: string; }
export interface CreateItemBody { title: string; }
```

### Controller pattern (every function looks like this)
```typescript
import { Request, Response } from 'express';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import pool from '../db';

export const getAll = async (_req: Request, res: Response): Promise<void> => {
  try {
    const [rows] = await pool.execute<RowDataPacket[]>('SELECT * FROM items');
    res.json(rows);
  } catch {
    res.status(500).json({ error: 'Failed' });
  }
};
```

### `src/routes/<name>.routes.ts`
```typescript
import { Router } from 'express';
import { getAll, create, update, remove } from '../controllers/item.controller';

const router = Router();
router.get('/', getAll);
router.post('/', create);
router.put('/:id', update);
router.delete('/:id', remove);
export default router;
```

### `src/app.ts` (middleware order MATTERS)
```typescript
import express, { Application } from 'express';
import cors from 'cors';
import itemRoutes from './routes/item.routes';

const app: Application = express();
app.use(express.json());                                 // 1st
app.use(cors({ origin: 'http://localhost:5173' }));      // 2nd
app.use('/api/items', itemRoutes);                       // 3rd
export default app;
```

### `src/server.ts`
```typescript
import app from './app';
import dotenv from 'dotenv';
dotenv.config();
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
```

---

## 4. Frontend Setup

```bash
cd ..
npm create vite@latest frontend -- --template react-ts
cd frontend
npm install
npm install axios
```

### Folder structure:
```
frontend/src/
├── api/<name>.ts       ← all axios calls
├── components/         ← .tsx files
└── App.tsx             ← state + layout
```

### `src/api/items.ts`
```typescript
import axios from 'axios';
const API = axios.create({ baseURL: 'http://localhost:3000/api' });

export interface Item { id: number; title: string; }
export const fetchItems = (): Promise<Item[]> =>
  API.get<Item[]>('/items').then(r => r.data);
export const createItem = (title: string) =>
  API.post<Item>('/items', { title }).then(r => r.data);
```

### `App.tsx` skeleton
```tsx
import { useState, useEffect } from 'react';
import { fetchItems, Item } from './api/items';

function App() {
  const [items, setItems] = useState<Item[]>([]);
  useEffect(() => { fetchItems().then(setItems); }, []);
  return <div>{items.map(i => <p key={i.id}>{i.title}</p>)}</div>;
}
export default App;
```

---

## 5. SQL — MySQL vs PostgreSQL Cheatsheet

| Feature | MySQL | PostgreSQL |
|---------|-------|------------|
| Auto-increment | `INT AUTO_INCREMENT` | `SERIAL` |
| Placeholders | `?` | `$1, $2, $3` |
| Return inserted row | re-SELECT after `insertId` | `RETURNING *` |
| Driver | `mysql2/promise` | `pg` |
| Method | `pool.execute()` | `pool.query()` |
| Result | `[rows]` (destructure) | `result.rows` |

### MySQL table:
```sql
CREATE TABLE items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### PostgreSQL table:
```sql
CREATE TABLE items (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 6. HTTP Status Codes

| Code | Use |
|------|-----|
| 200 | OK (GET, PUT) |
| 201 | Created (POST) |
| 204 | No Content (DELETE) |
| 400 | Bad input |
| 404 | Not found |
| 500 | Server error |

---

## 7. React State Rules (never mutate)

```typescript
setItems(prev => [newItem, ...prev]);                              // add
setItems(prev => prev.filter(i => i.id !== id));                   // delete
setItems(prev => prev.map(i => i.id === id ? updated : i));        // update
```

---

## 8. Test as You Build

```bash
curl http://localhost:3000/health
curl http://localhost:3000/api/items
curl -X POST http://localhost:3000/api/items \
  -H "Content-Type: application/json" \
  -d '{"title":"test"}'
```

---

## 9. Path Imports — Never Get Confused

```
./x      → same folder
../x     → up one folder
'pkg'    → node_modules
```

---

## 10. Run Both Servers

```bash
# Terminal 1
cd backend && npm run dev

# Terminal 2
cd frontend && npm run dev
```

Open `http://localhost:5173`.

---

## 11. Pre-Submit Checklist

```
□ .env in .gitignore
□ Parameterized queries (no string concat)
□ try/catch in every async controller
□ express.json() before routes
□ cors origin matches frontend port
□ React state updates return NEW arrays
□ Loading + error states in UI
□ HTTP status codes correct (201/204/400/404)
```
