// Practice areas that have a published detail page, keyed by the locale-independent
// area id (see practice.areas[].id in each locale's messages file). Areas not listed
// here fall back to the homepage #practice anchor.
export const PRACTICE_DETAIL_SLUGS: Record<string, string> = {
  'dispute-resolution': '/practice/dispute-resolution',
  'litigation': '/practice/litigation',
  'corporate-commercial': '/practice/corporate-commercial',
  'regulatory-compliance': '/practice/regulatory-compliance',
  'digital-transformation': '/practice/digital-transformation',
}
