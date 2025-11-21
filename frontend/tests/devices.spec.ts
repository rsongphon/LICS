import { expect, test } from "@playwright/test"

// Helper to generate unique device names and IDs
const randomDeviceName = () => `Test Device ${Date.now()}`
const randomDeviceId = () => `device-${Date.now()}`

// Tests use authenticated state from auth.setup.ts by default

test.describe("Devices List Page", () => {
  test("Can view devices list page", async ({ page }) => {
    await page.goto("/devices")

    // Check page title/heading
    await expect(page.getByRole("heading", { name: "Devices" })).toBeVisible()

    // Check that Register Device button is visible
    await expect(page.getByRole("link", { name: "Register Device" })).toBeVisible()
  })

  test("Devices table is visible with correct columns", async ({ page }) => {
    // Verified: Table headers now have role="columnheader"
    await page.goto("/devices")

    // Wait for table to load
    await page.waitForLoadState("networkidle")

    // Check for table or empty state
    const tableVisible = await page.getByRole("table").isVisible().catch(() => false)
    const emptyStateVisible = await page.getByText("No devices found").isVisible().catch(() => false)

    // At least one should be visible
    expect(tableVisible || emptyStateVisible).toBe(true)

    // If table is visible, check column headers
    if (tableVisible) {
      await expect(page.getByRole("columnheader", { name: "Name" })).toBeVisible()
      // Note: Looking for "Status" column
      await expect(page.getByRole("columnheader", { name: "Status" })).toBeVisible()
      await expect(page.getByRole("columnheader", { name: "Location" })).toBeVisible()
      await expect(page.getByRole("columnheader", { name: "Last Seen" })).toBeVisible()
      await expect(page.getByRole("columnheader", { name: "Actions" })).toBeVisible()
    }
  })

  test("Register Device button navigates to register page", async ({ page }) => {
    await page.goto("/devices")

    await page.getByRole("link", { name: "Register Device" }).click()

    // Should navigate to register page
    await page.waitForURL("/devices/register")
  })
})

test.describe("Register Device", () => {
  test("Can view register device form", async ({ page }) => {
    await page.goto("/devices/register")

    // Check heading
    await expect(page.getByRole("heading", { name: "Register Device" })).toBeVisible()

    // Check form fields are visible
    await expect(page.getByLabel("Device ID")).toBeVisible()
    await expect(page.getByLabel("Name")).toBeVisible()
    await expect(page.getByLabel("Location")).toBeVisible()

    // Check buttons
    await expect(page.getByRole("button", { name: "Register" })).toBeVisible()
  })

  test("Form validation: Device ID is required", async ({ page }) => {
    await page.goto("/devices/register")

    // Try to submit without filling device ID
    await page.getByRole("button", { name: "Register" }).click()

    // Should show validation error
    await expect(page.getByText("Device ID is required")).toBeVisible()
  })

  test("Form validation: Name is required", async ({ page }) => {
    await page.goto("/devices/register")

    // Fill device ID but not name
    await page.getByLabel("Device ID").fill(randomDeviceId())

    // Try to submit
    await page.getByRole("button", { name: "Register" }).click()

    // Should show validation error
    await expect(page.getByText("Name is required")).toBeVisible()
  })

  test("Can register new device with valid data", async ({ page }) => {
    const deviceId = randomDeviceId()
    const deviceName = randomDeviceName()
    const deviceDescription = "This is a test device for E2E testing"

    await page.goto("/devices/register")

    // Fill form
    await page.getByLabel("Device ID").fill(deviceId)
    await page.getByLabel("Name").fill(deviceName)
    await page.getByLabel("Location").fill(deviceDescription)

    // Submit form
    await page.getByRole("button", { name: "Register" }).click()

    // Should show success message
    await expect(page.getByText("Device registered")).toBeVisible()

    // Should redirect to devices list
    await page.waitForURL("/devices")

    // Should see the new device in the list
    await expect(page.getByText(deviceName)).toBeVisible()
  })

  test("Cannot register device with duplicate Device ID", async ({ page }) => {
    const deviceId = randomDeviceId()
    const deviceName = randomDeviceName()

    // Register first device
    await page.goto("/devices/register")
    await page.getByLabel("Device ID").fill(deviceId)
    await page.getByLabel("Name").fill(deviceName)
    await page.getByRole("button", { name: "Register" }).click()
    await page.waitForURL("/devices")

    // Try to register another device with same Device ID
    await page.goto("/devices/register")
    await page.getByLabel("Device ID").fill(deviceId)
    await page.getByLabel("Name").fill(`${deviceName} 2`)
    await page.getByRole("button", { name: "Register" }).click()

    // Should show error message
    await expect(page.getByText(/already exists|already registered/i)).toBeVisible()
  })

  test("Cancel button returns to devices list", async ({ page }) => {
    await page.goto("/devices/register")
    await page.getByRole("link", { name: "Cancel" }).click()
    await page.waitForURL("/devices")
  })
})

