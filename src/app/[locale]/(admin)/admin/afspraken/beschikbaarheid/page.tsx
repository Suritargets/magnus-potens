import { db } from '@/db'
import { availabilityConfig } from '@/db/schema'
import { AvailabilityForm } from './AvailabilityForm'

export default async function BeschikbaarheidPage() {
  const configs = await db.select().from(availabilityConfig)
  return <AvailabilityForm configs={configs} />
}
