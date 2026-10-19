import { expect, test } from '@playwright/test'
import type { Page } from '@playwright/test'

const browserErrors = new WeakMap<Page, string[]>()

test.beforeEach(async ({ page }) => {
  const errors: string[] = []
  browserErrors.set(page, errors)
  page.on('pageerror', error => errors.push(error.message))
  page.on('console', message => {
    if (message.type() === 'error') errors.push(message.text())
  })
})

test.afterEach(async ({ page }) => {
  expect(browserErrors.get(page), 'The page should not raise runtime or console errors').toEqual([])
})

test('loads the personal profile and navigates with desktop or mobile controls', async ({ page, isMobile }) => {
  await page.goto('/')
  await expect(page).toHaveTitle(/Alvin Estrada/)
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(/Cloud\. Code\.Curiosity\./)
  await expect(page.getByRole('link', { name: 'Alvin Estrada home' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Reset 3D view' })).toBeEnabled()

  if (isMobile) {
    const openMenu = page.getByRole('button', { name: 'Open navigation' })
    await openMenu.click()
    await expect(page.getByRole('button', { name: 'Close navigation' })).toHaveAttribute('aria-expanded', 'true')
    await page.getByRole('navigation', { name: 'Mobile navigation' }).getByRole('link', { name: 'About' }).click()
    await expect(page.getByRole('navigation', { name: 'Mobile navigation' })).toHaveCount(0)
    await expect(page.getByRole('button', { name: 'Open navigation' })).toHaveAttribute('aria-expanded', 'false')
  } else {
    await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'About' }).click()
  }
  await expect(page.getByRole('heading', { name: 'Big-picture thinker. Hands-on builder.' })).toBeInViewport()
  await expect.poll(async () => page.getByRole('img', { name: 'Alvin Estrada', exact: true })
    .evaluate(image => (image as HTMLImageElement).naturalWidth), { message: 'The portrait should load successfully' }).toBeGreaterThan(0)
  const dimensions = await page.evaluate(() => ({ width: innerWidth, content: document.documentElement.scrollWidth }))
  expect(dimensions.content, 'The layout should fit the viewport without horizontal scrolling').toBeLessThanOrEqual(dimensions.width)
})

test('changes the 3D experiment and presents its matching description', async ({ page }) => {
  await page.goto('/')
  const experiment = page.getByRole('group', { name: 'Choose 3D experiment' })
  await expect(page.getByRole('button', { name: 'Reset 3D view' })).toBeEnabled()
  await expect(experiment.getByRole('button', { name: 'Systems', exact: true })).toHaveAttribute('aria-pressed', 'true')
  await experiment.getByRole('button', { name: 'Intelligence', exact: true }).click()
  await expect(experiment.getByRole('button', { name: 'Intelligence', exact: true })).toHaveAttribute('aria-pressed', 'true')
  await expect(page.locator('.scene-caption')).toHaveText('AI · Connected ideas · New possibilities')
  await expect(page.locator('.scene-index')).toContainText('02')
  await experiment.getByRole('button', { name: 'Maker', exact: true }).click()
  await expect(experiment.getByRole('button', { name: 'Maker', exact: true })).toHaveAttribute('aria-pressed', 'true')
  await expect(page.locator('.scene-caption')).toHaveText('Electronics · Creative code · Experimentation')
  await expect(page.locator('.scene-index')).toContainText('03')
  await page.getByRole('button', { name: 'Reset 3D view' }).click()
})

test('filters projects, opens their details, and restores focus after Escape', async ({ page }) => {
  await page.goto('/')
  const filters = page.getByRole('group', { name: 'Filter projects' })
  await filters.getByRole('button', { name: 'Maker lab', exact: true }).click()
  await expect(page.locator('.project-card')).toHaveCount(2)
  await expect(page.getByRole('button', { name: 'Explore J.A.R.V.I.S.', exact: true })).toHaveCount(0)
  const opener = page.getByRole('button', { name: 'Explore ESP-IDF-Boy', exact: true })
  await opener.click()
  const dialog = page.getByRole('dialog', { name: 'ESP-IDF-Boy' })
  await expect(dialog).toBeVisible()
  await expect(dialog.getByRole('link', { name: 'Explore the source' })).toHaveAttribute('href', 'https://github.com/adawolfs/ESP-IDF-Boy')
  await expect(dialog.getByRole('button', { name: 'Close project details' })).toBeFocused()
  await expect(page.locator('body')).toHaveCSS('overflow', 'hidden')
  await page.keyboard.press('Escape')
  await expect(dialog).not.toBeVisible()
  await expect(opener).toBeFocused()
  await expect(page.locator('body')).not.toHaveCSS('overflow', 'hidden')

  await filters.getByRole('button', { name: 'Web & mobile', exact: true }).click()
  await expect(page.locator('.project-card')).toHaveCount(2)
  await page.getByRole('button', { name: 'Explore WASM Everywhere', exact: true }).click()
  const wasmDialog = page.getByRole('dialog', { name: 'WASM Everywhere' })
  await expect(wasmDialog.getByRole('link', { name: 'View the slides' })).toHaveAttribute('href', 'https://adawolfs.github.io/wasm-everywhere')
  await wasmDialog.getByRole('button', { name: 'Close project details' }).click()
  await filters.getByRole('button', { name: /All work/ }).click()
  await expect(page.locator('.project-card')).toHaveCount(6)
})

test('opens the command terminal, shows help, and navigates by keyboard', async ({ page }) => {
  await page.goto('/')
  await page.keyboard.press('Control+k')
  const terminal = page.getByRole('dialog', { name: 'adawolfs@portfolio: ~' })
  const input = terminal.getByRole('textbox', { name: /Enter a terminal command/ })
  await expect(terminal).toBeVisible()
  await expect(input).toBeFocused()
  await input.fill('help')
  await input.press('Enter')
  await expect(terminal.getByRole('status')).toContainText('Explore: about · work · community · contact')
  await input.fill('whoami')
  await input.press('Enter')
  await expect(terminal.getByRole('status')).toContainText('Alvin Estrada / @adawolfs')
  await input.fill('contact')
  await input.press('Enter')
  await expect(terminal).not.toBeVisible()
  await expect(page.getByRole('link', { name: 'Email Alvin Estrada' })).toBeInViewport()
  await page.keyboard.press('Control+k')
  await expect(terminal).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(terminal).not.toBeVisible()
  await expect(page.locator('body')).not.toHaveCSS('overflow', 'hidden')
})

test('offers working email links and copies the contact address', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText: async (text: string) => { (window as unknown as { copiedAddress: string }).copiedAddress = text } },
    })
  })
  await page.goto('/')
  await expect(page.getByRole('link', { name: 'Email Alvin Estrada' })).toHaveAttribute('href', 'mailto:adawolfs@gmail.com')
  await expect(page.getByRole('link', { name: /adawolfs@gmail.com/ })).toHaveAttribute('href', 'mailto:adawolfs@gmail.com')
  await page.getByRole('button', { name: 'Copy email address' }).click()
  await expect(page.getByRole('button', { name: 'Email copied' })).toBeVisible()
  await expect(page.locator('.copy-status')).toHaveText('Copied!')
  expect(await page.evaluate(() => (window as unknown as { copiedAddress: string }).copiedAddress)).toBe('adawolfs@gmail.com')
})

