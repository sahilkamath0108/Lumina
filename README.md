# Lumina — Conference registration + real-time observability

Lumina is a full-stack **conference and workshop catalog** demo: attendees browse **sessions** (stored as catalog rows), save a **lineup**, and complete **registration** through a cart and checkout flow. The same system-design stack as a classic e-commerce build is preserved end to end—only the product story changed.

## What it demonstrates

- **Next.js** UI with Supabase Auth, TanStack Query, and Zustand for cart / saved sessions  
- **Express** API with repository → service → controller layering  
- **Supabase (PostgreSQL)** for users, carts, wishlists, orders, and the `products` table (each row is a **session** in the UX)  
- **Kafka** topic `lumina-user-events` for behavioral events (session views, saves, completed registrations)  
- **Redis** streams and sorted sets for live analytics (consumer group `redis-group`)  
- **Prometheus** scraping the API (`/metrics`), Kafka exporter, Redis exporter, and **cAdvisor**  
- **Grafana** for dashboards (bring your own JSON or build in the UI)  
- **Docker Compose** orchestration (`lumina-api`, `lumina-web`, brokers, observability sidecars)

## Architecture (unchanged mechanics)

1. Authenticated users hit **`/events/*`** on the API; JWTs are verified with the Supabase JWT secret.  
2. Opening a session detail triggers a **Kafka** “views” event; saving the lineup emits “wishlist”; placing an order emits “purchase” per line.  
3. The **Kafka consumer** projects those events into **Redis** (leaderboards, per-user counters, purchase hashes).  
4. **Prometheus** pulls Node/process metrics from `prom-client` (prefix `lumina_`) plus infrastructure exporters.

## Repository layout

```
.
├── server/      # Express, Kafka, Redis, Supabase, metrics
├── frontend/    # Next.js App Router, Tailwind, Radix/shadcn-style UI
├── docker-compose.yml
└── prometheus.yml
```

## Run locally (Docker)

Create the external network once:

```bash
docker network create monitoring
```

Copy environment variables (Supabase, Redis, public URLs, Grafana admin) into a `.env` at the project root, then:

```bash
docker compose up -d --build
```

Services:

- **lumina-web** — http://localhost:3000  
- **lumina-api** — http://localhost:5500 (set `EXPRESS_PORT` / defaults to 5500 in Compose)  
- **Prometheus** — http://localhost:9090  
- **Grafana** — http://localhost:4000  

**Note:** This Compose file does not start a Redis server—only `redis-exporter`. Point `REDIS_HOST` / `REDIS_PORT` at your Redis instance (cloud or local).

**Kafka topic:** On a fresh broker, ensure the topic `lumina-user-events` exists (Kafka may auto-create, or run `server/kafka/admin.js` once).

## Renaming note (Supabase schema)

Table names such as `products`, `product_id`, and `cart` are **unchanged** in the database so you do not need a migration for this rebrand. The UI and API routes use **session** language; only the persistence layer keeps legacy names.

## Optional: shared cookies in production

Set `SITE_COOKIE_DOMAIN` on the Next server if you serve the app on a custom parent domain and need cookies shared across subdomains. Omit it for localhost.

## Name

**Lumina** — spotlight on sessions, registrations, and full-stack visibility.
