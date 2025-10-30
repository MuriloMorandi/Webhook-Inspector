import { env } from '@/env'
import { drizzle } from 'drizzle-orm/node-postgres'
import * as schema from './schema/index.js'

export const dbClient = drizzle(env.DATABASE_URL, {
  schema,
  casing: 'camelCase',
  logger: true,
})
