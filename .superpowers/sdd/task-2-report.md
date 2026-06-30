# Task 2 Report: Extend DB schema — 4 new tables + 2 new enums

## Status: DONE_WITH_CONCERNS

## What was done
Appended to `src/db/schema.ts` (lines 98–171):
- 2 new enums: `postStatusEnum`, `appointmentStatusEnum`
- 4 new tables: `blogPosts`, `appointments`, `availabilityConfig`, `mediaAssets`
- 8 new TypeScript types: `BlogPost`, `NewBlogPost`, `Appointment`, `NewAppointment`, `AvailabilityConfig`, `NewAvailabilityConfig`, `MediaAsset`, `NewMediaAsset`
- No existing code was touched

## Type-check result
`npm run type-check` exits with code 2, but the 2 errors are **pre-existing** in `src/lib/rate-limit.ts` (lines 50–51):
```
src/lib/rate-limit.ts(50,17): error TS2339: Property 'get' does not exist on type 'Promise<ReadonlyHeaders>'.
src/lib/rate-limit.ts(51,17): error TS2339: Property 'get' does not exist on type 'Promise<ReadonlyHeaders>'.
```
These errors exist because `headers()` returns a `Promise<ReadonlyHeaders>` in Next.js 15 and the code is not awaiting it. This is unrelated to the schema changes in Task 2.

## Concern
The pre-existing `rate-limit.ts` type errors mean `npm run type-check` does not exit 0 for the project as a whole. The schema additions themselves are type-safe. Task 3+ should address or note the `rate-limit.ts` issue.

## Acceptance criteria check
- [x] All 4 new tables exist in schema.ts
- [x] All 2 new enums exist in schema.ts
- [x] All 8 new TypeScript types exported
- [x] No existing code modified
- [ ] `npm run type-check` exits 0 — BLOCKED by pre-existing errors in `src/lib/rate-limit.ts`
