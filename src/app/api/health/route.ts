import { db } from '@/db'
import { sql } from 'drizzle-orm'

export const runtime = 'edge'

export async function GET() {
  try {
    await db.execute(sql`SELECT 1`)

    return Response.json({
      status: 'ok',
      client: 'magnus-potens',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version ?? '0.0.0',
    })
  } catch (error) {
    console.error('Health check failed:', error)
    return Response.json(
      { status: 'error', message: 'Database unreachable' },
      { status: 503 }
    )
  }
}