test('keeps the address available when clipboard permission is denied', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText: async () => { throw new Error('Clipboard denied') } },
    })
  })
  await page.goto('/')
  await page.getByRole('button', { name: 'Copy email address' }).click()
  await expect(page.locator('.copy-status')).toHaveText('Please copy the address above.')
  await expect(page.getByRole('link', { name: /adawolfs@gmail.com/ })).toBeVisible()
})

test.describe('reduced motion', () => {
  test.use({ reducedMotion: 'reduce' })

  test('starts paused and lets the visitor explicitly enable and pause motion', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('button', { name: 'Reset 3D view' })).toBeEnabled()
    const canvas = page.locator('.observatory-canvas')
    await expect(page.getByRole('button', { name: 'Enable animation' })).toHaveAttribute('aria-pressed', 'false')
    const initialFrame = await canvas.screenshot()
    await page.waitForTimeout(180)
    expect((await canvas.screenshot()).equals(initialFrame), 'Reduced motion should leave the instrument still').toBe(true)
    await page.getByRole('button', { name: 'Enable animation' }).click()
    await expect(page.getByRole('button', { name: 'Pause animation' })).toHaveAttribute('aria-pressed', 'true')
    await expect.poll(async () => (await canvas.screenshot()).equals(initialFrame), { message: 'Explicitly enabling motion should animate the instrument' }).toBe(false)
    await page.getByRole('button', { name: 'Pause animation' }).click()
    const pausedFrame = await canvas.screenshot()
    await page.waitForTimeout(180)
    expect((await canvas.screenshot()).equals(pausedFrame), 'The pause control should stop the instrument').toBe(true)
  })
})

test('presents the static interactive fallback when WebGL is unavailable', async ({ page }) => {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext
    HTMLCanvasElement.prototype.getContext = function (this: HTMLCanvasElement, contextId: string, ...args: unknown[]) {
      if (/^webgl/.test(contextId)) return null
      return Reflect.apply(original, this, [contextId, ...args])
    } as typeof original
  })
  await page.goto('/')
  await expect(page.getByText('Systems · static view')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Reset 3D view' })).toBeDisabled()
  await expect(page.locator('.scene-fallback')).toBeVisible()
  await page.getByRole('group', { name: 'Choose 3D experiment' }).getByRole('button', { name: 'Maker', exact: true }).click()
  await expect(page.getByText('Maker · static view')).toBeVisible()
  await expect(page.locator('.scene-caption')).toHaveText('Electronics · Creative code · Experimentation')
  await page.getByRole('link', { name: 'Explore my work' }).click()
  await expect(page.getByRole('heading', { name: 'Built with intent. And a little obsession.' })).toBeInViewport()
})
