import { expect, test } from "@playwright/test";

test("home page renders shell", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("公司价值决策系统")).toBeVisible();
});
