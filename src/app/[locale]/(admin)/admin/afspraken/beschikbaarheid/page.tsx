import { db } from '@/db'
import { availabilityConfig, availabilityOverrides } from '@/db/schema'
import { asc, gte } from 'drizzle-orm'
import { AvailabilityForm } from './AvailabilityForm'
import { DateBlocks } from './DateBlocks'

export default async function BeschikbaarheidPage() {
  const today = new Date().toISOString().slice(0, 10)

  const [configs, overrides] = await Promise.all([
    db.select().from(availabilityConfig),
    db
      .select()
      .from(availabilityOverrides)
      .where(gte(availabilityOverrides.date, today))
      .orderBy(asc(availabilityOverrides.date)),
  ])

  return (
    <div>
      <AvailabilityForm configs={configs} />
      <DateBlocks overrides={overrides} />
    </div>
  )
}
