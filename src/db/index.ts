import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from './schema'

type Database = ReturnType<typeof drizzle<typeof schema>>

let _db: Database | undefined

function getDb(): Database {
  if (!_db) {
    if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not set')
    _db = drizzle(neon(process.env.DATABASE_URL), { schema })
  }
  return _db
}

// Proxy keeps `db.select()` / `db.insert()` etc. working unchanged while
// deferring the real connection until the first actual query.
export const db: Database = new Proxy({} as Database, {
  get(_target, prop: string | symbol) {
    return getDb()[prop as keyof Database]
  },
})

export type DB = Database
