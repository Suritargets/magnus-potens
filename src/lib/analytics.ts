import 'server-only'
import { createHash } from 'crypto'

const BOT_PATTERNS = /bot|crawl|spider|slurp|facebookexternalhit|preview|monitor|pingdom|uptimerobot|headless|lighthouse|vercel-screenshot/i

export function isBot(userAgent: string | null): boolean {
  if (!userAgent) return true // geen UA — meestal een script/bot
  return BOT_PATTERNS.test(userAgent)
}

/**
 * Eenrichtings-hash van IP + user-agent, gezouten met AUTH_SECRET.
 * Nooit het IP zelf opslaan — alleen bruikbaar om (ruwe) unieke bezoekers
 * te tellen binnen deze applicatie, niet herleidbaar naar een persoon.
 */
export function hashVisitor(ip: string, userAgent: string): string {
  const salt = process.env.AUTH_SECRET ?? 'fallback-salt'
  return createHash('sha256').update(`${salt}:${ip}:${userAgent}`).digest('hex').slice(0, 32)
}
