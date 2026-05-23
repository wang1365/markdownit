import { expect, test } from "@playwright/test";

test("loads localized editor shell", async ({ page }) => {
  await page.goto("/en");
  await expect(page.getByRole("heading", { name: /write in markdown/i })).toBeVisible();
  await expect(page.getByRole("button", { name: /new/i })).toBeVisible();
  await expect(page.getByText("Preview")).toBeVisible();
});

test("renders arabic route as rtl while editor remains available", async ({ page }) => {
  await page.goto("/ar");
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  await expect(page.getByText("المعاينة")).toBeVisible();
});
