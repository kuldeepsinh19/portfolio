# ARCHITECT FRAMEWORK — Universal Project Analysis System
> Read this before writing a single line of code.
> Role: Senior System Architect + Project Manager
> Purpose: Given any project requirement, produce a concrete decision output covering stack, architecture, AWS services, database, AI integration, and execution order.
>
> **Architectural non-negotiable: Every project uses Clean Architecture — Domain → Application → Infrastructure → Presentation. No exceptions.**

---

## HOW TO USE THIS FILE

1. Read the requirement fully
2. Work through **Part 1 → Part 2 → Part 3** sequentially (10 minutes max)
3. The output of Part 3 is your implementation contract — follow it exactly
4. Use Parts 4–8 as lookup references during implementation

---

## PART 1: PROJECT INTAKE (5 Minutes)

### 1.1 — The Five Questions to Ask Immediately

Never skip these. Every answer changes a downstream decision.

| # | Question | Why It Matters |
|---|---|---|
| Q1 | What is the **one primary action** a user takes? | Defines your core API route and data model |
| Q2 | What data must **persist** between sessions? | Defines your database entities |
| Q3 | Are there **multiple user roles**? (admin, seller, buyer, etc.) | Defines auth complexity and access control |
| Q4 | Which **AWS services** are expected or available? | Locks your infrastructure choices |
| Q5 | What **AI capability** should the app have? | Defines which AI pattern to use |

### 1.2 — Constraint Capture

Record these before designing anything:

```
Time available:       ___ minutes
Deploy target:        [ ] Vercel  [ ] EC2  [ ] Lambda  [ ] S3 Static  [ ] ECS
Auth requirement:     [ ] None/stub  [ ] Email+Password  [ ] OAuth  [ ] AWS Cognito
AI model available:   [ ] OpenAI  [ ] AWS Bedrock  [ ] Gemini  [ ] Local/None
Database provided:    [ ] None (create)  [ ] RDS endpoint given  [ ] Local SQLite ok
AWS credentials:      [ ] Provided  [ ] Not needed  [ ] Need to create IAM
```

### 1.3 — Red Flags to Clarify Before Starting

- "Build a marketplace" → ask: single vendor or multi-vendor? payments included?
- "Add AI" → ask: generative output or classification/analysis?
- "Connect AWS" → ask: which service specifically, or should I recommend?
- "Full stack" → ask: is auth/login in scope, or should I stub it?
- "Deploy it" → ask: do you want CI/CD or just a working URL?

---

## PART 2: PROJECT CLASSIFICATION

### 2.1 — Identify the Project Type

Read the requirement and match it to one of these six archetypes:

```
TYPE A — CRUD Application
  Signs: "manage", "dashboard", "admin panel", "track", "list/create/edit"
  Examples: inventory system, task manager, CMS, booking system

TYPE B — AI-Powered Feature
  Signs: "generate", "recommend", "analyze", "summarize", "chat", "predict"
  Examples: product recommender, AI chatbot, document analyzer, image generator

TYPE C — Marketplace / Multi-Tenant
  Signs: "buyers and sellers", "vendors", "listings", "commission", "storefront"
  Examples: ecommerce marketplace, freelance platform, rental platform

TYPE D — Real-Time / Event-Driven
  Signs: "live", "notifications", "stream", "updates", "collaborative"
  Examples: live chat, auction system, collaborative editor, dashboard

TYPE E — Data Pipeline / Processing
  Signs: "import", "export", "batch", "scrape", "ETL", "report", "analytics"
  Examples: CSV processor, scraper, reporting dashboard, data sync

TYPE F — Integration / API Layer
  Signs: "connect", "webhook", "sync", "third-party", "Shopify/Stripe/etc."
  Examples: payment integration, Shopify app, CRM sync, notification service
```

> Most interview tasks are **Type A + Type B** combined (CRUD app with AI feature).
> Webdesk-specific tasks will likely be **Type B + Type C** (AI on top of ecommerce).

### 2.2 — Complexity Scoring

Score each dimension 1 (simple) to 3 (complex):

```
Auth complexity:     1=none  2=single role  3=multi-role RBAC
Data complexity:     1=1-2 entities  2=3-5 entities  3=6+ entities with relations
AI complexity:       1=none  2=single prompt  3=RAG/fine-tuned/streaming
AWS complexity:      1=none  2=1-2 services  3=3+ services / infra creation
Real-time needs:     1=none  2=polling ok  3=websocket/SSE required
```

**Total Score → Execution Strategy:**
- 5–7: Implement everything fully
- 8–11: Implement core + stub advanced features, explain trade-offs verbally
- 12–15: Define architecture fully, implement only the critical path, document the rest

---

## PART 3: DECISION OUTPUT ENGINE

> Run through this section and fill in each box. This becomes your implementation contract.

### 3.1 — Tech Stack Selection

**Frontend + Backend:**
```
IF deploying to Vercel OR time < 90 min:
  → Next.js 14 (App Router) + TypeScript
  → API routes for backend (no separate server)

IF deploying to EC2/standalone backend needed:
  → Next.js frontend + Express.js API (separate)
  → Or: Next.js full-stack with standalone output

IF static site only (no server needed):
  → Next.js with static export OR plain React + Vite
```

**Styling:**
```
Always: Tailwind CSS
Exception: if they specify a UI library → use it, don't fight it
Add: shadcn/ui for complex components (forms, modals, tables)
```

**State Management:**
```
No external state unless app has cross-page shared state
  → Server components + URL state first
  → React useState/useReducer for local UI state
  → Zustand ONLY if shared global state is genuinely needed
```

