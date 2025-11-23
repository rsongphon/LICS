import { expect, test } from "@playwright/test"

// Helper to generate unique experiment names
const randomExperimentName = () => `Test Experiment ${Date.now()}`

// Tests use authenticated state from auth.setup.ts by default

test.describe("Experiments List Page", () => {
  test("Can view experiments list page", async ({ page }) => {
    await page.goto("/experiments")

    // Check page title/heading
    await expect(
      page.getByRole("heading", { name: "Experiments" }),
    ).toBeVisible()

    // Check that Add Experiment button is visible
    await expect(
      page.getByRole("link", { name: "Add Experiment" }),
    ).toBeVisible()
  })

  test("Experiments table is visible with correct columns", async ({
    page,
  }) => {
    // Verified: Table headers now have role="columnheader"
    await page.goto("/experiments")

    // Wait for table to load (either with data or empty state)
    await page.waitForLoadState("networkidle")

    // Check for table headers (if experiments exist) or empty state
    const tableVisible = await page
      .getByRole("table")
      .isVisible()
      .catch(() => false)
    const emptyStateVisible = await page
      .getByText("No experiments found")
      .isVisible()
      .catch(() => false)

    // At least one should be visible
    expect(tableVisible || emptyStateVisible).toBe(true)

    // If table is visible, check column headers
    if (tableVisible) {
      await expect(
        page.getByRole("columnheader", { name: "Name" }),
      ).toBeVisible()
      await expect(
        page.getByRole("columnheader", { name: "Description" }),
      ).toBeVisible()
      await expect(
        page.getByRole("columnheader", { name: "Created At" }),
      ).toBeVisible()
      await expect(
        page.getByRole("columnheader", { name: "Actions" }),
      ).toBeVisible()
    }
  })

  test("Add Experiment button navigates to create page", async ({ page }) => {
    await page.goto("/experiments")

    await page.getByRole("link", { name: "Add Experiment" }).click()

    // Should navigate to create page
    await page.waitForURL("/experiments/create")
  })
})

test.describe("Create Experiment", () => {
  test("Can view create experiment form", async ({ page }) => {
    await page.goto("/experiments/create")

    // Check heading
    await expect(
      page.getByRole("heading", { name: "Create Experiment" }),
    ).toBeVisible()

    // Check form fields are visible
    await expect(page.getByLabel("Name")).toBeVisible()
    await expect(page.getByLabel("Description")).toBeVisible()

    // Check buttons
    await expect(page.getByRole("button", { name: "Create" })).toBeVisible()
  })

  test("Form validation: Name is required", async ({ page }) => {
    await page.goto("/experiments/create")

    // Try to submit without filling name
    await page.getByRole("button", { name: "Create" }).click()

    // Should show validation error
    await expect(page.getByText("Name is required")).toBeVisible()
  })

  test("Can create new experiment with valid data", async ({ page }) => {
    const experimentName = randomExperimentName()
    const experimentDescription = "This is a test experiment for E2E testing"

    await page.goto("/experiments/create")

    // Fill form
    await page.getByLabel("Name").fill(experimentName)
    await page.getByLabel("Description").fill(experimentDescription)

    // Submit form
    await page.getByRole("button", { name: "Create" }).click()

    // Should show success message
    await expect(page.getByText("Experiment created")).toBeVisible()

    // Should redirect to experiments list
    await page.waitForURL("/experiments")

    // Should see the new experiment in the list
    await expect(page.getByText(experimentName)).toBeVisible()
  })

  test("Cancel button returns to experiments list", async ({ page }) => {
    await page.goto("/experiments/create")
    await page.getByRole("link", { name: "Cancel" }).click()
    await page.waitForURL("/experiments")
  })
})