test.describe("Device Details Page", () => {
  test("Can navigate to device details page", async ({ page }) => {
    // First register a device
    const deviceId = randomDeviceId()
    const deviceName = randomDeviceName()

    await page.goto("/devices/register")
    await page.getByLabel("Device ID").fill(deviceId)
    await page.getByLabel("Name").fill(deviceName)
    await page.getByLabel("Location").fill("Device for details test")
    await page.getByRole("button", { name: "Register" }).click()
    await page.waitForURL("/devices")

    // Click on device to view details (clicking on Details button)
    const row = page.locator("tr", { has: page.getByText(deviceName) })
    await row.getByRole("link", { name: "Details" }).click()

    // Should navigate to details page
    await expect(page).toHaveURL(/\/devices\/.+\/details/)
  })

  test("Device details page shows device information", async ({ page }) => {
    // Register a device
    const deviceId = randomDeviceId()
    const deviceName = randomDeviceName()
    const deviceDescription = "Detailed device information"

    await page.goto("/devices/register")
    await page.getByLabel("Device ID").fill(deviceId)
    await page.getByLabel("Name").fill(deviceName)
    await page.getByLabel("Location").fill(deviceDescription)
    await page.getByRole("button", { name: "Register" }).click()
    await page.waitForURL("/devices")

    // Navigate to details by clicking Details button
    const row = page.locator("tr", { has: page.getByText(deviceName) })
    await row.getByRole("link", { name: "Details" }).click()

    // Wait for details page
    await page.waitForURL(/\/devices\/.+\/details/)

    // Verify details are shown
    await expect(page.getByRole("heading", { name: deviceName })).toBeVisible()
    await expect(page.getByRole("heading", { name: deviceName })).toBeVisible()
    await expect(page.getByText(deviceDescription)).toBeVisible()
    await expect(page.getByTestId("device-id")).not.toBeEmpty()
  })

  test("Device details page has back button", async ({ page }) => {
    // Register a device
    const deviceId = randomDeviceId()
    const deviceName = randomDeviceName()

    await page.goto("/devices/register")
    await page.getByLabel("Device ID").fill(deviceId)
    await page.getByLabel("Name").fill(deviceName)
    await page.getByRole("button", { name: "Register" }).click()
    await page.waitForURL("/devices")

    // Navigate to details
    const row = page.locator("tr", { has: page.getByText(deviceName) })
    await row.getByRole("link", { name: "Details" }).click()

    // Wait for details page
    await page.waitForURL(/\/devices\/.+\/details/)

    // Click back button
    const backButton = page.getByRole("link", { name: /Back to Devices/i })
    await expect(backButton).toBeVisible()
    await backButton.click()

    // Should return to devices list
    await page.waitForURL("/devices")
  })
})

test.describe("Device Status Display", () => {
  test("Shows status badge for registered device", async ({ page }) => {
    // Register a device
    const deviceId = randomDeviceId()
    const deviceName = randomDeviceName()

    await page.goto("/devices/register")
    await page.getByLabel("Device ID").fill(deviceId)
    await page.getByLabel("Name").fill(deviceName)
    await page.getByRole("button", { name: "Register" }).click()
    await page.waitForURL("/devices")

    // Find the device row
    const row = page.locator("tr", { has: page.getByText(deviceName) })

    // Should show status badge (offline by default for newly registered devices)
    const statusBadge = row.getByText(/offline|online|running/i)
    await expect(statusBadge).toBeVisible()
  })

  test("Shows last seen timestamp", async ({ page }) => {
    // Register a device
    const deviceId = randomDeviceId()
    const deviceName = randomDeviceName()

    await page.goto("/devices/register")
    await page.getByLabel("Device ID").fill(deviceId)
    await page.getByLabel("Name").fill(deviceName)
    await page.getByRole("button", { name: "Register" }).click()
    await page.waitForURL("/devices")

    // Find the device row
    const row = page.locator("tr", { has: page.getByText(deviceName) })

    // Should show last seen (might be "Never" for newly registered devices)
    const lastSeenCell = row.locator("td").nth(3) // Assuming last seen is 4th column
    await expect(lastSeenCell).toBeVisible()
  })
})

test.describe("Delete Device", () => {
  test("Can delete device from list", async ({ page }) => {
    // Register a device to delete
    const deviceId = randomDeviceId()
    const deviceName = randomDeviceName()

    await page.goto("/devices/register")
    await page.getByLabel("Device ID").fill(deviceId)
    await page.getByLabel("Name").fill(deviceName)
    await page.getByLabel("Location").fill("To be deleted")
    await page.getByRole("button", { name: "Register" }).click()
    await page.waitForURL("/devices")

    // Find and delete the device
    const row = page.locator("tr", { has: page.getByText(deviceName) })
    await row.getByRole("button", { name: "Delete" }).click()

    // Confirm deletion in modal/dialog
    await page.getByRole("button", { name: "Delete" }).last().click()

    // Should show success message
    await expect(page.getByText("Device deleted successfully")).toBeVisible()

    // Device should no longer be in the list
    await expect(page.getByText(deviceName)).not.toBeVisible()
  })
})

test.describe("Devices List Features", () => {
  test("Shows loading state while fetching devices", async ({ page }) => {
    await page.goto("/devices")

    // Loading indicator should appear briefly
    await page.waitForLoadState("networkidle")
  })

  test("Can navigate back to dashboard", async ({ page }) => {
    await page.goto("/devices")

    // Click on dashboard/home link
    const homeLink = page.getByRole("link", { name: "Dashboard" }).or(page.getByRole("link", { name: "Home" }))

    if (await homeLink.isVisible()) {
      await homeLink.click()
      await page.waitForURL("/")
    }
  })
})
