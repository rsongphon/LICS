import { test as setup, expect } from "@playwright/test"
import { firstSuperuser, firstSuperuserPassword } from "./config.ts"

const authFile = "playwright/.auth/user.json"

setup("authenticate", async ({ page }) => {
  // Set longer timeout for this specific test
  setup.setTimeout(120000) // 120 seconds for debugging

  // Listen for console messages
  page.on('console', msg => console.log('Browser console:', msg.text()))

  // Listen for page errors
  page.on('pageerror', error => console.log('Page error:', error.message))

  await page.goto("/login")
  await page.screenshot({ path: 'test-results/01-login-page.png' })

  console.log('Filling email:', firstSuperuser)
  await page.getByPlaceholder("Email").fill(firstSuperuser)

  console.log('Filling password')
  await page.getByPlaceholder("Password").fill(firstSuperuserPassword)

  await page.screenshot({ path: 'test-results/02-before-click.png' })

  console.log('Clicking Log In button')
  await page.getByRole("button", { name: "Log In" }).click()

  // Wait a bit to see what happens
  await page.waitForTimeout(3000)
  await page.screenshot({ path: 'test-results/03-after-click.png' })

  console.log('Current URL:', page.url())

  // Check for any error messages on the page
  const errorText = await page.locator('[role="alert"], .error, .chakra-alert').textContent().catch(() => null)
  if (errorText) {
    console.log('Error message found:', errorText)
  }

  // Check if access token was set in localStorage
  const hasToken = await page.evaluate(() => {
    const token = localStorage.getItem('access_token')
    console.log('Access token present:', !!token)
    return !!token
  })

  console.log('Has access token:', hasToken)

  // Try waiting for navigation with a longer timeout
  try {
    console.log('Waiting for URL change to /')
    await page.waitForURL("/", { timeout: 60000 })
    console.log('Successfully navigated to /')
  } catch (error) {
    console.log('Failed to navigate to /:', error.message)
    console.log('Final URL:', page.url())
    await page.screenshot({ path: 'test-results/04-final-state.png' })
    throw error
  }

  // Wait for the page to be fully loaded and authenticated
  await page.waitForLoadState("networkidle")
  await page.screenshot({ path: 'test-results/05-dashboard.png' })

  // Verify the auth state is saved properly
  await page.context().storageState({ path: authFile })
  console.log('Auth state saved to:', authFile)
})
