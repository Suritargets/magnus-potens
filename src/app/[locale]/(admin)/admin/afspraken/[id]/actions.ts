'use server'

import { db } from '@/db'
import { appointments } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { requireRole } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

export async function updateAppointmentStatus(
  id: string,
  status: 'confirmed' | 'cancelled'
): Promise<{ success: boolean; error?: string }> {
  try {
    await requireRole('admin', 'super_admin')

    const now = new Date()
    await db
      .update(appointments)
      .set({
        status,
        confirmedAt: status === 'confirmed' ? now : undefined,
        cancelledAt: status === 'cancelled' ? now : undefined,
      })
      .where(eq(appointments.id, id))

    revalidatePath('/admin/afspraken')
    revalidatePath(`/admin/afspraken/${id}`)

    return { success: true }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return { success: false, error: message }
  }
}
