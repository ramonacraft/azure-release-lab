import { expect, test } from '@playwright/test'

test.describe('Azure Release Lab smoke', () => {
  test('homepage shows brand and local path', async ({ page }) => {
    await page.goto('/')

    await expect(page.getByText('Azure Release Lab Dashboard', { exact: true }).first()).toBeVisible()
    await expect(page.getByTestId('path-headline')).toHaveText('Local path')
    await expect(page.getByTestId('env-chip')).toHaveText('local')
  })

  test('path steps list all four Azure stops', async ({ page }) => {
    await page.goto('/')

    await expect(page.getByTestId('path-step-pr')).toContainText('PR smoke')
    await expect(page.getByTestId('path-step-staging')).toContainText('Staging')
    await expect(page.getByTestId('path-step-production')).toContainText('Production')
    await expect(page.getByTestId('path-step-nightly')).toContainText('Nightly')
  })

  test('local lane marks PR as the current stop', async ({ page }) => {
    await page.goto('/')

    await expect(page.getByTestId('path-step-pr')).toHaveAttribute('data-current', 'true')
    await expect(page.getByTestId('path-step-production')).toHaveAttribute('data-current', 'false')
  })

  test('rollback note explains rerunning production', async ({ page }) => {
    await page.goto('/')

    await expect(page.getByRole('heading', { name: 'Rollback' })).toBeVisible()
    await expect(page.getByText(/Rerun the/i)).toBeVisible()
    await expect(page.getByText(/Deploy production/i)).toBeVisible()
  })

  test('recent runs table lists builds with a source badge', async ({ page }) => {
    await page.goto('/')

    await expect(page.getByRole('heading', { name: 'Recent runs' })).toBeVisible()
    await expect(page.getByTestId('runs-source')).toBeVisible()
    await expect(page.getByTestId('run-2204')).toContainText('Staging shipped')
    await expect(page.getByTestId('run-2201')).toContainText('Smoke failed')
  })
})
