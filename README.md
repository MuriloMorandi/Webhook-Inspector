# Webhook Inspector

Monorepo (pnpm workspaces) com dois pacotes:
- `api`: captura, armazena e expõe webhooks (docs em `/docs`).
- `web`: interface React para listar e inspecionar eventos.

## Stack

- API: Fastify + Zod + Drizzle (PostgreSQL) + Swagger UI
- Web: React + TanStack Router + React Query + Tailwind + Shiki
- Geração de código: endpoint `POST /generate` (Gemini)
- Schema: `webhooks` no banco (Drizzle)

## Pré‑requisitos

- Node 20+
- pnpm 9+
- PostgreSQL (ou usar `api/docker-compose.yml`)

## Instalação

No diretório raiz do monorepo:
```sh
pnpm install
```

## Variáveis de ambiente (API)

Crie um arquivo `.env` em `api/` (veja `api/.env.example`):

```
NODE_ENV=dev
PORT=3333
DATABASE_URL=postgres://user:pass@localhost:5432/webhooks
GOOGLE_GENERATIVE_AI_API_KEY=...
```

Opcional (Docker para Postgres):
```sh
cd api
docker compose up -d
```

## Variáveis de ambiente (Web)

Crie `web/.env` (veja `web/.env.example`):
```
VITE_API_URL=http://localhost:3333
```
Altere conforme URL pública da API em produção.

## Executar em desenvolvimento

Terminal 1 (API):
```sh
cd api
pnpm dev
```

Terminal 2 (Web):
```sh
cd web
pnpm dev
```

- API Docs: http://localhost:3333/docs
- Web: http://localhost:5173

## Endpoints principais (API)

- GET `/webhooks` — lista paginada de webhooks
- GET `/webhook/:id` — detalhe de um webhook
- DELETE `/webhook/:id` — remove um webhook
- ALL `/capture/*` — captura genérica de webhooks
- POST `/generate` — gera código TypeScript a partir de bodies selecionados

## Capturando um webhook (exemplo)

```sh
curl -X POST http://localhost:3333/capture/stripe/events ^
  -H "Content-Type: application/json" ^
  -d "{\"type\":\"checkout.session.completed\",\"data\":{\"id\":\"evt_123\"}}"
```

Resposta:
```json
{ "id": "<uuid>" }
```

Depois, abra o front-end e clique no item para ver detalhes.

## Geração de handle (código)

Na UI, selecione múltiplos webhooks e clique em “Gerar handle”.
Via cURL:
```sh
curl -X POST http://localhost:3333/generate ^
  -H "Content-Type: application/json" ^
  -d "{ \"webhooksIds\": [\"<id1>\", \"<id2>\"] }"
```

## Estrutura do projeto

```
.
├─ api/   # Fastify, Drizzle (PostgreSQL), Swagger UI
└─ web/   # React + TanStack Router + React Query + Tailwind
```