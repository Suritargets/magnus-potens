import { test, expect } from '@playwright/test'

test.describe('Magnus & Potens — smoke tests', () => {
  test('homepage loads and shows firm name', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/Magnus/i)
    // The Marcellus logotype should be visible
    const body = page.locator('body')
    await expect(body).toContainText('MAGNUS')
  })

  test('homepage has hero section', async ({ page }) => {
    await page.goto('/')
    // Hero headline should be present
    const hero = page.locator('main section').first()
    await expect(hero).toBeVisible()
  })

  test('contact section is reachable via anchor', async ({ page }) => {
    await page.goto('/#contact')
    // Contact section should exist
    const contact = page.locator('[id="contact"]')
    await expect(contact).toBeVisible()
  })

  test('health API returns ok', async ({ request }) => {
    const res = await request.get('/api/health')
    expect(res.status()).toBe(200)
    const json = await res.json()
    expect(json.ok).toBe(true)
  })

  test('404 page renders correctly', async ({ page }) => {
    await page.goto('/this-page-does-not-exist-xyz')
    await expect(page.locator('text=404')).toBeVisible()
    await expect(page.locator('text=Return home')).toBeVisible()
  })

  test('no console errors on homepage', async ({ page }) => {
    const errors: string[] = []
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text())
    })
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    expect(errors).toHaveLength(0)
  })
})
