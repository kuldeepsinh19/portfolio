# SKILLS — Production Rules by Technology
> Paste this file at the start of any project session.
> Stack: React.js · Node.js + Express.js · PostgreSQL (Prisma)
> Architecture: Clean Architecture (Domain → Application → Infrastructure → Presentation)

---

## REACT.JS

### Component Rules
- Default to Server Components. Add `'use client'` only when you need: `useState`, `useEffect`, browser APIs, or event handlers.
- Keep Client Components as leaf nodes — push interactivity down, data fetching up.
- Never fetch data inside a Client Component directly — fetch in Server Component, pass as props.
- One component = one responsibility. If it does two things, split it.

### Data Fetching
```tsx
// Parallel fetch — never sequential unless data depends on prior result
const [user, products] = await Promise.all([getUser(id), getProducts()])

// Streaming slow data — wrap in Suspense, never block the whole page
<Suspense fallback={<Skeleton />}>
  <SlowComponent />
</Suspense>

// Share data across components without prop drilling — use React.cache
import { cache } from 'react'
export const getUser = cache(async (id: string) => prisma.user.findUnique({ where: { id } }))
```

### State Management
- URL state first (`searchParams`) → component state (`useState`) → Zustand only for cross-page shared state.
- Never store derived data in state — compute it during render.
- Avoid `useEffect` for data fetching or derived state. Use it only for external system sync (DOM, timers, subscriptions).

### Performance
```tsx
// Memoize expensive renders
const MemoTable = memo(DataTable, (prev, next) => prev.data === next.data)

// Memoize expensive calculations
const sorted = useMemo(() => data.sort(compareFn), [data])

// Stable callbacks passed to children
const handleSubmit = useCallback(async (input) => { ... }, [dependency])

// Lazy load heavy components
const Chart = dynamic(() => import('@/components/Chart'), { ssr: false })
```

### Forms and Mutations
- Use Server Actions for mutations — no separate API route needed for form submits.
- Validate input server-side with Zod even when using Server Actions.
- Always show optimistic UI or loading state — never leave the user waiting with no feedback.

### Error Handling
```tsx
// Every async server component needs an error boundary
// app/[feature]/error.tsx
'use client'
export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return <button onClick={reset}>Retry</button>
}
```

### Anti-Patterns
| Bad | Good |
|---|---|
| `useEffect` to fetch on mount | Fetch in Server Component |
| Prop drilling 3+ levels | `React.cache` or context |
| `useState` for URL filter state | `useSearchParams` |
| Large Client Component with everything | Small `'use client'` leaf + Server parent |
| `any` on component props | Typed props interface always |

---

## NODE.JS + EXPRESS.JS

### App Setup (Production Baseline)
```typescript
import express from 'express'
import helmet from 'helmet'
import compression from 'compression'
import rateLimit from 'express-rate-limit'
import { z } from 'zod'

const app = express()

app.disable('x-powered-by')
app.use(helmet())
app.use(compression())
app.use(express.json({ limit: '10kb' }))  // prevent large payload attacks
app.set('trust proxy', 1)                 // needed behind Nginx/load balancer

// Global rate limit
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100, standardHeaders: true }))
```

### Route Structure
```typescript
// Every route follows: validate → auth → use case → respond
router.post('/products', authenticate, async (req, res, next) => {
  try {
    const input = CreateProductSchema.safeParse(req.body)
    if (!input.success) return res.status(400).json({ error: input.error.flatten() })

    const result = await new CreateProductUseCase(RepositoryFactory.product()).execute({
      ...input.data,
      sellerId: req.user.id,   // always from auth middleware, never req.body
    })
    res.status(201).json(result)
  } catch (err) {
    next(err)   // always pass to error handler
  }
})
```

### Auth Middleware
```typescript
export async function authenticate(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.status(401).json({ error: 'Unauthorized' })
  try {
    req.user = verifyJwt(token)   // throws on invalid/expired
    next()
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' })
  }
}
```

### Centralized Error Handler (required — always last middleware)
```typescript
app.use((err: unknown, req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ error: err.message, code: err.code })
  }
  logger.error({ err, path: req.path }, 'Unhandled error')
  res.status(500).json({ error: 'Internal server error' })
})
```