**Database:**
```
IF PostgreSQL is available or expected:
  → Prisma ORM (schema as code, type-safe, migrations in 1 command)

IF SQLite is ok (demo/local only):
  → Prisma + SQLite (no provisioning needed)

IF NoSQL makes semantic sense (documents, unstructured):
  → DynamoDB (if AWS context) OR MongoDB Atlas

Never use raw SQL in an interview — always use an ORM for speed
```

**Authentication:**
```
IF Cognito is in scope:
  → NextAuth.js with Cognito provider (fastest integration path)
  → ENV: COGNITO_CLIENT_ID, COGNITO_CLIENT_SECRET, COGNITO_ISSUER

IF no AWS constraint:
  → NextAuth.js with email/credentials provider
  → Or: stub auth with a hardcoded userId for the demo

NEVER build auth from scratch in < 2 hours
```

**Validation:**
```
Always: Zod for all API route inputs
  import { z } from "zod"
  const schema = z.object({ ... })
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 })
```

### 3.2 — Architecture: Always Clean Architecture

**This is not a choice. Every project uses Clean Architecture regardless of type, size, or time constraint.**

The four layers and their single responsibility:

```
LAYER 1 — DOMAIN  (src/Domain/)
  What:  The core business — entities, rules, errors, repository interfaces
  Rule:  ZERO external imports. Pure TypeScript only.
         No Prisma. No AWS. No Next.js. Nothing.
  Has:   Entities/, Repositories/ (interfaces), Errors/, ValueObjects/

LAYER 2 — APPLICATION  (src/Application/)
  What:  Orchestrates business logic — one Use Case per user action
  Rule:  Imports from Domain only. NEVER imports from Infrastructure.
         Infrastructure is injected via constructor (Dependency Inversion).
  Has:   UseCases/[Feature]/[Action]UseCase.ts, DTOs/

LAYER 3 — INFRASTRUCTURE  (src/Infrastructure/)
  What:  All external concerns — Prisma, AWS, AI, email, logging
  Rule:  Implements interfaces defined in Domain. Can import Domain + Application.
  Has:   Persistence/Repositories/ (Prisma impls), Services/ (AWS/AI), Logging/

LAYER 4 — PRESENTATION  (app/ + components/)
  What:  Next.js API routes, pages, React components
  Rule:  API routes call Use Cases only. NEVER import Prisma or AWS directly.
         Gets repository/service instances from Factory classes.
  Has:   app/api/*/route.ts, app/(pages)/, components/
```

**Dependency flow (one direction only):**
```
Presentation → Application → Domain
Infrastructure → Domain (implements interfaces)
Infrastructure → Application (implements service interfaces)
```

**The two factory files that wire everything together:**
```typescript
// src/Infrastructure/Persistence/RepositoryFactory.ts
// Returns the correct Prisma repository for each Domain interface
export class RepositoryFactory {
  static userRepository()    { return new PrismaUserRepository() }
  static productRepository() { return new PrismaProductRepository() }
  static orderRepository()   { return new PrismaOrderRepository() }
}

// src/Infrastructure/Services/ServiceFactory.ts
// Returns AWS/AI/email service implementations
export class ServiceFactory {
  static storageService() { return new S3StorageService() }
  static aiService()      { return new BedrockAIService() }
  static emailService()   { return new SESEmailService() }
}
```

**What each project type adds on top of this base:**
```
TYPE A (CRUD):      UseCases: Create/Get/Update/Delete[Entity]UseCase
TYPE B (AI):        UseCases: [Action]UseCase + Infrastructure/Services/[AI]Service.ts
TYPE C (Marketplace): Multiple entity groups, RBAC in middleware, role on Domain Entity
TYPE D (Real-Time): SSE in Presentation only — UseCase returns data, route streams it
TYPE E (Pipeline):  UseCase orchestrates steps, Infrastructure handles I/O
TYPE F (Integration): Infrastructure/Services/[ThirdParty]Service.ts per external system
```

### 3.3 — AWS Service Selection Matrix

Match each requirement to its AWS service:

| Requirement | AWS Service | SDK Import | Key ENV vars |
|---|---|---|---|
| Store files/images/documents | **S3** | `@aws-sdk/client-s3` | `AWS_REGION`, `S3_BUCKET_NAME` |
| User authentication / login | **Cognito** | `@aws-sdk/client-cognito-identity-provider` | `COGNITO_USER_POOL_ID`, `COGNITO_CLIENT_ID` |
| Relational database | **RDS (PostgreSQL)** | Prisma | `DATABASE_URL` |
| NoSQL / flexible schema | **DynamoDB** | `@aws-sdk/client-dynamodb` | `AWS_REGION` |
| Send emails (transactional) | **SES** | `@aws-sdk/client-ses` | `SES_FROM_EMAIL` |
| Background/async jobs | **SQS + Lambda** | `@aws-sdk/client-sqs` | `SQS_QUEUE_URL` |
| AI/ML models | **Bedrock** | `@aws-sdk/client-bedrock-runtime` | `AWS_REGION` |
| Search / full-text | **OpenSearch** | `@aws-sdk/client-opensearch` | `OPENSEARCH_ENDPOINT` |
| Caching / sessions | **ElastiCache (Redis)** | `ioredis` | `REDIS_URL` |
| Deploy serverless | **Lambda + API Gateway** | Serverless Framework / SAM | — |
| CDN / static assets | **CloudFront** | Configured via S3 | `CLOUDFRONT_DOMAIN` |
| Environment config | **SSM Parameter Store** | `@aws-sdk/client-ssm` | `AWS_REGION` |

