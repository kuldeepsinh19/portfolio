# Database Configuration — Senior Engineering Rules

> Generic, database-agnostic rules for initializing, configuring, and scaling any database (SQL, NoSQL, Graph, Time-Series, etc.) in any production project.

---

## 1. Connection & Credentials

- **NEVER hardcode credentials.** Always load from environment variables or a secrets manager (Vault, AWS Secrets Manager, GCP Secret Manager, Doppler).
- **NEVER commit `.env` files** containing real credentials. Add them to `.gitignore` immediately.
- Use **dedicated service accounts** per environment (dev, staging, prod). Zero shared credentials across environments.
- Rotate credentials on a schedule. Automate rotation where possible.
- Always use **TLS/SSL** for database connections — never plain-text transport in any environment.
- Store connection strings with the format: `protocol://user:pass@host:port/dbname?options` — validate structure at startup.
- **Principle of Least Privilege**: the application user should only have `SELECT`, `INSERT`, `UPDATE`, `DELETE` on required tables — never `DROP`, `CREATE`, or superuser access at runtime.

---

## 2. Connection Pooling

- **Always use a connection pool.** Never open a raw connection per request.
- Set explicit pool limits:
  - `min`: 2–5 (keep warm connections alive)
  - `max`: tune based on DB server's `max_connections` — a safe formula: `max = (num_cores * 2) + effective_spindle_count`
- Set `connection_timeout`, `idle_timeout`, and `max_lifetime` on every pool — prevent stale/leaked connections.
- Monitor pool utilization in production dashboards. Alert at >80% pool usage.
- For serverless / edge environments, use an **external connection pooler** (PgBouncer, RDS Proxy, Prisma Accelerate) — never raw pool inside a lambda.

---

## 3. Schema Design Rules

- **Schema-first, always.** Define schema before writing application code. Never infer schema from code.
- Every table/collection **must have a primary key**. Prefer `UUID v7` or `ULID` over auto-increment integers for distributed systems.
- Add **`created_at` and `updated_at` timestamps** to every entity table — never omit them.
- **Soft deletes over hard deletes** for user-facing data: add `deleted_at TIMESTAMP NULL` column. Hard deletes are irreversible.
- Normalize to at least **3NF** for relational schemas unless you have a measured performance reason to denormalize.
- Use **explicit column types** — never `TEXT` when `VARCHAR(n)` is known, never `FLOAT` for money (use `DECIMAL`/`NUMERIC`).
- **Never use reserved words** as table/column names.
- Add `NOT NULL` constraints by default. Only allow `NULL` when it has explicit semantic meaning (unknown vs. empty are different).
- Add **`CHECK` constraints** at the DB level for enums, ranges, and format validations — don't rely solely on application-level validation.
- Use **foreign key constraints** for relational integrity — do not skip them for "performance" without benchmarking proof.

---

## 4. Migrations

- **Every schema change goes through a migration file.** No manual `ALTER TABLE` in production.
- Migration files are **immutable once merged** — never edit a committed migration. Create a new one to reverse or modify.
- Name migrations with a **timestamp prefix**: `20240514_001_add_users_table.sql` — never sequential integers alone.
- Migrations must be **idempotent** where possible (`CREATE TABLE IF NOT EXISTS`, `CREATE INDEX IF NOT EXISTS`).
- Run migrations in a **transaction**. If the migration fails, it rolls back cleanly.
- Maintain both **up** and **down** migration scripts. A migration with no rollback path is a production risk.
- Test migrations on a **production-like data volume** before deploying. A migration that takes 2s on dev may lock prod for 20 minutes.
- Use **zero-downtime migration patterns** for large tables:
  1. Add new column (nullable)
  2. Backfill data in batches
  3. Add constraint / NOT NULL
  4. Remove old column in a later release
- Store migration state in a **dedicated migrations table** — never track it manually.

---

## 5. Indexing

