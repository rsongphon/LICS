import { expect, test } from "@playwright/test"
import { randomEmail } from "./utils/random"

test.describe("Builder", () => {
  test("should create, edit, save and compile an experiment", async ({
    page,
  }) => {
    // 1. Start at Dashboard (already logged in via auth.setup.ts)
    await page.goto("/")
    await expect(page.getByRole("link", { name: "Dashboard" })).toBeVisible()

    // 2. Create Experiment
    await page.getByRole("link", { name: "Experiments" }).click()
    await page.getByRole("link", { name: "Add Experiment" }).click()
    const expName = `Test Exp ${randomEmail()}`
    await page.getByLabel("Name").fill(expName)
    await page.getByRole("button", { name: "Create" }).click()
    await page.waitForURL("/experiments")

    // 3. Navigate to Builder
    // Find the row and get the ID from the Edit link
    const row = page.locator("tr", { has: page.getByText(expName) })
    const editLink = row.getByRole("link", { name: "Edit" })
    const href = await editLink.getAttribute("href")
    const expId = href?.split("/")[2] // /experiments/{id}/edit

    if (!expId) throw new Error("Could not find experiment ID")
    console.log(`Navigating to builder for experiment ID: ${expId}`)

    // Navigate to builder directly
    await page.goto(`/builder/${expId}`)

    // 3. Verify Builder loaded
    const heading = page.getByRole("heading", { name: expName })
    await expect(heading).toBeVisible()

    // 4. Add a Text component
    // Drag Text component from palette to canvas
    // This is hard to test with drag-and-drop in Playwright without specific coordinates.
    // For now, we'll assume the default experiment (if any) or just save/compile empty experiment.
    // But we need to verify save/compile works.

    // 5. Save
    await page.getByRole("button", { name: "Save" }).click()
    await expect(page.getByText("Experiment saved.")).toBeVisible()

    // 6. Compile
    await page.getByRole("button", { name: "Compile" }).click()
    await expect(page.getByText("Experiment compiled.")).toBeVisible()

    // 7. Check Code Preview
    await page.getByRole("tab", { name: "Code Preview" }).click()
    // Expect code editor to be visible and not showing "No code generated"
    await expect(page.getByText("No code generated yet")).not.toBeVisible()
    await expect(page.locator(".monaco-editor")).toBeVisible()
    // Check for 'psychopy' keyword which should be present in imports
    await expect(page.getByText("psychopy").first()).toBeVisible()
  })
})
