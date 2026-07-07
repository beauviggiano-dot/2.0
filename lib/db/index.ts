import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import { neon } from '@neondatabase/serverless'
import * as schema from './schema'

// Shared pg Pool used by Better Auth and Drizzle — one connection, one source
// of truth for all per-user data.
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

export const db = drizzle(pool, { schema })

// Lightweight HTTP client used only for the public, shared economic-calendar
// cache (no per-user data). Kept separate from the pool above so the calendar
// feature is unaffected by session/auth concerns.
export const sql = neon(process.env.DATABASE_URL!)