- Index **every foreign key column** — unindexed FKs cause full table scans on JOINs and deletes.
- Index every column used in **`WHERE`, `ORDER BY`, `GROUP BY`** in frequent queries.
- Use **composite indexes** for multi-column filter patterns — column order matters (most selective first, or match query predicate order).
- Use **partial indexes** for filtered queries (e.g., `WHERE deleted_at IS NULL`).
- Use **covering indexes** to avoid table lookups for high-frequency read queries.
- **Do not over-index** — every index slows down `INSERT`/`UPDATE`/`DELETE`. Benchmark before adding.
- Audit unused indexes regularly with query statistics views. Drop dead indexes.
- For full-text search: use DB-native FTS (PostgreSQL `tsvector`, MySQL FULLTEXT) or a dedicated search engine (Elasticsearch, Typesense) — never `LIKE '%term%'` on large tables.

---

## 6. Query Safety

- **Never interpolate user input into raw queries.** Always use parameterized queries / prepared statements — this is non-negotiable.
- Prefer **ORMs or query builders** with parameterization, but understand the SQL they generate.
- Log slow queries using `slow_query_log` or equivalent. Set threshold at 100ms–500ms for OLTP workloads.
- Use `EXPLAIN ANALYZE` / query plan inspection before shipping any complex query to production.
- Avoid `SELECT *` in application code — always specify required columns to reduce I/O and prevent schema-change breakage.
- Apply **pagination to all list queries** — never allow unbounded `SELECT` without `LIMIT`.
- For write-heavy operations, **batch inserts** over individual row inserts.

---

## 7. Transactions & Consistency

- Use **explicit transactions** for multi-step write operations. Never assume implicit transaction safety.
- Keep transactions **as short as possible** — long transactions cause lock contention and block concurrent writers.
- **Never perform I/O** (HTTP calls, file reads) inside a transaction.
- Choose the correct **isolation level** per use-case:
  - `READ COMMITTED`: default for most OLTP
  - `REPEATABLE READ`: needed when reading data twice in one operation
  - `SERIALIZABLE`: for strict financial or inventory operations
- Use **optimistic locking** (version/timestamp columns) for high-concurrency entities to avoid pessimistic lock deadlocks.
- Always handle **deadlock retries** in the application layer — deadlocks are normal and expected in concurrent systems.

---

## 8. Environment Parity

- **Maintain separate databases** for dev, test, staging, and production. Never share databases across environments.
- Use **the same database engine and version** across all environments. "It works on SQLite dev, fails on Postgres prod" is a preventable mistake.
- Seed dev/test databases with **realistic data volumes** — 10 rows in dev is meaningless for performance validation.
- **Never point automated tests at a production database.** Use isolated test DBs, reset between test runs.
- Use **Docker Compose** to provide local DB instances — no manual installation required for onboarding.

---

## 9. Backup & Recovery

- **Automate backups** — never rely on manual backup processes.
- Follow the **3-2-1 rule**: 3 copies, 2 different media, 1 offsite.
- Define and test **RTO (Recovery Time Objective)** and **RPO (Recovery Point Objective)** before going live.
- **Test restores regularly** — a backup you've never restored is not a backup.
- For relational databases, enable **WAL archiving / binlog** for point-in-time recovery (PITR).
- Store backup encryption keys **separately** from the backups themselves.
- Retain backups per environment:
  - Production: 30+ days
  - Staging: 7 days
  - Dev: not required

---

## 10. Observability & Monitoring

- Expose and collect the following metrics for every database:
  - Query latency (p50, p95, p99)
  - Connection pool utilization
  - Active connections vs. max connections
  - Cache hit rate (buffer pool / shared_buffers)
  - Replication lag (if applicable)
  - Lock wait time
  - Deadlock count
  - Disk I/O and storage utilization
- Set **alerts** before dashboards — alert on connection exhaustion, replication lag >30s, p99 latency >1s.
- Enable **audit logging** for production — log who changed what and when, especially for sensitive tables.
- Use **distributed tracing** (OpenTelemetry) to correlate slow DB queries with application request traces.

---

## 11. Scalability Patterns

- Design for **horizontal read scaling from day one**: use read replicas for reporting/analytics queries.
- Separate **OLTP and OLAP workloads** — never run analytical reports on the primary transactional database.
- Plan your **sharding strategy** before data reaches the scale where it becomes painful — shard by tenant, region, or hash.
- Use **caching layers** (Redis, Memcached) for frequently read, rarely changing data — never cache mutable shared state without an invalidation strategy.
- Implement **database-level rate limiting** or circuit breakers to protect the DB from application runaway queries.
- For event-driven architectures, implement the **outbox pattern** for reliable event publishing — never publish events inside a DB transaction with an external call.

