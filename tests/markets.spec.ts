import { browser, test, expect } from '@playwright/test';
import { TEST_CONFIGURATION } from './globalVariables';

test(
    'HTTP authentication',
   async ({ browser }) => {

     const context = await browser.newContext(
       {
          httpCredentials: {
            username: TEST_CONFIGURATION.httpAuthUserName,
            password: TEST_CONFIGURATION.httpAuthPassword,
          }
        }
     );

     const page = await context.newPage();
     await page.goto(`${TEST_CONFIGURATION.baseURL}markets`);
     expect(await page.screenshot()).toMatchSnapshot('landing.png');
   }
)

test(
  'Markets hero looks as designed', async ({ page }) => {
    // 1. When working on a staging environment, authentication will be requested.
    //    Before navigating to the page, handle the authentication `prompt` dialog.
    page.on('dialog', async dialog => {
      await dialog.accept();   
    });

    // 2. Go to markets landing
    await page.goto(`${TEST_CONFIGURATION.baseURL}markets`);

    // 3. Hero is at top of the page, no navigation is required
    // await expect(page).toHaveTitle(/Getting started/);
    // await page.locator('text=Get started').click();

    // 4. Compare images
    expect(await page.screenshot()).toMatchSnapshot('landing.png');
  }
);
