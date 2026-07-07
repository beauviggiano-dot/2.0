import { neon } from "@neondatabase/serverless"

// Shared, public economic-calendar cache. No per-user data, so a single
// HTTP-based Neon client is all we need (no connection pooling concerns).
export const sql = neon(process.env.DATABASE_URL!)
