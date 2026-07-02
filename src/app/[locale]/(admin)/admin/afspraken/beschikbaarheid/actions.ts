'use server'

import { db } from '@/db'
import { availabilityConfig } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { requireRole } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

type SaveAvailabilityState = { success: boolean; error: string | null }

export async function saveAvailability(
  _prev: SaveAvailabilityState,
  formData: FormData
): Promise<SaveAvailabilityState> {
  try {
    await requireRole('admin', 'super_admin')

    for (let dow = 0; dow <= 6; dow++) {
      const isActive = formData.get(`active_${dow}`) === 'on'
      const startTime = (formData.get(`start_${dow}`) as string) || '09:00'
      const endTime = (formData.get(`end_${dow}`) as string) || '17:00'
      const slotDuration = Number(formData.get(`duration_${dow}`)) || 60

      const [existing] = await db
        .select()
        .from(availabilityConfig)
        .where(eq(availabilityConfig.dayOfWeek, dow))
        .limit(1)

      if (existing) {
        await db
          .update(availabilityConfig)
          .set({ isActive, startTime, endTime, slotDuration })
          .where(eq(availabilityConfig.id, existing.id))
      } else {
        await db.insert(availabilityConfig).values({ dayOfWeek: dow, startTime, endTime, slotDuration, isActive })
      }
    }

    revalidatePath('/admin/afspraken/beschikbaarheid')
    revalidatePath('/consultation')

    return { success: true, error: null }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return { success: false, error: message }
  }
}
