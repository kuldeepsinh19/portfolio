@echo off
REM ============================================================================
REM setup.bat - Bootstrap React + Node + Express + TypeScript project (Windows)
REM Usage:  setup.bat <project-name> [mysql|pg]
REM Example: setup.bat myapp mysql
REM ============================================================================

setlocal enabledelayedexpansion

if "%~1"=="" (
  set PROJECT=myapp
) else (
  set PROJECT=%~1
)

if "%~2"=="" (
  set DB=mysql
) else (
  set DB=%~2
)

if exist "%PROJECT%" (
  echo Folder "%PROJECT%" already exists. Aborting.
  exit /b 1
)

echo Creating project: %PROJECT%  (DB: %DB%)
mkdir "%PROJECT%"
cd "%PROJECT%"

REM ─── BACKEND ────────────────────────────────────────────────────────────────
echo Setting up backend...
mkdir backend
cd backend
call npm init -y >nul

if "%DB%"=="pg" (
  call npm install express cors dotenv pg
  call npm install -D typescript ts-node nodemon @types/express @types/node @types/cors @types/pg
  set DB_URL=postgresql://postgres:password@localhost:5432/%PROJECT%_db
) else (
  call npm install express cors dotenv mysql2
  call npm install -D typescript ts-node nodemon @types/express @types/node @types/cors
  set DB_URL=mysql://root:password@localhost:3306/%PROJECT%_db
)

REM tsconfig.json
(
  echo {
  echo   "compilerOptions": {
  echo     "target": "ES2020",
  echo     "module": "commonjs",
  echo     "rootDir": "./src",
  echo     "outDir": "./dist",
  echo     "strict": true,
  echo     "esModuleInterop": true,
  echo     "resolveJsonModule": true
  echo   }
  echo }
) > tsconfig.json

REM update package.json scripts
node -e "const fs=require('fs');const p=JSON.parse(fs.readFileSync('package.json'));p.scripts={dev:'nodemon --exec ts-node src/server.ts',build:'tsc',start:'node dist/server.js'};fs.writeFileSync('package.json',JSON.stringify(p,null,2));"

REM folder structure
mkdir src
mkdir src\db
mkdir src\routes
mkdir src\controllers
mkdir src\types

REM .env
(
  echo PORT=3000
  echo DATABASE_URL=!DB_URL!
) > .env

REM .gitignore
(
  echo node_modules
  echo dist
  echo .env
) > .gitignore

REM db/index.ts
if "%DB%"=="pg" (
  (
    echo import { Pool } from 'pg';
    echo import dotenv from 'dotenv';
    echo dotenv.config(^);
    echo.
    echo const pool = new Pool({ connectionString: process.env.DATABASE_URL }^);
    echo.
    echo pool.connect((err, _c, release^) =^> {
    echo   if (err^) console.error('DB failed:', err.message^);
    echo   else { console.log('PostgreSQL connected'^); release(^); }
    echo }^);
    echo.
    echo export default pool;
  ) > src\db\index.ts
) else (
  (
    echo import mysql from 'mysql2/promise';
    echo import dotenv from 'dotenv';
    echo dotenv.config(^);
    echo.
    echo const pool = mysql.createPool(process.env.DATABASE_URL as string^);
    echo.
    echo pool.getConnection(^)
    echo   .then(c =^> { console.log('MySQL connected'^); c.release(^); }^)
    echo   .catch((err: Error^) =^> console.error('DB failed:', err.message^)^);
    echo.
    echo export default pool;
  ) > src\db\index.ts
)

REM types
(
  echo export interface Item {
  echo   id: number;
  echo   title: string;
  echo   created_at: Date;
  echo }
  echo export interface CreateItemBody { title: string; }
  echo export interface UpdateItemBody { title?: string; }
) > src\types\item.types.ts

