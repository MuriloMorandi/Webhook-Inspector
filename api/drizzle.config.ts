import { env } from '@/env'
import type { Config } from 'drizzle-kit'

export default {
  dialect: 'postgresql',
  dbCredentials: {
    url: env.DATABASE_URL,
  },
  out: './src/db/migrations',
  schema: './src/db/schema/index.ts',
  casing: 'camelCase',
} satisfies Config