---

## 12. Multi-Tenancy

- Decide on a tenancy model **before** schema design:
  - **Schema-per-tenant**: strong isolation, harder to manage at scale
  - **Row-level tenancy**: easy to manage, requires strict `tenant_id` enforcement everywhere
  - **Database-per-tenant**: maximum isolation, expensive
- For row-level tenancy: **every table must have `tenant_id`**. Add database-level Row-Level Security (RLS) policies — do not rely on application-level filtering alone.
- Test that cross-tenant data leakage is **impossible at the query level**, not just the API level.

---

## 13. Startup Validation Checklist

Run these checks at **application startup** before accepting traffic:

- [ ] Database connection is reachable
- [ ] Credentials are valid and not expired
- [ ] Pending migrations are detected and either auto-run or cause a startup failure with clear error
- [ ] Connection pool is initialized within configured bounds
- [ ] Required tables/collections exist (schema version matches expected)
- [ ] Health check endpoint queries the database and surfaces real connectivity status
- [ ] SSL/TLS is active on the connection
- [ ] Read replica connectivity verified (if applicable)

---

## 14. Anti-Patterns — Never Do These

| Anti-Pattern | Why It's Dangerous |
|---|---|
| Hardcoded credentials | Leaked in version control, shared across envs |
| `SELECT *` in production queries | Schema changes silently break consumers |
| No connection pool | Exhausts DB connections under load |
| Migrations without transactions | Partial schema changes corrupt state |
| Storing passwords in plain text | Non-negotiable security violation |
| Running migrations manually | Bypasses audit trail, causes drift |
| Skipping foreign keys "for performance" | Silent data corruption at scale |
| Sharing DB across environments | Test data destroys prod, or vice versa |
| No `updated_at` column | Impossible to implement sync, CDC, or auditing later |
| Unbounded list queries (no LIMIT) | Single bad request can kill the DB |
| Long-running transactions | Lock contention brings down production |
| `LIKE '%term%'` on large tables | Full table scans — use FTS instead |
| Storing file blobs in the DB | Bloats DB, kills performance — use object storage |
| Trusting `AUTO_INCREMENT` for distributed IDs | ID collision across shards/nodes |
| No backup restoration test | False sense of recovery safety |

---

## 15. Technology-Specific Notes

### Relational (PostgreSQL / MySQL / SQL Server)
- Set `timezone = 'UTC'` at the server level — never store local timestamps.
- Use `JSONB` (Postgres) for semi-structured data only when schema flexibility is genuinely needed.
- Run `VACUUM` / `ANALYZE` regularly (or ensure autovacuum is tuned).
- Set `statement_timeout` to prevent runaway queries from locking resources.

### NoSQL (MongoDB / DynamoDB / Cassandra)
- Define **access patterns first**, then design the schema around them — opposite of relational design.
- Use **TTL indexes/fields** for ephemeral data (sessions, OTPs, logs).
- For DynamoDB: design partition keys carefully to avoid **hot partitions** — uniform distribution is critical.
- For Cassandra: every query must include the **partition key** — full table scans are catastrophically expensive.

### Redis / Key-Value Stores
- Set **`maxmemory` and eviction policy** explicitly — default is no eviction, which causes OOM crashes.
- Always set **TTL on every key** — unbounded key growth crashes instances.
- Use **namespaced keys**: `app:env:entity:id` — never bare keys.
- Never use Redis as your **primary database** for data you cannot lose.

### Time-Series (InfluxDB / TimescaleDB / Prometheus)
- Always define a **retention policy** — time-series data grows without bound by default.
- Use **down-sampling** for long-term historical data — store raw data for 7 days, hourly aggregates for 1 year.
- Partition by time (hypertables, measurements) — never store time-series in a flat relational table.

---

> **Rule Zero**: Every decision you make at the database layer is 10x harder to reverse than at the application layer. Design deliberately, document every decision, and treat the database as the most critical layer of your system.