REM controller
if "%DB%"=="pg" (
  (
    echo import { Request, Response } from 'express';
    echo import pool from '../db';
    echo import { CreateItemBody } from '../types/item.types';
    echo.
    echo export const getAll = async (_req: Request, res: Response^): Promise^<void^> =^> {
    echo   try {
    echo     const r = await pool.query('SELECT * FROM items ORDER BY created_at DESC'^);
    echo     res.json(r.rows^);
    echo   } catch { res.status(500^).json({ error: 'Failed' }^); }
    echo };
    echo.
    echo export const create = async (req: Request^<{}, {}, CreateItemBody^>, res: Response^): Promise^<void^> =^> {
    echo   const { title } = req.body;
    echo   if (!title?.trim(^)^) { res.status(400^).json({ error: 'Title required' }^); return; }
    echo   try {
    echo     const r = await pool.query('INSERT INTO items (title^) VALUES ($1^) RETURNING *', [title.trim(^)]^);
    echo     res.status(201^).json(r.rows[0]^);
    echo   } catch { res.status(500^).json({ error: 'Failed' }^); }
    echo };
    echo.
    echo export const remove = async (req: Request^<{ id: string }^>, res: Response^): Promise^<void^> =^> {
    echo   try {
    echo     const r = await pool.query('DELETE FROM items WHERE id = $1 RETURNING *', [req.params.id]^);
    echo     if (r.rows.length === 0^) { res.status(404^).json({ error: 'Not found' }^); return; }
    echo     res.status(204^).send(^);
    echo   } catch { res.status(500^).json({ error: 'Failed' }^); }
    echo };
  ) > src\controllers\item.controller.ts
) else (
  (
    echo import { Request, Response } from 'express';
    echo import { RowDataPacket, ResultSetHeader } from 'mysql2';
    echo import pool from '../db';
    echo import { CreateItemBody } from '../types/item.types';
    echo.
    echo export const getAll = async (_req: Request, res: Response^): Promise^<void^> =^> {
    echo   try {
    echo     const [rows] = await pool.execute^<RowDataPacket[]^>('SELECT * FROM items ORDER BY created_at DESC'^);
    echo     res.json(rows^);
    echo   } catch { res.status(500^).json({ error: 'Failed' }^); }
    echo };
    echo.
    echo export const create = async (req: Request^<{}, {}, CreateItemBody^>, res: Response^): Promise^<void^> =^> {
    echo   const { title } = req.body;
    echo   if (!title?.trim(^)^) { res.status(400^).json({ error: 'Title required' }^); return; }
    echo   try {
    echo     const [r] = await pool.execute^<ResultSetHeader^>('INSERT INTO items (title^) VALUES (?^)', [title.trim(^)]^);
    echo     const [rows] = await pool.execute^<RowDataPacket[]^>('SELECT * FROM items WHERE id = ?', [r.insertId]^);
    echo     res.status(201^).json(rows[0]^);
    echo   } catch { res.status(500^).json({ error: 'Failed' }^); }
    echo };
    echo.
    echo export const remove = async (req: Request^<{ id: string }^>, res: Response^): Promise^<void^> =^> {
    echo   try {
    echo     const [r] = await pool.execute^<ResultSetHeader^>('DELETE FROM items WHERE id = ?', [req.params.id]^);
    echo     if (r.affectedRows === 0^) { res.status(404^).json({ error: 'Not found' }^); return; }
    echo     res.status(204^).send(^);
    echo   } catch { res.status(500^).json({ error: 'Failed' }^); }
    echo };
  ) > src\controllers\item.controller.ts
)

REM routes
(
  echo import { Router } from 'express';
  echo import { getAll, create, remove } from '../controllers/item.controller';
  echo.
  echo const router = Router(^);
  echo router.get('/', getAll^);
  echo router.post('/', create^);
  echo router.delete('/:id', remove^);
  echo export default router;
) > src\routes\item.routes.ts

REM app.ts
(
  echo import express, { Application } from 'express';
  echo import cors from 'cors';
  echo import itemRoutes from './routes/item.routes';
  echo.
  echo const app: Application = express(^);
  echo app.use(express.json(^)^);
  echo app.use(cors({ origin: 'http://localhost:5173' }^)^);
  echo app.use('/api/items', itemRoutes^);
  echo app.get('/health', (_req, res^) =^> res.json({ status: 'ok' }^)^);
  echo export default app;
) > src\app.ts