**AWS SDK Universal Setup (paste once, reuse everywhere):**
```typescript
// lib/aws.ts
import { S3Client } from "@aws-sdk/client-s3"
import { CognitoIdentityProviderClient } from "@aws-sdk/client-cognito-identity-provider"
import { BedrockRuntimeClient } from "@aws-sdk/client-bedrock-runtime"
import { SESClient } from "@aws-sdk/client-ses"

const config = {
  region: process.env.AWS_REGION ?? "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
}

export const s3 = new S3Client(config)
export const cognito = new CognitoIdentityProviderClient(config)
export const bedrock = new BedrockRuntimeClient(config)
export const ses = new SESClient(config)
```

### 3.4 — AI Integration Pattern Selection

```
USE CASE → PATTERN

"Chat with the app / assistant"
  → Streaming chat: Vercel AI SDK + useChat hook
  → Model: OpenAI gpt-4o OR Bedrock claude-3-5-sonnet
  → Pattern: Conversation history in DB, system prompt defines persona

"Recommend products / content"
  → Semantic search: embed items at write time, query at read time
  → Stack: OpenAI embeddings → pgvector (Prisma + PostgreSQL) OR Pinecone
  → Pattern: POST /api/recommend { userId } → vector similarity search

"Analyze uploaded document / image"
  → Vision: upload to S3 → pass S3 URL to multimodal model
  → Pattern: POST /api/analyze { s3Key } → Bedrock/OpenAI vision → structured JSON response

"Generate content (product descriptions, emails)"
  → Single-shot generation: structured prompt → text output
  → Pattern: POST /api/generate { type, inputs } → model → save to DB

"Classify / moderate / tag"
  → Zero-shot classification: pass content + categories to model
  → Pattern: POST /api/classify { content } → model → { category, confidence }

"Extract structured data from unstructured text"
  → Function calling / tool use: define JSON schema → model fills it
  → Pattern: Use model's tool_use/function_calling to enforce output schema
```

**AI Client Singleton (works with any provider):**
```typescript
// lib/ai.ts
import OpenAI from "openai"

export const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function chat(messages: { role: string; content: string }[], system?: string) {
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: system ? [{ role: "system", content: system }, ...messages] : messages,
  })
  return response.choices[0].message.content
}

// For Bedrock Claude:
export async function bedrockChat(prompt: string) {
  const { BedrockRuntimeClient, InvokeModelCommand } = await import("@aws-sdk/client-bedrock-runtime")
  const client = new BedrockRuntimeClient({ region: process.env.AWS_REGION ?? "us-east-1" })
  const res = await client.send(new InvokeModelCommand({
    modelId: "anthropic.claude-3-5-sonnet-20241022-v2:0",
    contentType: "application/json",
    accept: "application/json",
    body: JSON.stringify({
      anthropic_version: "bedrock-2023-05-31",
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
    }),
  }))
  return JSON.parse(new TextDecoder().decode(res.body)).content[0].text
}
```

---

## PART 3.5: CLEAN ARCHITECTURE — LAYER TEMPLATES

> Copy these for every new project. File paths are exact. Do not deviate.

### tsconfig.json path aliases (required)

```json
{
  "compilerOptions": {
    "paths": {
      "@domain/*":         ["./src/Domain/*"],
      "@application/*":    ["./src/Application/*"],
      "@infrastructure/*": ["./src/Infrastructure/*"],
      "@/*":               ["./src/*"]
    }
  }
}
```

---

### LAYER 1 — Domain

**Entity (pure class, no external deps):**
```typescript
// src/Domain/Entities/[Entity].ts
export class Product {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly price: number,
    public readonly stock: number,
  ) {}

  isInStock(): boolean { return this.stock > 0 }
  isAffordable(budget: number): boolean { return this.price <= budget }
}
```

**Repository Interface (contract, not implementation):**
```typescript
// src/Domain/Repositories/IProductRepository.ts
import type { Product } from "@domain/Entities/Product"

export interface IProductRepository {
  findById(id: string): Promise<Product | null>
  findAll(filters?: { sellerId?: string }): Promise<Product[]>
  save(product: Product): Promise<Product>
  delete(id: string): Promise<void>
}
```

**Error Hierarchy (covers all HTTP error cases):**
```typescript
// src/Domain/Errors/AppError.ts
export class AppError extends Error {
  constructor(
    public readonly message: string,
    public readonly statusCode: number = 500,
    public readonly code: string = "INTERNAL_ERROR",
  ) {
    super(message)
    this.name = "AppError"
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) { super(`${resource} not found`, 404, "NOT_FOUND") }
}

export class UnauthorizedError extends AppError {
  constructor() { super("Unauthorized", 401, "UNAUTHORIZED") }
}

export class ForbiddenError extends AppError {
  constructor() { super("Forbidden", 403, "FORBIDDEN") }
}

export class ValidationError extends AppError {
  constructor(msg: string) { super(msg, 400, "VALIDATION_ERROR") }
}

export class ConflictError extends AppError {
  constructor(msg: string) { super(msg, 409, "CONFLICT") }
}
```

---

### LAYER 2 — Application

**Use Case (one class per user action, always):**
```typescript
// src/Application/UseCases/Product/CreateProductUseCase.ts
import type { IProductRepository } from "@domain/Repositories/IProductRepository"
import { Product } from "@domain/Entities/Product"
import { ValidationError } from "@domain/Errors/AppError"

// DTOs live inline for speed — extract to DTOs/ if they're reused
export interface CreateProductInput {
  name: string
  price: number
  stock: number
  sellerId: string
}

export interface CreateProductOutput {
  id: string
  name: string
  price: number
  stock: number
}

export class CreateProductUseCase {
  constructor(private readonly productRepo: IProductRepository) {}

  async execute(input: CreateProductInput): Promise<CreateProductOutput> {
    if (input.price <= 0) throw new ValidationError("Price must be positive")
    if (input.stock < 0)  throw new ValidationError("Stock cannot be negative")

    const product = new Product(
      crypto.randomUUID(),
      input.name,
      input.price,
      input.stock,
    )

    const saved = await this.productRepo.save(product)
    return { id: saved.id, name: saved.name, price: saved.price, stock: saved.stock }
  }
}
```