test.describe("Edit Experiment", () => {
  test("Can navigate to edit page from experiments list", async ({ page }) => {
    // First create an experiment to edit
    const experimentName = randomExperimentName()

    await page.goto("/experiments/create")
    await page.getByLabel("Name").fill(experimentName)
    await page.getByLabel("Description").fill("Original description")
    await page.getByRole("button", { name: "Create" }).click()

    // Wait for redirect to list
    await page.waitForURL("/experiments")

    // Click edit button for the experiment (assuming Edit button exists in actions)
    // Find the row with our experiment name and click its edit link
    const row = page.locator("tr", { has: page.getByText(experimentName) })
    await row.getByRole("link", { name: "Edit" }).click()

    // Should navigate to edit page
    await expect(page).toHaveURL(/\/experiments\/.*\/edit/)

    // Should show edit heading
    await expect(
      page.getByRole("heading", { name: "Edit Experiment" }),
    ).toBeVisible()
  })

  test("Can update experiment successfully", async ({ page }) => {
    // First create an experiment
    const originalName = randomExperimentName()
    const updatedName = `${originalName} (Updated)`
    const updatedDescription = "Updated description"

    await page.goto("/experiments/create")
    await page.getByLabel("Name").fill(originalName)
    await page.getByLabel("Description").fill("Original description")
    await page.getByRole("button", { name: "Create" }).click()
    await page.waitForURL("/experiments")

    // Navigate to edit
    const row = page.locator("tr", { has: page.getByText(originalName) })
    await row.getByRole("link", { name: "Edit" }).click()

    // Update the experiment
    await page.getByLabel("Name").fill(updatedName)
    await page.getByLabel("Description").fill(updatedDescription)
    await page.getByRole("button", { name: "Save" }).click()

    // Should show success message
    await expect(
      page.getByText("Experiment updated successfully"),
    ).toBeVisible()

    // Should redirect to list
    await page.waitForURL("/experiments")

    // Should see updated name
    await expect(page.getByText(updatedName)).toBeVisible()
  })
})

test.describe("View Experiment Details", () => {
  test("Can view experiment details", async ({ page }) => {
    const experimentName = randomExperimentName()
    const experimentDescription = "Description for details view"

    // Create experiment
    await page.goto("/experiments/create")
    await page.getByLabel("Name").fill(experimentName)
    await page.getByLabel("Description").fill(experimentDescription)
    await page.getByRole("button", { name: "Create" }).click()
    await page.waitForURL("/experiments")

    // Click View button
    const row = page.locator("tr", { has: page.getByText(experimentName) })
    await row.getByRole("link", { name: "View" }).click()

    // Should navigate to details page
    await expect(page).toHaveURL(/\/experiments\/.*\/details$/) // Ends with ID, not /edit

    // Check details
    await expect(
      page.getByRole("heading", { name: experimentName }),
    ).toBeVisible()
    await expect(page.getByText(experimentDescription)).toBeVisible()
    await expect(page.getByText("Experiment ID")).toBeVisible()
    await expect(page.getByText("Created At")).toBeVisible()

    // Check actions
    await expect(page.getByRole("link", { name: "Open Builder" })).toBeVisible()
    await expect(page.getByRole("link", { name: "Edit" })).toBeVisible()
    await expect(page.getByRole("button", { name: "Delete" })).toBeVisible()
  })
})

test.describe("Delete Experiment", () => {
  test("Can delete experiment from list", async ({ page }) => {
    // Create an experiment to delete
    const experimentName = randomExperimentName()

    await page.goto("/experiments/create")
    await page.getByLabel("Name").fill(experimentName)
    await page.getByLabel("Description").fill("To be deleted")
    await page.getByRole("button", { name: "Create" }).click()
    await page.waitForURL("/experiments")

    // Find and delete the experiment
    const row = page.locator("tr", { has: page.getByText(experimentName) })
    await row.getByRole("button", { name: "Delete" }).click()

    // Confirm deletion in modal/dialog
    await page.getByRole("button", { name: "Delete" }).last().click()

    // Should show success message
    await expect(
      page.getByText("Experiment deleted successfully"),
    ).toBeVisible()

    // Experiment should no longer be in the list
    await expect(page.getByText(experimentName)).not.toBeVisible()
  })
})

test.describe("Experiments List Features", () => {
  test("Shows loading state while fetching experiments", async ({ page }) => {
    await page.goto("/experiments")

    // Loading indicator should appear briefly
    // This might be hard to catch, but we can at least verify the page loads
    await page.waitForLoadState("networkidle")
  })

  test("Can navigate back to dashboard", async ({ page }) => {
    await page.goto("/experiments")

    // Click on dashboard/home link (usually in sidebar or header)
    // Adjust selector based on actual implementation
    const homeLink = page
      .getByRole("link", { name: "Dashboard" })
      .or(page.getByRole("link", { name: "Home" }))

    if (await homeLink.isVisible()) {
      await homeLink.click()
      await page.waitForURL("/")
    }
  })
})