REM server.ts
(
  echo import app from './app';
  echo import dotenv from 'dotenv';
  echo dotenv.config(^);
  echo const PORT = process.env.PORT ^|^| 3000;
  echo app.listen(PORT, (^) =^> console.log(`Server: http://localhost:${PORT}`^)^);
) > src\server.ts

cd ..

REM ─── FRONTEND ───────────────────────────────────────────────────────────────
echo Setting up frontend...
call npm create vite@latest frontend -- --template react-ts
cd frontend
call npm install
call npm install axios

mkdir src\api
mkdir src\components

(
  echo import axios from 'axios';
  echo.
  echo const API = axios.create({ baseURL: 'http://localhost:3000/api' }^);
  echo.
  echo export interface Item { id: number; title: string; }
  echo.
  echo export const fetchItems = (^): Promise^<Item[]^> =^>
  echo   API.get^<Item[]^>('/items'^).then(r =^> r.data^);
  echo.
  echo export const createItem = (title: string^): Promise^<Item^> =^>
  echo   API.post^<Item^>('/items', { title }^).then(r =^> r.data^);
  echo.
  echo export const deleteItem = (id: number^): Promise^<void^> =^>
  echo   API.delete(`/items/${id}`^).then((^) =^> undefined^);
) > src\api\items.ts

(
  echo import { useState, useEffect } from 'react';
  echo import { fetchItems, createItem, deleteItem, Item } from './api/items';
  echo.
  echo function App(^) {
  echo   const [items, setItems] = useState^<Item[]^>([]^);
  echo   const [title, setTitle] = useState(''^);
  echo.
  echo   useEffect((^) =^> { fetchItems(^).then(setItems^).catch(console.error^); }, []^);
  echo.
  echo   const add = async (^) =^> {
  echo     if (!title.trim(^)^) return;
  echo     const item = await createItem(title.trim(^)^);
  echo     setItems(prev =^> [item, ...prev]^);
  echo     setTitle(''^);
  echo   };
  echo.
  echo   const remove = async (id: number^) =^> {
  echo     await deleteItem(id^);
  echo     setItems(prev =^> prev.filter(i =^> i.id !== id^)^);
  echo   };
  echo.
  echo   return (
  echo     ^<div style={{ maxWidth: 600, margin: '40px auto', fontFamily: 'sans-serif' }}^>
  echo       ^<h1^>Items^</h1^>
  echo       ^<input value={title} onChange={e =^> setTitle(e.target.value^)} placeholder="New item" /^>
  echo       ^<button onClick={add}^>Add^</button^>
  echo       ^<ul^>{items.map(i =^> (
  echo         ^<li key={i.id}^>{i.title} ^<button onClick={(^) =^> remove(i.id^)}^>x^</button^>^</li^>
  echo       ^)^)}^</ul^>
  echo     ^</div^>
  echo   ^);
  echo }
  echo export default App;
) > src\App.tsx

cd ..

REM ─── DONE ───────────────────────────────────────────────────────────────────
echo.
echo Done! Project "%PROJECT%" is ready.
echo.
echo Next steps:
echo   1. Create database "%PROJECT%_db" and an "items" table:
if "%DB%"=="pg" (
  echo      CREATE TABLE items ^(id SERIAL PRIMARY KEY, title VARCHAR^(255^), created_at TIMESTAMP DEFAULT NOW^(^)^);
) else (
  echo      CREATE TABLE items ^(id INT AUTO_INCREMENT PRIMARY KEY, title VARCHAR^(255^), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP^);
)
echo   2. Update password in %PROJECT%\backend\.env
echo   3. Start backend:   cd %PROJECT%\backend ^&^& npm run dev
echo   4. Start frontend:  cd %PROJECT%\frontend ^&^& npm run dev
echo   5. Open http://localhost:5173

endlocal