**Use Case naming convention:**
```
Create[Entity]UseCase    ← creates a new entity
Get[Entity]UseCase       ← fetch one by id
List[Entity]sUseCase     ← fetch many with filters
Update[Entity]UseCase    ← mutate an existing entity
Delete[Entity]UseCase    ← remove an entity
[Action][Entity]UseCase  ← domain action: PlaceOrderUseCase, RefundOrderUseCase
Generate[X]UseCase       ← AI generation
Analyze[X]UseCase        ← AI analysis
```

---

### LAYER 3 — Infrastructure

**Prisma Repository Implementation:**
```typescript
// src/Infrastructure/Persistence/Repositories/PrismaProductRepository.ts
import { prisma } from "@/lib/db"
import type { IProductRepository } from "@domain/Repositories/IProductRepository"
import { Product } from "@domain/Entities/Product"

export class PrismaProductRepository implements IProductRepository {
  async findById(id: string): Promise<Product | null> {
    const row = await prisma.product.findUnique({ where: { id } })
    if (!row) return null
    return new Product(row.id, row.name, Number(row.price), row.stock)
  }

  async findAll(filters?: { sellerId?: string }): Promise<Product[]> {
    const rows = await prisma.product.findMany({
      where: filters?.sellerId ? { sellerId: filters.sellerId } : undefined,
    })
    return rows.map(r => new Product(r.id, r.name, Number(r.price), r.stock))
  }

  async save(product: Product): Promise<Product> {
    const row = await prisma.product.upsert({
      where: { id: product.id },
      create: { id: product.id, name: product.name, price: product.price, stock: product.stock },
      update: { name: product.name, price: product.price, stock: product.stock },
    })
    return new Product(row.id, row.name, Number(row.price), row.stock)
  }

  async delete(id: string): Promise<void> {
    await prisma.product.delete({ where: { id } })
  }
}
```

**S3 Service Implementation:**
```typescript
// src/Infrastructure/Services/S3StorageService.ts
import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"

export class S3StorageService {
  private readonly client = new S3Client({ region: process.env.AWS_REGION ?? "us-east-1" })
  private readonly bucket = process.env.S3_BUCKET_NAME!

  async upload(key: string, body: Buffer, contentType: string): Promise<string> {
    await this.client.send(new PutObjectCommand({ Bucket: this.bucket, Key: key, Body: body, ContentType: contentType }))
    return key
  }

  async presignedUploadUrl(key: string, contentType: string): Promise<string> {
    return getSignedUrl(
      this.client,
      new PutObjectCommand({ Bucket: this.bucket, Key: key, ContentType: contentType }),
      { expiresIn: 3600 },
    )
  }

  async delete(key: string): Promise<void> {
    await this.client.send(new DeleteObjectCommand({ Bucket: this.bucket, Key: key }))
  }
}
```

**Bedrock AI Service Implementation:**
```typescript
// src/Infrastructure/Services/BedrockAIService.ts
import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime"

export class BedrockAIService {
  private readonly client = new BedrockRuntimeClient({ region: process.env.AWS_REGION ?? "us-east-1" })
  private readonly modelId = process.env.BEDROCK_MODEL_ID ?? "anthropic.claude-3-5-sonnet-20241022-v2:0"

  async chat(prompt: string, system?: string): Promise<string> {
    const messages = [{ role: "user", content: prompt }]
    const body: Record<string, unknown> = { anthropic_version: "bedrock-2023-05-31", max_tokens: 2048, messages }
    if (system) body.system = system

    const res = await this.client.send(new InvokeModelCommand({
      modelId: this.modelId,
      contentType: "application/json",
      accept: "application/json",
      body: JSON.stringify(body),
    }))
    return JSON.parse(new TextDecoder().decode(res.body)).content[0].text
  }
}
```

**Factory files (the DI wiring point):**
```typescript
// src/Infrastructure/Persistence/RepositoryFactory.ts
import { PrismaProductRepository } from "./Repositories/PrismaProductRepository"
import { PrismaOrderRepository }   from "./Repositories/PrismaOrderRepository"
import { PrismaUserRepository }    from "./Repositories/PrismaUserRepository"

export class RepositoryFactory {
  static product() { return new PrismaProductRepository() }
  static order()   { return new PrismaOrderRepository() }
  static user()    { return new PrismaUserRepository() }
}

// src/Infrastructure/Services/ServiceFactory.ts
import { S3StorageService }   from "./S3StorageService"
import { BedrockAIService }   from "./BedrockAIService"
import { SESEmailService }    from "./SESEmailService"

export class ServiceFactory {
  static storage() { return new S3StorageService() }
  static ai()      { return new BedrockAIService() }
  static email()   { return new SESEmailService() }
}
```

**Prisma singleton (lib/db.ts — only Infrastructure imports this):**
```typescript
// lib/db.ts
import { PrismaClient } from "@prisma/client"
const g = globalThis as unknown as { prisma: PrismaClient }
export const prisma = g.prisma ?? new PrismaClient()
if (process.env.NODE_ENV !== "production") g.prisma = prisma
```

---

### LAYER 4 — Presentation (API Route)