### Async Error Wrapper (avoid try/catch in every route)
```typescript
const asyncHandler = (fn: RequestHandler): RequestHandler =>
  (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

router.get('/products', asyncHandler(async (req, res) => {
  const products = await new ListProductsUseCase(RepositoryFactory.product()).execute()
  res.json(products)
}))
```

### Security Rules
- `helmet()` always — sets 11 security headers in one line.
- Rate-limit all auth endpoints separately (stricter: 10 req / 15 min).
- Validate all `req.body`, `req.params`, `req.query` with Zod before use.
- Never expose stack traces in responses — log them, return generic message.
- Use `crypto.timingSafeEqual` for any secret/token comparison (prevents timing attacks).
- Store secrets in env only. Never log `req.body` directly (may contain passwords).

### Performance Rules
- Use `compression()` for all text responses.
- Use `Promise.all` for independent DB/service calls — never await sequentially.
- Use connection pooling (PgBouncer or Prisma's built-in pool).
- Never use synchronous `fs`, `crypto`, or `JSON.parse` on large payloads in request path.
- Use pino (not winston, not console) for structured logging — it's 5x faster.

```typescript
// pino setup
import pino from 'pino'
export const logger = pino({ level: process.env.LOG_LEVEL ?? 'info' })

// usage
logger.info({ userId, action: 'create_product' }, 'Product created')
logger.error({ err, productId }, 'Failed to create product')
```

### Graceful Shutdown
```typescript
const server = app.listen(PORT)

async function shutdown() {
  server.close(async () => {
    await prisma.$disconnect()
    process.exit(0)
  })
}
process.on('SIGTERM', shutdown)
process.on('SIGINT', shutdown)
```

---

## SQL — POSTGRESQL + PRISMA

### Schema Rules
- Every model: `id String @id @default(cuid())`, `createdAt DateTime @default(now())`, `updatedAt DateTime @updatedAt`
- All foreign keys need `@@index` — Prisma does NOT add these automatically.
- Use `Decimal @db.Decimal(10,2)` for money — never `Float`.
- Use enums for any field with a fixed set of values (status, role, type).
- Use `onDelete: Cascade` only when child records are meaningless without parent.

```prisma
model Order {
  id        String      @id @default(cuid())
  userId    String
  status    OrderStatus @default(PENDING)
  total     Decimal     @db.Decimal(10, 2)
  user      User        @relation(fields: [userId], references: [id], onDelete: Restrict)
  items     OrderItem[]
  createdAt DateTime    @default(now())
  updatedAt DateTime    @updatedAt
  @@index([userId])
  @@index([status])       // index columns you filter on
}
```

### Query Rules

**Prevent N+1 — always `include` or `select` what you need:**
```typescript
// BAD — N+1: one query per order item
const orders = await prisma.order.findMany()
for (const order of orders) {
  const items = await prisma.orderItem.findMany({ where: { orderId: order.id } })
}

// GOOD — single query with join
const orders = await prisma.order.findMany({
  include: { items: { include: { product: true } } }
})
```

**Select only what you need — never fetch full rows for lists:**
```typescript
const products = await prisma.product.findMany({
  select: { id: true, name: true, price: true },  // not select: undefined
  where: { stock: { gt: 0 } },
  orderBy: { createdAt: 'desc' },
  take: 20,
  skip: page * 20,
})
```

**Transactions for multi-step writes (atomicity rule):**
```typescript
// Deduct credits + create transaction record — must be atomic
const result = await prisma.$transaction(async (tx) => {
  const user = await tx.user.update({
    where: { id: userId },
    data: { credits: { decrement: cost } },
  })
  if (user.credits < 0) throw new Error('Insufficient credits')

  return tx.creditTransaction.create({
    data: { userId, amount: -cost, reason: 'image_generation' },
  })
})
```

**Bulk operations — never loop individual creates:**
```typescript
// BAD
for (const item of items) await prisma.orderItem.create({ data: item })

// GOOD
await prisma.orderItem.createMany({ data: items, skipDuplicates: true })
```

### Connection Management
```typescript
// Prisma singleton — one client for the entire process
// lib/db.ts
import { PrismaClient } from '@prisma/client'
const g = globalThis as unknown as { prisma: PrismaClient }
export const prisma = g.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error'] : ['error'],
})
if (process.env.NODE_ENV !== 'production') g.prisma = prisma
```

### Migration Workflow
```bash
# Development: create + apply migration
pnpm prisma migrate dev --name describe_the_change

# Production: apply existing migrations only (no schema drift)
pnpm prisma migrate deploy

# Never run migrate dev in production
```

### Indexing Checklist
```sql
-- Add these for every table:
-- 1. Foreign keys (Prisma doesn't auto-index them)
-- 2. Columns used in WHERE clauses
-- 3. Columns used in ORDER BY on large tables
-- 4. Columns used in unique constraints

-- In Prisma schema:
@@index([userId])          -- foreign key
@@index([status])          -- filtered frequently
@@index([createdAt])       -- sorted frequently
@@unique([email])          -- unique constraint
```

### Production Query Checklist
```
[ ] No unbounded findMany() — always use take/skip or cursor pagination
[ ] No select: undefined on list queries — always specify fields
[ ] Multi-step writes use $transaction
[ ] Relations loaded with include/select, not in a loop
[ ] Sensitive queries (balance updates) use SELECT FOR UPDATE or transactions
[ ] Raw queries use $queryRaw with tagged templates (parameterized, never string concat)
```

---

## INTEGRATION RULES (How the Stack Works Together)

```
React (Presentation)    → calls API routes or Server Actions
API Routes              → validates input → calls Use Cases
Use Cases (Application) → calls Repository interfaces
Repositories (Infra)    → Prisma queries → PostgreSQL
Express (if standalone) → same pattern, replaces Next.js API routes
```

**The three lines that must always be true:**
1. Business logic lives in Use Cases — never in routes, never in components.
2. `userId` always comes from the authenticated session — never from request body.
3. All external writes (DB, S3, email) that must succeed together go in a transaction or have rollback logic.

---

*v1.0 — 2026-05-14 | Use at project start. Applies to Next.js App Router + Express + PostgreSQL projects.*
# SKILLS — Production Rules by Technology
> Paste this file at the start of any project session.
> Stack: React.js · Node.js + Express.js · PostgreSQL (Prisma)
> Architecture: Clean Architecture (Domain → Application → Infrastructure → Presentation)

---

## REACT.JS

### Component Rules
- Default to Server Components. Add `'use client'` only when you need: `useState`, `useEffect`, browser APIs, or event handlers.
- Keep Client Components as leaf nodes — push interactivity down, data fetching up.
- Never fetch data inside a Client Component directly — fetch in Server Component, pass as props.
- One component = one responsibility. If it does two things, split it.

### Data Fetching
```tsx
// Parallel fetch — never sequential unless data depends on prior result
const [user, products] = await Promise.all([getUser(id), getProducts()])

// Streaming slow data — wrap in Suspense, never block the whole page
<Suspense fallback={<Skeleton />}>
  <SlowComponent />
</Suspense>

// Share data across components without prop drilling — use React.cache
import { cache } from 'react'
export const getUser = cache(async (id: string) => prisma.user.findUnique({ where: { id } }))
```

### State Management
- URL state first (`searchParams`) → component state (`useState`) → Zustand only for cross-page shared state.
- Never store derived data in state — compute it during render.
- Avoid `useEffect` for data fetching or derived state. Use it only for external system sync (DOM, timers, subscriptions).

### Performance
```tsx
// Memoize expensive renders
const MemoTable = memo(DataTable, (prev, next) => prev.data === next.data)

// Memoize expensive calculations
const sorted = useMemo(() => data.sort(compareFn), [data])

// Stable callbacks passed to children
const handleSubmit = useCallback(async (input) => { ... }, [dependency])

// Lazy load heavy components
const Chart = dynamic(() => import('@/components/Chart'), { ssr: false })
```

### Forms and Mutations
- Use Server Actions for mutations — no separate API route needed for form submits.
- Validate input server-side with Zod even when using Server Actions.
- Always show optimistic UI or loading state — never leave the user waiting with no feedback.

### Error Handling
```tsx
// Every async server component needs an error boundary
// app/[feature]/error.tsx
'use client'
export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return <button onClick={reset}>Retry</button>
}
```

### Anti-Patterns
| Bad | Good |
|---|---|
| `useEffect` to fetch on mount | Fetch in Server Component |
| Prop drilling 3+ levels | `React.cache` or context |
| `useState` for URL filter state | `useSearchParams` |
| Large Client Component with everything | Small `'use client'` leaf + Server parent |
| `any` on component props | Typed props interface always |

---

## NODE.JS + EXPRESS.JS

### App Setup (Production Baseline)
```typescript
import express from 'express'
import helmet from 'helmet'
import compression from 'compression'
import rateLimit from 'express-rate-limit'
import { z } from 'zod'

const app = express()

app.disable('x-powered-by')
app.use(helmet())
app.use(compression())
app.use(express.json({ limit: '10kb' }))  // prevent large payload attacks
app.set('trust proxy', 1)                 // needed behind Nginx/load balancer

// Global rate limit
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100, standardHeaders: true }))
```

### Route Structure
```typescript
// Every route follows: validate → auth → use case → respond
router.post('/products', authenticate, async (req, res, next) => {
  try {
    const input = CreateProductSchema.safeParse(req.body)
    if (!input.success) return res.status(400).json({ error: input.error.flatten() })

    const result = await new CreateProductUseCase(RepositoryFactory.product()).execute({
      ...input.data,
      sellerId: req.user.id,   // always from auth middleware, never req.body
    })
    res.status(201).json(result)
  } catch (err) {
    next(err)   // always pass to error handler
  }
})
```

### Auth Middleware
```typescript
export async function authenticate(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.status(401).json({ error: 'Unauthorized' })
  try {
    req.user = verifyJwt(token)   // throws on invalid/expired
    next()
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' })
  }
}
```

### Centralized Error Handler (required — always last middleware)
```typescript
app.use((err: unknown, req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ error: err.message, code: err.code })
  }
  logger.error({ err, path: req.path }, 'Unhandled error')
  res.status(500).json({ error: 'Internal server error' })
})
```

### Async Error Wrapper (avoid try/catch in every route)
```typescript
const asyncHandler = (fn: RequestHandler): RequestHandler =>
  (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

router.get('/products', asyncHandler(async (req, res) => {
  const products = await new ListProductsUseCase(RepositoryFactory.product()).execute()
  res.json(products)
}))
```

### Security Rules
- `helmet()` always — sets 11 security headers in one line.
- Rate-limit all auth endpoints separately (stricter: 10 req / 15 min).
- Validate all `req.body`, `req.params`, `req.query` with Zod before use.
- Never expose stack traces in responses — log them, return generic message.
- Use `crypto.timingSafeEqual` for any secret/token comparison (prevents timing attacks).
- Store secrets in env only. Never log `req.body` directly (may contain passwords).

### Performance Rules
- Use `compression()` for all text responses.
- Use `Promise.all` for independent DB/service calls — never await sequentially.
- Use connection pooling (PgBouncer or Prisma's built-in pool).
- Never use synchronous `fs`, `crypto`, or `JSON.parse` on large payloads in request path.
- Use pino (not winston, not console) for structured logging — it's 5x faster.

```typescript
// pino setup
import pino from 'pino'
export const logger = pino({ level: process.env.LOG_LEVEL ?? 'info' })

// usage
logger.info({ userId, action: 'create_product' }, 'Product created')
logger.error({ err, productId }, 'Failed to create product')
```

### Graceful Shutdown
```typescript
const server = app.listen(PORT)

async function shutdown() {
  server.close(async () => {
    await prisma.$disconnect()
    process.exit(0)
  })
}
process.on('SIGTERM', shutdown)
process.on('SIGINT', shutdown)
```

---

## SQL — POSTGRESQL + PRISMA

### Schema Rules
- Every model: `id String @id @default(cuid())`, `createdAt DateTime @default(now())`, `updatedAt DateTime @updatedAt`
- All foreign keys need `@@index` — Prisma does NOT add these automatically.
- Use `Decimal @db.Decimal(10,2)` for money — never `Float`.
- Use enums for any field with a fixed set of values (status, role, type).
- Use `onDelete: Cascade` only when child records are meaningless without parent.

```prisma
model Order {
  id        String      @id @default(cuid())
  userId    String
  status    OrderStatus @default(PENDING)
  total     Decimal     @db.Decimal(10, 2)
  user      User        @relation(fields: [userId], references: [id], onDelete: Restrict)
  items     OrderItem[]
  createdAt DateTime    @default(now())
  updatedAt DateTime    @updatedAt
  @@index([userId])
  @@index([status])       // index columns you filter on
}
```

### Query Rules

**Prevent N+1 — always `include` or `select` what you need:**
```typescript
// BAD — N+1: one query per order item
const orders = await prisma.order.findMany()
for (const order of orders) {
  const items = await prisma.orderItem.findMany({ where: { orderId: order.id } })
}

// GOOD — single query with join
const orders = await prisma.order.findMany({
  include: { items: { include: { product: true } } }
})
```

**Select only what you need — never fetch full rows for lists:**
```typescript
const products = await prisma.product.findMany({
  select: { id: true, name: true, price: true },  // not select: undefined
  where: { stock: { gt: 0 } },
  orderBy: { createdAt: 'desc' },
  take: 20,
  skip: page * 20,
})
```

**Transactions for multi-step writes (atomicity rule):**
```typescript
// Deduct credits + create transaction record — must be atomic
const result = await prisma.$transaction(async (tx) => {
  const user = await tx.user.update({
    where: { id: userId },
    data: { credits: { decrement: cost } },
  })
  if (user.credits < 0) throw new Error('Insufficient credits')

  return tx.creditTransaction.create({
    data: { userId, amount: -cost, reason: 'image_generation' },
  })
})
```

**Bulk operations — never loop individual creates:**
```typescript
// BAD
for (const item of items) await prisma.orderItem.create({ data: item })

// GOOD
await prisma.orderItem.createMany({ data: items, skipDuplicates: true })
```

### Connection Management
```typescript
// Prisma singleton — one client for the entire process
// lib/db.ts
import { PrismaClient } from '@prisma/client'
const g = globalThis as unknown as { prisma: PrismaClient }
export const prisma = g.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error'] : ['error'],
})
if (process.env.NODE_ENV !== 'production') g.prisma = prisma
```

### Migration Workflow
```bash
# Development: create + apply migration
pnpm prisma migrate dev --name describe_the_change

# Production: apply existing migrations only (no schema drift)
pnpm prisma migrate deploy

# Never run migrate dev in production
```

### Indexing Checklist
```sql
-- Add these for every table:
-- 1. Foreign keys (Prisma doesn't auto-index them)
-- 2. Columns used in WHERE clauses
-- 3. Columns used in ORDER BY on large tables
-- 4. Columns used in unique constraints

-- In Prisma schema:
@@index([userId])          -- foreign key
@@index([status])          -- filtered frequently
@@index([createdAt])       -- sorted frequently
@@unique([email])          -- unique constraint
```

### Production Query Checklist
```
[ ] No unbounded findMany() — always use take/skip or cursor pagination
[ ] No select: undefined on list queries — always specify fields
[ ] Multi-step writes use $transaction
[ ] Relations loaded with include/select, not in a loop
[ ] Sensitive queries (balance updates) use SELECT FOR UPDATE or transactions
[ ] Raw queries use $queryRaw with tagged templates (parameterized, never string concat)
```

---

## INTEGRATION RULES (How the Stack Works Together)

```
React (Presentation)    → calls API routes or Server Actions
API Routes              → validates input → calls Use Cases
Use Cases (Application) → calls Repository interfaces
Repositories (Infra)    → Prisma queries → PostgreSQL
Express (if standalone) → same pattern, replaces Next.js API routes
```

**The three lines that must always be true:**
1. Business logic lives in Use Cases — never in routes, never in components.
2. `userId` always comes from the authenticated session — never from request body.
3. All external writes (DB, S3, email) that must succeed together go in a transaction or have rollback logic.

---

*v1.0 — 2026-05-14 | Use at project start. Applies to Next.js App Router + Express + PostgreSQL projects.*
