# 🧠 Brev.ly — Backend

API para encurtamento de links, construída com Fastify, PostgreSQL e Drizzle ORM.

---

## 🛠️ Tecnologias

- Fastify (servidor)
- Drizzle ORM + PostgreSQL
- Zod (validação)
- Vitest (testes)
- TypeScript
- Docker (somente para o banco)
- tsup (build)

---

## 🔧 Como rodar

### 1. Instale as dependências

```bash
pnpm install
```

### 2. Configure o `.env.local`

```env
PORT=3333
NODE_ENV=development
DATABASE_URL=postgres://postgres:postgres@localhost:5432/postgres

CLOUDFLARE_ACCOUNT_ID=#
CLOUDFLARE_ACCESS_KEY_ID=#
CLOUDFLARE_SECRET_ACCESS_KEY=#
CLOUDFLARE_BUCKET=#
CLOUDFLARE_PUBLIC_URL=http://localhost

POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=postgres
POSTGRES_PORT=5432
```

### 3. Suba o banco de dados

```bash
pnpm db:up
```

> Isso usa `docker-compose.dev.yml` que está nesta pasta.

### 4. Rode as migrations de desenvolvimento

```bash
pnpm db:migration:dev
```

### 5. Rode em modo desenvolvimento

```bash
pnpm dev
```

---

## 🧪 Testes

```bash
pnpm test # ou
pnpm test:watch # modo watch
```

---

## 📦 Build

```bash
pnpm build
```

---