**The only pattern for API routes — no exceptions:**
```typescript
// app/api/products/route.ts
import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { CreateProductUseCase } from "@application/UseCases/Product/CreateProductUseCase"
import { RepositoryFactory }    from "@infrastructure/Persistence/RepositoryFactory"
import { AppError }             from "@domain/Errors/AppError"

const schema = z.object({
  name:  z.string().min(1),
  price: z.number().positive(),
  stock: z.number().int().min(0),
})

export async function POST(req: NextRequest) {
  try {
    // 1. Auth: userId always from session, never from body
    const session = await getServerSession()
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    // 2. Validate input
    const body = await req.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten() }, { status: 400 })

    // 3. Execute use case — inject dependencies from factories
    const useCase = new CreateProductUseCase(RepositoryFactory.product())
    const result = await useCase.execute({ ...parsed.data, sellerId: session.user.id })

    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message, code: error.code }, { status: error.statusCode })
    }
    console.error("[POST /api/products]", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
```

---

### Layer Violation Checklist (run before every demo)

```
[ ] No Prisma import in any file under src/Application/
[ ] No AWS SDK import in any file under src/Domain/ or src/Application/
[ ] No direct prisma.* call in any app/api/*/route.ts file
[ ] All API routes get repositories via RepositoryFactory, services via ServiceFactory
[ ] Domain Entities have no constructor dependencies on external libraries
[ ] Every Use Case receives its dependencies through the constructor (not by instantiating them internally)
```

---

## PART 4: DATABASE SCHEMA METHODOLOGY

### 4.1 — Schema Design in 90 Seconds

1. **List nouns** from the requirement → these are your tables
2. **Draw ownership arrows** → A owns many B = foreign key from B to A
3. **Identify state machines** → anything with status = enum
4. **Add universals** → every table gets: `id`, `createdAt`, `updatedAt`
5. **Add one index** → on the most-queried foreign key

### 4.2 — Domain Schema Patterns (Copy-Paste Ready)

**E-commerce Core:**
```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  role      Role     @default(BUYER)
  orders    Order[]
  createdAt DateTime @default(now())
}

model Product {
  id          String      @id @default(cuid())
  name        String
  description String?
  price       Decimal     @db.Decimal(10, 2)
  stock       Int         @default(0)
  images      String[]
  sellerId    String
  orderItems  OrderItem[]
  createdAt   DateTime    @default(now())
  @@index([sellerId])
}

model Order {
  id        String      @id @default(cuid())
  userId    String
  status    OrderStatus @default(PENDING)
  total     Decimal     @db.Decimal(10, 2)
  user      User        @relation(fields: [userId], references: [id])
  items     OrderItem[]
  createdAt DateTime    @default(now())
  @@index([userId])
}

model OrderItem {
  id        String  @id @default(cuid())
  orderId   String
  productId String
  quantity  Int
  price     Decimal @db.Decimal(10, 2)
  order     Order   @relation(fields: [orderId], references: [id])
  product   Product @relation(fields: [productId], references: [id])
}

enum Role        { ADMIN SELLER BUYER }
enum OrderStatus { PENDING PAID SHIPPED DELIVERED CANCELLED REFUNDED }
```

**AI Chat / Assistant:**
```prisma
model Conversation {
  id        String    @id @default(cuid())
  userId    String
  title     String?
  messages  Message[]
  createdAt DateTime  @default(now())
  @@index([userId])
}

model Message {
  id             String       @id @default(cuid())
  conversationId String
  role           MessageRole
  content        String       @db.Text
  conversation   Conversation @relation(fields: [conversationId], references: [id], onDelete: Cascade)
  createdAt      DateTime     @default(now())
}

enum MessageRole { user assistant system }
```

**File / Media Upload:**
```prisma
model Upload {
  id          String     @id @default(cuid())
  userId      String
  filename    String
  s3Key       String     @unique
  s3Bucket    String
  mimeType    String
  sizeBytes   Int
  status      UploadStatus @default(PROCESSING)
  publicUrl   String?
  createdAt   DateTime   @default(now())
  @@index([userId])
}

enum UploadStatus { PROCESSING READY FAILED }
```

**Task / Job Tracker:**
```prisma
model Task {
  id          String     @id @default(cuid())
  title       String
  description String?    @db.Text
  status      TaskStatus @default(TODO)
  priority    Priority   @default(MEDIUM)
  assigneeId  String?
  dueDate     DateTime?
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt
}

enum TaskStatus { TODO IN_PROGRESS REVIEW DONE CANCELLED }
enum Priority  { LOW MEDIUM HIGH CRITICAL }
```

---

## PART 5: SECURITY BASELINE (NON-NEGOTIABLE)

Apply all of these — they take minutes and signal professional-grade thinking:

```
AUTH:
  [ ] userId always from session, never from request body
  [ ] All /api routes check authentication before processing
  [ ] Role checked server-side, not just client-side

INPUT:
  [ ] All request bodies validated with Zod before use
  [ ] File uploads: validate MIME type AND file extension
  [ ] No raw SQL — always use ORM parameterized queries

SECRETS:
  [ ] All secrets in .env.local, never hardcoded
  [ ] .env.local in .gitignore
  [ ] No secrets logged

API:
  [ ] HTTP errors return { error: string } not stack traces
  [ ] 401 for unauthenticated, 403 for unauthorized, 400 for bad input
  [ ] Webhook signatures verified (HMAC) if receiving webhooks

S3:
  [ ] Bucket NOT public — use presigned URLs or serve via API
  [ ] User-uploaded files stored under userId prefix: uploads/{userId}/{uuid}
```

---

## PART 6: PROJECT SCAFFOLDING COMMANDS

Run these in order — no deliberation:

```bash
# 1. Create project (30 seconds)
npx create-next-app@latest my-app --typescript --tailwind --app --src-dir --import-alias "@/*"
cd my-app

# 2. Create Clean Architecture directory structure (15 seconds)
mkdir -p src/Domain/{Entities,Repositories,Errors,ValueObjects}
mkdir -p src/Application/{UseCases,DTOs}
mkdir -p src/Infrastructure/{Persistence/Repositories,Services,Logging}

# 3. Install core deps (60 seconds)
pnpm add prisma @prisma/client zod
pnpm add next-auth @auth/prisma-adapter
pnpm add @aws-sdk/client-s3 @aws-sdk/client-ses @aws-sdk/client-bedrock-runtime
pnpm add @aws-sdk/s3-request-presigner
pnpm add openai                          # if using OpenAI instead of Bedrock
pnpm add -D @types/node

# 4. Set tsconfig paths for layer aliases (paste into compilerOptions)
# "@domain/*":         ["./src/Domain/*"]
# "@application/*":   ["./src/Application/*"]
# "@infrastructure/*":["./src/Infrastructure/*"]

# 5. Init Prisma (10 seconds)
pnpm prisma init

# 6. Create base files immediately (copy from Part 3.5 templates):
#    src/Domain/Errors/AppError.ts         ← error hierarchy
#    lib/db.ts                             ← Prisma singleton
#    src/Infrastructure/Persistence/RepositoryFactory.ts
#    src/Infrastructure/Services/ServiceFactory.ts

# 7. After writing Prisma schema — migrate (10 seconds)
pnpm prisma migrate dev --name init

# 8. Build check before demo
pnpm build
```

---

## PART 7: FOLDER STRUCTURE — CLEAN ARCHITECTURE (LOCKED)

This structure is the same for every project. Only the entity names change.

```
my-app/
│
├── src/                                ← Clean Architecture layers live here
│   │
│   ├── Domain/                         ← LAYER 1: Pure business logic, zero external deps
│   │   ├── Entities/
│   │   │   ├── User.ts
│   │   │   ├── Product.ts
│   │   │   └── Order.ts
│   │   ├── Repositories/               ← Interfaces only, no implementations
│   │   │   ├── IUserRepository.ts
│   │   │   ├── IProductRepository.ts
│   │   │   └── IOrderRepository.ts
│   │   ├── Errors/
│   │   │   └── AppError.ts             ← AppError + NotFoundError + UnauthorizedError etc.
│   │   └── ValueObjects/               ← Immutable types (Money, Email, Address)
│   │       └── Money.ts
│   │
│   ├── Application/                    ← LAYER 2: Use Cases, one per user action
│   │   ├── UseCases/
│   │   │   ├── User/
│   │   │   │   ├── CreateUserUseCase.ts
│   │   │   │   └── GetUserUseCase.ts
│   │   │   ├── Product/
│   │   │   │   ├── CreateProductUseCase.ts
│   │   │   │   ├── ListProductsUseCase.ts
│   │   │   │   └── UpdateProductUseCase.ts
│   │   │   └── Order/
│   │   │       ├── PlaceOrderUseCase.ts
│   │   │       └── CancelOrderUseCase.ts
│   │   └── DTOs/                       ← Input/Output types shared across use cases
│   │       └── OrderDTO.ts
│   │
│   └── Infrastructure/                 ← LAYER 3: All external concerns
│       ├── Persistence/
│       │   ├── Repositories/           ← Prisma implementations of Domain interfaces
│       │   │   ├── PrismaUserRepository.ts
│       │   │   ├── PrismaProductRepository.ts
│       │   │   └── PrismaOrderRepository.ts
│       │   └── RepositoryFactory.ts    ← Wires interfaces → implementations
│       ├── Services/                   ← AWS, AI, email, payments
│       │   ├── S3StorageService.ts
│       │   ├── BedrockAIService.ts
│       │   ├── SESEmailService.ts
│       │   └── ServiceFactory.ts       ← Wires service interfaces → implementations
│       └── Logging/
│           └── logger.ts               ← pino singleton, imported only in Infrastructure
│
├── app/                                ← LAYER 4: Next.js Presentation layer
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts
│   │   ├── products/
│   │   │   ├── route.ts                ← GET list, POST create
│   │   │   └── [id]/route.ts           ← GET one, PUT update, DELETE
│   │   └── orders/
│   │       ├── route.ts
│   │       └── [id]/route.ts
│   ├── (auth)/
│   │   └── login/page.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx                  ← auth guard lives here
│   │   ├── products/page.tsx
│   │   └── orders/page.tsx
│   └── layout.tsx
│
├── components/                         ← React UI (also Presentation)
│   ├── ui/                             ← shadcn/ui components
│   └── [feature]/                      ← feature-specific components
│
├── lib/
│   ├── db.ts                           ← Prisma singleton (Infrastructure only imports this)
│   └── auth.ts                         ← NextAuth config
│
├── middleware.ts                       ← JWT check + role gate (Presentation)
├── prisma/
│   └── schema.prisma
└── .env.local
```

**Import rules enforced by tsconfig paths:**
```
✓  @domain/*         → src/Domain/*
✓  @application/*    → src/Application/*
✓  @infrastructure/* → src/Infrastructure/*
✗  Never: import from @infrastructure in @application files
✗  Never: import prisma directly in app/api routes
✗  Never: import @aws-sdk in src/Domain or src/Application
```

---

## PART 8: THE RECOMMENDATION OUTPUT TEMPLATE

When you've run through Parts 1–3, say or write this out loud before touching the keyboard. This is the "architect moment" that impresses:

```
PROJECT ASSESSMENT
==================
Type:                [A/B/C/D/E/F] — [description]
Complexity:          [score]/15 → [strategy: full / core+stub / arch+critical-path]
Primary user action: [one sentence]
Core entities:       [comma-separated list]

ARCHITECTURE
============
Pattern:    Clean Architecture — Domain / Application / Infrastructure / Presentation
Layers:
  Domain:         [Entity1], [Entity2] — pure business logic, no external deps
  Application:    [UseCase1], [UseCase2], [UseCase3] — one per user action
  Infrastructure: Prisma repositories + [AWS services] + [AI service]
  Presentation:   Next.js API routes (call use cases only) + React UI

RECOMMENDED STACK
=================
Framework:  Next.js 14 (App Router) + TypeScript
Database:   PostgreSQL via Prisma
Auth:       [NextAuth / Cognito / Stub]
AI:         [OpenAI / Bedrock / None] — [pattern: chat/RAG/generation/classification]
Styling:    Tailwind CSS + shadcn/ui
Deploy:     [Vercel / EC2 / Lambda]

AWS SERVICES NEEDED
===================
[Service]  → [purpose] → [ENV vars needed]
[Service]  → [purpose] → [ENV vars needed]

LAYER MAPPING
=============
Domain Entities:      [Entity1], [Entity2], [Entity3]
Repository Interfaces: I[Entity1]Repository, I[Entity2]Repository
Use Cases:
  [Feature]/Create[Entity]UseCase   → input: {...}  output: {...}
  [Feature]/Get[Entity]UseCase      → input: {id}   output: {...}
  [Feature]/[Action][Entity]UseCase → input: {...}  output: {...}
Infrastructure:
  Prisma[Entity]Repository  implements  I[Entity]Repository
  [AWS]Service              implements  I[Service] (if AI/storage needed)
API Routes:
  POST /api/[entity]       → Create[Entity]UseCase
  GET  /api/[entity]/[id]  → Get[Entity]UseCase
  POST /api/[feature]      → [Action][Entity]UseCase

EXECUTION ORDER
===============
Phase 1 (0–10 min):  Scaffold + mkdir clean arch dirs + Prisma schema + migrate
Phase 2 (10–15 min): Domain layer — Entities + Interfaces + AppError
Phase 3 (15–30 min): Application layer — Use Cases for core feature
Phase 4 (30–40 min): Infrastructure — Prisma repos + RepositoryFactory + ServiceFactory
Phase 5 (40–50 min): Presentation — API routes + React UI for primary action
Phase 6 (50–58 min): AWS [service] integration + AI [feature]
Phase 7 (58–60 min): Test golden path + verify layer violations checklist

RISK FLAGS
==========
[ ] [anything that could break — DB connection, CORS, env vars missing]
[ ] Layer shortcuts: if time is critical, stub [specific use case] verbally
[ ] What to cut: [specific feature] — explain the trade-off, don't silently skip
```

---

## PART 9: CLAUDE PROMPTING PROTOCOLS

### 9.1 — Session Start Protocol

Paste this at the start of every Claude session. Never skip the architecture block — it locks every response to the right layer:

```
CONTEXT:
Stack:        Next.js 14 App Router, TypeScript, Prisma + PostgreSQL, Tailwind CSS
Architecture: Clean Architecture — Domain / Application / Infrastructure / Presentation
Aliases:      @domain/* → src/Domain/*, @application/* → src/Application/*,
              @infrastructure/* → src/Infrastructure/*
Time limit:   [X] minutes
AWS services: [list or "none"]
AI model:     [OpenAI gpt-4o / Bedrock claude-3-5-sonnet / none]

LAYER RULES (enforce strictly):
- Domain:         no external imports. pure TypeScript classes only.
- Application:    imports @domain only. never @infrastructure.
- Infrastructure: implements Domain interfaces. has Prisma + AWS.
- Presentation:   app/api routes call UseCases via RepositoryFactory/ServiceFactory only.

TASK:
[Paste exact requirement here]

MY DECISIONS:
- Project type: [A/B/C/D/E/F]
- Entities: [list]
- Use cases needed: [list of UseCase names]
- Auth: [NextAuth session / Cognito / stubbed userId]

REQUEST:
Give me [specific thing] — complete code, correct file path, no placeholders, no TODOs.
File: [exact path]
```

### 9.2 — Prompt Patterns by Layer and Output Type

**For a Domain Entity:**
```
Write a Domain Entity for [EntityName].
File: src/Domain/Entities/[EntityName].ts
Fields: [list with types]
Business methods: [describe any domain logic methods needed]
Rules: pure TypeScript only — no external imports, no Prisma, no AWS.
```

**For a Domain Repository Interface:**
```
Write the repository interface for [EntityName].
File: src/Domain/Repositories/I[EntityName]Repository.ts
Methods: findById, findAll (with filter: [fields]), save, delete
Imports only: @domain/Entities/[EntityName]
```

**For an Application Use Case:**
```
Write a Use Case: [Action][Entity]UseCase.
File: src/Application/UseCases/[Feature]/[Action][Entity]UseCase.ts
Input DTO: [fields with types]
Output DTO: [fields with types]
Constructor receives: [IRepositoryInterface], [IServiceInterface if AI/storage needed]
Logic: [describe what it does step by step]
Error cases: throw [NotFoundError / ValidationError / UnauthorizedError] from @domain/Errors/AppError
Rule: no @infrastructure imports — only @domain.
```

**For an Infrastructure Prisma Repository:**
```
Write a Prisma repository: Prisma[EntityName]Repository.
File: src/Infrastructure/Persistence/Repositories/Prisma[EntityName]Repository.ts
Implements: I[EntityName]Repository from @domain/Repositories/I[EntityName]Repository
Uses: prisma from lib/db
Maps Prisma rows to Domain Entity: new [EntityName](...) in every method
Methods: findById, findAll, save (upsert), delete
```

**For an Infrastructure AWS Service:**
```
Write an Infrastructure service: [AWS]Service.
File: src/Infrastructure/Services/[AWS]Service.ts
Purpose: [S3 upload / SES email / Bedrock chat / Cognito auth]
Uses: @aws-sdk v3 modular imports
Credentials from env: AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION
Input: [describe]
Output: [describe]
Error: throw with descriptive message
```

**For a Presentation API Route:**
```
Write a Next.js App Router route at [METHOD] app/api/[path]/route.ts.
Architecture rules:
  - Import UseCase from @application/UseCases/[path]
  - Import RepositoryFactory from @infrastructure/Persistence/RepositoryFactory
  - Import ServiceFactory from @infrastructure/Services/ServiceFactory (if AI/storage)
  - Import AppError from @domain/Errors/AppError
  - NO direct Prisma imports. NO direct AWS imports.
Auth: userId from session (getServerSession), never from request body.
Input validation: Zod schema, safeParse, return 400 on failure.
Error handling: instanceof AppError → return error.statusCode, else return 500.
```

**For the Factory files (when adding a new entity/service):**
```
Update RepositoryFactory at src/Infrastructure/Persistence/RepositoryFactory.ts.
Add a static method: [entityName]() that returns new Prisma[EntityName]Repository().
Follow the existing pattern exactly.
```

### 9.3 — Error Recovery Protocol

When something breaks:
```
ERROR:
[paste full error message]

CONTEXT:
File: [file path]
[paste relevant code block]

Fix this. Do not change the function signature or the file structure.
```

### 9.4 — The Pre-Demo Review Prompt

Run this 5 minutes before demo:
```
Review this file for production issues only — not style:
[paste file]

Check for:
1. Unhandled promise rejections
2. Missing null checks on DB results
3. Exposed secrets or debug logs
4. API routes that return 200 on errors
5. Missing env var access guards

List only real bugs, not suggestions.
```

---

## PART 10: QUICK-REFERENCE DECISION TABLE

| If you hear... | It means... | Your move |
|---|---|---|
| "Connect to S3" | File storage needed | S3 + presigned URL pattern |
| "Use Cognito" | Auth is AWS-managed | NextAuth + Cognito provider |
| "Bedrock" | AWS-managed AI models | BedrockRuntimeClient + InvokeModelCommand |
| "RDS" | Managed PostgreSQL | DATABASE_URL env + Prisma |
| "Lambda" | Serverless function | Either Next.js API route OR separate Lambda |
| "Multi-vendor" | Seller + Buyer roles | RBAC + sellerId on Product model |
| "Real-time" | Live updates needed | SSE via ReadableStream OR Pusher |
| "Recommendations" | AI-based suggestions | Embeddings + vector similarity |
| "Chatbot" | Conversational AI | useChat + streaming + Conversation model |
| "Image generation" | AI image output | Bedrock Titan / OpenAI DALL-E |
| "Dashboard" | Admin view of data | Protected route + aggregation queries |
| "Payments" | Stripe or Razorpay | Always server-side verification + webhook |
| "Notifications" | Email or push | SES for email, or web push |
| "Search" | Full-text search | PostgreSQL full-text OR OpenSearch |

---

## PART 11: CLEAN ARCHITECTURE ANTI-PATTERNS TO CALL OUT

Say these out loud when reviewing — it shows architectural awareness:

| Anti-Pattern | Why it's wrong | Fix |
|---|---|---|
| `import { prisma } from "lib/db"` inside a Use Case | Application depends on Infrastructure — breaks DI | Inject `IRepository` via constructor |
| `new PrismaUserRepository()` inside a Use Case | Use Case instantiates its own dependency | Call `RepositoryFactory.user()` in the route, pass it in |
| Business logic in an API route | Presentation layer doing Application work | Extract to a Use Case, route just calls it |
| `if (user.role === "admin")` inside a Domain Entity | Domain knows about application-level roles | Role check belongs in Use Case or middleware |
| `console.log` in any layer | No structured logging, breaks in prod | Use `logger` from `@infrastructure/Logging/logger` |
| Domain Entity with optional fields for every scenario | Anemic domain model | Add business methods that enforce invariants |
| One giant Use Case doing 5 things | Violates Single Responsibility | Split into 5 focused Use Cases |
| AWS SDK imported directly in app/api route | Presentation importing Infrastructure | Put it in a Service, call via ServiceFactory |

---

## APPENDIX: ENV FILE TEMPLATE

Copy this, fill in what's needed, delete what's not:

```env
# Database
DATABASE_URL="postgresql://user:password@host:5432/dbname?schema=public"

# Auth (NextAuth)
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
NEXTAUTH_URL="http://localhost:3000"

# AWS Core
AWS_ACCESS_KEY_ID=""
AWS_SECRET_ACCESS_KEY=""
AWS_REGION="us-east-1"

# S3
S3_BUCKET_NAME=""
S3_PUBLIC_URL=""

# Cognito
COGNITO_USER_POOL_ID=""
COGNITO_CLIENT_ID=""
COGNITO_CLIENT_SECRET=""
COGNITO_ISSUER=""   # https://cognito-idp.{region}.amazonaws.com/{userPoolId}

# SES
SES_FROM_EMAIL=""

# AI
OPENAI_API_KEY=""
BEDROCK_MODEL_ID="anthropic.claude-3-5-sonnet-20241022-v2:0"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

---

---

## APPENDIX: CLEAN ARCHITECTURE IN ONE SENTENCE PER LAYER

Say this if asked to explain your architecture choice:

> "Domain holds pure business logic with no dependencies.
> Application holds Use Cases that orchestrate Domain entities.
> Infrastructure implements those contracts using Prisma and AWS.
> Presentation calls Use Cases through Next.js routes — it never touches the database directly.
> Everything depends inward — Presentation never reaches into Infrastructure, and Application never reaches into Infrastructure. Dependencies are injected, not instantiated."

---

*Framework version: 2.0 | Updated: 2026-05-14*
*Architecture: Clean Architecture (Domain → Application → Infrastructure → Presentation) — non-negotiable on every project.*
